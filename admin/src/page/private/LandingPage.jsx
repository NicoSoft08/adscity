import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { SideBarLeft, SideBarRight } from '../../customs/SideBar';
import SideBar from '../../components/left-side-bar/SideBar';
import { adminSidebarData } from '../../data';
import DashboardPanel from './DashboardPanel';
import ManageUsers from './ManageUsers';
import UserProfile from './UserProfile';
import Settings from './Settings';
import Header from '../../components/dashboard-header/Header';
import Notifications from './Notifications';
import '../../styles/LandingPage.scss';

const style = { display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' };

// content
const AdsSection = () => <div style={style}>Ads Content</div>;



export default function LandingPage() {
    const navigate = useNavigate();
    const { currentUser, userRole } = useContext(AuthContext);
    const [selectedId, setSelectedId] = useState('panel');
    const [notifications, setNotifications] = useState([]);


    useEffect(() => {
        if (!currentUser) {
            navigate('/auth/signin');
        }
        // else if (userRole !== 'admin') {
        //     navigate('/access-denied');
        // }

    }, [navigate, currentUser, userRole]);


    const handleItemClick = (selectId) => {
        setSelectedId(selectId);
        // Vous pouvez ajouter ici la logique pour gérer l'action au clic
    };



    const renderContent = () => {
        switch (selectedId) {
            case 'panel':
                return <DashboardPanel />;
            case 'users':
                return <ManageUsers />;
            case 'ads':
                return <AdsSection />;
            case 'profil':
                return <UserProfile />;
            case 'settings':
                return <Settings onItemClick={handleItemClick} />;
            case 'notifications':
                return <Notifications notifications={notifications} />;
            default:
                return <div>Sélectionnez une option pour afficher le contenu</div>;
        }
    };



    return (
        <div className='user-dashboard'>
            <Header notifications={notifications.length} />
            <div className="content">
                <div className="_left">
                    <SideBarLeft>
                        <SideBar
                            items={adminSidebarData}
                            selectedId={selectedId}
                            onItemClick={handleItemClick}
                        />
                    </SideBarLeft>
                </div>
                <div className="_right">
                    <SideBarRight>
                        {renderContent()}
                    </SideBarRight>
                </div>
            </div>
        </div>

    );
};
