import React from 'react';
import '../styles/ButtonAdd.scss';

// icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

export default function ButtonAdd() {
    const navigate = useNavigate();
    return (
        <button
            title='Créer une annonce'
            onClick={() => navigate('/auth/create-announcement')}
            className='floating-btn'
        >
            <FontAwesomeIcon icon={faPlusSquare} />
        </button>
    );
};
