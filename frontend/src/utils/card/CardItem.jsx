import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCalendarDay, 
    faEllipsisV, 
    faEye, 
    faHeart 
} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { formatViewCount } from '../../func';
import { format, isToday, isYesterday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { defaultProfilURL } from '../../config';
import {
    updateContactClick,
    updateInteraction
} from '../../services/userServices';
import { fetchProfileByUserID } from '../../services/storageServices';
import Menu from '../../customs/Menu';
import './CardItem.scss';

export default function CardItem({ ad, isLiked, onToggleFavorites }) {
    const { currentUser } = useContext(AuthContext);
    const { id, userID, adDetails, images,
        location, category, subcategory, views,
        posted_at, expiry_date, isActive, 
    } = ad;
    const [showMenu, setShowMenu] = useState(false);
    const [profilURL, setProfilURL] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfilURL = async () => {
            const response = await fetchProfileByUserID(userID);
            setProfilURL(response.profilURL);
        };

        fetchProfilURL();
    }, [userID]);


    const handleReportAd = (adID) => {
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
                    <img src={profilURL || defaultProfilURL} alt="avatar" className="avatar" />
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
                isOpen={showMenu}
                onClose={() => setShowMenu(false)}
                ad={ad}
                onReport={handleReportAd}
                onShare={handleShareAd}
                onHide={handleHideAd}
            />
        </div>
    );
};
