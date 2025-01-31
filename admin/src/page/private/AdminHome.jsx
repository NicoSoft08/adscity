import React, { useContext, useEffect, useState } from 'react';

// components
import UserProfile from './UserProfile';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ManageUsers from './ManageUsers';
import DashboardPanel from './DashboardPanel';
import Settings from './Settings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBell,
    faBullhorn, 
    faChartLine, 
    faCogs, 
    faMoneyBill, 
    faUserCircle, 
    faUsers 
} from '@fortawesome/free-solid-svg-icons';
import PaymentIntents from '../public/PaymentIntents';
import ManagePosts from './ManagePosts';
import Notifications from './Notifications';
import '../../styles/AdminHome.scss';


export default function AdminHome() {
    const { currentUser, userRole } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        if (!currentUser) {
            navigate('/');
        } else if (currentUser && userRole !== 'admin') {
            navigate('/access-denied');
        }
    }, [navigate, currentUser, userRole]);



    return (
        <div className={`dashboard ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="content">
                <nav className="sidebar">
                    <ul>
                        <li
                            className={`${activeSection === "panel" ? 'active' : ''}`}
                            onClick={() => setActiveSection('panel')}
                        >
                            <FontAwesomeIcon icon={faChartLine} />
                            {!isCollapsed ? <span>Panel</span> : null}
                        </li>
                        <li
                            className={`${activeSection === "posts" ? 'active' : ''}`}
                            onClick={() => setActiveSection('posts')}
                        >
                            <FontAwesomeIcon icon={faBullhorn} />
                            {!isCollapsed ? <span>Annonces</span> : null}
                        </li>
                        <li
                            className={`${activeSection === "users" ? 'active' : ''}`}
                            onClick={() => setActiveSection('users')}
                        >
                            <FontAwesomeIcon icon={faUsers} />
                            {!isCollapsed ? <span>Utilisateurs</span> : null}
                        </li>
                        <li
                            className={`${activeSection === "payments" ? 'active' : ''}`}
                            onClick={() => setActiveSection('payments')}
                        >
                            <FontAwesomeIcon icon={faMoneyBill} />
                            {!isCollapsed ? <span>Paiements</span> : null}
                        </li>
                        <li
                            className={`${activeSection === "profile" ? 'active' : ''}`}
                            onClick={() => setActiveSection('profile')}
                        >
                            <FontAwesomeIcon icon={faUserCircle} />
                            {!isCollapsed ? <span>Profile</span> : null}
                        </li>
                        <li
                            className={`${activeSection === "notifications" ? 'active' : ''}`}
                            onClick={() => setActiveSection('notifications')}
                        >
                            <FontAwesomeIcon icon={faBell} />
                            {!isCollapsed ? <span>Notifications</span> : null}
                        </li>
                        <li
                            className={`${activeSection === "settings" ? 'active' : ''}`}
                            onClick={() => setActiveSection('settings')}
                        >
                            <FontAwesomeIcon icon={faCogs} />
                            {!isCollapsed ? <span>Paramètres</span> : null}
                        </li>
                    </ul>
                    <button className="collapse-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
                        {isCollapsed ? "Ouvrir" : "Fermer"}
                    </button>
                </nav>

                <div className="main-content">
                    {activeSection === "panel" && <DashboardPanel />}
                    {activeSection === "posts" && <ManagePosts />}
                    {activeSection === "users" && <ManageUsers />}
                    {activeSection === "payments" && <PaymentIntents />}
                    {activeSection === "profile" && <UserProfile />}
                    {activeSection === "notifications" && <Notifications />}
                    {activeSection === "settings" && <Settings />}
                </div>
            </div>
        </div>
    );
};
