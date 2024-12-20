import React from 'react';
import { logos } from '../../config';
import '../../styles/InstallAppModal.scss';

function InstallAppModal({ onClose, requestNotificationPermission, userID }) {
    
    const handleAllowClick = async () => {
        requestNotificationPermission();
        onClose();
    };

    return (
        <div className='popup-overlay'>
            <div className='popup-modal'>
                <img src={logos.letterWhiteBgBlue} alt="popup-pic" className='popup-pic' />
                <div>
                    <h2>Autoriser les notifications</h2>
                    <p>AdsCity souhaite vous envoyer des notifications pour vous informer des annonces et mises à jour.</p>
                    <div className='buttons'>
                        <button className='dismiss' onClick={onClose}>
                            Plus tard
                        </button>
                        <button className='install' onClick={handleAllowClick}>
                            Accepter
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstallAppModal;