const backendUrl = process.env.REACT_APP_BACKEND_URL;

const fetchUserData = async (userID) => {
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
        throw error;
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
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
};


const fetchUserActivePosts = async (UserID) => {
    const response = await fetch(`${backendUrl}/api/posts/user/${UserID}/active`, {
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

const updateUserField = async (userID, field) => {
    const response = await fetch(`${backendUrl}/api/users/${userID}/profile-field/update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ field }),
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

const markAllNotificationsAsRead = async (userID) => {
    const response = await fetch(`${backendUrl}/api/users/${userID}/notifications/read-all`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const result = await response.json();
    return result;
}

const deleteNotification = async (userID, notificationID) => {
    const response = await fetch(`${backendUrl}/api/users/${userID}/notifications/${notificationID}/delete`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const result = await response.json();
    return result;
};

const deteleteAllNotifications = async (userID) => {
    const response = await fetch(`${backendUrl}/api/users/${userID}/notifications/delete-all`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const result = await response.json();
    return result;
}

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

const updateSearchHistory = async (userID, query) => {
    try {
        const response = await fetch(`${backendUrl}/api/users/${userID}/update-search-history`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'historique de recherche:", error);
    }
};

const getUserLoginActivity = async (userID) => {
    try {
        const response = await fetch(`${backendUrl}/api/users/${userID}/login-activity`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'activité de connexion de l\'utilisateur:', error);
        throw error;
    }
}

export {
    fetchUserData,
    fetchDataByUserID,
    fetchNotifications,
    fetchPostsByUserID,
    fetchInterlocutorProfile,
    fetchUserActivePosts,
    fetchUserInactivePosts,
    getUserDevices,
    getUserFavorites,
    getUserLoginActivity,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    deteleteAllNotifications,
    rateUser,
    setUserOnlineStatus,
    toggleFavorites,
    updateUserField,
    updateUserWithDeviceToken,
    updateSearchHistory,
};