import React, { useContext, useState } from 'react';

// components
import DashboardPanel from './DashboardPanel';
import UserProfile from './UserProfile';
import Settings from './Settings';
import MyAds from './MyAds';
import PaymentIntents from '../../../components/payment/PaymentIntents';
import MyNotifications from '../MyNotifications';
import MyFavorites from '../MyFavorites';
import { AuthContext } from '../../../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBell, 
    faBullhorn, 
    faChartLine, 
    faCogs, 
    faHeartCircleCheck, 
    faMoneyBill, 
    faUserCircle 
} from '@fortawesome/free-solid-svg-icons';
import '../../../styles/UserHome.scss';


export default function UserHome() {
    const { currentUser } = useContext(AuthContext);
    const [activeSection, setActiveSection] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);

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
                            className={`${activeSection === "favoris" ? 'active' : ''}`}
                            onClick={() => setActiveSection('favoris')}
                        >
                            <FontAwesomeIcon icon={faHeartCircleCheck} />
                            {!isCollapsed ? <span>Favoris</span> : null}
                        </li>
                        <li
                            className={`${activeSection === "notifications" ? 'active' : ''}`}
                            onClick={() => setActiveSection('notifications')}
                        >
                            <FontAwesomeIcon icon={faBell} />
                            {!isCollapsed ? <span>Notifications</span> : null}
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
                    {activeSection === "posts" && <MyAds currentUser={currentUser} />}
                    {activeSection === "favoris" && <MyFavorites currentUser={currentUser} />}
                    {activeSection === "notifications" && <MyNotifications />}
                    {activeSection === "payments" && <PaymentIntents userID={currentUser?.uid} />}
                    {activeSection === "profile" && <UserProfile />}
                    {activeSection === "settings" && <Settings />}
                </div>
            </div>
        </div>

    );
};
