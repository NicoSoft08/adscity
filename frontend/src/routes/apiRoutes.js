const backendUrl = process.env.REACT_APP_BACKEND_URL;

const incrementViewCount = async (postID) => {
    try {
        const response = await fetch(`${backendUrl}/api/do/increment/view/${postID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de l\'incrémentation du nombre de vues:', error);
        throw error;
    }
};

const incrementClickCount = async (postID) => {
    try {
        const response = await fetch(`${backendUrl}/api/do/increment/click/${postID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
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

const fetchFilteredPosts = async (filters) => {
    const queryParams = new URLSearchParams(filters).toString();

    try {
        const response = await fetch(`${backendUrl}/api/do/search/filtered?${queryParams}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();
        // console.log(result);
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
        // console.log(result);
        return result;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'annonce', error);
        throw error;
    }
};

export {
    advancedSearch,
    collectLocations,
    contactSupportClient,
    fetchFilteredPosts,
    incrementClickCount,
    incrementViewCount,
    searchItems,
    updateInteraction,
    updateContactClick,
    updatePost,
    updateSocialLinks,
};