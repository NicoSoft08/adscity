import React, { useContext, useState } from 'react';
import { plans } from '../../data/plans';
import Spinner from '../../customs/Spinner';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Toast from '../../customs/Toast';
import Modal from '../../customs/Modal';
import PlanItem from '../../components/plan-item/PlanItem';
import '../../styles/PlansPage.scss';

export default function PlansPage() {
    const { currentUser } = useContext(AuthContext);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [showSelectCategory, setShowSelectCategory] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const navigate = useNavigate();

    const handleSelect = (id) => {
        const plan = plans.find((p) => p.id === id);

        if (plan) setSelectedPlan(plan);
    };

    const handleHide = () => {
        setToast({
            ...toast,
            show: false,
        });
    };




    const CTAButton = ({ className, selectedPlan, isLoading, currentUser, setToast, navigate }) => {
        if (!selectedPlan) return null;

        const isParticulierPlan = selectedPlan?.name.toLowerCase() === "professionnel";
        console.log(isParticulierPlan);

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

            if (isParticulierPlan) {
                setShowSelectCategory(true);
                setToast({
                    type: 'error',
                    show: true,
                    message: "Ce plan est réservé aux professionnels !"
                });
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
        <div className="pricing">
            <h2>Découvrez nos Plans et Tarifs</h2>
            <p>Choisissez le forfait adapté à vos besoins.</p>
            <div className="pricing-container">
                {plans.map((plan) => (
                    <PlanItem
                        key={plan.id}
                        id={plan.id}
                        plan={plan}
                        onSelect={handleSelect}
                        selectedPlan={selectedPlan?.id}
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
                            <span>{selectedPlan.price === 0 ? "Gratuit" : `${selectedPlan.price} RUB`}</span>
                        </div>
                        <p>{`<<${selectedPlan?.name.toUpperCase()}>>`}</p>
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

            {selectedPlan && isOpen && (
                <Modal
                    onShow={isOpen}
                    title={`Forfait ${selectedPlan?.name.toUpperCase()}`}
                    onHide={() => setIsOpen(false)}
                >
                    <div className="plan-details-modal">
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        Nombre d'annonces
                                    </td>
                                    <td>{selectedPlan?.content.ads_num}</td>
                                </tr>
                                <tr>
                                    <td>
                                        Coût des plans
                                    </td>
                                    <td>{selectedPlan?.content.cost_plan}</td>
                                </tr>
                                <tr>
                                    <td>
                                        Visibilité des annonces
                                    </td>
                                    <td>{selectedPlan?.content.ads_visible}</td>
                                </tr>
                                <tr>
                                    <td>
                                        Support client
                                    </td>
                                    <td>{selectedPlan?.content.support_client}</td>
                                </tr>
                                <tr>
                                    <td>
                                        Rapports de performance
                                    </td>
                                    <td>{selectedPlan?.content.stat_performance}</td>
                                </tr>
                                <tr>
                                    <td>
                                        Catégories spécialisées
                                    </td>
                                    <td>{selectedPlan?.content.special_cat}</td>
                                </tr>
                                <tr>
                                    <td>
                                        Outils de gestion
                                    </td>
                                    <td>{selectedPlan?.content.tool_manage_ads}</td>
                                </tr>
                                <tr>
                                    <td>
                                        Personnalisation
                                    </td>
                                    <td>{selectedPlan?.content.personalize}</td>
                                </tr>
                                <tr>
                                    <td>
                                        Crédibilité perçue
                                    </td>
                                    <td>{selectedPlan?.content.credibility}</td>
                                </tr>
                                <tr>
                                    <td>
                                        Status publicitaires
                                    </td>
                                    <td>{selectedPlan?.content.ads_status}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Modal>
            )}

            {showSelectCategory && (
                <Modal
                    onShow={showSelectCategory}
                    title={`Sélectionner une catégorie`}
                    onHide={() => setShowSelectCategory(false)}
                >

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
