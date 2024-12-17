import React, { useContext, useEffect, useState } from 'react';
import UserIsOnline from '../../customs/UserIsOnline';
import AppLogo from '../../utils/app-logo/AppLogo';
import { AuthContext } from '../../contexts/AuthContext';
import { defaultProfilURL, logos } from '../../config';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../services/authServices';
import Modal from '../../customs/Modal';
import './Header.scss';
import { fetchDataByUserID } from '../../services/userServices';

export default function Header() {
    const { currentUser } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const backendUrl = process.env.REACT_APP_BACKEND_URL;


    useEffect(() => {
        const userID = currentUser?.uid;
        const fetchUserData = async () => {
            const result = await fetchDataByUserID(userID);
            setData(result);
        }

        fetchUserData();
    }, [currentUser, backendUrl]);

    const handleOpen = () => setOpen(true);

    const handleLogout = async () => {
        try {
            await logoutUser();
            navigate('/');
            setOpen(false);
            console.log('User signed out successfully');
        } catch (error) {
            console.error('Error signing out:', error);
        }

    };


    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };


    return (
        <header>
            <div className="container">
                <div className="logo">
                    <AppLogo source={logos.letterBlueBgWhite} />
                </div>
                <div className="actions">
                    <div className='display-name'>{data?.displayName}</div>
                    <div className="user-icon" onClick={toggleDropdown}>
                        <UserIsOnline
                            width={'40px'}
                            height={'40px'}
                            top={'30px'}
                            right={'-4px'}
                            profileURL={data?.profilURL || defaultProfilURL}
                            isOnline={data?.isOnline || null}
                        />
                        {dropdownOpen && (
                            <div className="dropdown-menu">
                                <button className="logout" onClick={handleOpen}>Déconnexion</button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
            {open &&
                <Modal
                    title={"Déconnexion"}
                    onShow={() => setOpen(true)}
                    onHide={() => setOpen(false)}
                    onNext={handleLogout}
                    isNext={true}
                    nextText={"Oui, déconnecter"}
                    hideText={"Annuler"}
                >
                    <p>Confirmez-vous vouloir vous déconnecter ?</p>
                </Modal>
            }
        </header>
    );
};
