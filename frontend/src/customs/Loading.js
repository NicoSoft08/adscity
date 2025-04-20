import React from 'react';
import { 
    letterWhiteBgBlue, 
    textBlueWithoutBg 
} from '../config/logos';
import '../styles/Loading.scss';

export default function Loading() {
    return (
        <div className="loading-modal">
            <div className="loading-container">
                <img src={letterWhiteBgBlue} alt="AdsCity" className="loading-logo" />
                <div className="loading-header">
                    <img src={textBlueWithoutBg} alt="AdsCity" className="loading-text" />
                </div>
                <span className="loading-span">Publiez, Vendez, Echangez</span>
                <div className="loading-spinner"></div>
            </div>
        </div>
    );
};
