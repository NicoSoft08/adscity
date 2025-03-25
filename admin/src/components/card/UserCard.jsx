import React, { useState } from 'react';
import { IconAvatar } from '../../config/images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard, faChevronDown, faChevronRight, faHome, faLocation } from '@fortawesome/free-solid-svg-icons';
import '../../styles/UserCard.scss';

export default function UserCard({ user }) {
    const [drop, setDrop] = useState({
        info: false,
        activity: false,
        rating: false,
        subscription: false,
    });

    const {
        profilURL,
        displayName,
        profileNumber,
        profileType,
        location,
        isOnline,
        adsCount,
        adsPostedThisMonth,
        profileViewed,
        clicksOnAds,
        ratings,
        reviews,
        subscription,
        plans,
        createdAt,
        role,
    } = user;

    const formatDate = (timestamp) => {
        if (timestamp && timestamp._seconds) {
            const date = new Date(timestamp._seconds * 1000); // Convert to milliseconds
            let formattedDate = date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });

            // Capitalize the first letter
            return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
        }
        return '';
    };
    const getProfilePicture = () => profilURL || IconAvatar;
    const formatUserStatut = () => (isOnline ? "🟢 En ligne" : "🔴 Hors ligne");
    const formatUserRole = () => (role === 'admin' ? "Administrateur" : "Utilisateur");

    return (
        <div className="user-card">
            {/* Photo de profil */}
            <div className="profile-pic">
                <img src={getProfilePicture()} alt={displayName} />
                <p>{displayName}</p>
            </div>

            {/* Infos principales */}
            <div className="drop" onClick={() => setDrop({ ...drop, info: !drop.info })}>
                <h2>Infos principales</h2>
                <FontAwesomeIcon icon={drop.info ? faChevronRight : faChevronDown} className="icon" />
            </div>
            {drop.info && (
                <div className="user-info">
                    <p className="profile-number">
                        <FontAwesomeIcon icon={faAddressCard} className="icon" /> #{profileNumber}
                    </p>
                    <p className="role">{formatUserRole()}</p>
                    <p className="profile-type">{profileType}</p>
                    <p className="location">
                        <FontAwesomeIcon icon={faHome} className="icon" /> {location}
                    </p>
                    <p className={`status ${isOnline ? 'online' : 'offline'}`}>
                        {formatUserStatut()}
                    </p>
                    <p className='member-since'>Membre depuis: {formatDate(createdAt)}</p>
                </div>
            )}

            {role === 'user' ? (
                <>
                    {/* Activité */}
                    <div className="drop" onClick={() => setDrop({ ...drop, activity: !drop.activity })}>
                        <h2>Activité</h2>
                        <FontAwesomeIcon icon={drop.activity ? faChevronRight : faChevronDown} className="icon" />
                    </div>
                    {drop.activity && (
                        <div className="user-stats">
                            <p>📝 Annonces : <strong>{adsCount}</strong></p>
                            <p>📅 Ce mois-ci : <strong>{adsPostedThisMonth}</strong></p>
                            <p>👀 Profil vu : <strong>{profileViewed}</strong></p>
                            <p>📊 Clics sur annonces : <strong>{clicksOnAds}</strong></p>
                        </div>
                    )}

                    {/* Évaluations */}
                    <div className="drop" onClick={() => setDrop({ ...drop, rating: !drop.rating })}>
                        <h2>Évaluations</h2>
                        <FontAwesomeIcon icon={drop.rating ? faChevronRight : faChevronDown} className="icon" />
                    </div>
                    {drop.rating && (
                        <div className="user-ratings">
                            <p className="rating">
                                <FontAwesomeIcon icon={faLocation} className="star-icon" /> {ratings.average} / 5
                            </p>
                            <p>{reviews.totalReviews} avis</p>
                        </div>
                    )}

                    {/* Abonnement */}
                    <div className="drop" onClick={() => setDrop({ ...drop, subscription: !drop.subscription })}>
                        <h2>Abonnement</h2>
                        <FontAwesomeIcon icon={drop.subscription ? faChevronRight : faChevronDown} className="icon" />
                    </div>
                    {drop.subscription && (
                        <div className="subscription-info">
                            <p>🛠️ Abonnement : <strong>{subscription}</strong></p>
                            <p>📌 Max annonces : <strong>{plans.individual.max_ads}</strong></p>
                            <p>📅 Expiration : <strong>{new Date(plans.individual.expiryDate._seconds * 1000).toLocaleDateString()}</strong></p>
                        </div>
                    )}
                </>
            ) : null}
        </div>
    );
};
