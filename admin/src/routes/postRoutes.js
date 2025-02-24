import { analytics } from "../firebaseConfig";
import { logEvent } from "firebase/analytics";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

// Fetch all Ads
const fetchAllPosts = async () => {
    try {
        const response = await fetch(`${backendUrl}/api/posts/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des annonces.');
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    };
};

// Fetch all Approved Ads
const fetchApprovedPosts = async () => {
    try {
        const response = await fetch(`${backendUrl}/api/posts/approved`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des annonces approuvées.');
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    };
};

// Fetch all Pending Ads
const fetchPendingPosts = async () => {
    try {
        const response = await fetch(`${backendUrl}/api/posts/pending`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des annonces en attente.');
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    };
};

// Fetch all Refused Ads 
const fetchRefusedPosts = async () => {
    try {
        const response = await fetch(`${backendUrl}/api/posts/refused`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des annonces refusées.');
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    };
};

const suspendPost = async (postID, reason) => {
    try {
        const response = await fetch(`${backendUrl}/api/posts/${postID}/suspend`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reason }),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de la suspension de l\'annonce.', error);
        return false;
    };
};

// Update Ads status
const updatePostStatus = async (postID, newStatus) => {
    
};

const onApprovePost = async (postID) => {
    const response = await fetch(`${backendUrl}/api/posts/post/${postID}/approve`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const result = await response.json();
    console.log(result);
    logEvent(analytics, 'advertisment_approved');
    fetchPendingPosts();

    return result;
};

const onRefusePost = async (postID, reason) => {
    try {
        const response = await fetch(`${backendUrl}/api/posts/refuse`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ postID, reason }),
        });


        const result = await response.json();

        if (response.ok) {
            console.log('Annonce refusée avec succès', result.message);
            logEvent(analytics, 'advertisment_refused');
            fetchPendingPosts(); // Rafraîchir la liste après approbation
        } else {
            console.error('Erreur lors du refus de l\'annonce:', result.error);
        }
    } catch (error) {
        console.error('Erreur lors du refus de l\'annonce:', error);
    }
};

const deletePost = async (postID, reason) => {
    try {
        const response = await fetch(`${backendUrl}/api/posts/${postID}/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reason }),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'annonce.', error);
        return false;
    };
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
    fetchAllPosts,
    fetchPendingPosts,
    fetchPostById,
    fetchRefusedPosts,
    fetchApprovedPosts,
    onApprovePost,
    onRefusePost,
    suspendPost,
    deletePost,

    updatePostStatus,
};