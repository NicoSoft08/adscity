import React, { useContext, useState } from 'react';
import UserIsOnline from '../../customs/UserIsOnline';
import AppLogo from '../../utils/app-logo/AppLogo';
import { AuthContext } from '../../contexts/AuthContext';
import { IconAvatar } from '../../config/images';
import { letterBlueBgWhite } from '../../config/logos';
import './Header.scss';

export default function Header() {
    const { currentUser, userRole, userData } = useContext(AuthContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const profileImage =
            currentUser && userRole === 'admin'
                ? userData?.profilURL || IconAvatar // Si profilURL est null, utiliser l'image par défaut
                : IconAvatar;


    return (
        <header>
            <div className="container">
                <div className="logo">
                    <AppLogo source={letterBlueBgWhite} />
                </div>
                <div className="actions">
                    <div className='display-name'>{userData?.firstName} {userData?.lastName}</div>
                    <div className="user-icon" onClick={toggleDropdown}>
                        <UserIsOnline
                            width={'40px'}
                            height={'40px'}
                            top={'30px'}
                            right={'-4px'}
                            profileURL={profileImage}
                            isOnline={userData?.isOnline}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};
