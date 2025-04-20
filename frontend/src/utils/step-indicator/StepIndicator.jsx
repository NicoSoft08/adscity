import React from 'react';
import './StepIndicator.scss';

export default function StepIndicator({ currentStep, totalSteps, title }) {
    return (
        <div className="step-indicator">
            <div className="step-count">
                Étape {currentStep} sur {totalSteps}
            </div>
            <h2 className="step-title">{title}</h2>
        </div>
    );
};
