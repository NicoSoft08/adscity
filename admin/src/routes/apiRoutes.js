const backendUrl = process.env.REACT_APP_BACKEND_URL;


const createPub = async (pubData) => {
    try {
        const response = await fetch(`${backendUrl}/api/do/host/pub`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pubData),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de la création de la publicité :', error);
        throw error;
    }
};

const fetchPubById = async (pub_id) => {
    try {
        const response = await fetch(`${backendUrl}/api/do/collect/pubs/${pub_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de la récupération de la publicité :', error);
        throw error;
    }
};

const fetchPubs = async () => {
    try {
        const response = await fetch(`${backendUrl}/api/do/collect/pubs`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de la récupération des publicités :', error);
        throw error;
    }
};

const logAdminAction = async (userID, action, details) => {
    try {
        const response = await fetch(`${backendUrl}/api/do/log/${userID}/admin/action`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action, details })
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error)
    }
};

const fetchVerifications = async (idToken) => {
    try {
        const response = await fetch(`${backendUrl}/api/do/collect/verifications`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
        });
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
};

const sendVerificationEmail = async (userID) => {
    try {
        const response = await fetch(`${backendUrl}/api/do/send/users/${userID}/verification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();
        console.log(result);
        return result;
    } catch (error) {
        throw error;
    }
};

export {
    createPub,
    fetchPubs,
    fetchPubById,
    fetchVerifications,
    logAdminAction,
    sendVerificationEmail,
};