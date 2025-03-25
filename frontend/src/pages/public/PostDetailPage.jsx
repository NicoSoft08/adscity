import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPostById } from '../../routes/postRoutes';
import { fetchDataByUserID } from '../../routes/userRoutes';
import OwnerProfileCard from '../../components/owner-card/OwnerProfileCard';
import { FaLocationDot } from "react-icons/fa6";
import { FaEye, FaRegCalendarAlt } from "react-icons/fa";
import { formatPostedAt, formatViewCount, parseTimestamp } from '../../func';
import RelatedListing from '../../components/related-listing/RelatedListing';
import { AuthContext } from '../../contexts/AuthContext';
// import MessageToAnnouncer from '../../components/contact-announcer/MessageToAnnouncer';
// import { sendMessage } from '../../routes/chatRoutes';
import Toast from '../../customs/Toast';
import '../../styles/PostDetailPage.scss';
import Loading from '../../customs/Loading';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebaseConfig';
import FormData from '../../hooks/FormData';

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

export default function PostDetailPage() {
    const params = useParams();
    const { currentUser, userData } = useContext(AuthContext);
    const [post, setPost] = useState(null);
    const [profilData, setProfilData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const { post_id } = params;

    const userCity = userData?.city || '';

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

    const { details = {}, location = {}, images = [], posted_at, stats = {}, isSold } = post || {};
    const { title = '', price = 0, price_type = '' } = details || {};
    const { address = '', city = '', country = '' } = location || {};
    const { views = 0 } = stats || {};

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

    

    // const handleSendMessage = async ({ senderID, receiverID, text }) => {
    //     const result = await sendMessage(senderID, receiverID, text);
    //     if (result.success) {
    //         setToast({ show: true, type: 'info', message: result.message });
    //     } else {
    //         setToast({ show: true, type: 'error', message: result.message });
    //     }
    // };

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
                            <FaEye className='icon' /> {formatViewCount(views)}
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
                                <li><strong>Catégorie :</strong> {post?.category}</li>
                                <li><strong>Sous-catégorie :</strong> {post?.subcategory}</li>
                                <li><strong>Vues :</strong> {views}</li>
                            </ul>
                        </section>
                    </div>

                    {/* <MessageToAnnouncer currentUser={currentUser} announcerID={post?.userID} onSendMessage={handleSendMessage} /> */}

                    <div className='owner'>
                        <OwnerProfileCard
                            owner={profilData}
                            userID={currentUser?.uid}
                            city={userCity}
                        />
                    </div>
                </div>
            </div>
            <div className="pubs"></div>


            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />

            <RelatedListing post_id={post_id} category={post?.category} />
        </div>
    );
}
