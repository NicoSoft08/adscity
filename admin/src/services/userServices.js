const backendUrl = process.env.REACT_APP_BACKEND_URL;

// Fetch User Data
const fetchDataByUserID = async (userID) => {
    try {
        const response = await fetch(`${backendUrl}/api/users/user/${userID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données de l\'utilisateur.');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur:', error);
        return null;
    }
};


// Fetch all users
const fetchAllUsers = async () => {
    try {
        const response = await fetch(`${backendUrl}/api/users/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des utilisateurs.');
        }
        const allUsers = await response.json();
        return allUsers;
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
}


// Fetch online users
const fetchOnlineUsers = async () => {
    try {
        const response = await fetch(`${backendUrl}/api/users/online`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des utilisateurs online.');
        }
        const onlineUsers = await response.json();
        return onlineUsers;
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
};


// Fetch offline users
const fetchOfflineUsers = async () => {
    try {
        const response = await fetch(`${backendUrl}/api/users/offline`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des utilisateurs offline.');
        }
        const offlineUsers = await response.json();
        return offlineUsers;
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
};


export {
    fetchDataByUserID,
    fetchAllUsers,
    fetchOfflineUsers,
    fetchOnlineUsers,
};