const backendUrl = process.env.REACT_APP_BACKEND_URL;

const fetchUserData = async (userID) => {
    console.log(userID)
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

const fetchAllUsersWithStatus = async () => {
    try {
        const response = await fetch(`${backendUrl}/api/users/all/status`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const result = await response.json();
        return result;
    } catch (error) {

    }
}

const fetchUsersLocations = async () => {
    const response = await fetch(`${backendUrl}/api/users/locations`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const result = await response.json();
    return result;
}

const fetchUsers = async () => {
    try {
        const response = await fetch(`${backendUrl}/api/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
}

const fetchUserVerificationData = async (userID) => {
    try {
        const response = await fetch(`${backendUrl}/api/users/verification/${userID}`, {
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
}

const fetchUserById = async (user_id) => {
    try {
        const response = await fetch(`${backendUrl}/api/users/user/${user_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur:', error);
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

const updateUserFields = async (userID, fields) => {
    const response = await fetch(`${backendUrl}/api/users/${userID}/profile-fields/update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields }),
    });

    const result = await response.json();
    console.log(result);
    return result;
}

const fetchNotifications = async (userID) => {
    const response = await fetch(`${backendUrl}/api/users/${userID}/admin/notifications`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const result = await response.json();
    return result;
};

const markNotificationAsRead = async (userID, notificationID) => {
    const response = await fetch(`${backendUrl}/api/users/${userID}/admin/notifications/${notificationID}/read`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const result = await response.json();
    return result;
};


const deleteNotification = async (userID, notificationID) => {
    const response = await fetch(`${backendUrl}/api/users/${userID}/admin/notifications/${notificationID}/delete`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    }); 

    const result = await response.json();
    return result;
};

const deteleteAllNotifications = async (userID) => {
    const response = await fetch(`${backendUrl}/api/users/${userID}/admin/notifications/delete-all`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const result = await response.json();
    return result;
};

const markAllNotificationsAsRead = async (userID) => {
    const response = await fetch(`${backendUrl}/api/users/${userID}/admin/notifications/read-all`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const result = await response.json();
    return result;
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
};

const getUserIDLoginActivity = async (UserID) => {
    try {
        const response = await fetch(`${backendUrl}/api/users/user/${UserID}/login-activity`, {
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
};

export {
    fetchUsersLocations,
    getUserLoginActivity,
    getUserIDLoginActivity,
    markAllNotificationsAsRead,
    deteleteAllNotifications,
    deleteNotification,
    fetchUserData,
    getUserDevices,
    fetchUserById,
    fetchDataByUserID,
    fetchUsers,
    fetchAllUsersWithStatus,
    fetchNotifications,
    markNotificationAsRead,
    setUserOnlineStatus,
    updateUserField,
    updateUserFields,
    fetchUserVerificationData,
};