import React, { useContext, useState } from 'react';
import { plans } from '../../data/plans';
import Spinner from '../../customs/Spinner';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Toast from '../../customs/Toast';
import Modal from '../../customs/Modal';
import ComparisonTable from '../../utils/ComparisonTable';
import PlanItem from '../../components/plan-item/PlanItem';
import data from '../../json/data.json';
import '../../styles/PlansPage.scss';

export default function PlansPage() {
    const { currentUser } = useContext(AuthContext);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [compareModal, setCompareModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSelect = (id) => {
        const plan = plans.find((p) => p.id === id);
        setSelectedPlan(plan);

        if (plan?.name === 'Professionnel') {
            setShowCategoryModal(true);
        }
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    const handleConfirmCategory = () => {
        if (!selectedCategory) {
            setToast({
                type: 'error',
                show: true,
                message: "Veuillez sélectionner une catégorie."
            });
            return;
        }
        setShowCategoryModal(false);
    };

    const handleProceed = () => {
        if (!selectedPlan) {
            setToast({
                type: 'error',
                show: true,
                message: "Veuillez sélectionner un plan."
            });
            return;
        }

        if (!currentUser) {
            setToast({
                type: 'error',
                show: true,
                message: "Veuillez vous connecter pour continuer."
            });
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            navigate('/proceed-to-checkout', {
                state: {
                    planInfo: {
                        plan: selectedPlan.name,
                        price: selectedPlan.price,
                        category: selectedCategory,
                    }
                }
            });
            setIsLoading(false);
        }, 1000);
    }

    const CTAButton = ({ plan }) => {
        return (
            <button className="proceed-btn" onClick={handleProceed} disabled={isLoading}>
                {isLoading ? <Spinner /> : `Passer au plan ${plan.name}`}
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
                        onClick={() => setIsModalOpen(true)}
                    />
                ))}
            </div>

            <div className="compare-plans" onClick={() => setCompareModal(true)}>
                🔍 Comparer les Plans
            </div>

            <div className="action-section">
                {selectedPlan && (
                    <div className="resume">
                        <h2>Prix tarifaire</h2>
                        <div className="forfait">
                            <span>Forfait</span>
                            <span>{selectedPlan?.price === 0 ? "Gratuit" : `${selectedPlan?.price} RUB`}</span>
                        </div>
                        <p>{`<<${selectedPlan?.name.toUpperCase()}>>`}</p>
                        <div className="forfait">
                            <span><strong>Total</strong></span>
                            <span><strong>{selectedPlan?.price === 0 ? "Gratuit" : `${selectedPlan?.price} RUB`}</strong></span>
                        </div>
                        <div className="call-to-action">
                            <CTAButton plan={selectedPlan} />
                        </div>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <Modal
                    onShow={isModalOpen}
                    title={`Forfait ${selectedPlan?.name}`}
                    onHide={() => setIsModalOpen(false)}
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

            {showCategoryModal && (
                <Modal
                    onShow={showCategoryModal}
                    title={`Sélectionner une catégorie`}
                    onHide={() => setShowCategoryModal(false)}
                >
                    <div className="category-selector">
                        {data.categories.map((category) => (
                            <div
                                key={category.key}
                                className={`category-item ${selectedCategory === category.categoryName ? 'selected' : ''}`}
                                onClick={() => handleCategoryClick(category.categoryName)}
                            >
                                {category.categoryTitles.fr}
                            </div>
                        ))}
                        <button className="confirm-btn" onClick={handleConfirmCategory}>
                            Confirmer la sélection
                        </button>
                    </div>
                </Modal>
            )}

            {compareModal && (
                <ComparisonTable plans={plans} onClose={() => setCompareModal(false)} />
            )}

            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    );
};
