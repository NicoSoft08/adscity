import React from 'react';
import {
    letterWhiteBgBlue,
    textBlueWithoutBg
} from '../config/logos';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../langs/translations';
import '../styles/Loading.scss';

export default function Loading() {
    const { language } = useLanguage();
    const t = translations[language] || translations.FR;

    return (
        <div className="loading-modal">
            <div className="loading-container">
                <img src={letterWhiteBgBlue} alt="AdsCity" className="loading-logo" />
                <div className="loading-header">
                    <img src={textBlueWithoutBg} alt="AdsCity" className="loading-text" />
                </div>
                <span className="loading-span">
                    {t.loading}
                </span>
                <div className="loading-spinner"></div>
            </div>
        </div>
    );
};
