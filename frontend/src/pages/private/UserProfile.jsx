import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faAddressCard, faCamera, faChartSimple, faCheck, faEnvelopeOpen,
    faFolderOpen, faHome, faIdCard, faLocationDot,
    faMoneyCheck,
    faPhone, faSliders, faTimes, faUserAltSlash,
    faUserCheck
} from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../contexts/AuthContext';
import { IconCover, IconAvatar } from '../../config/images';
import { uploadProfilePhoto } from '../../routes/storageRoutes';
import Toast from '../../customs/Toast';
import Spinner from '../../customs/Spinner';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebaseConfig';
import { getUserLoginActivity } from '../../routes/userRoutes';
import Settings from './Settings';
import { differenceInDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import PaymentIntents from '../../components/payment/ManagePayments';
import '../../styles/UserProfile.scss';

export default function UserProfile() {
    const { currentUser, userData, userRole } = useContext(AuthContext);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [profilePreview, setProfilePreview] = useState(null);
    const [activeSection, setActiveSection] = useState('info'); // Section active par défaut, 'activity
    const [loginActivity, setLoginActivity] = useState([]);


    useEffect(() => {
        if (!currentUser?.uid) return;

        const fetchUserActivity = async () => {
            const result = await getUserLoginActivity(currentUser.uid);
            if (result.success) {
                setLoginActivity(result.activity);
            }
        };

        fetchUserActivity();
    }, [currentUser?.uid]);

    useEffect(() => {
        return () => {
            if (profilePreview) {
                URL.revokeObjectURL(profilePreview);
            }
        };
    }, [profilePreview]);

    const tabs = [
        { id: 'info', icon: faIdCard, label: 'Données' },
        { id: 'activity', icon: faChartSimple, label: 'Activité' },
        { id: 'payments', icon: faMoneyCheck, label: 'Paiements' },
        { id: 'settings', icon: faSliders, label: 'Réglages' },
    ];

    const validateFile = (file) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file?.type)) {
            setToast({
                show: true,
                type: 'error',
                message: 'Le fichier doit être au format JPEG, PNG ou JPG.',
            });
            return false;
        }

        if (file?.size > maxSize) {
            setToast({
                show: true,
                type: 'error',
                message: 'La taille du fichier ne doit pas dépasser 5MB.',
            });
            return false;
        }

        return true;
    };


    const handleProfileChange = (e) => {
        const file = e.target.files[0];

        if (!validateFile(file)) return;

        setSelectedFile(file);
        setProfilePreview(URL.createObjectURL(file));
        setIsModalOpen(true);
    };

    const handleConfirm = async () => {
        const userID = currentUser?.uid;
        setIsLoading(true);
        if (selectedFile) {
            const result = await uploadProfilePhoto(selectedFile, userID);
            logEvent(analytics, 'profile_photo_changed');
            if (result.success) {
                setToast({
                    show: true,
                    type: 'success',
                    message: result.message,
                });
                setIsLoading(false);
            } else {
                setToast({
                    show: true,
                    type: 'error',
                    message: result.message,
                });
                setIsLoading(false);
            }
        }

        setIsModalOpen(false);
        setProfilePreview(null);
        setSelectedFile(null);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setProfilePreview(null);
        setSelectedFile(null);
    };

    // Déterminer l'image de couverture à afficher
    const coverImage =
        currentUser && userRole === 'user'
            ? userData?.coverURL || IconCover // Si profilURL est null, utiliser l'image par défaut
            : IconAvatar;

    // Déterminer l'image de profil à afficher
    const profileImage =
        currentUser && userRole === 'user'
            ? userData?.profilURL || IconAvatar // Si profilURL est null, utiliser l'image par défaut
            : IconAvatar;


    // const handleBannerChange = async (e) => {
    //     const file = e.target.files[0];
    //     console.log(file);
    // }

    const renderSection = () => {
        switch (activeSection) {
            case 'info':
                return <PersonnalInfo />;
            case 'activity':
                return <Activity />;
            case 'settings':
                return <Settings />;
            case 'payments':
                return <PaymentIntents />;
            default:
                return null;
        }
    }


    const PersonnalInfo = () => {
        return (
            <div className='user-data'>
                <h2>{userData?.displayName}</h2>
                <div className="seperator" />
                <p>
                    {userData?.profileNumber}
                    <FontAwesomeIcon
                        icon={faAddressCard}
                        className='pen'
                    />
                </p>
                <div className="seperator" />
                <p>
                    {userData?.adsCount > 1
                        ? `${userData?.adsCount} annonces`
                        : `${userData?.adsCount} annonce`
                    }
                    <FontAwesomeIcon
                        icon={faFolderOpen}
                        className='pen'
                    />
                </p>
                <div className="seperator" />
                <p>
                    {userData?.isActive
                        ? "Actif"
                        : "Désactivé"
                    }
                    <FontAwesomeIcon
                        icon={userData?.isActive
                            ? faUserCheck
                            : faUserAltSlash
                        }
                        className='pen'
                    />
                </p>
                <div className="seperator" />
                <p>
                    {userData?.city}, {userData?.country}
                    <FontAwesomeIcon
                        icon={faLocationDot}
                        className='pen'
                    />
                </p>
                <div className="seperator" />
                <p>
                    {userData?.email}
                    <FontAwesomeIcon
                        icon={faEnvelopeOpen}
                        className='pen'
                    />
                </p>
                <div className="seperator" />
                <p>{userData?.phoneNumber}
                    <FontAwesomeIcon
                        icon={faPhone}
                        className='pen'
                    />
                </p>
                <div className="seperator" />
                <p>
                    {userData?.address}
                    <FontAwesomeIcon
                        icon={faHome}
                        className='pen'
                    />
                </p>
            </div>
        );
    };

    const Activity = () => {

        const formatDateTimestamp = (adTimestamp) => {
            if (!adTimestamp) return "Date inconnue";
        
            const adDate = new Date(adTimestamp?._seconds * 1000);
            const now = new Date();
            const diffDays = differenceInDays(now, adDate);
        
            if (diffDays === 0) return `Auj. à ${format(adDate, 'HH:mm', { locale: fr })}`;
            if (diffDays === 1) return `Hier à ${format(adDate, 'HH:mm', { locale: fr })}`;
            if (diffDays === 2) return `Avant-hier à ${format(adDate, 'HH:mm', { locale: fr })}`;
        
            return `${format(adDate, 'dd/MM/yyyy à HH:mm', { locale: fr })}`;
        };

        return (
            <div className='activity'>
                <h2>Activité de Connexion</h2>
                <p>
                    {loginActivity.length === 0
                        ? "Aucune activité récente."
                        : `Voici votre journal ${loginActivity.length > 1
                            ? `${loginActivity.length} dernières activités`
                            : "dernière activité"
                        } de connexion.`}
                </p>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Navigateur</th>
                                <th>Système</th>
                                <th>Adresse IP</th>
                                <th>Période</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loginActivity.map((activity, index) => (
                                <tr key={index}>
                                    <td>{activity.deviceInfo.browser}</td>
                                    <td>{activity.deviceInfo.os}</td>
                                    <td>{activity.deviceInfo.ip}</td>
                                    <td>{formatDateTimestamp(activity.time)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };


    return (
        <div className='user-profile'>
            <div className="banner-content">
                <img
                    src={coverImage}
                    alt="User Banner"
                    className="banner-image"
                />
                {/* <label className="update-icon banner-update">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerChange}
                        style={{ display: 'none' }}
                    />
                    <FontAwesomeIcon icon={faCamera} />
                </label> */}
            </div>
            <div className="profile-content">
                <img
                    src={profileImage}
                    alt="User Profile"
                    className="profile-image"
                />
                <label className="update-icon profile-update">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfileChange}
                        style={{ display: 'none' }}
                    />
                    <FontAwesomeIcon icon={faCamera} />
                </label>
            </div>

            {/* SWITCHER */}
            <div className="switcher">
                <div className="switcher-tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`switcher-tab ${activeSection === tab.id ? 'active' : ''
                                }`}
                            onClick={() => setActiveSection(tab.id)}
                        >
                            <FontAwesomeIcon icon={tab.icon} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                <div className="switcher-content">
                    {renderSection()}
                </div>
            </div>

            <div style={{ height: '50px' }} />



            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Aperçu de la nouvelle photo</h3>
                        <img src={profilePreview} alt="Preview" className="modal-preview" />
                        <div className="modal-actions">
                            <button className="btn btn-confirm" onClick={handleConfirm}>
                                {isLoading ? <Spinner /> : <><FontAwesomeIcon icon={faCheck} />Valider</>}
                            </button>
                            <button className="btn btn-cancel" onClick={handleCancel}>
                                <FontAwesomeIcon icon={faTimes} /> Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast({ ...toast, show: false })}
            />
        </div>
    );
};
