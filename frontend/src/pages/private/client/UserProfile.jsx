import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faAddressCard, faCamera, faCheck, faEnvelopeOpen,
    faFolderOpen, faHome, faLocationDot,
    faPhone, faTimes, faUserAltSlash,
    faUserCheck
} from '@fortawesome/free-solid-svg-icons';
import Modal from '../../../customs/Modal';
import { AuthContext } from '../../../contexts/AuthContext';
import { IconCover, IconAvatar } from '../../../config/images';
import ProfileStats from '../../../components/profile-stats/ProfileStats';
import { uploadProfilePhoto } from '../../../services/storageServices';
import Toast from '../../../customs/Toast';
import '../../../styles/UserProfile.scss';

export default function UserProfile() {
    const { currentUser, userData } = useContext(AuthContext);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
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

        if (selectedFile) {
            await uploadProfilePhoto(userID, selectedFile);
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


    const handleBannerChange = async (e) => { 
        const file = e.target.files[0];
        console.log(file);
    }


    return (
        <div className='user-profile'>
            <div className="banner-content">
                <img
                    src={userData?.coverURL || IconCover}
                    alt="User Banner"
                    className="banner-image"
                />
                <label className="update-icon banner-update">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerChange}
                        style={{ display: 'none' }}
                    />
                    <FontAwesomeIcon icon={faCamera} />
                </label>
            </div>
            <div className="profile-content">
                <img
                    src={userData?.profilURL || IconAvatar}
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
                    {userData?.adsCount}
                    annonce(s)
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
                    {userData?.location}
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

            <ProfileStats user={userData} />
            {isModalOpen && (
                <Modal
                    onShow={isModalOpen}
                >
                    <div className="modal">
                        <div className="modal-content">
                            <h3>Aperçu de la nouvelle photo</h3>
                            <img src={profilePreview} alt="Preview" className="modal-preview" />
                            <div className="modal-actions">
                                <button className="btn btn-confirm" onClick={handleConfirm}>
                                    <FontAwesomeIcon icon={faCheck} /> Valider
                                </button>
                                <button className="btn btn-cancel" onClick={handleCancel}>
                                    <FontAwesomeIcon icon={faTimes} /> Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
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
