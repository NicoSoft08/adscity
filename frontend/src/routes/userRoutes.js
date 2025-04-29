import { auth } from "../firebaseConfig";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const fetchUserData = async (userID) => {
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

const fetchDataByUserID = async (userID, idToken) => {
    try {
        const response = await fetch(`${backendUrl}/api/users/${userID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
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

const setUserOnlineStatus = async (userID, isOnline, idToken) => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`${backendUrl}/api/users/user/status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({
                userID,
                isOnline,
                // Add a timestamp to prevent replay attacks
                timestamp: Date.now()
            }),
            credentials: 'include',
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error setting user online status:", error);
        // Don't throw the error during logout to prevent blocking the process
        if (isOnline) {
            throw error;
        }
        return { success: false };
    }
};

const fetchPostsByUserID = async (userID) => {
    try {
        // Get the current user and their token
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }

        const idToken = await user.getIdToken(true);

        // Verify the user is fetching their own posts or has admin rights
        if (user.uid !== userID) {
            throw new Error('Non autorisé : Vous ne pouvez pas accéder aux posts d\'un autre utilisateur.');
        }

        const response = await fetch(`${backendUrl}/api/posts/user/${userID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
            // Add timeout for the request
            signal: AbortSignal.timeout(10000)
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        const result = await response.json();

        // Validate the response structure
        if (!result || !result.success || !result.postsData) {
            throw new Error('Invalid response format');
        }

        return result;
    } catch (error) {
        console.error('Error fetching user posts:', error);
        throw error; // Re-throw to handle in the component
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
    try {
        // Get the current user and their token
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }

        const idToken = await user.getIdToken();

        // Verify the user is updating their own profile
        if (user.uid !== userID) {
            throw new Error('Unauthorized: Cannot modify another user\'s profile');
        }

        const response = await fetch(`${backendUrl}/api/users/${userID}/profile-field/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
                // Add CSRF token if you have it implemented
                // 'X-CSRF-Token': csrfToken,
            },
            body: JSON.stringify({ field }),
            // Add timeout for the request
            signal: AbortSignal.timeout(10000)
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error updating user field:', error);
        return {
            success: false,
            message: 'Failed to update profile field'
        };
    }
}

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

const getUserFavorites = async (userID, idToken) => {
    try {
        const response = await fetch(`${backendUrl}/api/users/${userID}/favorites`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
        });
        const result = await response.json();
        return result;

    } catch (error) {
        console.error('Erreur réseau :', error);
        return [];
    }
};

const fetchNotifications = async (userID, idToken) => {
    const response = await fetch(`${backendUrl}/api/users/${userID}/notifications`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
    });

    const result = await response.json();
    return result;
};

const markNotificationAsRead = async (userID, idToken, notificationID) => {
    const response = await fetch(`${backendUrl}/api/users/${userID}/notifications/${notificationID}/read`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
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

const getUserLoginActivity = async (userID, idToken) => {
    try {
        const response = await fetch(`${backendUrl}/api/users/${userID}/login-activity`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
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