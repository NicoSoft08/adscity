import React, { useEffect, useState } from 'react';
import { plans } from '../../data/plans';
import Toast from '../../customs/Toast';
import Spinner from '../../customs/Spinner';
import { useNavigate } from 'react-router-dom';
import Loading from '../../customs/Loading';
import './ChoosePlan.scss';

const PlanCard = ({ plan, planKey, onSelect, selectedPlan, isLoading, onClick }) => {
    const isSelected = selectedPlan === planKey;

    return (
        <div
            className={`plan-card ${isSelected ? "selected" : ""}`}
            onClick={() => !isLoading && onSelect(planKey)}
        >
            <span className='plan-name'>{planKey.charAt(0).toUpperCase() + planKey.slice(1)}</span>
            <div className="plan-header">
                <span className="price">
                    {plan.price === 0 ? "Gratuit" : `${plan.price} RUB`}
                </span>
                <span className="duration"> / {plan.validity_days} jours</span>
            </div>
            <div className="plan-details">
                <p className='max-ads'>
                    {plan.max_ads === "Illimité"
                        ? "Illimité"
                        : `${plan.max_ads} ${plan.max_ads > 1 ? "annonces" : "annonce"}`}
                </p>
                <p className='max-photos'>{plan.max_photos} photos</p>
            </div>
            <button className="see-more" onClick={onClick}>Voir Plus</button>
        </div>
    );
};

export default function ChoosePlan({ onNext, onBack, onChange, formData }) {
    const [selectedPlan, setSelectedPlan] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const navigate = useNavigate();

    useEffect(() => {
        setToast({
            type: 'info',
            message: 'Choisissez un plan !',
            show: true,
        });
    }, []);

    const handleSelect = async (planKey) => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        setSelectedPlan(planKey);
        onChange({
            ...formData,
            plan: planKey,
            planDetails: plans[planKey]
        });
    };

    const getSelectedPlanPrice = () => {
        let price = 0

        switch (selectedPlan) {
            case 'basic':
                return price === 0 ? "Gratuit" : price;
            case 'bronze':
                price = 2000 + " RUB";
                return price;
            case 'silver':
                price = 4000 + " RUB";
                return price;
            case 'gold':
                price = 6000 + " RUB";
                return price;
            default:
                return null;
        }
    }

    const CTAButton = ({ className, selectedPlan, isLoading }) => {
        const planDetails = {
            basic: { price: 0, label: 'Continuer' },
            bronze: { price: 2000, label: 'Payer 2000 RUB' },
            silver: { price: 4000, label: 'Payer 4000 RUB' },
            gold: { price: 6000, label: 'Payer 6000 RUB' }
        };

        const handleNext = (plan, price) => {
            if (price === 0) {
                onNext();
            } else {
                setLoading(true);
                setTimeout(() => {
                    navigate('/proceed-to-checkout', { state: { planInfo: { plan, price } } });
                    setLoading(false);
                }, 2000);
            }
        };

        if (!planDetails[selectedPlan]) return null; // Gère les plans non définis

        const { price, label } = planDetails[selectedPlan];

        return (
            <button
                className={className}
                onClick={() => handleNext(selectedPlan, price)}
                disabled={isLoading}
            >
                {isLoading ? <Spinner /> : label}
            </button>
        );
    }

    return (
        <div className="choose-plan">
            <h2>Choisissez un plan pour votre annonce</h2>
            <div className="plans-grid">
                {Object.entries(plans).map(([planKey, plan]) => (
                    <PlanCard
                        key={planKey}
                        plan={plan}
                        planKey={planKey}
                        onSelect={handleSelect}
                        selectedPlan={selectedPlan}
                        isLoading={isLoading}
                        onClick={() => navigate('/pricing')}
                    />
                ))}
            </div>

            {loading && <Loading />}

            <div className="action-section">
                {selectedPlan && (
                    <div className="resume">
                        <h2>Prix tarifaire</h2>
                        <div className="forfait">
                            <span>Forfait</span>
                            <span>{getSelectedPlanPrice(selectedPlan)}</span>
                        </div>
                        <p>{`<<${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}>>`}</p>
                        <div className="forfait">
                            <span><strong>Total</strong></span>
                            <span><strong>{getSelectedPlanPrice(selectedPlan)}</strong></span>
                        </div>
                    </div>
                )}
            </div>

            <div className="form-navigation">
                <button className="back-button" onClick={onBack}>
                    Retour
                </button>
                {selectedPlan && (
                    <CTAButton
                        className='proceed-btn'
                        selectedPlan={selectedPlan}
                        isLoading={isLoading}
                    />
                )}
            </div>

            <Toast
                type={toast.type}
                message={toast.message}
                show={toast.show}
                onClose={() => setToast({ ...toast, show: false })}
            />
        </div>
    );
}
