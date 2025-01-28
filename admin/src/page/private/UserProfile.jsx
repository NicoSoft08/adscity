import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faAddressCard, faCamera, faCheck, faEnvelopeOpen,
    faHome, faLocationDot,
    faPhone, faTimes, faUserAltSlash,
    faUserCheck
} from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../contexts/AuthContext';
import { IconCover, IconAvatar } from '../../config/images';
import { uploadProfilePhoto } from '../../routes/storageRoutes';
import Toast from '../../customs/Toast';
import Spinner from '../../customs/Spinner';
import '../../styles/UserProfile.scss';


export default function UserProfile() {
    const { currentUser, userRole, userData } = useContext(AuthContext);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [profilePreview, setProfilePreview] = useState(null);

    const validateFile = (file) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const maxSize = 2 * 1024 * 1024; // 2MB

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
                message: 'La taille du fichier ne doit pas dépasser 2MB.',
            });
            return false;
        }

        return true;
    };


    const handleProfileChange = (e) => {
        const file = e.target.files[0];

        if (!validateFile(file)) {
            return;
        }

        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = () => {
            setProfilePreview(reader.result);
            setIsModalOpen(true);
        };
        reader.readAsDataURL(file);
    };

    const handleConfirm = async () => {
        const userID = currentUser?.uid;
        setIsLoading(true);
        if (selectedFile) {
            const result = await uploadProfilePhoto(selectedFile, userID);
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
        currentUser && userRole === 'admin'
            ? userData?.coverURL || IconCover // Si profilURL est null, utiliser l'image par défaut
            : IconAvatar;

    // Déterminer l'image de profil à afficher
    const profileImage =
        currentUser && userRole === 'admin'
            ? userData?.profilURL || IconAvatar // Si profilURL est null, utiliser l'image par défaut
            : IconAvatar;

    // const handleBannerChange = async (e) => {
    //     const file = e.target.files[0];
    //     console.log(file);
    // }


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

            <div style={{ height: '50px' }} />

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
                    {userData?.country}, {userData?.city}
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
