import React, { useContext, useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { AuthContext } from '../../../contexts/AuthContext';
import {
    fetchApprovedPostsByUserID,
    fetchPendingPostsByUserID,
    fetchRefusedPostsByUserID
} from '../../../routes/userRoutes';
import '../../../styles/UserAdsChart.scss';

// Activer les composants de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

export default function UserAdsChart() {
    const { currentUser } = useContext(AuthContext);
    const [adsPending, setAdsPending] = useState([]);
    const [adsApproved, setAdsApproved] = useState([]);
    const [adsRefused, setAdsRefused] = useState([]);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const userID = currentUser?.uid;
                // Fetch all the ads data in parallel
                const [pendingAds, approvedAds, refusedAds] = await Promise.all([
                    fetchPendingPostsByUserID(userID),
                    fetchApprovedPostsByUserID(userID),
                    fetchRefusedPostsByUserID(userID),
                ]);

                // Set the ads data
                setAdsPending(pendingAds?.pendingPosts || []);
                setAdsApproved(approvedAds?.approvedPosts || []);
                setAdsRefused(refusedAds?.refusedPosts || []);
            } catch (error) {
                console.error('Erreur lors de la récupération des annonces:', error);
            }
        }


        fetchAllData();
    }, [currentUser]);


    const data = {
        labels: ['En attente', 'Approuvée(s)', 'Refusée(s)'],
        datasets: [
            {
                label: 'Statut des annonces',
                data: [adsPending?.length, adsApproved?.length, adsRefused?.length],
                backgroundColor: ['#ffab00', '#4caf50', '#f44336'],
                borderColor: ['#ffab00', '#4caf50', '#f44336'],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 14,
                        family: "'Ubuntu', sans-serif"
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${value} annonce(s)`;
                    },
                },
            },
        },
    };

    return (
        <div className="admin-chart-container">
            <h3 className="chart-title">Statistique des annonces</h3>
            <Doughnut data={data} options={options} />
        </div>
    );

};
