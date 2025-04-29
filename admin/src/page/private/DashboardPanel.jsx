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
import Loading from '../../customs/Loading';
import { LanguageContext } from '../../contexts/LanguageContext';
import PostsAnalytics from '../../components/PostsAnalytics';
import UsersAnalytics from '../../components/UsersAnalytics';
import '../../styles/DashboardPanel.scss';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

export default function DashboardPanel() {
    const navigate = useNavigate();
    const { language } = useContext(LanguageContext);
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

    // Fetch users data
    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                // Get the authentication token if user is logged in
                let idToken;

                if (currentUser) {
                    idToken = await currentUser.getIdToken(true);
                }

                const data = await fetchUsers(idToken);
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
    }, [language, currentUser]);

    // Fetch all posts data
    useEffect(() => {
        let isMounted = true;

        const fetchAllData = async () => {
            try {
                // Get the authentication token if user is logged in
                let idToken;

                if (currentUser) {
                    idToken = await currentUser.getIdToken(true);
                }

                const data = await fetchPosts(idToken);
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
    }, [language, currentUser]);

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

            <PostsAnalytics
                posts={posts}
                postsApproved={postsApproved}
                postsPending={postsPending}
                postsRefused={postsRefused}
                isLoading={isLoading}
            />

            <UsersAnalytics
                users={users}
                online={online}
                offline={offline}
                isLoading={isLoading}
            />

            <PaymentStats />
            <PendingPosts />

            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    );
}
