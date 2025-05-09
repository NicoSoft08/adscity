import { auth } from "../firebaseConfig";

const apiRequest = async (url, method = 'GET', data = null) => {
    try {
        const idToken = await auth.currentUser.getIdToken();

        if (!idToken) {
            throw new Error('No authentication token found');
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        };

        const options = {
            method,
            headers
        };

        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);

        // Handle token expiration
        if (response.status === 401) {
            // Token expired or invalid
            window.location.href = '/login'; // Redirect to login
            throw new Error('Session expired. Please login again.');
        }

        return await response.json();
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
};

// Helper function to verify captcha with Google
const verifyCaptcha = async (token) => {
    try {
        const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

        const response = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`
        });

        const data = await response.json();

        return {
            success: data.success,
            score: data.score, // Only available in v3
            action: data.action, // Only available in v3
            timestamp: data.challenge_ts,
            hostname: data.hostname
        };
    } catch (error) {
        console.error('Error verifying captcha:', error);
        return { success: false };
    }
};

export { apiRequest, verifyCaptcha };