import React, { useContext, useState } from 'react'
import { fetchNearbyPosts } from '../../routes/postRoutes';
import Toast from '../../customs/Toast';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebaseConfig';
import { LanguageContext } from '../../contexts/LanguageContext';
import './TabFilter.scss';

function TabFilter({ adsApproved, setFilteredAds, onFilterClick, currentUser, userData, setToast, toast, setIsLoading }) {
    const [activeTab, setActiveTab] = useState('recently-posted');
    const { language } = useContext(LanguageContext);

    const handleTabClick = async (tab) => {
        const idToken = await currentUser?.getIdToken(); // 🔑 Récupère le token d'authentification de l'utilisateur
        if (tab === 'nearby' && !currentUser) {
            setToast({
                show: true,
                type: 'error',
                message: language === 'FR'
                    ? 'Veuillez vous connecter pour voir l\'onglet "Autour de moi".'
                    : 'Please log in to see the "Nearby" tab.'
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
                setToast({
                    show: true,
                    type: 'error',
                    message: language === 'FR'
                        ? 'Informations de localisation manquantes.'
                        : 'Missing location information.'
                });
                return;
            }

            setIsLoading(true);  // ⏳ Active le loader
            const result = await fetchNearbyPosts(userData?.country, userData?.city, idToken); // 🌍 Récupère les annonces à proximité
            logEvent(analytics, 'filter_nearby_posts');  // 📝 Enregistre l'événement

            if (result.success && result.nearbyPosts.length > 0) {
                setFilteredAds(result.nearbyPosts);
                setToast({
                    show: true,
                    type: 'info',
                    message: language === 'FR'
                        ? 'Annonces filtrées par proximité.'
                        : 'Filtered ads by proximity.'
                });
            } else {
                setToast({
                    show: true,
                    type: 'error',
                    message: language === 'FR'
                        ? 'Aucune annonce trouvée à proximité.'
                        : 'No ads found nearby.'
                });
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
                {language === 'FR' ? 'Récemment publiés' : 'Recently Posted'}
            </span>
            <span
                className={`tab ${activeTab === 'nearby' ? 'active' : ''}`}
                onClick={() => handleTabClick('nearby')}
            >
                {language === 'FR' ? 'Autour de moi' : 'Nearby'}
            </span>
            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    );
}

export default TabFilter