import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { IconAvatar } from '../../config/images';
import { useNavigate } from 'react-router-dom';
import './NavLinks.scss';

const dashboardurl = process.env.REACT_APP_DASHBOARD_URL;
const authURL = process.env.REACT_APP_AUTH_URL;

export default function NavLinks() {
    const { currentUser, userRole, userData } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleNavigate = () => {
        if (!currentUser) {
            window.location.href = `${authURL}/signin`;
        } else if (currentUser && userRole !== 'user') {
            navigate('/access-denied');
        } else {
            window.location.href = `${dashboardurl}/panel`;
        }
    };

    // Déterminer l'image de profil à afficher
    const profileImage = currentUser && userRole === 'user' ?
        userData?.profilURL || IconAvatar :
        IconAvatar;

    return (
        <nav className='nav-links' title='Mon Compte'>
            <img onClick={handleNavigate}
                src={profileImage} // Image par défaut si l'utilisateur n'a pas de photo de profil
                alt="Profile"
                className="profile-image"
            />
        </nav>
    );
};
