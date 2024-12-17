import React from 'react';
import { plans } from '../../data';

export default function ChoosePlan({ selectedPlan, setSelectedPlan, nextStep }) {

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
    };


    const PlanItem = ({ plan }) => {
        return (
            <div
                key={plan.id}
                className={`plan-card ${selectedPlan?.id === plan.id ? 'selected' : ''}`}
                onClick={() => handlePlanSelect(plan)}
            >
                <h3>{plan.name}</h3>
                <p>{plan.duration}</p>
                <p>{plan.price}</p>
                <p>{plan.adsLimit}</p>
                <ul>
                    {plan.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                    ))}
                </ul>
            </div>
        )
    }

    const handleSubmit = () => {
        if (selectedPlan) {
            // Appel API pour sauvegarder le plan sélectionné si besoin
            nextStep();  // Passer à l'étape suivante
        } else {
            alert('Veuillez sélectionner un plan.');
        }
    };


    return (
        <div className="choose-plan">
            <h2>Choisissez un plan</h2>
            <div className="plans">
                {plans.map((plan) => (
                    <PlanItem plan={plan} />
                ))}
                <button
                    onClick={handleSubmit}
                    disabled={!selectedPlan}
                >
                    Valider le plan
                </button>
            </div>
        </div>
    );
};
