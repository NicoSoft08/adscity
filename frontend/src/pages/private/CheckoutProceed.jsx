import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import PaymentForm from '../../common/adscity-pay/payment-form/PaymentForm';
import Loading from '../../customs/Loading';
import { faMobile, faUniversity, faWallet } from '@fortawesome/free-solid-svg-icons';
import {
    alpha_bank, flashsend, moov_money,
    mtn_money, orange_money, sber_bank,
    tinkoff_bank, vtb_bank, wave
} from '../../config/images';
import Toast from '../../customs/Toast';
import PaymentInstructions from '../../common/adscity-pay/payment-instructions/PaymentInstructions';
import '../../styles/CheckoutProceed.scss';
import { createPaymentIntent } from '../../routes/paymentRoutes';

// Available payment methods configuration
const paymentMethods = [
    {
        id: 'BankTransfer',
        label: 'Transfert bancaire',
        icon: faUniversity,
        providers: [
            { id: 'SberBank', name: 'SberBank', icon: sber_bank },
            { id: 'Tinkoff', name: 'Tinkoff', icon: tinkoff_bank },
            { id: 'VTB', name: 'VTB', icon: vtb_bank },
            { id: 'Alpha Bank', name: 'Alpha Bank', icon: alpha_bank }
        ]
    },
    {
        id: 'MobileMoney',
        label: 'Mobile Money',
        icon: faMobile,
        providers: [
            { id: 'Orange Money', name: 'Orange Money', icon: orange_money },
            { id: 'MTN Money', name: 'MTN Money', icon: mtn_money },
            { id: 'Moov Money', name: 'Moov Money', icon: moov_money }
        ]
    },
    {
        id: 'Wallet',
        label: 'Wallet',
        icon: faWallet,
        providers: [
            { id: 'Wave', name: 'Wave', icon: wave },
            { id: 'FlashSend', name: 'FlashSend', icon: flashsend }
        ]
    }
];


export default function CheckoutProceed() {
    const { currentUser, userData } = useContext(AuthContext);
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [provider, setProvider] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    // Get plan details from location state or fetch them if not available
    const [plan, setPlan] = useState(location.state?.plan || null);

    useEffect(() => {
        // If plan details weren't passed via location state, fetch them
        if (!plan && id) {
            // Import the plans data
            import('../../data/plans').then(module => {
                const selectedPlan = module.forfaits.find(p => p.id === id);
                if (selectedPlan) {
                    setPlan(selectedPlan);
                } else {
                    setToast({ show: true, type: 'error', message: 'Plan non trouvé' });
                }
            });
        }
    }, [plan, id]);

    // Update the handleOnsubmit function to match what PaymentForm expects
    const handleOnsubmit = async (paymentMethod, paymentData) => {
        if (!currentUser) {
            setToast({ show: true, type: 'error', message: 'Vous devez être connecté pour effectuer un paiement' });
            return;
        }

        // Show payment instructions instead of processing immediately
        setShowInstructions(true);
    };

    // Add a payment completion handler
    const handlePaymentDone = async () => {
        setIsProcessing(true);

        try {
            // Here you would integrate with your payment gateway
            // For this example, we'll simulate a successful payment
            await new Promise(resolve => setTimeout(resolve, 2000));

            // After successful payment, update user subscription in database
            const subscriptionData = {
                planID: plan.id,
                planName: plan.displayName,
                startDate: new Date().toISOString(),
                endDate: new Date(Date.now() + (plan.validity.days * 24 * 60 * 60 * 1000)).toISOString(),
                price: plan.price,
                currency: plan.currency,
                status: 'active',
                features: plan.features.filter(f => f.included).map(f => f.id),
                limits: plan.limits
            };

            await createPaymentIntent(currentUser.uid, subscriptionData);

            // Navigate to success page
            navigate('/payment/success', {
                state: {
                    plan: plan,
                    subscription: subscriptionData
                }
            });
        } catch (error) {
            console.error("Erreur lors du traitement du paiement:", error);
            setToast({ show: true, type: 'error', message: 'Une erreur est survenue lors du traitement du paiement. Veuillez réessayer.' });
            setShowInstructions(false); // Go back to payment form
        } finally {
            setIsProcessing(false);
        }
    };

    if (!plan) return <Loading />

    // Show payment instructions after form submission
    if (showInstructions) {
        return (
            <PaymentInstructions
                paymentMethod={paymentMethod}
                provider={provider}
                amount={plan?.price}
                paymentDone={handlePaymentDone}
            />
        );
    }

    // Show loading during processing
    if (isProcessing) return <Loading />;


    return (
        <div className='checkout'>
            <PaymentForm
                paymentMethods={paymentMethods}
                provider={provider}
                setPaymentMethod={setPaymentMethod}
                paymentMethod={paymentMethod}
                setProvider={setProvider}
                amount={plan?.price}
                subscription={plan?.displayName}
                userData={userData}
                onSubmit={handleOnsubmit}
            />
            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    );
};
