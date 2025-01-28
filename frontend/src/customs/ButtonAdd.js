import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/ButtonAdd.scss';

export default function ButtonAdd() {
    const { currentUser, userData } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleNavigate = () => {
        if (!currentUser) {
            navigate('/auth/signin');
        } else if (currentUser && (userData.role !== 'user')) {
            navigate('/access-denied');
        } else {
            navigate('/auth/create-post');
        }
    }

    return (
        <button
            title='Créer une annonce'
            onClick={handleNavigate}
            className='floating-btn'
        >
            <FontAwesomeIcon icon={faPlusSquare} />
        </button>
    );
};
