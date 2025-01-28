import React, { useState } from 'react'
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './TabFilter.scss';
import Toast from '../../customs/Toast';

function TabFilter({ adsApproved, setAdsApproved, onFilterClick, currentUser, userData, setToast, toast }) {
    const [activeTab, setActiveTab] = useState('recently-posted');

    const handleTabClick = (tab) => {
        if (tab === 'nearby' && !currentUser) {
            setToast({
                show: true,
                type: 'error',
                message: 'Veuillez vous connecter pour utiliser la fonction "Autour de moi".'
            });
            return;
        }
        setActiveTab(tab);

        // Filtrer les annonces en fonction de l'onglet sélectionné
        if (tab === 'recently-posted') {
            const filteredAds = adsApproved.filter((post) => {
                const createdAt = post?.posted_at?.toDate?.() || new Date(post.posted_at);
                const currentTime = new Date();
                return (currentTime - createdAt) < 7 * 24 * 60 * 60 * 1000; // Moins de 7 jours
            });
            setAdsApproved(filteredAds); // Affiche les annonces récemment publiées
        } else if (tab === 'nearby') {
            const filteredAds = adsApproved.filter(
                (post) =>
                    post?.location.city?.toLowerCase() === userData.city.toLowerCase() ||
                    post?.location.country?.toLowerCase() === userData.country.toLowerCase()
            ); // Filtrer par proximité
            setAdsApproved(filteredAds);
            setToast({
                show: true,
                type: 'success',
                message: 'Annonces filtrées par proximité.'
            });
        }
    };

    return (
        <div className="filter-header">
            <span
                className={`tab ${activeTab === 'recently-posted' ? 'active' : ''}`}
                onClick={() => handleTabClick('recently-posted')}
            >
                Récemment publiés
            </span>
            <span
                className={`tab ${activeTab === 'nearby' ? 'active' : ''}`}
                onClick={() => handleTabClick('nearby')}
            >
                Autour de moi
            </span>
            <FontAwesomeIcon
                icon={faFilter}
                size="2x"
                className="filter-icon"
                onClick={onFilterClick} // Fonction pour l'icône de filtre
            />
            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    );
};

export default TabFilter