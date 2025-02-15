import React, { useContext } from 'react';
import PaymentInstructions from '../../common/adscity-pay/payment-instructions/PaymentInstructions';
import { AuthContext } from '../../contexts/AuthContext';
import { useLocation } from 'react-router-dom';

function PaymentPage() {
    const location = useLocation();
    const { userData } = useContext(AuthContext);
    const { planInfo, provider, paymentMethod } = location.state || {};

    return (
        <div>
            <PaymentInstructions
                paymentInfo={userData}
                amount={planInfo?.price}
                paymentMethod={paymentMethod}
                provider={provider}
            />
        </div>
    );
};

export default PaymentPage;