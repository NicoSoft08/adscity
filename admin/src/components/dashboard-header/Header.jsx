import React, { useContext, useEffect, useState } from 'react';
import UserIsOnline from '../../customs/UserIsOnline';
import AppLogo from '../../utils/app-logo/AppLogo';
import { AuthContext } from '../../contexts/AuthContext';
import { IconAvatar } from '../../config/images';
import { fetchDataByUserID } from '../../services/userServices';
import { letterBlueBgWhite } from '../../config/logos';
import './Header.scss';

export default function Header() {
    const { currentUser } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);


    useEffect(() => {
        const userID = currentUser?.uid;
        const fetchUserData = async () => {
            const result = await fetchDataByUserID(userID);
            setData(result);
        }

        fetchUserData();
    }, [currentUser]);


    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const profilURL = data
        && data?.profilURL === null ? IconAvatar // Si profilURL est null, utiliser l'image par défaut
        : data?.profilURL;


    return (
        <header>
            <div className="container">
                <div className="logo">
                    <AppLogo source={letterBlueBgWhite} />
                </div>
                <div className="actions">
                    <div className='display-name'>{data?.displayName}</div>
                    <div className="user-icon" onClick={toggleDropdown}>
                        <UserIsOnline
                            width={'40px'}
                            height={'40px'}
                            top={'30px'}
                            right={'-4px'}
                            profileURL={profilURL}
                            isOnline={data?.isOnline || null}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};
