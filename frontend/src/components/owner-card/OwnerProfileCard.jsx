import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Toast from '../../customs/Toast';
import { updateContactClick } from '../../routes/apiRoutes';
import { IconAvatar } from '../../config/images';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebaseConfig';
import './OwnerProfileCard.scss';


const OwnerProfileCard = ({ owner, userID, city }) => {
    const navigate = useNavigate();
    const [showPhone, setShowPhone] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    const handlePhoneClick = () => {
        if (!userID) {
            setToast({
                show: true,
                type: 'error',
                message: "Oups ! Il semble que vous n'êtes pas connecté"
            });
            return;
        };

        setShowPhone(true);
        logEvent(analytics, 'contact_click');
    };


    const handleProfileClick = async (url) => {
        navigate(url);

        if (!userID) return null;

        await updateContactClick(owner.userID, city);
    }

    const formatDate = (timestamp) => {
        if (timestamp && timestamp._seconds) {
            const date = new Date(timestamp._seconds * 1000); // Convert to milliseconds
            let formattedDate = date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });

            // Capitalize the first letter
            return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
        }
        return '';
    };

    const user_id = owner.UserID?.toLowerCase();

    return (
        <div className='owner-card'>
            <div className='owner-image'>
                <img
                    className='profil-image'
                    src={owner?.profilURL === null ? IconAvatar : owner?.profilURL}
                    alt={owner.displayName}
                />
                {owner?.isOnline ? <div className="online-badge" /> : null}
            </div>
            <span className='profile-type'> {owner?.profileType} </span>
            <p className='member-since'>Membre depuis: {formatDate(owner.createdAt)}</p>
            <h2 className='name'>{owner.firstName} {owner.lastName}</h2>
            <p className='review'>{owner.ratings?.total || 0} ⭐ {owner.reviews?.totalReviews || 0} avis</p>
            <div className='contact-info'>
                <button onClick={handlePhoneClick} className='contact-button'>
                    {showPhone ? owner.phoneNumber : "Voir le Numéro"}
                    <FontAwesomeIcon icon={faPhone} className='icon' />
                </button>
            </div>
            <div className='action-buttons'>
                <button className='message' onClick={() => handleProfileClick(`/users/user/${user_id}/profile/show`)}>Voir Profil</button>
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


export default OwnerProfileCard;
