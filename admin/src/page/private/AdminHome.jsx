import React, { useState } from 'react';

// components
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBars,
    faBell,
    faBullhorn,
    faChartLine,
    faCogs,
    faMoneyBill,
    faUserCircle,
    faUsers
} from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/dashboard-header/Header';
import '../../styles/AdminHome.scss';

const menuItems = [
    { id: "panel", label: "Panel", icon: faChartLine, path: "/admin/dashboard/panel" },
    { id: "posts", label: "Annonces", icon: faBullhorn, path: "/admin/dashboard/posts" },
    { id: "users", label: "Utilisateurs", icon: faUsers, path: "/admin/dashboard/users" },
    { id: "notifications", label: "Notifications", icon: faBell, path: "/admin/dashboard/notifications" },
    { id: "payments", label: "Paiements", icon: faMoneyBill, path: "/admin/dashboard/payments" },
    { id: "profile", label: "Profil", icon: faUserCircle, path: "/admin/dashboard/profile" },
    { id: "settings", label: "Paramètres", icon: faCogs, path: "/admin/dashboard/settings" },
];


export default function AdminHome() {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);


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
                                        {!isCollapsed && <span>{label}</span>}
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
