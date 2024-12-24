const backendUrl = process.env.REACT_APP_BACKEND_URL;


const checkCode = async (email, code) => {

    try {
        const response = await fetch(`${backendUrl}/api/verify/code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, code }),
        });

        if (!response.ok) {
            // Si le statut de la réponse n'est pas "OK", retourne un objet avec un message d'erreur
            const errorData = await response.json();
            return { error: errorData.message || 'Erreur lors de la vérification du code' };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la requête vers le serveur :', error);
        throw error;
    }
}



// Delete a User
const deleteUser = async (userID) => {
    try {
        const response = await fetch(`${backendUrl}/api/delete/user/${userID}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la suppression de l\'utilisateur');
        }

        const data = await response.json();
        console.log(data.message); // "Utilisateur supprimé avec succès."
    } catch (error) {
        console.error('Erreur:', error);
    }
};



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
        throw error;
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



// Fetch all Ads by userID
const fetchAdsByUserID = async (userID) => {
    try {
        const response = await fetch(`${backendUrl}/api/ads/user/${userID}`, {
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


// Fetch all Approved Ads by userID
const fetchApprovedAdsByUserID = async (userID) => {
    try {
        const response = await fetch(`${backendUrl}/api/ads/user/${userID}/approved`, {
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


// Fetch all Pending Ads by userID
const fetchPendingAdsByUserID = async (userID) => {
    try {
        const response = await fetch(`${backendUrl}/api/ads/user/${userID}/pending`, {
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


// Fetch all Refused Ads by userID
const fetchRefusedAdsByUserID = async (userID) => {
    try {
        const response = await fetch(`${backendUrl}/api/ads/user/${userID}/refused`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
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


// Fetch all Active Ads by userID
const fetchUserActiveAds = async (userID) => {
    if (!userID) {
        console.error('Aucun utilisateur identifié');
        return false;
    }

    try {
        const response = await fetch(`${backendUrl}/api/ads/user/${userID}/active`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des annonces actives de l\'utilisateur.');
        }

        const adsActive = await response.json();
        return adsActive;
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
};


// Fetch all Inactive Ads by userID
const fetchUserInactiveAds = async (userID) => {
    try {
        const response = await fetch(`${backendUrl}/api/ads/user/${userID}/outdated`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des annonces inactives de l\'utilisateur.');
        }

        const adsInactive = await response.json();
        return adsInactive;
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
};





// Update Interaction
const updateInteraction = async (adID, userID, category) => {
    const response = await fetch(`${backendUrl}/api/update/interaction`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adID, userID, category })
    });

    const data = await response.json();
    return data.success;
};


// Update contact click
const updateContactClick = async (userID) => {
    try {
        const response = await fetch(`${backendUrl}/api/update/contact-click`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userID })
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de la mise à jour des favoris:', error);
        return false;
    }
}


const updateUserField = async (userID, selectedField, fieldValue) => {
    const response = await fetch(`${backendUrl}/api/update/user/${userID}/${selectedField}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: fieldValue }),
    });

    const result = await response.json();
    return result;
};






export {
    deleteUser,

    checkCode,
    fetchDataByUserID,
    fetchAdsByUserID,
    fetchApprovedAdsByUserID,
    fetchPendingAdsByUserID,
    fetchRefusedAdsByUserID,
    fetchUserActiveAds,
    fetchUserInactiveAds,
    updateInteraction,
    updateContactClick,
    updateUserField,
    setUserOnlineStatus,
};
