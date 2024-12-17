import React from 'react';
import { mediaSocio } from '../../config';
import './SocialMedia.scss';

export default function SocialMedia() {
    return (
        <div className='social'>
            <img src={mediaSocio.facebook} alt="facebook" />
            <img src={mediaSocio.instagram} alt="instagram" />
            <img src={mediaSocio.whatsapp} alt="whatsapp" />
            <img src={mediaSocio.youtube} alt="youtube" />
        </div>
    )
}
