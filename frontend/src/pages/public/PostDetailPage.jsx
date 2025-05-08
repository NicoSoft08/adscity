import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchPostById } from '../../routes/postRoutes';
import { fetchDataByUserID, fetchUserData } from '../../routes/userRoutes';
import { FaLocationDot } from "react-icons/fa6";
import { FaRegCalendarAlt } from "react-icons/fa";
import { formatPostedAt, parseTimestamp } from '../../func';
import RelatedListing from '../../components/related-listing/RelatedListing';
import { AuthContext } from '../../contexts/AuthContext';
import { fetchUserConversations, sendMessage } from '../../routes/chatRoutes';
import Toast from '../../customs/Toast';
import Loading from '../../customs/Loading';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebaseConfig';
import FormData from '../../hooks/FormData';
import data from '../../json/data.json';
import Spinner from '../../customs/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faPhone } from '@fortawesome/free-solid-svg-icons';
import { updateContactClick } from '../../routes/apiRoutes';
import { IconAvatar } from '../../config/images';
import '../../styles/PostDetailPage.scss';

const ImageGallery = ({ images = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (images.length === 0) {
        return <p>Aucune image disponible.</p>;
    }

    // 🔹 Aller à l'image suivante
    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    // 🔹 Aller à l'image précédente
    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    // 🔹 Sélectionner une image spécifique via la miniature
    const handleSelectImage = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div className="image-gallery">
            <div className="main-image-container">
                <button className="nav-button left" onClick={handlePrev}>
                    ‹
                </button>

                <img
                    src={images[currentIndex]}
                    alt={`Slide ${currentIndex + 1}`}
                    className="main-image"
                />

                <button className="nav-button right" onClick={handleNext}>
                    ›
                </button>
            </div>

            <div className="thumbnails">
                {images.map((img, index) => (
                    <div
                        key={index}
                        className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => handleSelectImage(index)}
                    >
                        <img src={img} alt={`Thumbnail ${index + 1}`} />
                    </div>
                ))}
            </div>
        </div>
    );
}

const predefinedMessages = [
    "Bonjour, votre annonce m'intéresse. Est-elle toujours disponible ?",
    "Pouvez-vous me donner plus de détails sur l'annonce ?",
    "Est-il possible de négocier le prix ?",
    "Où et quand puis-je voir l'article en personne ?",
];

