import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function EngagementStatsChart({ data }) {
    const chartData = {
        labels: data.labels, // Les dates ou périodes
        datasets: [
            {
                label: 'Vues d\'annonce',
                data: data.views, // Données des vues
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
            {
                label: 'Clics sur l\'annonce',
                data: data.clicks, // Données des clics
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                fill: true,
            },
            {
                label: 'Sauvegardes (Favoris)',
                data: data.saves, // Données des favoris
                borderColor: 'rgba(255, 159, 64, 1)',
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                fill: true,
            }
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Engagement des Annonces',
            },
        },
    };

    return (
        <div>
            <Line data={chartData} options={options} />
        </div>
    );
};
