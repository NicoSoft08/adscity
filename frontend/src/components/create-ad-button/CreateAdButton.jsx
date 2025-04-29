import React, { useContext } from 'react';
import './CreateAdButton.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../../contexts/LanguageContext';

export default function CreateAdButton({ currentUser, userRole }) {
    const navigate = useNavigate();
    const { language } = useContext(LanguageContext);

    const handleNavigate = () => {
        if (!currentUser) {
            navigate('/auth/signin');
        }
        if (currentUser && userRole !== 'user') {
            navigate('/access-denied');
        } else {
            navigate('/auth/create-post');
        }
    }

    return (
        <button
            className='create-ad'
            onClick={handleNavigate}
        >
            <FontAwesomeIcon icon={faPlusSquare} className='icon' />
            <span>
                {language === 'FR'
                    ? "Créer une annonce" : "Place an ad"
                }
            </span>
        </button>
    );
};
