import React from 'react';
import { IconNotAllowed } from '../../config/images';

import './LimitExceed.scss';

export default function LimitExceed() {
    return (
        <div className='limit-exceed-warning'>
            <img src={IconNotAllowed} alt="not-authorized" width={70} height={70} />
                <h1>Limite atteinte</h1>
                <p>Vous avez dépassé la limite autorisée pour ce mois. Veuillez contacter le Support Client ou mettre à niveau votre abonnement.</p>
        </div>
    );
};
