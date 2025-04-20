import React, { useContext, useEffect, useState } from 'react';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fetchPosts } from '../../routes/postRoutes';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Toast from '../../customs/Toast';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from "chart.js";
import '../../styles/PostsStatistics.scss';
import '../../styles/PhoneInput.scss';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);



export default function PostsStatistics() {
    const navigate = useNavigate();
    const { currentUser, userData } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [postsPending, setPostsPending] = useState([]);
    const [postsApproved, setPostsApproved] = useState([]);
    const [postsRefused, setPostsRefused] = useState([]);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    useEffect(() => {
        let isMounted = true;


        const fetchAllData = async () => {
            try {
                const data = await fetchPosts();

                if (isMounted && data) {
                    setPosts(data.posts?.allAds || []);
                    setPostsPending(data.posts?.pendingAds || []);
                    setPostsApproved(data.posts?.approvedAds || []);
                    setPostsRefused(data.posts?.refusedAds || []);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des annonces:', error);
            }
        };

        fetchAllData();

        return () => { isMounted = false; };
    }, []);

    const data = {
        labels: ["Toutes", "En attente", "Approuvées", "Refusées"],
        datasets: [
            {
                label: "Statut des annonces",
                data: [posts.length, postsPending.length, postsApproved.length, postsRefused.length],
                backgroundColor: ["#00aaff", "#FFA500", "#4CAF50", "#FF0000"],
            },
        ],
    };

    const handleClickAddAdmin = () => {
        if (currentUser && userData.permissions.includes('SUPER_ADMIN')) {
            navigate('create-admin')
        } else {
            setToast({
                show: true,
                type: 'error',
                message: 'Vous n\'avez pas les autorisations pour ajouter un administrateur.'
            });
        }
    };

    return (
        <div className='ads-stats'>
            <div className='head'>
                <h3>Aperçus</h3>
                <button className='add-new-ad' onClick={handleClickAddAdmin}>
                    <FontAwesomeIcon icon={faPlusSquare} className='icon' />
                    <span>Ajouter Admin</span>
                </button>
            </div>

            <div className="chart-container">
                <h4>État des annonces</h4>
                <Pie data={data} />
            </div>

            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast({ ...toast, show: false })}
            />
        </div>
    );
};
