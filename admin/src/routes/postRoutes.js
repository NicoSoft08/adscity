const backendUrl = process.env.REACT_APP_BACKEND_URL;
    

const fetchPosts = async (idToken) => {
    try {
        const response = await fetch(`${backendUrl}/api/posts`, {
            method: 'GET',
            // credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
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
    }
};


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
            credentials: 'include',
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

const onApprovePost = async (postID, idToken) => {
    const response = await fetch(`${backendUrl}/api/posts/post/${postID}/admin/approve`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
    });

    const result = await response.json();
    fetchPendingPosts();
    return result;
};

const onRefusePost = async (postID, reason) => {
    console.log(postID, reason);
    try {
        const response = await fetch(`${backendUrl}/api/posts/post/${postID}/admin/refuse`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reason }),
        });


        const result = await response.json();
        fetchPendingPosts(); // Rafraîchir la liste après approbation
        return result;
    } catch (error) {
        console.error('Erreur lors du refus de l\'annonce:', error);
    }
};

const adminDeletePost = async (postID, idToken) => {
    try {
        const response = await fetch(`${backendUrl}/api/posts/post/${postID}/admin/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'annonce.', error);
        return false;
    };
};

const fetchPostById = async (post_id, idToken = null) => {
    const headers = {
        'Content-Type': 'application/json'
    };

    // Add Authorization header if token exists
    if (idToken) {
        headers['Authorization'] = `Bearer ${idToken}`;
    }

    try {
        const response = await fetch(`${backendUrl}/api/posts/${post_id}`, {
            method: 'GET',
            headers: headers
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
};


export {
    fetchPosts,
    fetchAllPosts,
    fetchPendingPosts,
    fetchPostById,
    fetchRefusedPosts,
    fetchApprovedPosts,
    onApprovePost,
    onRefusePost,
    suspendPost,
    adminDeletePost,

    updatePostStatus,
};