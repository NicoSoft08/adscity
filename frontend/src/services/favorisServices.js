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

       const result = await response.json();
       return result;
    } catch (error) {
        console.error('Erreur lors de la mise à jour des favoris:', error);
        return false;
    }
};


export {
    toggleFavorites
};