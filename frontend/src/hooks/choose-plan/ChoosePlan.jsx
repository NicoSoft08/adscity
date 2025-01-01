import React, { useEffect, useState } from 'react';
import { plans } from '../../data/plans';
import Toast from '../../customs/Toast';
import Spinner from '../../customs/Spinner';
import { useNavigate } from 'react-router-dom';
import Loading from '../../customs/Loading';
import PlanItem from '../../components/plan-item/PlanItem';
import './ChoosePlan.scss';


export default function ChoosePlan({ onNext, onBack, onChange, formData, currentUser }) {
    const [selectedPlan, setSelectedPlan] = useState(null);
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

    const handleSelect = async (id) => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        setSelectedPlan(id);
        onChange({
            ...formData,
            plan: id,
            planDetails: plans[id]
        });
    };


    const CTAButton = ({ className, selectedPlan, isLoading, currentUser, setToast, navigate }) => {
        if (!selectedPlan) return null;

        const handleClick = () => {
            // Redirection pour un plan payant
            if (!currentUser) {
                // Afficher un message si l'utilisateur n'est pas connecté
                setToast({
                    type: 'error',
                    show: true,
                    message: "Connectez-vous pour continuer !!"
                });
                return;
            }
            setIsLoading(true);
            setTimeout(() => {
                navigate(`/proceed-to-checkout`, {
                    state: {
                        planInfo: {
                            plan: selectedPlan.name,
                            price: selectedPlan.price
                        }
                    }
                });
                setIsLoading(false);
            }, 1000);
        }

        return (
            <button
                className={className}
                onClick={handleClick}
                disabled={isLoading}
            >
                {isLoading ? <Spinner /> : `Passer au plan ${selectedPlan.name}`}
            </button>
        );
    }

    return (
        <div className="choose-plan">
            <h2>Choisissez un plan pour votre annonce</h2>
            <div className="pricing-container">
                {plans.map((plan) => (
                    <PlanItem
                        key={plan.id}
                        id={plan.id}
                        plan={plan}
                        onSelect={handleSelect}
                        selectedPlan={selectedPlan?.id}
                        setSelectedPlan={setSelectedPlan}
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
                            <span>{selectedPlan.name}</span>
                        </div>
                        <p>{`<<${selectedPlan?.name}>>`}</p>
                        <div className="forfait">
                            <span><strong>Total</strong></span>
                            <span><strong>{selectedPlan.price === 0 ? "Gratuit" : `${selectedPlan.price} RUB`}</strong></span>
                        </div>
                        <div className="call-to-action">
                            <CTAButton
                                className='proceed-btn'
                                selectedPlan={selectedPlan}
                                isLoading={isLoading}
                                currentUser={currentUser}
                                setToast={setToast}
                                navigate={navigate}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="form-navigation">
                <button className="back-button" onClick={onBack}>
                    Retour
                </button>
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
