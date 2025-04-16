import React, { useContext, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBalanceScale,
    faBan, faCalendarDay, faClone, faEllipsisV, faExclamationTriangle,
    faFlag, faGavel, faQuestionCircle,
    faShareFromSquare
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { format, isToday, isYesterday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { IconAvatar } from '../../config/images';
import {
    getViewCount,
    incrementClickCount,
    incrementViewCount,
    updateContactClick,
    updateInteraction,
    updateShareCount
} from '../../routes/apiRoutes';
import { reportPost } from '../../routes/postRoutes';
import { fetchProfileByUserID } from '../../routes/storageRoutes';
import Menu from '../../customs/Menu';
import Toast from '../../customs/Toast';
import { toggleFavorites } from '../../routes/userRoutes';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebaseConfig';
import { Truck } from 'lucide-react';
import './CardItem.scss';

export default function CardItem({ post, onToggleFavorite }) {
    const { currentUser, userData } = useContext(AuthContext);
    const { id, PostID, UserID, userID, details = {}, images = [], location = {}, category, subcategory, isActive, moderated_at, isSold } = post;
    const [showMenu, setShowMenu] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [profilURL, setProfilURL] = useState(null);
    const [reportSuccess, setReportSuccess] = useState(false);
    const [currentImage, setCurrentImage] = useState(images?.length > 0 ? images[0] : "");
    const navigate = useNavigate();
    const cardRef = useRef(null);
    const reportRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (reportRef.current && !reportRef.current.contains(event.target)) {
                setReportSuccess(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!currentUser || !currentUser.uid || !id) return;

        const observer = new IntersectionObserver(
            async (entries) => {
                if (entries[0].isIntersecting) {
                    const success = await incrementViewCount(id, currentUser?.uid);
                    if (success) {
                        await getViewCount(id);
                    }

                    observer.disconnect(); // Arrêter l'observation après enregistrement
                }
            },
            { threshold: 0.5 } // Déclenche si 50% de l'annonce est visible
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, [currentUser, id]);

    // Charger le nombre de vues au montage
    useEffect(() => {
        getViewCount(id);
    }, [id]);

    useEffect(() => {
        if (currentUser && userData?.adsSaved?.includes(post.id)) {
            setIsFavorite(true);
        }

        const fetchProfilURL = async () => {
            try {
                const response = await fetchProfileByUserID(userID);
                if (response && response.profilURL) {
                    setProfilURL(response.profilURL);
                } else {
                    setProfilURL(null); // Assurer que la valeur est bien gérée
                }
            } catch (error) {
                setProfilURL(null);
                throw error;
            }
        };

        if (userID) {
            fetchProfilURL();
        }
    }, [userID, currentUser, userData, post]);

    const reportReasons = [
        {
            id: 1,
            label: 'Contenu inapproprié',
            icon: faBan,
            action: () => handleReportWithReason(post.id, 'Contenu inapproprié')
        },
        {
            id: 2,
            label: 'Produit illégal',
            icon: faGavel,
            action: () => handleReportWithReason(post.id, 'Produit illégal')
        },
        {
            id: 3,
            label: 'Annonce frauduleuse',
            icon: faExclamationTriangle,
            action: () => handleReportWithReason(post.id, 'Annonce frauduleuse')
        },
        {
            id: 4,
            label: 'Violation des règles du site',
            icon: faBalanceScale,
            action: () => handleReportWithReason(post.id, 'Violation des règles du site')
        },
        {
            id: 5,
            label: 'Produit contrefait',
            icon: faClone,
            action: () => handleReportWithReason(post.id, 'Produit contrefait')
        },
        {
            id: 6,
            label: 'Informations trompeuses',
            icon: faQuestionCircle,
            action: () => handleReportWithReason(post.id, 'Informations trompeuses')
        },
    ];

    const options = [
        {
            label: 'Signaler l\'annonce',
            icon: faFlag,
            action: () => handleReportAd(post.id)
        },
        {
            label: 'Partager',
            icon: faShareFromSquare,
            action: () => handleShareAd(post.PostID)
        },
        // {
        //     label: 'Masquer',
        //     icon: faEyeSlash,
        //     action: () => handleHideAd(post.id)
        // },
    ];

    const handleMouseEnter = () => {
        if (images.length > 1) {
            setCurrentImage(images[1]); // Passer à la deuxième image si disponible
        }
    };

    const handleMouseLeave = () => {
        setCurrentImage(images.length > 0 ? images[0] : ""); // Revenir à l’image principale
    };

    const handleReportWithReason = async (postID, reasonLabel) => {
        if (!currentUser) {
            setToast({
                show: true,
                type: 'error',
                message: 'Vous devez être connecté pour signaler une annonce.'
            });
            return;
        };

        try {
            const userID = currentUser.uid;

            const result = await reportPost(postID, userID, reasonLabel);

            if (result.success) {
                setToast({
                    show: true,
                    type: 'success',
                    message: 'Votre signalement a été envoyé avec succès.'
                });
                setReportSuccess(true);
                logEvent(analytics, 'report_ad', {
                    postID: postID,
                    userID: userID,
                    reason: reasonLabel
                });
            } else {
                setToast({
                    show: true,
                    type: 'error',
                    message: 'Une erreur est survenue lors du signalement de l\'annonce.'
                });
                setReportSuccess(false);
            }
            setShowReportModal(false);
        } catch (error) {
            console.error('Erreur lors du signalement de l\'annonce :', error);
            setToast({
                show: true,
                type: 'error',
                message: 'Une erreur est survenue lors du signalement de l\'annonce.'
            });
        }
    };

    const handleReportAd = () => {
        setShowReportModal(true);
        setShowMenu(false);
    };

    const handleShareAd = async (PostID) => {
        const shareLink = `${window.location.origin}/posts/${category}/${subcategory}/${PostID}`;

        try {
            // More captivating title and text
            await navigator.share({
                title: '✨ Annonce exceptionnelle sur AdsCity! ✨',
                text: '🔥 J\'ai trouvé cette offre incroyable que vous devez absolument voir! Cliquez pour découvrir tous les détails.',
                url: shareLink
            }).then(async () => {
                const postID = id;
                const userID = currentUser?.uid;
                if (!userID) return null;
                await updateShareCount(postID, userID);
            });

            await navigator.clipboard.writeText(shareLink);
            setToast({
                show: true,
                type: 'success',
                message: 'Le lien a été copié dans le presse-papiers.'
            });
            logEvent(analytics, 'share_link');
        } catch (error) {
            console.error('Erreur lors de la copie dans le presse-papiers :', error);
            setToast({
                show: true,
                type: 'error',
                message: 'Une erreur est survenue lors de la copie du lien dans le presse-papiers.'
            });
        }
    };


    // const handleHideAd = (postID) => {
    //     console.log(`Masquer l'annonce avec l'ID : ${postID}`);
    // };


    const formatPostedAt = (posted_at) => {
        const date = new Date(posted_at);

        if (isToday(date)) {
            return `Auj. ${format(date, 'HH:mm', { locale: fr })}`;
        }

        if (isYesterday(date)) {
            return `Hier ${format(date, 'HH:mm', { locale: fr })}`;
        }

        let formattedDate = format(date, 'd MMMM HH:mm', { locale: fr });

        return formattedDate;
    };

    const handlePostClick = async (url) => {
        const postID = id;
        navigate(url, { state: { id: postID } });

        const userID = currentUser?.uid;
        if (!userID) return null;

        try {
            await updateInteraction(postID, userID, category); // Fonction pour mettre à jour adsViewed, categoriesViewed, et totalAdsViewed
            await incrementClickCount(postID, userID);

        } catch (error) {
            throw error;
        }
    };

    const handleMenuClick = () => {
        setShowMenu(!showMenu);
    };

    const handleProfileClick = async (url) => {
        navigate(url, { state: { id: userID } });

        if (!currentUser) return null;

        const { city } = userData;

        await updateContactClick(userID, city);

        logEvent(analytics, 'view_profile', {
            userID: userID,
            postID: id,
            city: city
        });
    };

    const handleToggleFavorite = async (postID) => {
        if (!currentUser) {
            setToast({
                show: true,
                type: 'error',
                message: 'Vous devez être connecté pour ajouter aux favoris.',
            });
            return;
        }

        try {
            const userID = currentUser?.uid;
            const result = await toggleFavorites(postID, userID);
            logEvent(analytics, 'favorite_ad', {
                postID: postID,
                userID: userID,
                isFavorite: result.isFavorite,
            });
            if (result.success) {
                setIsFavorite(true);
                setToast({
                    show: true,
                    type: result.isFavorite ? 'success' : 'info',
                    message: result.isFavorite
                        ? 'Annonce ajoutée aux favoris !'
                        : 'Annonce retirée des favoris.',
                });

                // Si la prop onToggleFavorite est définie, l'appeler
                if (onToggleFavorite && !result.isFavorite) {
                    onToggleFavorite(postID);
                }
            } else {
                setToast({
                    show: true,
                    type: 'error',
                    message: 'Erreur lors de la mise à jour des favoris.',
                });
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour des favoris:', error);
            setToast({
                show: true,
                type: 'error',
                message: 'Une erreur s\'est produite.',
            });
        }
    };

    // Vérifier si l'annonce a expiré
    function parseTimestamp(timestamp) {
        return new Date(timestamp?._seconds * 1000 + timestamp?._nanoseconds / 1000000);
    };

    const moderatedAtDate = parseTimestamp(moderated_at);

    // Déterminer l'image de profil à afficher
    const profileImage = profilURL ?? IconAvatar;

    const post_id = PostID?.toLowerCase();
    const user_id = UserID?.toLowerCase();

    if (!isActive) return null;

    return (
        <div ref={cardRef} className={`card-container ${isActive ? 'active' : 'inactive'}`} key={id}>
            {isSold && <span className="sold-badge">VENDU</span>}
            {/* Image de l'annonce */}
            <div
                onClick={() => handlePostClick(`/posts/${category}/${subcategory}/${post_id}`)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <img
                    title={`Annonce: ${details.title}`}
                    src={currentImage}
                    alt={details.title}
                    className="card-image"
                // onError={() => setCurrentImage(PlaceholderImage)} // Gérer les erreurs de chargement
                />
                {/*  <div className="badge-sponsored">Sponsorisé</div> */}
            </div>

            {/* Contenu de l'annonce */}
            <div className="card-content">
                <h2 className="card-title" title={`${details?.title}`}>
                    {details?.title?.length > 50
                        ? `${details.title.substring(0, 50)}...`
                        : details.title
                    }
                </h2>
                <p className="card-price">{details.price} RUB {details.delievery && <span title='Possibilité de livraison'><Truck className='delievery-icon' size={14} /></span>} </p>
                <p className="card-city">{location.city}, {location.country}</p>
                <div onClick={() => handleProfileClick(`/users/user/${user_id}/profile/show`)} className="announcer">
                    <img src={profileImage} alt="avatar" className="avatar" />
                </div>
                <div className="card-footer">
                    <span className="card-date">
                        <FontAwesomeIcon icon={faCalendarDay} color={"gray"} />
                        {formatPostedAt(moderatedAtDate)}
                    </span>
                </div>
            </div>

            {/* Icons pour les actions */}
            <div className="card-actions">
                <button
                    className="options-button"
                    title="Plus d'options"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleMenuClick();
                    }}
                >
                    <FontAwesomeIcon icon={faEllipsisV} color='#343a40' />
                </button>
                <button
                    className={`like-button ${isFavorite ? 'active' : ''}`}
                    title={isActive ? (isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris') : 'Inactif - indisponible'}
                    onClick={(e) => { e.stopPropagation(); isActive && handleToggleFavorite(post.id); }}
                >
                    {isFavorite ? '❤️' : '🤍'}
                </button>
            </div>

            {reportSuccess && (
                <div className="report-success" ref={reportRef} aria-live="polite">
                    <div className="content">
                        <p className="message">Signalement enregistré !</p>
                        <p className='text'>Merci ! Un modérateur vérifiera bientôt l'annonce</p>
                    </div>
                </div>
            )}

            <Menu options={options} isOpen={showMenu} onClose={() => setShowMenu(false)} />
            <Menu options={reportReasons} isOpen={showReportModal} onClose={() => setShowReportModal(false)} />
            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    );
};
