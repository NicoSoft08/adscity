import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/dashboard-header/Header';
import { AuthContext } from '../../contexts/AuthContext';
import { fetchNotifications } from '../../routes/userRoutes';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebaseConfig';
import Loading from '../../customs/Loading';
import Toast from '../../customs/Toast';
import { LanguageContext } from '../../contexts/LanguageContext';
import { userSidebarData } from '../../data';
import '../../styles/UserHome.scss';
import { fetchUserConversations } from '../../routes/chatRoutes';

export default function UserHome() {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser, userData } = useContext(AuthContext);
    const { language } = useContext(LanguageContext);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    useEffect(() => {
        let isMounted = true;

        // Check authentication
        if (!currentUser) {
            console.error("❌ Utilisateur non connecté.");
            navigate('/auth/signin');
            return;
        }

        // Log analytics with minimal data
        try {
            logEvent(analytics, 'page_view', {
                page_path: '/user/dashboard',
                user_type: 'authenticated' // Avoid sending actual UIDs
            });
        } catch (analyticsError) {
            console.error("❌ Erreur d'analytics:", analyticsError);
        }

        // Validate user ID format (assuming Firebase UID format)
        const userID = currentUser.uid;
        if (!userID || typeof userID !== 'string' || userID.length < 10) {
            console.error("❌ ID utilisateur invalide");
            return;
        }

        // Set loading state
        setIsLoading(true);

        // Fonction pour récupérer le nombre de messages non lus
        // const fetchUnreadMessagesCount = async () => {
        //     try {
        //         const idToken = await currentUser.getIdToken();
        //         const result = await fetchUserConversations(userID, idToken);
        //         if (result.success) {
        //             setUnreadMessages(result.data.totalUnreadCount || 0);
        //         }
        //     } catch (error) {
        //         console.error('Erreur lors de la récupération des messages non lus:', error);
        //     }
        // };

        const getNotifications = async () => {
            try {
                const idToken = await currentUser.getIdToken(true);

                const result = await fetchNotifications(userID, idToken);

                if (isMounted) {
                    if (result && result.success) {
                        setNotifications(result?.data?.unReadNotifs || []);
                    } else {
                        // Handle unsuccessful response
                        console.warn("⚠️ Réponse invalide lors de la récupération des notifications");
                        setNotifications([]);
                    }
                }
            } catch (error) {
                console.error("❌ Erreur lors de la récupération des notifications :", error);
                if (isMounted) {
                    setToast({ show: true, type: 'error', message: 'Impossible de charger les notifications. Veuillez réessayer.' });
                    setNotifications([]);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        // fetchUnreadMessagesCount();
        getNotifications();
        return () => { isMounted = false };
    }, [currentUser, navigate]);

    const identityDocument = userData?.documents?.identityDocument;
    const selfie = userData?.documents?.selfie;
    const userHasDocument = Boolean(identityDocument && selfie);


    return (
        <div className='user-home'>
            <Header />

            {isLoading && <Loading />}

            <div className={`dashboard ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="content">
                    <nav className="sidebar">
                        <ul>
                            {userSidebarData(language, userData?.profileType, userHasDocument).map(({ id, name, icon, path }) => (
                                <li key={id} className={location.pathname.includes(path) ? "active" : ""}>
                                    <Link to={path}>
                                        <FontAwesomeIcon icon={icon} />
                                        {!isCollapsed && <span className='label'>{name}</span>}
                                        {id === "notifications" && notifications.length > 0 && (
                                            <span className="badge">{notifications.length}</span>
                                        )}

                                        {/* {id === "messages" && unreadMessages > 0 && (
                                            <span className="badge">{unreadMessages}</span>
                                        )} */}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <button className="collapse-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
                            <FontAwesomeIcon icon={faBars} />
                        </button>
                    </nav>
                    <div className="main-content">
                        <Outlet />
                        <div className="footer">
                            <p>© 2025 AdsCity DashBoard by AdsCity</p>
                        </div>
                    </div>
                </div>
            </div>
            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ show: false, type: '', message: '' })} />
        </div>
    );
}
