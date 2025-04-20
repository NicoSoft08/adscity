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
import Loading from '../../customs/Loading';
import { LanguageContext } from '../../contexts/LanguageContext';
import '../../styles/DashboardPanel.scss';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

export default function DashboardPanel() {
    const navigate = useNavigate();
    const { currentUser, userData } = useContext(AuthContext);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    // Data states
    const [users, setUsers] = useState([]);
    const [online, setOnline] = useState([]);
    const [offline, setOffline] = useState([]);
    const [posts, setPosts] = useState([]);
    const [postsPending, setPostsPending] = useState([]);
    const [postsApproved, setPostsApproved] = useState([]);
    const [postsRefused, setPostsRefused] = useState([]);

    // Loading states for each data fetch
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [loadingPendingPosts, setLoadingPendingPosts] = useState(true);
    const { language } = useContext(LanguageContext);

    // Fetch users data
    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const data = await fetchUsers();
                if (isMounted && data) {
                    setUsers(data.users?.allUsers || []);
                    setOnline(data.users?.onlineUsers || []);
                    setOffline(data.users?.offlineUsers || []);
                }
            } catch (err) {
                console.error('Erreur lors de la récupération des utilisateurs:', err);
                if (isMounted) {
                    setToast({
                        show: true,
                        type: 'error',
                        message: language === 'FR'
                            ? 'Erreur lors du chargement des données utilisateurs'
                            : 'Error fetching user data',
                    });
                }
            } finally {
                if (isMounted) {
                    setLoadingUsers(false);
                }
            }
        };

        fetchData();
        return () => { isMounted = false };
    }, [language]);

    // Fetch all posts data
    useEffect(() => {
        let isMounted = true;

        const fetchAllData = async () => {
            try {
                const data = await fetchPosts();
                if (isMounted && data) {
                    setPosts(data.posts?.allAds || []);
                    setPostsApproved(data.posts?.approvedAds || []);
                    setPostsRefused(data.posts?.refusedAds || []);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des annonces:', error);
                if (isMounted) {
                    setToast({
                        show: true,
                        type: 'error',
                        message: language === 'FR'
                            ? 'Erreur lors du chargement des annonces'
                            : 'Error fetching ads data',
                    });
                }
            } finally {
                if (isMounted) {
                    setLoadingPosts(false);
                }
            }
        };

        fetchAllData();
        return () => { isMounted = false; };
    }, [language]);

    // Fetch pending posts
    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const result = await fetchPendingPosts();
                if (isMounted && result.success) {
                    setPostsPending(result.pendingPosts || []);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des annonces en attente:', error);
                if (isMounted) {
                    setToast({
                        show: true,
                        type: 'error',
                        message: language === 'FR'
                            ? 'Erreur lors du chargement des annonces en attente'
                            : 'Error fetching pending ads',
                    });
                }
            } finally {
                if (isMounted) {
                    setLoadingPendingPosts(false);
                }
            }
        };

        fetchData();
        return () => { isMounted = false; };
    }, [language]);

    // Compute overall loading state
    const isLoading = loadingUsers || loadingPosts || loadingPendingPosts;

    // Prepare chart data only when data is available
    const graphics = {
        pieData: {
            labels: language === 'FR'
                ? ["Toutes", "En attente", "Approuvées", "Refusées"]
                : ["All", "Pending", "Approved", "Rejected"],
            datasets: [
                {
                    label: language === 'FR'
                        ? "Statut des annonces"
                        : "Ads status",
                    data: [
                        posts.length || 0,
                        postsPending.length || 0,
                        postsApproved.length || 0,
                        postsRefused.length || 0
                    ],
                    backgroundColor: ["#00aaff", "#FFA500", "#4CAF50", "#FF0000"],
                },
            ],
        },
        barData: {
            labels: language === 'FR'
                ? ["Tous", "Online", "Offline"]
                : ["All", "Online", "Offline"],
            datasets: [
                {
                    label: language === 'FR'
                        ? "Statut des utilisateurs"
                        : "Users status",
                    data: [
                        users.length || 0,
                        online.length || 0,
                        offline.length || 0
                    ],
                    backgroundColor: ["#00aaff", "#4CAF50", "#FF0000"],
                },
            ],
        }
    };

    const handleClickAddAdmin = () => {
        if (currentUser && userData?.permissions?.includes('SUPER_ADMIN')) {
            navigate('create-admin');
        } else {
            setToast({
                show: true,
                type: 'error',
                message: language === 'FR'
                    ? 'Vous n\'avez pas les autorisations pour ajouter un administrateur.'
                    : 'You do not have permission to add an administrator.',
            });
        }
    };

    // If loading, show loading indicator
    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className='panel'>
            <div className='head'>
                <h3>{language === 'FR' ? "Aperçus" : "Overviews"}</h3>
                <button className='add-new-ad' onClick={handleClickAddAdmin}>
                    <FontAwesomeIcon icon={faPlusSquare} className='icon' />
                    <span>{language === 'FR' ? "Ajouter Admin" : "Add Admin"}</span>
                </button>
            </div>

            <div className="chart-container">
                <h4>{language === 'FR' ? "État des annonces" : "Ads status"}</h4>
                <Pie data={graphics.pieData} />
            </div>

            <div className="chart-container">
                <h4>{language === 'FR' ? "État des utilisateurs" : "Users status"}</h4>
                <Bar data={graphics.barData} />
            </div>

            <PaymentStats />
            <PendingPosts />

            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    );
}
