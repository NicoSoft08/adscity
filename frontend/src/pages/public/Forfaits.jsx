import React, { useState } from 'react';
import PlanItem from '../../components/plan-item/PlanItem';
import { useNavigate } from 'react-router-dom';
import '../../styles/Forfaits.scss';
import { forfaits } from '../../data/plans';
import ConfirmationModal from '../../customs/ConfirmationModal';
import Spinner from '../../customs/Spinner';

export default function Forfaits() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    const handleSelect = (planId) => {
        // Find the selected plan details
        const plan = forfaits.find(p => p.id === planId);
        setSelectedPlan(plan);
        setShowModal(true);
    };

    const handleConfirm = () => {
        // setShowModal(false);
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setShowModal(false);
            navigate(`/proceed-to-checkout/${selectedPlan.id}`, {
                state: {
                    plan: selectedPlan
                }
            });
        }, 2000);
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    return (
        <>
            <PlanItem onSelectPlan={handleSelect} currentPlan={"Professionnel"} />;

            {showModal && selectedPlan && (
                <ConfirmationModal
                    title="Confirmation d'abonnement"
                    message={`Vous êtes sur le point de souscrire au forfait ${selectedPlan.displayName} pour ${selectedPlan.price} ${selectedPlan.currency}. Souhaitez-vous continuer?`}
                    confirmText={loading ? <Spinner /> : "Confirmer"}
                    cancelText="Annuler"
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
        </>
    )
};
