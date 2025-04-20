import React from 'react';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import './AdCreatedSuccess.scss';

export default function AdCreatedSuccess() {
    return (
        <div className='ad-created-success'>
            <div className='ad-created-success-icon'>
                {Array.from({ length: 3 }, (_, i) => (
                    <div key={i}>
                        <FontAwesomeIcon icon={faThumbsUp} className='icon' />
                    </div>
                ))}
            </div>
            <h2>Annonce postée avec succès.</h2>
            <p>Votre annonce est en attente de vérification par notre équipe de modération.</p>
            <p>Vous serez notifié(s) une fois la vérification terminée.</p>
            <Link to="/">
                Revenir à l'accueil
            </Link>
        </div>
    );
};
