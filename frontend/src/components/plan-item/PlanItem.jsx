import React from 'react';
import './PlanItem.scss';

export default function PlanItem({ plan, id, onSelect, selectedPlan, setSelectedPlan, onClick }) {
    const isSelected = selectedPlan === id;

    const handleSeeMore = (e, id) => {
        onClick(id);
        setSelectedPlan(id);
    };

    const isParticulierPlan = plan?.name.toLowerCase() === "particulier";

    return (
        <div
            title={`Forfait ${plan?.name.toUpperCase()}`}
            className={`plan-card ${isSelected ? "selected" : ""}`}
            onClick={() => isParticulierPlan && onSelect(id)}
        >
            <span className='plan-name'>
                {plan?.name.charAt(0).toUpperCase() + plan?.name.slice(1)}
            </span>
            <div className="plan-header">
                <span className="price">
                    {plan.price === 0 ? "Gratuit" : plan.price + " RUB"}
                </span>
                {" "}
                <span className="duration">
                    {" "} / {plan.validity_days} jours
                </span>
            </div>
            <div className="plan-details">
                <p className='max-ads'>
                    {plan.max_ads === "Illimité"
                        ? "Illimité"
                        : `${plan.max_ads} ${plan.max_ads > 1 ? "annonces" : "annonce"
                        }`
                    }
                </p>
                <p className='max-photos'>
                    {plan.max_photos} photos
                </p>
                <p className='max-photos'>
                    Visibilité {plan.visibility}
                </p>
                <p className='max-photos'>
                    Assistance {plan.support}
                </p>
            </div>
            {isParticulierPlan ? (
                <button className="see-more" onClick={(e) => handleSeeMore(e, id)}>
                    Voir Plus
                </button>
            ) : (
                <p className="not-supported">
                    Ce plan n'est pas encore pris en charge.
                </p>
            )}
        </div>
    );
};
