import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBars,
    faBell,
    faBullhorn,
    faChartLine,
    // faFolder,
    faHeartCircleCheck,
    // faMoneyBill,
    faUserCircle
} from '@fortawesome/free-solid-svg-icons';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/dashboard-header/Header';
import { AuthContext } from '../../contexts/AuthContext';
import { fetchNotifications } from '../../routes/userRoutes';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebaseConfig';
import '../../styles/UserHome.scss';
import Loading from '../../customs/Loading';
import Toast from '../../customs/Toast';

export default function UserHome() {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [unreadnotifications, setUnreadNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    // Define menu items inside the component to access userData
    const menuItems = [
        { id: "panel", label: "Panel", icon: faChartLine, path: "/user/dashboard/panel" },
        { id: "posts", label: "Annonces", icon: faBullhorn, path: "/user/dashboard/posts" },
        // {
        //     id: "documents",
        //     label: "Documents",
        //     icon: faFolder,
        //     path: "/user/dashboard/documents",
        //     badge: userData?.verificationStatus === "pending" ? "pending" : null
        // },
        { id: "favoris", label: "Favoris", icon: faHeartCircleCheck, path: "/user/dashboard/favoris" },
        // { id: "messages", label: "Messages", icon: faMessage, path: "/user/dashboard/messages" },
        {
            id: "notifications",
            label: "Notifications",
            icon: faBell,
            path: "/user/dashboard/notifications",
            badge: unreadnotifications.length > 0 ? unreadnotifications.length : null
        },
        // { id: "payments", label: "Paiements", icon: faMoneyBill, path: "/user/dashboard/payments" },
        { id: "profile", label: "Profil", icon: faUserCircle, path: "/user/dashboard/profile" },
    ];

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
        
        const getNotifications = async () => {
            try {
                const result = await fetchNotifications(userID);
                
                if (isMounted) {
                    if (result && result.success) {
                        setUnreadNotifications(result?.data?.unReadNotifs || []);
                    } else {
                        // Handle unsuccessful response
                        console.warn("⚠️ Réponse invalide lors de la récupération des notifications");
                        setUnreadNotifications([]);
                    }
                }
            } catch (error) {
                console.error("❌ Erreur lors de la récupération des notifications :", error);
                if (isMounted) {
                    setToast({ show: true, type: 'error', message: 'Impossible de charger les notifications. Veuillez réessayer.' });
                    setUnreadNotifications([]);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }
        
        getNotifications();
        
        return () => {
            isMounted = false;
        };
    }, [currentUser, navigate]);
    

    return (
        <div className='user-home'>
            <Header />

            {isLoading && <Loading />}

            <div className={`dashboard ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="content">
                    <nav className="sidebar">
                        <ul>
                            {menuItems.map(({ id, label, icon, path, badge }) => {
                                return (
                                    <li key={id} className={location.pathname.includes(path) ? "active" : ""}>
                                        <Link to={path}>
                                            <FontAwesomeIcon icon={icon} />
                                            {!isCollapsed && <span className='label'>{label}</span>}
                                            {badge && (
                                                <span className={`badge ${typeof badge === 'string' ? badge : ''}`}>
                                                    {typeof badge === 'number' ? badge : '!'}
                                                </span>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
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
