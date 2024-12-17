import React, { useContext, useState } from 'react';
import { plans } from '../../data/plans';
import Spinner from '../../customs/Spinner';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Toast from '../../customs/Toast';
import Modal from '../../customs/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import '../../styles/PlansPage.scss';

const PlanCard = ({ plan, planKey, onSelect, selectedPlan, setSelectedPlan, onClick }) => {
    const isSelected = selectedPlan === planKey;

    const handleSeeMore = (e) => {
        e.stopPropagation(); // Prevent triggering the card selection
        onClick(planKey);
        setSelectedPlan(planKey);
    };

    return (
        <div
            title={`Forfait ${planKey.toUpperCase()}`}
            className={`plan-card ${isSelected ? "selected" : ""}`}
            onClick={() => onSelect(planKey)}
        >
            <span className='plan-name'>{planKey.charAt(0).toUpperCase() + planKey.slice(1)}</span>
            <div className="plan-header">
                <span className="price">{plan.price === 0 ? "Gratuit" : plan.price + " RUB"}</span>{" "}
                <span className="duration">{" "} / {plan.validity_days} jours</span>
            </div>
            <div className="plan-details">
                <p className='max-ads'>
                    {plan.max_ads === "Illimité"
                        ? "Illimité"
                        : `${plan.max_ads} ${plan.max_ads > 1 ? "annonces" : "annonce"
                        }`}
                </p>
                <p className='max-photos'>{plan.max_photos} photos</p>
                <p className='max-photos'>Visibilité {plan.visibility}</p>
                <p className='max-photos'>Assistance {plan.support}</p>
            </div>
            <button className="see-more" onClick={handleSeeMore}>Voir Plus</button>
        </div>
    );
};


export default function PlansPage() {
    const { currentUser } = useContext(AuthContext);
    const [selectedPlan, setSelectedPlan] = useState("basic");
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const navigate = useNavigate();

    const handleSelect = (planKey) => {
        setSelectedPlan(planKey);
        setIsLoading(true);
        setTimeout(() => { setIsLoading(false) }, 2000);
    };

    const handleHide = () => {
        setToast({
            ...toast,
            show: false,
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

        const handleClick = (plan, price) => {
            if (price === 0) {
                navigate('/'); // Redirection pour le plan gratuit
            } else {
                if (!currentUser) {
                    setToast({ type: 'error', show: true, message: "Connectez-vous pour continuer !!" });
                } else {
                    const planInfo = { plan, price };
                    navigate(`/proceed-to-checkout`, { state: { planInfo: planInfo } });
                }
            }
        };

        if (!planDetails[selectedPlan]) return null; // Gère les plans non définis

        const { price, label } = planDetails[selectedPlan];

        return (
            <button
                className={className}
                onClick={() => handleClick(selectedPlan, price)}
                disabled={isLoading}
            >
                {isLoading ? <Spinner /> : label}
            </button>
        );
    }

    return (
        <div className="pricing">
            <h2>Nos Tarifs et Forfaits</h2>
            <p>Choisissez le forfait adapté à vos besoins.</p>
            <div className="pricing-container">
                {Object.keys(plans).map((planKey) => (
                    <PlanCard
                        key={planKey}
                        plan={plans[planKey]}
                        planKey={planKey}
                        onSelect={handleSelect}
                        selectedPlan={selectedPlan}
                        setSelectedPlan={setSelectedPlan}
                        onClick={() => setIsOpen(true)}
                    />
                ))}
            </div>
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
                        <div className="call-to-action">
                            <CTAButton
                                className='proceed-btn'
                                selectedPlan={selectedPlan}
                                isLoading={isLoading}
                            />
                        </div>
                    </div>
                )}
            </div>

            {isOpen && (
                <Modal
                    onShow={isOpen}
                    title={`Forfait ${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}`}
                    onHide={() => setIsOpen(false)}
                >
                    <div className="plan-details-modal">
                        <table border="1" style={{ margin: "10px", width: "95%" }}>
                            <tbody>
                                <tr>
                                    <td>
                                        Annonces
                                        <FontAwesomeIcon
                                            icon={faExclamationCircle}
                                            title="Nombre d'annonces incluses pour ce forfait"
                                        />
                                    </td>
                                    <td>{plans[selectedPlan].max_ads}</td>
                                </tr>
                                <tr>
                                    <td>
                                        Photos par annonce
                                        <FontAwesomeIcon
                                            icon={faExclamationCircle}
                                            title="Nombre de photos publiables par annonce"
                                        />
                                    </td>
                                    <td>{plans[selectedPlan].max_photos}</td>
                                </tr>
                                <tr>
                                    <td>
                                        Validité
                                        <FontAwesomeIcon
                                            icon={faExclamationCircle}
                                            title="Durée de validité de l'annonce"
                                        />
                                    </td>
                                    <td>{plans[selectedPlan].validity_days} jours</td>
                                </tr>
                                <tr>
                                    <td>Visibilité</td>
                                    <td>{plans[selectedPlan].visibility}</td>
                                </tr>
                                <tr>
                                    <td>Support client</td>
                                    <td>{plans[selectedPlan].support}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Modal>
            )}

            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={handleHide}
            />
        </div>
    );
};
