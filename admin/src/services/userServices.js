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

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur:', error);
        return null;
    }
};


const setUserOnlineStatus = async (userID, isOnline) => {
    try {
        const response = await fetch(`${backendUrl}/api/users/user/status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userID, isOnline })
        });

        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
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
    setUserOnlineStatus,
};