export default function PostDetailPage() {
    const params = useParams();
    const { currentUser, userData } = useContext(AuthContext);
    const [post, setPost] = useState(null);
    const [profilData, setProfilData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const { post_id } = params;
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [showPhone, setShowPhone] = useState(false);
    const [selectedChat, setSelectedChat] = useState(null);
    const [interlocutor, setInterlocutor] = useState(null);
    const [conversations, setConversations] = useState([]);
    const navigate = useNavigate();

    const userCity = userData?.city || '';

    // 📌 Récupérer les conversations de l'utilisateur
    useEffect(() => {
        const fetchMessages = async () => {
            if (!currentUser) return;
            setLoading(true);
            try {
                const userID = currentUser?.uid;
                const idToken = await currentUser.getIdToken();
                const result = await fetchUserConversations(userID, idToken);
                if (result.success) {
                    setConversations(result.data.conversations || []);
                }
            } catch (error) {
                console.error("❌ Erreur lors de la récupération des conversations :", error);
            }
            setLoading(false);
        };

        fetchMessages();
    }, [currentUser]);

    // 📌 Récupérer les infos de l’interlocuteur
    useEffect(() => {
        if (!selectedChat || !currentUser) return;

        const fetchInterlocutor = async () => {
            if (selectedChat && selectedChat.participants) {
                const userID = currentUser.uid;
                const participants = selectedChat.participants || [];
                const interlocutorID = participants.find(participant => participant !== userID);

                if (interlocutorID) {
                    const result = await fetchUserData(interlocutorID);
                    if (result.success) {
                        setInterlocutor(result.data);
                        console.log("👤 Interlocuteur :", result.data);
                    }
                }
            }
        };

        fetchInterlocutor();
    }, [selectedChat, currentUser]);

    useEffect(() => {
        logEvent(analytics,
            'post_detail_page_view',
            {
                post_id: post_id,
                user_id: currentUser?.uid,
            }
        );
        const fetchAdsData = async () => {
            const result = await fetchPostById(post_id);
            if (result.success) {
                setPost(result?.data);
                setIsLoading(false);
            }
        };
        fetchAdsData();

    }, [post_id, currentUser]);

    const { details = {}, location = {}, images = [], posted_at, isSold } = post || {};
    const { title = '', price = 0, price_type = '' } = details || {};
    const { address = '', city = '', country = '' } = location || {};

    useEffect(() => {
        if (post && post?.userID) {
            const fetchProfilData = async () => {
                const response = await fetchDataByUserID(post?.userID);
                setProfilData(response?.data);
            };
            fetchProfilData();
        }
    }, [post]);


    const postedAtDate = parseTimestamp(posted_at);



    const handleSendMessage = async ({ senderID, receiverID, text }) => {
        if (!currentUser) {
            setToast({ show: true, type: 'error', message: 'Vous devez être connecté pour envoyer un message.' });
            return;
        }
        setLoading(true);

        try {
            const senderID = currentUser.uid;
            const receiverID = post?.userID;
            const idToken = await currentUser.getIdToken();

            const result = await sendMessage(senderID, receiverID, idToken, message);
            if (result.success) {
                setToast({ show: true, type: 'info', message: result.message });
                setMessage('');
                setLoading(false);
            } else {
                setToast({ show: true, type: 'error', message: result.message });
                setLoading(false);
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message :', error);
            setToast({ show: true, type: 'error', message: 'Une erreur est survenue lors de l\'envoi du message.' });

        }

    };

    const formatCategorization = () => {
        let category = "";
        let subcategory = "";

        if (post?.category) {
            const categoryData = data.categories.find(cat => cat.categoryName === post?.category);
            if (categoryData) category = categoryData.categoryTitles.fr;
        }

        if (post?.subcategory) {
            const categoryData = data.categories.find(cat => cat.categoryName === post?.category);
            if (categoryData) {
                const subcategoryData = categoryData.container.find(subcat => subcat.sousCategoryName === post?.subcategory);
                if (subcategoryData) subcategory = subcategoryData.sousCategoryTitles.fr;
            }
        }

        return { category, subcategory };
    };

    const handlePhoneClick = () => {
        if (!currentUser?.userID) {
            setToast({
                show: true,
                type: 'error',
                message: "Oups ! Il semble que vous n'êtes pas connecté"
            });
            return;
        };

        setShowPhone(true);
        logEvent(analytics, 'contact_click');
    };


    const handleProfileClick = async (url) => {
        navigate(url);

        if (!currentUser?.userID) return null;

        await updateContactClick(profilData.userID, userCity);
    }

    const formatDate = (timestamp) => {
        if (timestamp && timestamp._seconds) {
            const date = new Date(timestamp._seconds * 1000); // Convert to milliseconds
            let formattedDate = date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });

            // Capitalize the first letter
            return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
        }
        return '';
    };

    // const handleContact = async () => {
    //     if (!currentUser) {
    //         navigate('/auth/signin?redirect=/user/dashboard/messages');
    //         return;
    //     }

    //     setIsBottomSheetOpen(true);
    // }

    // const closeBottomSheet = () => {
    //     setIsBottomSheetOpen(false);
    // };

    const user_id = profilData.UserID?.toLowerCase();

    const { category, subcategory } = formatCategorization();

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className="ad-details">
            <ImageGallery images={images} />

            <div className="display">

                <div className='under_score'>
                    <div className='title'>
                        <span>{title}</span>
                        <p>
                            <FaLocationDot className='icon' /> {city}, {country}
                            <FaRegCalendarAlt className='icon' /> {formatPostedAt(postedAtDate)}
                        </p>
                    </div>
                    <div className='seperator' />
                    <div className='price'>
                        <span>{price_type}</span>
                        <p>{price} RUB</p>
                    </div>
                </div>

                {isSold && <span className="sold-badge">VENDU</span>}

                <div className="content">
                    <div className='detail-section'>
                        <section className="details">
                            <h2>Caractéristiques</h2>
                            <FormData details={details} />
                        </section>

                        <section className="description">
                            <h2>Description</h2>
                            <p>{details.description}</p>
                        </section>

                        <section className="location">
                            <h2>Localisation</h2>
                            <p>{address}, {city}, {country}</p>
                        </section>

                        <section className="meta-info">
                            <h2>Informations supplémentaires</h2>
                            <ul>
                                <li><strong>Catégorie :</strong> {category}</li>
                                <li><strong>Sous-catégorie :</strong> {subcategory}</li>
                            </ul>
                        </section>
                    </div>

                    <div className='owner-card'>
                        <div className='owner-image'>
                            <img
                                className='profil-image'
                                src={profilData?.profilURL === null ? IconAvatar : profilData?.profilURL}
                                alt={profilData.displayName}
                            />
                            {profilData?.isOnline ? <div className="online-badge" /> : null}
                        </div>
                        <span className='profile-type'> {profilData?.profileType} </span>
                        <p className='member-since'>Membre depuis: {formatDate(profilData.createdAt)}</p>
                        <a onClick={handleProfileClick} href={`/users/user/${user_id}/profile/show`}>
                            <h2 className='name'>{profilData.firstName} {profilData.lastName}</h2>
                        </a>
                        <p className='review'>{profilData.ratings?.total || 0} ⭐ {profilData.reviews?.totalReviews || 0} avis</p>
                        <div className='contact-info'>
                            <button onClick={handlePhoneClick} className='contact-button'>
                                {showPhone ? profilData.phoneNumber : "Voir le Numéro"}
                                <FontAwesomeIcon icon={faPhone} className='icon' />
                            </button>
                        </div>
                        {/* <div className='action-buttons'>
                            <button className='message' onClick={handleContact}>
                                Ecrire un message
                                <FontAwesomeIcon icon={faEnvelope} className='icon' />
                            </button>
                        </div> */}

                        {/* {isBottomSheetOpen && (
                            <BottomSheet
                                isOpen={isBottomSheetOpen}
                                onClose={closeBottomSheet}
                                sellerData={profilData}
                                adData={post}
                                unreadMessagesCount={conversations.length}
                            />
                        )} */}
                    </div>
                </div>

                {/* <div className="message-to-advertiser">
                    <label htmlFor="message-textarea">✉️ Écrire à l'annonceur :</label>

                    <div className="predefined-messages">
                        {predefinedMessages.map((msg, index) => (
                            <button key={index} onClick={() => setMessage(msg)}>
                                {msg}
                            </button>
                        ))}
                    </div>

                    <textarea
                        id="message-textarea"
                        placeholder="Tapez votre message ici..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows="4"
                    ></textarea>
                    <button className='send' onClick={handleSendMessage} disabled={loading || !message.trim()}>
                        {loading ? <Spinner /> : <FontAwesomeIcon icon={faPaperPlane} />}
                    </button>
                </div> */}
            </div>
            <div className="pubs"></div>


            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />

            <RelatedListing post_id={post_id} category={post?.category} />
        </div>
    );
}
