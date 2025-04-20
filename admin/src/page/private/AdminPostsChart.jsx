import React, { useEffect, useState } from 'react';
import {
    fetchApprovedPosts,
    fetchPendingPosts,
    fetchRefusedPosts
} from '../../routes/postRoutes';
import {
    Chart as ChartJS,
    ArcElement,
    Legend,
    Tooltip
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import '../../styles/AdminPostsChart.scss';

// Activer les composants de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

export default function AdminPostsChart() {
    const [postsPending, setPostsPending] = useState([]);
    const [postsApproved, setPostsApproved] = useState([]);
    const [postsRefused, setPostsRefused] = useState([]);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Fetch all the ads data in parallel
                const [pendingPosts, approvedPosts, refusedPosts] = await Promise.all([
                    fetchPendingPosts(),
                    fetchApprovedPosts(),
                    fetchRefusedPosts(),
                ]);

                // Set the ads data
                setPostsPending(pendingPosts?.pendingPosts || []); 
                setPostsApproved(approvedPosts?.approvedPosts || []); 
                setPostsRefused(refusedPosts?.refusedPosts || []); 
            } catch (error) {
                console.error('Erreur lors de la récupération des annonces:', error);
            }
        };

        fetchAllData();
    }, []);

    const data = {
        labels: ['En attente', 'Approuvée(s)', 'Refusée(s)'],
        datasets: [
            {
                label: 'Statut des annonces',
                data: [postsPending.length, postsApproved.length, postsRefused.length],
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
                        family: "'Ubuntu', sans-serif",
                        color: '#ffffff'
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
            <Doughnut
                data={data}
                options={options}
            />
        </div>
    );
};
