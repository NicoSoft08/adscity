import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    fetchAdsByUserID, 
    fetchApprovedAdsByUserID, 
    fetchPendingAdsByUserID, 
    fetchRefusedAdsByUserID 
} from '../../../services/userServices';
import {
    faPlusSquare,
    faListAlt,
    faClock,
    faCheckCircle,
    faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthContext';
import '../../../styles/AdsStatistics.scss';



const Stats = ({ allAds, pendingAds, approvedAds, refusedAds }) => {
    return (
        <div className="ads-statistics">
            {/* Bloc pour toutes les annonces */}
            <div className="stat-block all">
                <FontAwesomeIcon icon={faListAlt} className="icon" />
                <div className="stat-info">
                    <h3>Toutes</h3>
                    <p>{allAds} annonce(s)</p>
                </div>
            </div>

            {/* Bloc pour les annonces en attente */}
            <div className="stat-block pending">
                <FontAwesomeIcon icon={faClock} className="icon" />
                <div className="stat-info">
                    <h3>En attente</h3>
                    <p>{pendingAds} annonce(s)</p>
                </div>
            </div>

            {/* Bloc pour les annonces approuvées */}
            <div className="stat-block approved">
                <FontAwesomeIcon icon={faCheckCircle} className="icon" />
                <div className="stat-info">
                    <h3>Approuvées</h3>
                    <p>{approvedAds} annonce(s)</p>
                </div>
            </div>

            {/* Bloc pour les annonces refusées */}
            <div className="stat-block refused">
                <FontAwesomeIcon icon={faTimesCircle} className="icon" />
                <div className="stat-info">
                    <h3>Refusées</h3>
                    <p>{refusedAds} annonce(s)</p>
                </div>
            </div>
        </div>
    )
}


export default function AdsStatistics() {
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [ads, setAds] = useState([]);
    const [adsPending, setAdsPending] = useState([]);
    const [adsApproved, setAdsApproved] = useState([]);
    const [adsRefused, setAdsRefused] = useState([]);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const userID = currentUser?.uid;
                // Fetch all the ads data in parallel
                const [allAds, pendingAds, approvedAds, refusedAds] = await Promise.all([
                    fetchAdsByUserID(userID),
                    fetchPendingAdsByUserID(userID),
                    fetchApprovedAdsByUserID(userID),
                    fetchRefusedAdsByUserID(userID),
                ]);

                // Set the ads data
                setAds(allAds);
                setAdsPending(pendingAds);
                setAdsApproved(approvedAds);
                setAdsRefused(refusedAds);
            } catch (error) {
                console.error('Erreur lors de la récupération des annonces:', error);
            }
        }


        fetchAllData();
    }, [currentUser]);

    return (
        <div className='ads-stats'>
            <div className='head'>
                <h3>Aperçus</h3>
                <button className='add-new-ad' onClick={() => navigate('/auth/create-announcement')}>
                    <FontAwesomeIcon icon={faPlusSquare} className='icon' />
                    <span>Créer une annonce</span>
                </button>
            </div>
            <Stats
                allAds={ads.length}
                pendingAds={adsPending.length}
                approvedAds={adsApproved.length}
                refusedAds={adsRefused.length}
            />
        </div>
    );
};
