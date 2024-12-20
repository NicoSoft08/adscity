import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faAddressCard, faEnvelopeOpen,
    faFolderOpen, faHome, faLocationDot,
    faPen, faPhone, faPlus, faTrash,
    faUserAltSlash,
    faUserCheck
} from '@fortawesome/free-solid-svg-icons';
import Modal from '../../customs/Modal';
import { AuthContext } from '../../contexts/AuthContext';
import { IconCover, IconAvatar } from '../../config/images';
import '../../styles/UserProfile.scss';


export default function UserProfile() {
    const { currentUser, userData } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userPersoData, setUserPersoData] = useState({
        displayName: userData?.displayName,
        email: userData?.email,
        phoneNumber: userData?.phoneNumber,
        profileNumber: userData?.profileNumber,
        location: userData?.location || "Ville, Pays Non Renseignés",
        address: userData?.address || "Adresse Non Renseignée",
        profilURL: userData?.profilURL || IconAvatar,
        coverURL: userData?.coverURL || IconCover,
        city: userData?.city || "Ville Non Renseignée",
        country: userData?.country || "Pays Non Renseigné",
        lastName: userData?.lastName,
        firstName: userData?.firstName,
    });



    const handleClose = () => setIsModalOpen(false);

    const handleChangeProfil = async (e) => {
        const file = e.target.files[0];
        const userID = currentUser?.uid;

        const formData = new FormData();
        formData.append('profilURL', file);

        handleClose();

        try {
            const response = await fetch(`http://localhost:3001/api/upload/${userID}/profile`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const res = await response.json();
                setUserPersoData((prevData) => ({
                    ...prevData,
                    profilURL: res.profilURL,
                }));
            } else {
                console.error('Erreur lors de la mise à jour de la photo de profil');
            }
        } catch (error) {
            console.error('Erreur lors de l\'upload du fichier :', error);
        }
    };




    const handleDeleteProfil = async () => {
        setUserPersoData((prevData) => ({
            ...prevData,
            profilURL: null
        }));
    };



    return (
        <div className='user-profile' style={{}}>
            <div className='background' style={{ backgroundImage: `url(${userPersoData.coverURL})`, backgroundSize: 'cover', backgroundPosition: 'center', }}>
                <img className='avatar' src={userPersoData.profilURL} alt='avatar' />
                <div className='wrap-camera' onClick={() => setIsModalOpen(true)}>
                    <FontAwesomeIcon icon={faPen} />
                </div>
            </div>

            <div style={{ height: '50px' }} />

            <div className='user-data'>
                <h2>{userPersoData.displayName}</h2>                
                <div className="seperator" />
                <p>{userPersoData.profileNumber}<FontAwesomeIcon icon={faAddressCard} className='pen' /></p>
                <div className="seperator" />
                <p>{userData?.adsCount} annonce(s)<FontAwesomeIcon icon={faFolderOpen} className='pen' /></p>
                <div className="seperator" />
                <p>{userData?.isActive ? "Actif" : "Désactivé"}<FontAwesomeIcon icon={userData?.isActive ? faUserCheck : faUserAltSlash} className='pen' /></p>
                <div className="seperator" />
                <p>{userPersoData.location}<FontAwesomeIcon icon={faLocationDot} className='pen'/></p>
                <div className="seperator" />
                <p>{userPersoData.email}<FontAwesomeIcon icon={faEnvelopeOpen} className='pen' /></p>
                <div className="seperator" />
                <p>{userPersoData.phoneNumber}
                    <FontAwesomeIcon icon={faPhone} className='pen' /></p>
                <div className="seperator" />
                <p>{userPersoData.address}<FontAwesomeIcon icon={faHome} className='pen' /></p>
            </div>

            {isModalOpen && (
                <Modal
                    onShow={isModalOpen}
                    onHide={handleClose}
                    title={"Choisie une action"}
                >
                    <div className='banner'>
                        <div className="file-info">
                            {userPersoData.profilURL && <p>Fichier sélectionné : {userPersoData.profilURL.name}</p>}
                        </div>
                        <div className="icons-actions">
                            <label htmlFor="file-upload">
                                <FontAwesomeIcon icon={faPlus} className="icon" />
                            </label>
                            <input
                                type="file"
                                id="file-upload"
                                style={{ display: 'none' }} // Masquer l'input file natif
                                onChange={handleChangeProfil}
                            />
                            <FontAwesomeIcon
                                icon={faTrash}
                                className="icon delete"
                                onClick={userPersoData.profilURL ? handleDeleteProfil : null}
                                style={{ cursor: userPersoData.profilURL ? 'pointer' : 'not-allowed' }}
                            />
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};
