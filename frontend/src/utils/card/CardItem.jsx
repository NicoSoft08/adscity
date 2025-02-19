import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBalanceScale,
    faBan, faCalendarDay, faClone, faEllipsisV, faExclamationTriangle,
    faEye, faFlag, faGavel, faQuestionCircle, faShare
} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { formatViewCount } from '../../func';
import { format, isToday, isYesterday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { IconAvatar } from '../../config/images';
import {
    incrementClickCount,
    incrementViewCount,
    updateContactClick,
    updateInteraction
} from '../../routes/apiRoutes';
import { reportPost } from '../../routes/postRoutes';
import { fetchProfileByUserID } from '../../routes/storageRoutes';
import Menu from '../../customs/Menu';
import Toast from '../../customs/Toast';
import { toggleFavorites } from '../../routes/userRoutes';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebaseConfig';
import './CardItem.scss';

export default function CardItem({ post, onToggleFavorite }) {
    const { currentUser, userData } = useContext(AuthContext);
    const { id, userID, adDetails, images, location, category, subcategory, views, isActive, moderated_at, isSold } = post;
    const [showMenu, setShowMenu] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [profilURL, setProfilURL] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser && userData.adsSaved?.includes(post.id)) {
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
                console.error("Erreur lors de la récupération du profil :", error);
                setProfilURL(null);
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
            icon: faShare,
            action: () => handleShareAd(post.id)
        },
        // {
        //     label: 'Masquer',
        //     icon: faEyeSlash,
        //     action: () => handleHideAd(post.id)
        // },
    ];

    const handleReportWithReason = async (postID, reasonLabel) => {
        if (!currentUser) {
            setToast({
                show: true,
                type: 'error',
                message: 'Vous devez être connecté pour signaler une annonce.'
            });
            return;
        };

        // Confirmation avant d'envoyer le signalement
        const confirmReport = window.confirm(`Êtes-vous sûr de vouloir signaler cette annonce pour : "${reasonLabel}" ?`);
        if (!confirmReport) return;

        const userID = currentUser.id;

        const result = await reportPost(postID, userID, reasonLabel);
        logEvent(analytics, 'report_ad', {
            postID: postID,
            userID: userID,
            reason: reasonLabel
        });

        if (result.success) {
            setToast({
                show: true,
                type: 'success',
                message: 'Votre signalement a été envoyé avec succès.'
            });
        } else {
            setToast({
                show: true,
                type: 'error',
                message: 'Une erreur est survenue lors du signalement de l\'annonce.'
            });
        }
        setShowReportModal(false);
    };

    const handleReportAd = (postID) => {
        setShowReportModal(true);
        setShowMenu(false);
        console.log(`Signaler l'annonce avec l'ID : ${postID}`);
    };

    const handleShareAd = async (postID) => {
        const postUrl = `${window.location.origin}/post/${postID}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Découvrez cette annonce sur AdsCity !",
                    text: "Jetez un œil à cette annonce, ça pourrait vous intéresser.",
                    url: postUrl,
                });
                setToast({
                    show: true,
                    type: 'success',
                    message: 'L\'annonce a été partagée avec succès.'
                });
            } catch (error) {
                console.error('Erreur lors du partage :', error);
                setToast({
                    show: true,
                    type: 'error',
                    message: 'Erreur lors du partage. Veuillez réessayer.'
                });
            }
        } else {
            navigator.clipboard.writeText(postUrl).then(() => {
                setToast({
                    show: true,
                    type: 'success',
                    message: 'L\'URL de l\'annonce a été copiée dans le presse-papiers.'
                });
            }).catch(err => setToast({
                show: true,
                type: 'error',
                message: 'Erreur lors de la copie de l\'URL. Veuillez réessayer.'
            }))
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
    }

    const handlePostClick = async (url) => {
        const userID = currentUser?.uid;
        const postID = id;

        navigate(url);

        if (!userID) return null;

        try {
            await updateInteraction(postID, userID, category); // Fonction pour mettre à jour adsViewed, categoriesViewed, et totalAdsViewed
            await incrementViewCount(postID);
            await incrementClickCount(postID);

        } catch (error) {
            throw error;
        }
    };

    const handleMenuClick = () => {
        setShowMenu(!showMenu);
    };



    const handleProfileClick = async () => {
        if (!currentUser) return null;
        await updateContactClick(userID);
        logEvent(analytics, 'view_profile', {
            userID: userID,
            postID: id,
        });
    }


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
                setIsFavorite(result.isFavorite);
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
    }



    // Vérifier si l'annonce a expiré
    function parseTimestamp(timestamp) {
        return new Date(timestamp?._seconds * 1000 + timestamp?._nanoseconds / 1000000);
    }

    const moderatedAtDate = parseTimestamp(moderated_at);

    // Déterminer l'image de profil à afficher
    const profileImage = profilURL ?? IconAvatar;


    if (!isActive) return null;

    return (
        <div className={`card-container ${isActive ? 'active' : 'inactive'}`} key={id}>
            {isSold && <span className="sold-badge">VENDU</span>}
            {/* Image de l'annonce */}
            {images && images.length > 0 && (
                <div onClick={() => handlePostClick(`/posts/${category}/${subcategory}/${id}`)}>
                    <img
                        title={`Annonce<<${adDetails.title}>>`}
                        src={images[0]}
                        alt={adDetails.title}
                        className="card-image"
                    />
                </div>
            )}

            {/* Contenu de l'annonce */}
            <div className="card-content">
                <h2 className="card-title" title={`${adDetails?.title}`}>
                    {adDetails?.title?.length > 50
                        ? `${adDetails.title.substring(0, 50)}...`
                        : adDetails.title
                    }
                </h2>
                <p className="card-price">{adDetails.price} RUB</p>
                <p className="card-city">{location.city}, {location.country}</p>
                <Link to={`/users/user/${userID}/profile/show`} onClick={() => handleProfileClick(userID)} className="announcer">
                    <img src={profileImage} alt="avatar" className="avatar" />
                </Link>
                <div className="card-footer">
                    <span className="card-date">
                        <FontAwesomeIcon icon={faCalendarDay} color={"gray"} />
                        {formatPostedAt(moderatedAtDate)}
                    </span>
                    <span className="card-viewCount">
                        <FontAwesomeIcon icon={faEye} color={"gray"} />
                        {formatViewCount(views)}
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

            <Menu options={options} isOpen={showMenu} onClose={() => setShowMenu(false)} />
            <Menu options={reportReasons} isOpen={showReportModal} onClose={() => setShowReportModal(false)} />
            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    );
};
