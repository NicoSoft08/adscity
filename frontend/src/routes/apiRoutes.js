const backendUrl = process.env.REACT_APP_BACKEND_URL;

const getViewCount = async (postID) => {
    try {
        const response = await fetch(`${backendUrl}/api/do/get/view/${postID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de la récupération du nombre de vues:', error);
        throw error;
    }
};

const incrementViewCount = async (postID, userID) => {
    try {
        const response = await fetch(`${backendUrl}/api/do/increment/view/${postID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userID }),
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de l\'incrémentation du nombre de vues:', error);
        throw error;
    }
};

const incrementClickCount = async (postID, userID) => {
    try {
        const response = await fetch(`${backendUrl}/api/do/increment/click/${postID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userID }),
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de l\'incrémentation du nombre de clics:', error);
        throw error;
    }
};

const updateShareCount = async (postID, userID) => {
    try {
        const response = await fetch(`${backendUrl}/api/do/increment/share/${postID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userID }),
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de l\'incrémentation du nombre de clics:', error);
        throw error;
    }
};

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

const updateContactClick = async (userID, city) => {
    try {
        const response = await fetch(`${backendUrl}/api/do/update/contact-click`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userID, city })
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

const fetchFilteredPosts = async (filters) => {
    // Supprime les filtres vides avant d’envoyer la requête
    const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
    );

    const queryParams = new URLSearchParams(cleanFilters).toString();

    try {
        const response = await fetch(`${backendUrl}/api/do/search/filtered?${queryParams}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de la récupération des posts filtrés:', error);
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

const updateSocialLinks = async (userID, socialLinks) => {
    try {
        const response = await fetch(`${backendUrl}/api/do/update/${userID}/social-links`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ socialLinks }),
        });

        const result = await response.json();
        // console.log(result);
        return result;
    } catch (error) {
        console.error('Erreur lors de la mise à jour des réseaux sociaux', error);
        throw error;
    }
};

const updatePost = async (postID, updatedData, userID) => {
    try {
        const response = await fetch(`${backendUrl}/api/posts/${postID}/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ updatedData, userID }),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'annonce', error);
        throw error;
    }
};

const fetchPubs = async () => {
    try {
        const response = await fetch(`${backendUrl}/api/do/collect/pubs`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de la récupération des publicités :', error);
        throw error;
    }
};

const logClientAction = async (userID, action, details) => {
    try {
        const response = await fetch(`${backendUrl}/api/do/log/${userID}/client/action`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({action, details})
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error)
    }
}

export {
    logClientAction,
    advancedSearch,
    collectLocations,
    contactSupportClient,
    fetchPubs,
    fetchFilteredPosts,
    getViewCount,
    incrementClickCount,
    incrementViewCount,
    searchItems,
    updateInteraction,
    updateContactClick,
    updateShareCount,
    updatePost,
    updateSocialLinks,
};