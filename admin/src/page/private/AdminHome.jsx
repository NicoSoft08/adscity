import React, { useContext, useEffect, useState } from 'react';

// components
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/dashboard-header/Header';
// import { faBuysellads } from '@fortawesome/free-brands-svg-icons';
import { AuthContext } from '../../contexts/AuthContext';
import { fetchNotifications } from '../../routes/userRoutes';
import { fetchVerifications } from '../../routes/apiRoutes';
import Toast from '../../customs/Toast';
import Loading from '../../customs/Loading';
import { LanguageContext } from '../../contexts/LanguageContext';
import { adminSidebarData } from '../../data';
import '../../styles/AdminHome.scss';

export default function AdminHome() {
    const { currentUser } = useContext(AuthContext);
    const { language } = useContext(LanguageContext);
    const location = useLocation();
    const [loading, setIsLoading] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [verifications, setVerifications] = useState([]);
    const [toast, setToast] = useState({ show: false, type: '', message: ''});

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);

        const getNotifications = async () => {
            const userID = currentUser?.uid;

            if (!userID) {
                if (isMounted) {
                    setIsLoading(false);
                    setToast({ show: true, type: 'error', message: 'Utilisateur non connecté' });
                }
                return;
            }

            try {
                const [notifResult, verifResult] = await Promise.all([
                    fetchNotifications(userID),
                    fetchVerifications()
                ]);

                if (isMounted) {
                    if (notifResult.success) {
                        setNotifications(notifResult.data.unReadNotifs);
                    } else {
                        setToast({ show: true, type: 'error', message: notifResult.message || "Erreur lors de la récupération des notifications" });
                    }

                    if (verifResult.success) {
                        setVerifications(verifResult.data);
                    }

                    setIsLoading(false);
                }
            } catch (error) {
                console.error("❌ Erreur lors de la récupération des données :", error);
                if (isMounted) {
                    setToast({ show: true, type: 'error', message: "Erreur lors de la récupération des données" });
                    setIsLoading(false);
                }
            }
        }

        getNotifications();

        return () => { isMounted = false };
    }, [currentUser]);


    return (
        <div className='user-home'>
            <Header />
            {loading && <Loading />}
            <div className={`dashboard ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="content">
                    <nav className="sidebar">
                        <ul>
                            {adminSidebarData(language).map(({ id, name, icon, path }) => (
                                <li key={id} className={location.pathname.includes(path) ? "active" : ""}>
                                    <Link to={path}>
                                        <FontAwesomeIcon icon={icon} />
                                        {!isCollapsed && <span className='label'>{name}</span>}
                                        {id === "notifications" && notifications.length > 0 && (
                                            <span className="badge">{notifications.length}</span>
                                        )}
                                        {id === 'verifications' && verifications.length > 0 && (
                                            <span className="badge">{verifications.length}</span>
                                        )}
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
                            <p>© 2025 AdsCity DashBoard  by AdsCity</p>
                        </div>
                    </div>
                </div>
            </div>
            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ show: false, type: '', message: '' })} />
        </div>
    );
};
