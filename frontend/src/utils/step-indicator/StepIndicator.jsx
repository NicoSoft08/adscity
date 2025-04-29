import React, { useContext } from 'react';
import { LanguageContext } from '../../contexts/LanguageContext';
import './StepIndicator.scss';

export default function StepIndicator({ currentStep, totalSteps, title }) {
    const { language } = useContext(LanguageContext);
    return (
        <div className="step-indicator">
            <div className="step-count">
                {language === 'FR' ? 'Étape' : 'Step'} {currentStep} {language === 'FR' ? 'sur' : 'of'} {totalSteps}
            </div>
            <h2 className="step-title">{title}</h2>
        </div>
    );
};
