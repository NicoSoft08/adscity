import React, { useContext, useEffect, useState } from 'react';
import { fetchPendingPosts, fetchPosts } from '../../routes/postRoutes';
import PaymentStats from '../../components/payment-stats/PaymentStats';
import PendingPosts from './PendingPosts';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Toast from '../../customs/Toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from "chart.js";
import { fetchUsers } from '../../routes/userRoutes';
import { Bar, Pie } from 'react-chartjs-2';
import '../../styles/DashboardPanel.scss';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

export default function DashboardPanel() {
    const navigate = useNavigate();
    const { currentUser, userData } = useContext(AuthContext);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [users, setUsers] = useState([]);
    const [online, setOnline] = useState([]);
    const [offline, setOffline] = useState([]);
    const [posts, setPosts] = useState([]);
    const [postsPending, setPostsPending] = useState([]);
    const [postsApproved, setPostsApproved] = useState([]);
    const [postsRefused, setPostsRefused] = useState([]);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const data = await fetchUsers();
                if (isMounted && data) {
                    setUsers(data.users?.allUsers);
                    setOnline(data.users?.onlineUsers);
                    setOffline(data.users?.offlineUsers);
                }
            } catch (err) {
                console.error('Erreur technique:', err);
            }
        };

        fetchData();

        return () => { isMounted = false };
    }, []);

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

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchPendingPosts();
            if (result.success) {
                setPostsPending(result.pendingPosts);
            }
        };

        fetchData();
    }, []);

    const graphics = {
        pieData: {
            labels: ["Toutes", "En attente", "Approuvées", "Refusées"],
            datasets: [
                {
                    label: "Statut des annonces",
                    data: [posts.length, postsPending.length, postsApproved.length, postsRefused.length],
                    backgroundColor: ["#00aaff", "#FFA500", "#4CAF50", "#FF0000"],
                },
            ],
        },
        barData: {
            labels: ["Tous", "Online", "Offline"],
            datasets: [
                {
                    label: "Statut des utilisateurs",
                    data: [users.length, online.length, offline.length],
                    backgroundColor: ["#00aaff", "#4CAF50", "#FF0000"],
                },
            ],
        }

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
        <div className='panel'>
            <div className='head'>
                <h3>Aperçus</h3>
                <button className='add-new-ad' onClick={handleClickAddAdmin}>
                    <FontAwesomeIcon icon={faPlusSquare} className='icon' />
                    <span>Ajouter Admin</span>
                </button>
            </div>

            <div className="chart-container">
                <h4>État des annonces</h4>
                <Pie data={graphics.pieData} />
            </div>

            <div className="chart-container">
                <h4>État des utilisateurs</h4>
                <Bar data={graphics.barData} />
            </div>

            <PaymentStats />

            <PendingPosts />
            
            

            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast({ ...toast, show: false })}
            />
        </div>
    );
};
