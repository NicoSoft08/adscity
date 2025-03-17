import React, { useContext, useEffect, useState } from 'react';

// components
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBars,
    faBell,
    faBullhorn,
    faChartLine,
    faMoneyBill,
    faUserCircle,
    faUsers
} from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/dashboard-header/Header';
// import { faBuysellads } from '@fortawesome/free-brands-svg-icons';
import { AuthContext } from '../../contexts/AuthContext';
import { fetchNotifications } from '../../routes/userRoutes';
import '../../styles/AdminHome.scss';

const menuItems = [
    { id: "panel", label: "Panel", icon: faChartLine, path: "/admin/dashboard/panel" },
    { id: "posts", label: "Annonces", icon: faBullhorn, path: "/admin/dashboard/posts" },
    { id: "users", label: "Utilisateurs", icon: faUsers, path: "/admin/dashboard/users" },
    // { id: "pubs", label: "Publicités", icon: faBuysellads, path: "/admin/dashboard/pubs" },
    { id: "notifications", label: "Notifications", icon: faBell, path: "/admin/dashboard/notifications", badge: 0 },
    { id: "payments", label: "Paiements", icon: faMoneyBill, path: "/admin/dashboard/payments" },
    { id: "profile", label: "Profil", icon: faUserCircle, path: "/admin/dashboard/profile" },
    // { id: "settings", label: "Paramètres", icon: faCogs, path: "/admin/dashboard/settings" },
];


export default function AdminHome() {
    const { currentUser } = useContext(AuthContext);
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        let isMounted = true;

        const getNotifications = async () => {
            const userID = currentUser.uid;

            try {
                const result = await fetchNotifications(userID);
                if (isMounted && result) {
                    setNotifications(result.data?.unReadNotifs || []);
                }
            } catch (error) {
                console.error("❌ Erreur lors de la récupération des notifications :", error);
            }
        }

        getNotifications();

        return () => { isMounted = false };

    }, [currentUser]);

    return (
        <div className='user-home'>
            <Header />
            <div className={`dashboard ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="content">
                    <nav className="sidebar">
                        <ul>
                            {menuItems.map(({ id, label, icon, path }) => (
                                <li key={id} className={location.pathname.includes(path) ? "active" : ""}>
                                    <Link to={path}>
                                        <FontAwesomeIcon icon={icon} />
                                        {!isCollapsed && <span className='label'>{label}</span>}
                                        {id === "notifications" && notifications.length > 0 && (
                                            <span className="badge">{notifications.length}</span>
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
        </div>
    );
};
