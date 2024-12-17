import React, { useContext, useState } from 'react';
// import { faFacebookF, faLinkedin, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faFolderOpen, faMapMarkerAlt, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { defaultCoverURL } from '../../config';
import { AuthContext } from '../../contexts/AuthContext';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import Toast from '../../customs/Toast';
import './PublicProfil.scss';

export default function PublicProfil({ profile }) {
    const { currentUser } = useContext(AuthContext);
    const [showPhone, setShowPhone] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    const handleHide = () => {
        setToast({
            ...toast,
            show: false,
        });
    };

    const handleShowPhone = () => {
        if (!currentUser) {
            setToast({
                show: true,
                type: 'error',
                message: "Oups !!! Il semble que vous n'êtes pas connecté."
            });
            return false;
        }

        setShowPhone(true);
    };

    const handleOpenChat = () => {
        if (currentUser) {
            setToast({
                show: true,
                type: 'error',
                message: "Oups !!! Il semble que vous n'êtes pas connecté."
            });
            return false;
        }

        window.location.href = `https://wa.me/${profile.phoneNumber}`;
    };

    return (
        <div className="public-profile-container" style={{ backgroundImage: `url(${profile.coverURL || defaultCoverURL})` }}>
            {/* Background Image */}
            <div className="profile-header">
                <div className="profile-info">
                    <img className='avatar' src={profile.profilURL} alt="Profile" />
                    <div className="info">
                        <h2 className='name'>{profile.displayName}</h2>
                        <div className="detail">
                            <small className='location'><FontAwesomeIcon icon={faMapMarkerAlt} /> {profile.location}</small>
                            <small className='adsCount'><FontAwesomeIcon icon={faFolderOpen} /> {profile.adsCount} ads</small>
                        </div>
                    </div>
                </div>

                {/* Social Media Links */}
                {/* <div className="social-media-links">
                    <a href={"/"} target="_blank" rel="noreferrer">
                        <FontAwesomeIcon icon={faFacebookF} />
                    </a>
                    <a href={"/"} target="_blank" rel="noreferrer">
                        <FontAwesomeIcon icon={faTwitter} />
                    </a>
                    <a href={"/"} target="_blank" rel="noreferrer">
                        <FontAwesomeIcon icon={faLinkedin} />
                    </a>
                    <a href={"/"} target="_blank" rel="noreferrer">
                        <FontAwesomeIcon icon={faYoutube} />
                    </a>
                </div> */}
            </div>

            <div className='seperator' />

            <div className="profile-footer">
                {/* Contact Options */}
                <div className="contact-options">
                    <div className="phone-info">
                        <div className="show-phone">
                            <FontAwesomeIcon icon={faPhone} />
                        </div>
                        <div className='show-phone-btn' onClick={handleShowPhone}>
                            {showPhone ? <small>{profile.phoneNumber}</small> : <small>Voir le numéro</small>}
                            {/* <span>{profile.phoneNumber}</span> */}
                        </div>
                    </div>

                    <div className="phone-info">
                        <div className="show-phone">
                            <FontAwesomeIcon icon={faWhatsapp} />
                        </div>
                        <div className='show-phone-btn' onClick={handleOpenChat}>
                            <small>Ecrire sur WhatsApp</small>
                        </div>
                    </div>
                </div>

                {/* Message Form */}
                <div className="message-form">
                    <input className='message-input' type="text" placeholder="Message" />
                    <button className='send-btn' type="submit">Envoyer</button>
                </div>
            </div>

            <Toast 
            show={toast.show}
            type={toast.type}
            message={toast.message}
            onClose={handleHide}
            />
        </div>
    );
};
