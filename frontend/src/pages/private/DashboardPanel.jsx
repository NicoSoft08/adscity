import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchPostsByUserID } from '../../routes/userRoutes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from "chart.js";
import '../../styles/DashboardPanel.scss';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

export default function DashboardPanel() {
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

    // 🔵 Données pour le graphique des visites aujourd'hui (Line Chart)
    const visitsTodayData = {
        labels: Object.keys(userData.profileVisitsToday || {}), // Dates
        datasets: [
            {
                label: "Visites aujourd'hui",
                data: Object.values(userData.profileVisitsToday || {}), // Nombre de visites
                backgroundColor: "rgba(54, 162, 235, 0.5)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 2,
                fill: true
            }
        ]
    };

    // 🟠 Données pour le graphique des visites par ville (Bar Chart)
    const visitsByCityData = {
        labels: Object.keys(userData.profileVisitsByCity || {}), // Noms des villes
        datasets: [
            {
                label: "Visites par ville",
                data: Object.values(userData.profileVisitsByCity || {}), // Nombre de visites
                backgroundColor: [
                    "rgba(255, 99, 132, 0.5)",
                    "rgba(54, 162, 235, 0.5)",
                    "rgba(255, 206, 86, 0.5)",
                    "rgba(75, 192, 192, 0.5)"
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)"
                ],
                borderWidth: 1
            }
        ]
    };

    return (
        <div className='panel'>
            <div className='head'>
                <h3>Aperçus</h3>
                <button className='add-new-ad' onClick={() => navigate('/auth/create-post')}>
                    <FontAwesomeIcon icon={faPlusSquare} className='icon' />
                    <span>Créer une annonce</span>
                </button>
            </div>

            <div className="chart-container">
                <h4>État des annonces</h4>
                <Pie data={data} />
            </div>

            <h3>Statistiques de Visites</h3>

            {/* Graphique des visites aujourd'hui */}
            <div className="chart-container">
                <h4>📅 Visites aujourd'hui</h4>
                <Bar data={visitsTodayData} />
            </div>

            {/* Graphique des visites par ville */}
            <div className="chart-container">
                <h4>🌍 Visites par ville</h4>
                <Pie data={visitsByCityData} />
            </div>
        </div>
    );
};
