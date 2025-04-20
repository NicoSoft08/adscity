import React from 'react';
import PaymentInstructions from '../../common/adscity-pay/payment-instructions/PaymentInstructions';

function PaymentPage({ userData, price, currency, paymentMethod, provider }) {

    return (
        <div>
            <PaymentInstructions
                paymentInfo={userData}
                amount={price}
                paymentMethod={paymentMethod}
                provider={provider}
            />
        </div>
    );
};

export default PaymentPage;