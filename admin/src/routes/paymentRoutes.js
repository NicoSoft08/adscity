const backendUrl = process.env.REACT_APP_BACKEND_URL;

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


export {
    fetchProcessingPayments,
    fetchCompletedPayments,
    fetchFailedPayments,
};