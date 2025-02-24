const backendUrl = process.env.REACT_APP_BACKEND_URL;

const fetchDataByUserID = async (userID) => {
    try {
        const response = await fetch(`${backendUrl}/api/users/${userID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

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

const fetchPostsByUserID = async (userID) => {
    try {
        const response = await fetch(`${backendUrl}/api/posts/user/${userID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des annonces de l\'utilisateur.');
        }
        const userAllAds = await response.json();
        return userAllAds;
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
};

const fetchApprovedPostsByUserID = async (userID) => {
    try {
        const response = await fetch(`${backendUrl}/api/posts/user/${userID}/approved`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des annonces approuvées de l\'utilisateur.');
        }
        const userApprovedAds = await response.json();
        return userApprovedAds;
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
};

const fetchPendingPostsByUserID = async (userID) => {
    try {
        const response = await fetch(`${backendUrl}/api/posts/user/${userID}/pending`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des annonces en attente de l\'utilisateur.');
        }
        const userPendingAds = await response.json();
        return userPendingAds;
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
};

const fetchRefusedPostsByUserID = async (userID) => {
    try {
        const response = await fetch(`${backendUrl}/api/posts/user/${userID}/refused`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des annonces refusées de l\'utilisateur.');
        }
        const userRefusedAds = await response.json();
        return userRefusedAds;
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
};

const fetchUserActivePosts = async (userID) => {
    const response = await fetch(`${backendUrl}/api/posts/user/${userID}/active`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const result = await response.json();
    return result;
};

const fetchUserInactivePosts = async (userID) => {
    try {
        const response = await fetch(`${backendUrl}/api/posts/user/${userID}/outdated`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des annonces inactives de l\'utilisateur.');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur:', error);
        return [];
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

const toggleFavorites = async (postID, userID) => { 
    try {
        const response = await fetch(`${backendUrl}/api/users/${userID}/favorites/add-remove`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ postID })
        });

        if (!response.ok) {
            throw new Error('Erreur réseau lors de la mise à jour des favoris');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de la mise à jour des favoris:', error);
        return { success: false, message: error.message };
    }
};

const getUserFavorites = async (userID) => {
    try {
        const response = await fetch(`${backendUrl}/api/users/${userID}/favorites`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();
        return result;

    } catch (error) {
        console.error('Erreur réseau :', error);
        return [];
    }
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

const fetchUnreadNotifications = async (userID) => {
    const response = await fetch(`${backendUrl}/api/users/${userID}/notifications/unread`, {
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

const rateUser = async (userID, rating, comment) => {
    try {
        const response = await fetch(`${backendUrl}/api/do/rate/${userID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rating, comment }),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de la notation de l\'utilisateur :', error);
        throw error;
    };
};

const updateUserWithDeviceToken = async (deviceToken, idToken) => {
    try {
        const response = await fetch(`${backendUrl}/api/users/update-device-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({ deviceToken }),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du jeton de l\'utilisateur :', error);
        throw error;
    };
};

const fetchInterlocutorProfile = async (userID) => {
    try {
        const response = await fetch(`${backendUrl}/api/users/${userID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();
        // console.log(result);
        return result;
    } catch (error) {
        console.error('Erreur lors de la récupération du profil de l\'interlocuteur:', error);
        throw error;
    }
};

export {
    fetchDataByUserID,
    fetchNotifications,
    fetchUnreadNotifications,
    fetchPostsByUserID,
    fetchInterlocutorProfile,
    fetchApprovedPostsByUserID,
    fetchPendingPostsByUserID,
    fetchRefusedPostsByUserID,
    fetchUserActivePosts,
    fetchUserInactivePosts,
    getUserDevices,
    getUserFavorites,
    markNotificationAsRead,
    rateUser,
    setUserOnlineStatus,
    toggleFavorites,
    updateUserFields,
    updateUserWithDeviceToken,
};