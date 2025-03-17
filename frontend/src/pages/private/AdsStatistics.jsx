import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fetchPostsByUserID } from '../../routes/userRoutes';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { Bar, Pie } from "react-chartjs-2";
import ProfileStats from '../../components/profile-stats/ProfileStats';
import '../../styles/AdsStatistics.scss';


export default function AdsStatistics() {
    const { currentUser, userData } = useContext(AuthContext);
    const navigate = useNavigate();
    const [ads, setAds] = useState([]);
    const [adsPending, setAdsPending] = useState([]);
    const [adsApproved, setAdsApproved] = useState([]);
    const [adsRefused, setAdsRefused] = useState([]);

    useEffect(() => {
        let isMounted = true;
    
        const fetchAllData = async () => {
            try {
                if (!currentUser) return;
    
                const userID = currentUser.uid;
                const data = await fetchPostsByUserID(userID);
    
                if (isMounted && data) {
                    setAds(data.postsData?.allAds || []);
                    setAdsPending(data.postsData?.pendingAds || []);
                    setAdsApproved(data.postsData?.approvedAds || []);
                    setAdsRefused(data.postsData?.refusedAds || []);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des annonces:', error);
            }
        };
    
        fetchAllData();
    
        return () => { isMounted = false; };
    }, [currentUser]);

    const data = {
        labels: ["Toutes", "En attente", "Approuvées", "Refusées"],
        datasets: [
            {
                label: "Statut des annonces",
                data: [ads.length, adsPending.length, adsApproved.length, adsRefused.length],
                backgroundColor: ["#00aaff", "#FFA500", "#4CAF50", "#FF0000"],
            },
        ],
    };

    return (
        <div className='ads-stats'>
            <div className='head'>
                <h3>Aperçus</h3>
                <button className='add-new-ad' onClick={() => navigate('/auth/create-post')}>
                    <FontAwesomeIcon icon={faPlusSquare} className='icon' />
                    <span>Créer une annonce</span>
                </button>
            </div>
            <Pie data={data} />
            <ProfileStats user={userData} />
        </div>
    );
};
