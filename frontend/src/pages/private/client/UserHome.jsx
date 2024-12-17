import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// components
import DashboardPanel from './DashboardPanel';
import UserProfile from './UserProfile';
import Settings from './Settings';
import MyAds from './MyAds';
import PaymentIntents from '../../../components/payment/PaymentIntents';
import { AuthContext } from '../../../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBell, 
    faBullhorn, 
    faChartLine, 
    faCogs, 
    faMoneyBill, 
    faUserCircle 
} from '@fortawesome/free-solid-svg-icons';
import '../../../styles/UserHome.scss';


const style = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black'
};

// content
const Notifications = () => <div style={style}>Ads Content</div>;


export default function UserHome() {
    const { currentUser, userData } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        if (!currentUser) {
            navigate('/');
        } else if (userData && userData.role !== 'user') {
            navigate('/access-denied');
        }
    }, [navigate, currentUser, userData]);



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
                            className={`${activeSection === "ads" ? 'active' : ''}`}
                            onClick={() => setActiveSection('ads')}
                        >
                            <FontAwesomeIcon icon={faBullhorn} />
                            {!isCollapsed ? <span>Annonces</span> : null}
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
                    {activeSection === "ads" && <MyAds currentUser={currentUser} />}
                    {activeSection === "notifications" && <Notifications />}
                    {activeSection === "payments" && <PaymentIntents userID={currentUser?.uid} />}
                    {activeSection === "profile" && <UserProfile />}
                    {activeSection === "settings" && <Settings />}
                </div>
            </div>
        </div>

    );
};
