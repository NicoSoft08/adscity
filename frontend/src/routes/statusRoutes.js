const backendUrl = process.env.REACT_APP_BACKEND_URL;

    
const createNewStatus = async (statusData, userID, idToken) => {
    try {
        const response = await fetch(`${backendUrl}/api/status/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({ statusData, userID })
        });
        const data = await response.json();
        console.log('Statut créé avec succès :', data);
        return data;
    } catch (error) {
        console.error('Erreur lors de la création du statut :', error);
        throw error;
    }
};

const getAllStatuses = async () => {
    try {
        const response = await fetch(`${backendUrl}/api/status/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des statuts :', error);
        throw error;
    }
};

const getStatusByUserID = async (userID, idToken) => {
    try {
        const response = await fetch(`${backendUrl}/api/status/user/${userID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des statuts :', error);
        throw error;
    }

};

export {
    createNewStatus,
    getAllStatuses,
    getStatusByUserID
};