import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { logEvent } from 'firebase/analytics';
import { AuthContext } from '../../contexts/AuthContext';
import PaymentForm from '../../common/adscity-pay/payment-form/PaymentForm';
import { paymentProcessing } from '../../routes/paymentRoutes';
import Toast from '../../customs/Toast';
import { analytics } from '../../firebaseConfig';
import '../../styles/CheckoutProceed.scss';

export default function CheckoutProceed() {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser, userData } = useContext(AuthContext);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [provider, setProvider] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const { planInfo } = location.state || {};

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
            navigate('/payment', { state: { planInfo, provider, paymentMethod } });
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
            </div>
            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ show: false, ...toast })} />
        </div>
    );
};
