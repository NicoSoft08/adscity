import React, { useContext } from 'react';
import './NavLinks.scss';

import { AuthContext } from '../../contexts/AuthContext';
import { IconAvatar } from '../../config/images';
import { useNavigate } from 'react-router-dom';

export default function NavLinks() {
    const { currentUser, userData } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleNavigate = () => {
        if (!currentUser) {
            navigate('/auth/signin');
            return;
        }
    
        if (userData && userData.role === 'user') {
            navigate('/user/dashboard');
        } else {
            navigate('/access-denied');
        }
    };

    return (
        <nav className='nav-links' title='Mon Compte'>
            <img onClick={handleNavigate}
                src={
                    userData?.role === 'user'
                    && (userData?.profilURL === null ? IconAvatar : userData?.profilURL)
                } // Image par défaut si l'utilisateur n'a pas de photo de profil
                alt="Profile"
                className="profile-image"
            />
        </nav>
    );
};
