import React from 'react';
import './PlanItem.scss';

export default function PlanItem({ id, plan, onSelect, selectedPlan, onClick }) {
    const isSelected = selectedPlan === id;
    
    const isParticulierPlan = plan?.name.toLowerCase() === "entreprise";

    const handleSelect = () => {
        if (!isParticulierPlan) { 
            onSelect(id);
        }
    };


    return (
        <div
            className={`plan-item ${isSelected ? 'selected' : ''} ${isParticulierPlan ? 'disabled' : ''}`}
            onClick={handleSelect}
        >
            <h3>{plan.name}</h3>
            <p className="price">{plan.price === 0 ? "Gratuit" : `${plan.price} RUB`}</p>

            <ul className="plan-features">
                <li>Valable {plan.validity_days} jours</li>
                <li>{plan.max_ads} annonces</li>
                <li>{plan.max_photos} photos</li>
                <li>Visibilité {plan.visibility}</li>
                <li>Support {plan.support}</li>
            </ul>

            {isParticulierPlan && (
                <div className="coming-soon">
                    🚧 Bientôt disponible 🚧
                </div>
            )}

            {!isParticulierPlan && (
                <button className="select-btn" onClick={onClick}>
                    Voir plus
                </button>
            )}
        </div>
    );
};
