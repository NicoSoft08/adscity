const backendUrl = process.env.REACT_APP_BACKEND_URL;

const fetchAllUsers = async () => {
    try {
        const response = await fetch(`${backendUrl}/api/users/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const result = await response.json();
        console.log(result);
        return result;
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
}


// Fetch online users
const fetchOnlineUsers = async () => {
    try {
        const response = await fetch(`${backendUrl}/api/users/all/online`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const result = await response.json();
        console.log(result);
        return result;
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
};


// Fetch offline users
const fetchOfflineUsers = async () => {
    try {
        const response = await fetch(`${backendUrl}/api/users/all/offline`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const result = await response.json();
        console.log(result);
        return result;
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
};


const fetchDataByUserID = async (userID) => {
    try {
        const response = await fetch(`${backendUrl}/api/users/${userID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données de l\'utilisateur');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
};

const getUserDevices = async (userID) => {
    const response = await fetch(`${backendUrl}/api/users/devices/${userID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const result = await response.json();
    return result;
}

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

const updateUserFields = async (userID, updatedFields) => {
    const response = await fetch(`${backendUrl}/api/users/${userID}/profile-fields/update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updatedFields }),
    });

    const result = await response.json();
    return result;
};

const fetchNotifications = async (userID) => {
    const response = await fetch(`${backendUrl}/api/users/${userID}/notifications`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const result = await response.json();
    return result;
};

const markNotificationAsRead = async (userID, notificationID) => {
    const response = await fetch(`${backendUrl}/api/users/${userID}/notifications/${notificationID}/read`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const result = await response.json();
    return result;
};


export {
    getUserDevices,
    fetchDataByUserID,
    fetchAllUsers,
    fetchOfflineUsers,
    fetchOnlineUsers,
    fetchNotifications,
    markNotificationAsRead,
    setUserOnlineStatus,
    updateUserFields,
};