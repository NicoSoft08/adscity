import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBan,
    faCalendarDay,
    faEllipsisV,
    faExclamationTriangle,
    faEye,
    faEyeSlash,
    faFlag,
    faGavel,
    faHeart,
    faShare
} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { formatViewCount } from '../../func';
import { format, isToday, isYesterday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { IconAvatar } from '../../config/images';
import {
    reportAd,
    updateContactClick,
    updateInteraction
} from '../../services/userServices';
import { fetchProfileByUserID } from '../../services/storageServices';
import Menu from '../../customs/Menu';
import Toast from '../../customs/Toast';
import './CardItem.scss';

export default function CardItem({ ad, isLiked, onToggleFavorites }) {
    const { currentUser } = useContext(AuthContext);
    const { id, userID, adDetails, images,
        location, category, subcategory, views,
        posted_at, expiry_date, isActive,
    } = ad;
    const [showMenu, setShowMenu] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [profilURL, setProfilURL] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfilURL = async () => {
            const response = await fetchProfileByUserID(userID);
            setProfilURL(response.profilURL);
        };

        fetchProfilURL();
    }, [userID]);

    const reportReasons = [
        { 
            id: 1, 
            label: 'Contenu inapproprié', 
            icon: faBan,
            action: () => handleReportWithReason(ad.id, 'Contenu inapproprié')
        },
        { 
            id: 2, 
            label: 'Produit illégal', 
            icon: faGavel,
            action: () => handleReportWithReason(ad.id, 'Produit illégal')
        },
        { 
            id: 3, 
            label: 'Annonce frauduleuse', 
            icon: faExclamationTriangle,
            action: () => handleReportWithReason(ad.id, 'Annonce frauduleuse')
        },
    ];

    const options = [
        {
            label: 'Signaler l\'annonce',
            icon: faFlag,
            action: () => handleReportAd(ad.id)
        },
        {
            label: 'Partager',
            icon: faShare,
            action: () => handleShareAd(ad.id)
        },
        {
            label: 'Masquer',
            icon: faEyeSlash,
            action: () => handleHideAd(ad.id)
        },
    ];

    const handleReportWithReason = async (adID, reasonLabel) => {
        if (!currentUser) {
            setToast({
                show: true,
                type: 'error',
                message: 'Vous devez être connecté pour signaler une annonce.'
            });
            return;
        }

        const userID = currentUser.id;

        const result = await reportAd(adID, userID, reasonLabel);
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


    const handleReportAd = (adID) => {
        setShowReportModal(true);
        setShowMenu(false);
        console.log(`Signaler l'annonce avec l'ID : ${adID}`);
    };

    const handleShareAd = (adID) => {
        console.log(`Partager l'annonce avec l'ID : ${adID}`);
    };

    const handleHideAd = (adID) => {
        console.log(`Masquer l'annonce avec l'ID : ${adID}`);
    };


    const formatPostedAt = (posted_at) => {
        const date = new Date(posted_at);

        if (isToday(date)) {
            return `Aujourd'hui ${format(date, 'HH:mm', { locale: fr })}`;
        }

        if (isYesterday(date)) {
            return `Hier ${format(date, 'HH:mm', { locale: fr })}`;
        }

        let formattedDate = format(date, 'd MMMM HH:mm', { locale: fr });

        return formattedDate;
    }

    const handleAdClick = async (url) => {
        const userID = currentUser?.uid;

        navigate(url);

        if (!userID) return null;

        try {
            await updateInteraction(id, userID, category); // Fonction pour mettre à jour clicksOnAds, categoriesViewed, et totalAdsViewed
            // Navigue vers la page de l'annonce

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
    }



    // Vérifier si l'annonce a expiré
    function parseTimestamp(timestamp) {
        return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
    }

    const postedAtDate = parseTimestamp(posted_at);
    const expiryDate = new Date(expiry_date);


    if (postedAtDate > expiryDate) return null;

    if (!isActive) return null;

    return (
        <div className={`card-container ${isActive ? 'active' : 'inactive'}`} key={id}>
            {/* Image de l'annonce */}
            {images && images.length > 0 && (
                <div onClick={() => handleAdClick(`/ads/${category}/${subcategory}/${id}`)}>
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
                <h2 className="card-title" title={`${adDetails.title}`}>
                    {adDetails.title.length > 50
                        ? `${adDetails.title.substring(0, 50)}...`
                        : adDetails.title
                    }
                </h2>
                <p className="card-price">{adDetails.price} RUB</p>
                <p className="card-city">{location.city}, {location.country}</p>
                <Link to={`/users/show/${userID}`} onClick={() => handleProfileClick(userID)} className="announcer">
                    <img src={profilURL || IconAvatar} alt="avatar" className="avatar" />
                </Link>
                <div className="card-footer">
                    <span className="card-date">
                        <FontAwesomeIcon icon={faCalendarDay} color={"gray"} />
                        {formatPostedAt(postedAtDate)}
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
                    className={`like-button ${isLiked ? 'active' : ''}`}
                    // className="like-button"
                    title={isActive ? 'Ajouter aux favoris' : 'Inactif - indisponible'}
                    onClick={(e) => { e.stopPropagation(); isActive && onToggleFavorites(ad.id); }}
                >
                    <FontAwesomeIcon icon={faHeart} color={isLiked ? "red" : "#343a40"} />
                </button>
            </div>
            {/* <div className="card-stats">
                <span>
                    <FontAwesomeIcon className='favoris-count' icon={faHeart} />
                    {" "}{favorites || 0}
                </span>
                <span>
                    <FontAwesomeIcon className='comment-count' icon={faComments} />
                    {" "}{comments || 0}
                </span>
                <span>
                    <FontAwesomeIcon className='share-count' icon={faShare} />
                    {" "}{shares}
                </span>
            </div> */}
            <Menu
                options={options}
                isOpen={showMenu}
                onClose={() => setShowMenu(false)}
            />
            <Menu
                options={reportReasons}
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
            />
            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    );
};
