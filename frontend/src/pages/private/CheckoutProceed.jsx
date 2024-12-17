import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import PaymentForm from '../../common/adscity-pay/payment-form/PaymentForm';
import PaymentInstructions from '../../common/adscity-pay/payment-instructions/PaymentInstructions';
import { useLocation, useNavigate } from 'react-router-dom';
import { paymentProcessing } from '../../services/paymentServices';
import Toast from '../../customs/Toast';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebaseConfig';
import '../../styles/CheckoutProceed.scss';

export default function CheckoutProceed() {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser, userData } = useContext(AuthContext);
    const [rules, setRules] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [provider, setProvider] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    let planInfo = location.state.planInfo;

    useEffect(() => {
        if (!currentUser) {
            navigate('/auth/signin');
        }
    }, [currentUser, navigate]);

    const handleOnsubmit = async () => {
        const userID = currentUser?.uid;
        const paymentData = {
            plan: planInfo?.plan,
            paymentMethod: paymentMethod,
            provider: provider,
            amount: planInfo?.price,
            subscription: planInfo?.plan.charAt(0).toUpperCase() + planInfo?.plan.slice(1),
        };

        try {
            await paymentProcessing(userID, paymentData);
            logEvent(analytics, 'add_payment_info');
            setRules(true);
        } catch (error) {
            console.error("Erreur de l'enregistrment du paiement", error);
        }
    }


    return (
        <div className='checkout'>
            <div className="content">
                <PaymentForm
                    provider={provider}
                    setPaymentMethod={setPaymentMethod}
                    paymentMethod={paymentMethod}
                    setProvider={setProvider}
                    amount={planInfo?.price}
                    subscription={planInfo?.plan.charAt(0).toUpperCase() + planInfo?.plan.slice(1)}
                    userData={userData}
                    onSubmit={handleOnsubmit}
                />

                {rules && (
                    <PaymentInstructions
                        paymentInfo={userData}
                        amount={planInfo?.price}
                        paymentMethod={paymentMethod}
                        provider={provider}
                    />
                )}
            </div>
            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast({ show: false, ...toast })}
            />
        </div>
    );
};
