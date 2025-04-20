import React, { useContext, useState } from 'react';
import { faFolderOpen, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { facebook, IconAvatar, IconCover, instagram, whatsapp } from '../../config/images';
import { AuthContext } from '../../contexts/AuthContext';
import Toast from '../../customs/Toast';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebaseConfig';
import { Phone } from 'lucide-react';
import './PublicProfil.scss';

export default function PublicProfil({ profile }) {
    const { currentUser, userData } = useContext(AuthContext);
    const [showPhone, setShowPhone] = useState(false);
    const [message, setMessage] = useState('');
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    const handleSubmit = () => {
        setToast({
            show: true,
            type: 'info',
            message: "Cette fonctionnalité n'est pas encore disponible."
        })
    }
    const handleShowPhone = () => {
        if (!currentUser) {
            setToast({
                show: true,
                type: 'error',
                message: "Oups !!! Il semble que vous n'êtes pas connecté."
            });
            return false;
        }

        logEvent(analytics, 'phone_viewed');
        setShowPhone(true);
    };

    // const handleOpenChat = () => {
    //     if (!currentUser) {
    //         setToast({
    //             show: true,
    //             type: 'error',
    //             message: "Oups !!! Il semble que vous n'êtes pas connecté."
    //         });
    //         return false;
    //     }

    //     window.location.href = `https://wa.me/${profile.phoneNumber}`;
    // };

    const profilURL = profile
        && profile?.profilURL === null ? IconAvatar // Si profilURL est null, utiliser l'image par défaut
        : profile?.profilURL;


    return (
        <div
            className="public-profile-container"
            style={{
                backgroundImage: `url(${profile.coverURL || IconCover})`
            }}
        >
            {/* Background Image */}
            <div className="profile-header">
                <div className="profile-info">
                    <img className='avatar' src={profilURL} alt="Profile" />
                    <div className="info">
                        <h2 className='name'>{profile.firstName} {profile.lastName}</h2>
                        {/* <FontAwesomeIcon icon={faCheckCircle} size='1x' color='skyblue' /> */}
                        <div className="detail">
                            <small className='location'><FontAwesomeIcon icon={faMapMarkerAlt} /> {profile.city}, {profile.country}</small>
                            <small className='adsCount'><FontAwesomeIcon icon={faFolderOpen} /> {profile.adsCount > 1 ? `${profile.adsCount + " annonces"}` : `${profile.adsCount + " annonce"}`} </small>
                        </div>

                        {/* Social Media Links */}
                        {/* PERSONNALISATION POUR LES COMPTES  ENTREPRISES ET PROFESSIONNELS */}
                        {currentUser && (profile.profileType === 'Professionnel' || userData.profileType === 'Entreprise') && (
                            <div className="social-media-links">
                                <a href={"/"} target="_blank" rel="noreferrer">
                                    <img src={facebook} alt="faceook" />
                                </a>
                                <a href={"/"} target="_blank" rel="noreferrer">
                                    <img src={instagram} alt="instagram" />
                                </a>
                                <a href={"/"} target="_blank" rel="noreferrer">
                                    <img src={whatsapp} alt="whatsapp" />
                                </a>
                            </div>
                        )}
                    </div>
                </div>


            </div>

            <div className='seperator' />

            <div className="profile-footer">
                {/* Contact Options */}
                <div className="contact-options">
                    <div className="phone-info">
                        <div className="show-phone">
                            <Phone size={18} />
                        </div>
                        <div className='show-phone-btn' onClick={handleShowPhone}>
                            {showPhone ? <small>{profile.phoneNumber}</small> : <small>Voir le numéro</small>}
                        </div>
                    </div>

                    {/* <div className="phone-info">
                        <div className="show-phone">
                            <FontAwesomeIcon icon={faWhatsapp} />
                        </div>
                        <div className='show-phone-btn' onClick={handleOpenChat}>
                            <small>Ecrire sur WhatsApp</small>
                        </div>
                    </div> */}
                </div>

                {/* Message Form */}
                <div className="message-form">
                    <input
                        className='message-input'
                        value={message}
                        type="text"
                        placeholder="Message"
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button
                        className='send-btn'
                        type="submit"
                        onClick={handleSubmit}
                    >
                        Envoyer
                    </button>
                </div>
            </div>

            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast({ ...toast, show: false })}
            />
        </div>
    );
};
