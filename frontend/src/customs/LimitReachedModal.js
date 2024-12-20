import React from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/LimitReachedModal.scss';

export default function LimitReachedModal({ isOpen, onClose, onUpgrade }) {
    if (!isOpen) return null;
    return (

        <div className="limit-reached">
            <div className="body">
                <h2>Limite atteinte</h2>
                <p>Vous avez atteint la limite maximale d'annonces pour votre plan</p>
            </div>

            <div className="footer">
                <button className="upgrade-button" onClick={onUpgrade}>
                    Mettre à jour
                </button>

            </div>
            <div className='close'>
                <button className="close-button" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>
        </div>
    );
};
