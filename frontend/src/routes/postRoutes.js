import { auth } from "../firebaseConfig";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const createPost = async (postData, userID, captchaToken) => {
    try {
        // Get user's current token for authentication
        const idToken = await auth.currentUser.getIdToken();

        // Set the token in the request headers
        const response = await fetch(`${backendUrl}/api/posts/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({ postData, userID, captchaToken }),
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

const reportPost = async (postID, userID, reason) => {
    const response = await fetch(`${backendUrl}/api/posts/post/${postID}/report`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID, reason })
    });

    const result = await response.json();
    return result;
};

const fetchPostBySlug = async (category, subcategory, slug) => {
    const response = await fetch(`${backendUrl}/api/posts/${category}/${subcategory}/${slug}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const result = await response.json();
    return result;
};

const fetchPostByPostID = async (postID) => {
    try {
        const response = await fetch(`${backendUrl}/api/posts/post/${postID}`, {
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

const fetchApprovedPosts = async () => {
    try {
        const response = await fetch(`${backendUrl}/api/posts/approved`, {
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

const fetchPostsByCategory = async (categoryName) => {
    try {
        const response = await fetch(`${backendUrl}/api/posts/category`, {
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

const fetchRelatedListings = async (postID, category) => {
    try {
        const response = await fetch(`${backendUrl}/api/posts/related-category`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ postID, category }),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error fetching related ads:', error);
        return [];
    }
};

const updatePost = async (postID, updatedData, userID) => {
    try {
        const response = await fetch(`${backendUrl}/api/posts/${postID}/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ updatedData, userID }),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'annonce:', error);
        return null;
    };
};

const deletePost = async (postID, userID) => {
    try {
        const response = await fetch(`${backendUrl}/api/posts/${postID}/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userID }),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'annonce:', error);
        return null;
    };
};

const markAsSold = async (userID, postID) => {
    try {
        const response = await fetch(`${backendUrl}/api/posts/${postID}/mark/sold`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userID }),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'annonce:', error);
        return null;
    };
};

const fetchNearbyPosts = async (country, city) => {
    try {
        const response = await fetch(`${backendUrl}/api/posts/collect/nearby?country=${encodeURIComponent(country)}&city=${encodeURIComponent(city)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de la récupération des annonces proches:', error);
        return [];
    }
};

const fetchPostById = async (post_id) => {
    try {
        const response = await fetch(`${backendUrl}/api/posts/${post_id}`, {
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

export {
    createPost,
    deletePost,
    markAsSold,
    fetchPostById,
    fetchNearbyPosts,
    fetchPostByPostID,
    fetchPostsByCategory,
    fetchPostBySlug,
    fetchApprovedPosts,
    fetchRelatedListings,
    reportPost,
    updatePost,
};