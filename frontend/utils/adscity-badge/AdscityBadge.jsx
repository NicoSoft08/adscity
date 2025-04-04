import React from 'react';
import { IconVerifiedModified } from '../../config/images';
import './AdscityBadge.scss';

export default function AdscityBadge({ logoURL, name, isVerified }) {
    return (
        <div className="adscity-badge">
            <div className="adscity-badge-logo">
                <img src={logoURL} alt="AdsCity Logo" className="logo" />
            </div>
            <div className="adscity-badge-details">
                <span className="name">{name}</span>
                {isVerified && (
                    <span className="verified-badge">
                        <img
                            src={IconVerifiedModified} // Remplacez par le chemin de l'image du badge
                            alt="Verified"
                        />
                    </span>
                )}
            </div>
        </div>
    );
};
