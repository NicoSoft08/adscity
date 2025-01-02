import { auth } from "../firebaseConfig";

const backendUrl = process.env.REACT_APP_BACKEND_URL;


// Create Ad
const createAnnonce = async (adData, userID) => {
    try {
        // Get user's current token for authentication
        const idToken = await auth.currentUser.getIdToken();

        // Set the token in the request headers
        const response = await fetch(`${backendUrl}/api/ads/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({ adData, userID }),
        });


        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: result.message
            };
        }

        return {
            success: true,
            message: result.message,
            adId: result.adId
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'Erreur de création d\'annonce'
        };
    }
};


// Fetch Ad By ID
const fetchAnnonceByAdID = async (adID) => {
    try {
        const response = await fetch(`${backendUrl}/api/ads/${adID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
};



// Fetch all Approved Ads
const fetchApprovedAds = async () => {
    try {
        const response = await fetch(`${backendUrl}/api/ads/approved`, {
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


// Fetch Ads by Category
const fetchAdsByCategory = async (categoryName) => {
    try {
        const response = await fetch(`${backendUrl}/api/ads/category`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ categoryName }),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de la requête de récupération des annonces:', error);
        return [];
    }
};



// Fetch Related Listings
const fetchRelatedListings = async (adID, category) => {
    try {
        const response = await fetch(`${backendUrl}/api/ads/related-category`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ adID, category }),
        });

        const relatedAds = await response.json();
        return relatedAds;
    } catch (error) {
        console.error('Error fetching related ads:', error);
        return [];
    }
};




export {
    createAnnonce,
    fetchAnnonceByAdID,
    fetchAdsByCategory,
    fetchApprovedAds,
    fetchRelatedListings,
};