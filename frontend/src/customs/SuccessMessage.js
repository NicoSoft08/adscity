import React from 'react';
import '../styles/SuccessMessage.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function SuccessMessage({ icon, message, title, onItemClick }) {
    const handleNavigateToPanel = () => {
        onItemClick('panel');
    }
    return (
        <div className='success-message'>
            <div className='icons'>
                {Array.from({ length: 3 }, (_, i) => (
                    <div key={i}>
                        <FontAwesomeIcon icon={icon} className='icon' />
                    </div>
                ))}
            </div>
            <h2>{title}</h2>
            <p>{message}</p>
            <button onClick={handleNavigateToPanel}>
                Aller au Panel
            </button>
        </div>
    );
};
