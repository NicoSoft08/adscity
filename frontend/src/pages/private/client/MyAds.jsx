import React, { useEffect, useState } from 'react';
import { 
    fetchUserActiveAds, 
    fetchUserInactiveAds 
} from '../../../services/userServices';
import '../../../styles/MyAds.scss';
import CardList from '../../../utils/card/CardList';
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
            const activeAds = await fetchUserActiveAds(userID);
            setAdsActive(activeAds);
        };

        const fetchActiveAds = async () => {
            const disabledAds = await fetchUserInactiveAds(userID);
            setAdsInactive(disabledAds);
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
                    <CardList>
                        {adsActive.map((item, index) => (
                            <CardItem key={index} ad={item} />
                        ))}
                    </CardList>
                )}

                {selectedTab === 'completed' && adsInactive.length > 0 && (
                    <CardList>
                        {adsInactive.map((item, index) => (
                            <CardItem key={index} ad={item} />
                        ))}
                    </CardList>
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
