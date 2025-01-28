import React, { useEffect, useState } from 'react';
import { 
    fetchUserActivePosts, 
    fetchUserInactivePosts 
} from '../../../routes/userRoutes';
import '../../../styles/MyAds.scss';
import CardItem from '../../../utils/card/CardItem';

const AdSwitch = ({ activeCount = 10, completedCount = 289, onSwitch }) => {
    const [activeTab, setActiveTab] = useState('active');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        if (onSwitch) {
            onSwitch(tab); // Déclenche la fonction passée en tant que prop
        }
    };


    return (
        <div className="ad-switch-container">
            <div
                className={`tab ${activeTab === 'active' ? 'active' : ''}`}
                onClick={() => handleTabClick('active')}
            >
                Actives <span className='count'>{activeCount}</span>
                {activeTab === 'active' && <div className='underline'></div>}
            </div>
            <div
                className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
                onClick={() => handleTabClick('completed')}
            >
                Inactives <span className='count'>{completedCount}</span>
                {activeTab === 'completed' && <div className='underline'></div>}
            </div>
        </div>
    )
}

export default function MyAds({ currentUser }) {
    const [adsActive, setAdsActive] = useState([]);
    const [adsInactive, setAdsInactive] = useState([]);
    const [selectedTab, setSelectedTab] = useState('active');

    useEffect(() => {
        const userID = currentUser?.uid;
        const fetchDisabledAds = async () => {
            const result = await fetchUserActivePosts(userID);
            if (result.success) {
                setAdsActive(result?.activePosts || []);
            }
        };

        const fetchActiveAds = async () => {
            const result = await fetchUserInactivePosts(userID);
            if (result.success) {
                setAdsInactive(result?.inactivePosts || []);
            }
        }

        fetchActiveAds();
        fetchDisabledAds();

    }, [currentUser]);

    const handleSwitch = (tab) => {
        setSelectedTab(tab);
    };

    return (
        <div className='my-ads'>
            <h2>Mes Annonces</h2>
            <AdSwitch
                activeCount={adsActive.length}
                completedCount={adsInactive.length}
                onSwitch={handleSwitch}
            />
            <div className="ads-list">
                {selectedTab === 'active' && adsActive.length > 0 && (
                    <div className="card-list">
                        {adsActive.map((item, index) => (
                            <CardItem key={index} post={item} />
                        ))}
                    </div>
                )}

                {selectedTab === 'completed' && adsInactive.length > 0 && (
                    <div className="card-list">
                        {adsInactive.map((item, index) => (
                            <CardItem key={index} ad={item} />
                        ))}
                    </div>
                )}

                {selectedTab === 'active' && adsActive.length === 0 && (
                    <p>Vous n'avez aucune annonce active.</p>
                )}
                {selectedTab === 'completed' && adsInactive.length === 0 && (
                    <p>Vous n'avez aucune annonce inactive.</p>
                )}
            </div>
        </div>
    );
};
