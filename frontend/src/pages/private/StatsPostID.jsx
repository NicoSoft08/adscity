import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchPostById } from '../../routes/postRoutes';
import { Bar, Pie } from 'react-chartjs-2';
import Loading from '../../customs/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

export default function StatsPostID() {
    const { post_id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchPostById(post_id);
            if (result.success) {
                setPost(result.data);
                setLoading(false);
            }
        };

        if (post_id) {
            fetchData();
        }
    }, [post_id]);

    const { stats } = post || {};

    const barData = {
        labels: ["Vues", "Clics", "Signalements"],
        datasets: [
            {
                label: "Interactions",
                data: [stats?.views, stats?.clicks, stats?.reportingCount],
                backgroundColor: ["#4CAF50", "#FF5733", "#FFC107"],
                borderWidth: 2,
                fill: true
            }
        ]
    };

    const piesData = {
        pieOne: {
            labels: Object.keys(stats?.views_per_city || {}),
            datasets: [
                {
                    label: "Vues par ville",
                    data: Object.values(stats?.views_per_city || {}),
                    backgroundColor: ["#FF5733", "#4CAF50", "#FFD700", "#4285F4"]
                }
            ]
        },
        pieTwo: {
            labels: Object.keys(stats?.clicks_per_city || {}),
            datasets: [
                {
                    label: "Clics par ville",
                    data: Object.values(stats?.clicks_per_city || {}),
                    backgroundColor: ["#FF5733", "#4CAF50", "#FFD700", "#4285F4"]
                }
            ]
        },
        pieThree: {
            labels: Object.keys(stats?.report_per_city || {}),
            datasets: [
                {
                    label: "Signalements par ville",
                    data: Object.values(stats?.report_per_city || {}),
                    backgroundColor: ["#FF5733", "#4CAF50", "#FFD700", "#4285F4"]
                }
            ]
        }
    };

    const handleBack = () => {
        navigate(`/user/dashboard/posts/${post_id}`);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className='edit-post-id'>
            <div className="head">
                <FontAwesomeIcon icon={faChevronLeft} title='Go Back' onClick={handleBack} />
                <h2>Statistiques: {post_id.toLocaleUpperCase()}</h2>
            </div>
            <div className="charts">
                <div className="chart-container">
                    <h3>Vues, Clics & Signalements</h3>
                    {/* <Bar data={barData} /> */}

                    <Pie data={barData} />
                </div>

                <div className="chart-container">
                    <h3>Répartition des Vues par Ville</h3>
                    <Bar data={piesData.pieOne} />
                </div>

                <div className="chart-container">
                    <h3>Répartition des Clics par Ville</h3>
                    <Bar data={piesData.pieTwo} />
                </div>

                <div className="chart-container">
                    <h3>Répartition des Signalements par Ville</h3>
                    <Pie data={piesData.pieThree} />
                </div>
            </div>
        </div>
    );
};
