import React from 'react';

import '../styles/Loading.scss';
import { logos } from '../config';

export default function Loading() {
    return (
        <div className="loading-modal">
            <div className="loading-container">
                <img src={logos.letterWhiteBgBlue} alt="AdsCity" className="loading-logo" />
                <div className="loading-header">
                    <img src={logos.textBlueWithoutBg} alt="AdsCity" className="loading-text" />
                </div>
                <span className="loading-span">Publiez, Vendez, Echangez</span>
                <div className="loading-spinner"></div>
            </div>
        </div>
    );
};
