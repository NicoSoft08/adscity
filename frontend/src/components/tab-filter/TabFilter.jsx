import React, { useState } from 'react'
import { fetchNearbyPosts } from '../../routes/postRoutes';
import Toast from '../../customs/Toast';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebaseConfig';
import './TabFilter.scss';

function TabFilter({ adsApproved, setFilteredAds, onFilterClick, currentUser, userData, setToast, toast, setIsLoading }) {
    const [activeTab, setActiveTab] = useState('recently-posted');

    const handleTabClick = async (tab) => {
        if (tab === 'nearby' && !currentUser) {
            setToast({
                show: true,
                type: 'error',
                message: 'Veuillez vous connecter pour voir l\'onglet "Autour de moi".'
            });
            return;
        }
    
        setActiveTab(tab);
    
        if (tab === 'recently-posted') {
            setFilteredAds(adsApproved); // 🔥 Retour aux annonces originales
            return;
        }
    
        if (tab === 'nearby') {
            if (!userData?.country || !userData?.city) {
                setToast({ show: true, type: 'error', message: 'Informations de localisation manquantes.' });
                return;
            }
    
            setIsLoading(true);  // ⏳ Active le loader
            const result = await fetchNearbyPosts(userData?.country, userData?.city);
            logEvent(analytics, 'filter_nearby_posts');  // 📝 Enregistre l'événement
    
            if (result.success && result.nearbyPosts.length > 0) {
                setFilteredAds(result.nearbyPosts);
                setToast({ show: true, type: 'info', message: 'Annonces filtrées par proximité.' });
            } else {
                setToast({ show: true, type: 'error', message: 'Aucune annonce trouvée à proximité.' });
            }
    
            setIsLoading(false);  // ✅ Désactive le loader après la requête
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
            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    );
}

export default TabFilter