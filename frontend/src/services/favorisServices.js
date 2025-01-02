const backendUrl = process.env.REACT_APP_BACKEND_URL

// Add Item to Favorites
const toggleFavorites = async (adID, userID) => { 
    try {
        const response = await fetch(`${backendUrl}/api/favoris/toggle`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ adID, userID })
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


// Collect User Favorites
const getUserFavorites = async (userID) => {
    try {
        const response = await fetch(`${backendUrl}/api/favoris/users/${userID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();
        return result;

        // if (result.success) {
        //     return result.favorites; // Liste des annonces favorites
        // } else {
        //     console.error('Erreur lors de la récupération des favoris :', result.message);
        //     return [];
        // }
    } catch (error) {
        console.error('Erreur réseau :', error);
        return [];
    }
}


export {
    getUserFavorites,
    toggleFavorites
};