import { logEvent } from "firebase/analytics";
import { analytics } from "../firebaseConfig";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

// Collect user payment info
const fetchUserPaymentInfo = async (userID) => {
    const response = await fetch(`${backendUrl}/api/payment/collect/${userID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const result = await response.json();

    return result;
};


// Process payment
const paymentProcessing = async (userID, paymentData) => {
    const response = await fetch(`${backendUrl}/api/payment/process`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID, paymentData }),
    });

    const result = await response.json();

    if (response.ok) {
        logEvent(analytics, 'begin_checkout', {
            payment_type: paymentData.plan,
            value: paymentData.amount,
            currency: paymentData.currency,
        });
        return {
            success: true,
            message: result.message,
            data: result.data
        };
    }

    return {
        success: false,
        error: result.error
    };
}



export {
    fetchUserPaymentInfo,
    paymentProcessing,
};