import React, { useContext } from 'react';
import './CreateAdButton.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

export default function CreateAdButton() {
    const { currentUser, userData } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleNavigate = () => {
        if (!currentUser) {
            navigate('/auth/signin');
        } else if (currentUser && (userData.role !== 'user')) {
            navigate('/access-denied');
        } else {
            navigate('/auth/create-announcement');
        }
    }

    return (
        <button
            className='create-ad'
            onClick={handleNavigate}
        >
            <FontAwesomeIcon icon={faPlusSquare} className='icon' />
            <span>Créer une annonce</span>
        </button>
    );
};
