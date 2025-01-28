const backendUrl = process.env.REACT_APP_BACKEND_URL;


const updateInteraction = async (postID, userID, category) => {
    try {
        const response = await fetch(`${backendUrl}/api/do/update/interaction`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ postID, userID, category })
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de la mise à jour des interactions:', error);
        throw error;
    }
};

const updateContactClick = async (userID) => {
    try {
        const response = await fetch(`${backendUrl}/api/do/update/contact-click`, {
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
};

const searchItems = async (query) => {
    try {
        const response = await fetch(`${backendUrl}/api/do/search/items?query=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const results = await response.json();
        return results;
    } catch (error) {
        console.error('Erreur lors de la recherche d\'items:', error);
        throw error;
    }
};

const contactSupportClient = async (formData) => {
    try {
        const response = await fetch(`${backendUrl}/api/do/contact/support-client`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ formData }),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de l\'envoie du formulaire:', error);
        throw error;
    }
};

const collectLocations = async () => {
    try {
        const response = await fetch(`${backendUrl}/api/do/collect/locations`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de la collecte des localisations:', error);
        throw error;
    }
};

const advancedSearch = async (queryParams) => {
    try {
        const response = await fetch(`${backendUrl}/api/do/search/advanced?${queryParams}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de la recherche avancée d\'items:', error);
        throw error;
    }
};



export {
    advancedSearch,
    collectLocations,
    contactSupportClient,
    searchItems,
    updateInteraction,
    updateContactClick,
};