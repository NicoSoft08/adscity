import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBars,
    faBell,
    faBullhorn,
    faChartLine,
    faCogs,
    faHeartCircleCheck,
    // faMessage,
    faMoneyBill,
    faUserCircle
} from '@fortawesome/free-solid-svg-icons';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/dashboard-header/Header';
import { AuthContext } from '../../contexts/AuthContext';
import { fetchUnreadNotifications } from '../../routes/userRoutes';
import '../../styles/UserHome.scss';

const menuItems = [
    { id: "panel", label: "Panel", icon: faChartLine, path: "/user/dashboard/panel" },
    { id: "posts", label: "Annonces", icon: faBullhorn, path: "/user/dashboard/posts" },
    { id: "favoris", label: "Favoris", icon: faHeartCircleCheck, path: "/user/dashboard/favoris" },
    // { id: "messages", label: "Messages", icon: faMessage, path: "/user/dashboard/messages" },
    { id: "notifications", label: "Notifications", icon: faBell, path: "/user/dashboard/notifications", badge: 0 },
    { id: "payments", label: "Paiements", icon: faMoneyBill, path: "/user/dashboard/payments" },
    { id: "profile", label: "Profil", icon: faUserCircle, path: "/user/dashboard/profile" },
    { id: "settings", label: "Paramètres", icon: faCogs, path: "/user/dashboard/settings" },
];


export default function UserHome() {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [unreadnotifications, setUnreadNotifications] = useState([]);

    useEffect(() => {
        if (!currentUser) {
            console.error("❌ Utilisateur non connecté.");
            navigate('/auth/signin');
            return;
        }

        const userID = currentUser.uid;
        const getNotifications = async () => {
            const result = await fetchUnreadNotifications(userID);
            if (result.success) {
                setUnreadNotifications(result?.data);
            }
        }

        if (userID) {
            getNotifications();
        }
    }, [currentUser, navigate]);

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
                                        {id === "notifications" && unreadnotifications.length > 0 && (
                                            <span className="badge">{unreadnotifications.length}</span>
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
                    </div>
                </div>
            </div>
        </div>
    );
};