const backendUrl = process.env.REACT_APP_BACKEND_URL;

const fetchPaymentStatus = async () => {
    const response = await fetch(`${backendUrl}/api/payments/all/status`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const result = await response.json();
    return result;
}

// Fetch processing payments 
const fetchProcessingPayments = async () => {
    const response = await fetch(`${backendUrl}/api/payments/processing`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const result = await response.json();
    return result;
};


// Fetch completed payments
const fetchCompletedPayments = async () => {
    const response = await fetch(`${backendUrl}/api/payments/completed`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const result = await response.json();
    return result;
};


// Fetch failed payments
const fetchFailedPayments = async () => {
    const response = await fetch(`${backendUrl}/api/payments/failed`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const result = await response.json();
    return result;
};

const fetchPaymentInfo = async () => {
    const response = await fetch(`${backendUrl}/api/payments/all`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const result = await response.json();

    return result;

};


// Update Payment Info Status
const updatePaymentStatus = async (paymentID, newStatus) => {
    const response = await fetch(`${backendUrl}/api/payments/update-status/${paymentID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
    });

    const result = await response.json();
    console.log(result);

    return result;
};



export {
    fetchPaymentInfo,
    updatePaymentStatus,
    fetchPaymentStatus,
    fetchProcessingPayments,
    fetchCompletedPayments,
    fetchFailedPayments,
};