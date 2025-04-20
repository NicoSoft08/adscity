import React from 'react';
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from "chart.js";

// Enregistrement des composants nécessaires de Chart.js
// import './ProfileStats.scss';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

export default function ProfileStats({ user }) {
    // 🔵 Données pour le graphique des visites aujourd'hui (Line Chart)
    const visitsTodayData = {
        labels: Object.keys(user.profileVisitsToday || {}), // Dates
        datasets: [
            {
                label: "Visites aujourd'hui",
                data: Object.values(user.profileVisitsToday || {}), // Nombre de visites
                backgroundColor: "rgba(54, 162, 235, 0.5)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 2,
                fill: true
            }
        ]
    };

    // 🟠 Données pour le graphique des visites par ville (Bar Chart)
    const visitsByCityData = {
        labels: Object.keys(user.profileVisitsByCity || {}), // Noms des villes
        datasets: [
            {
                label: "Visites par ville",
                data: Object.values(user.profileVisitsByCity || {}), // Nombre de visites
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
        <div className="profile-charts">
            <h3>📊 Statistiques de Visites</h3>

            <div className="charts-container">

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

        </div>
    );
};
