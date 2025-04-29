const backendUrl = process.env.REACT_APP_BACKEND_URL;

const deletePostImagesFromStorage = async (postID) => {
    try {
        const response = await fetch(`${backendUrl}/api/storage/delete/post-images/${postID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de la suppression des images :', error);
        throw error;
    }
};

const deleteProfilURLByUserID = async (userID) => {
    try {
        const response = await fetch(`${backendUrl}/api/delete-profile/${userID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        throw error;
    }
};

const fetchProfileByUserID = async (userID) => {
    try {
        const response = await fetch(`${backendUrl}/api/storage/user/${userID}/profilURL`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur:', error);
        return null;
    }
};

const uploadProfilePhoto = async (file, userID, idToken) => {
    const formData = new FormData();
    formData.append('profilURL', file);
    formData.append('userID', userID);

    const response = await fetch(`${backendUrl}/api/storage/upload/${userID}/profile`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${idToken}`,
        },
        body: formData,
    });

    const result = await response.json();
    return result;
};

const uploadCoverPhoto = async (file, userID, idToken) => {
    const formData = new FormData();
    formData.append('coverURL', file);
    formData.append('userID', userID);

    const response = await fetch(`${backendUrl}/api/storage/upload/${userID}/cover`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${idToken}`,
        },
        body: formData,
    });

    const result = await response.json();
    return result;
};

const uploadImage = async (file, userID, idToken) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('userID', userID);

    const response = await fetch(`${backendUrl}/api/storage/upload/image`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${idToken}`,
        },
        body: formData,
    });

    const result = await response.json();
    return result;
};

const uploadMedia = async (media, userID, idToken) => {
    const formData = new FormData();
    formData.append('media', media);
    formData.append('userID', userID);

    const response = await fetch(`${backendUrl}/api/storage/upload/media`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${idToken}`,
        },
        body: formData,
    });

    const result = await response.json();
    return result;
}

const uploadStatusMedia = async (media, userID, idToken) => {
    const formData = new FormData();
    formData.append('media', media);
    formData.append('userID', userID);

    try {
        const response = await fetch(`${backendUrl}/api/storage/upload/status-media`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
            body: formData,
        })

        const result = await response.json();
        console.log('Result:', result);
        return result;
    } catch (error) {
        console.error('Erreur lors de l\'upload du média :', error);
        throw error;
        
    }
};

const uploadSensitiveVerification = async (userID, document, faceImage, idToken) => {
    // Create FormData for secure file upload
    const formData = new FormData();
    formData.append('userID', userID);
    formData.append('document', document);
    formData.append('selfie', faceImage);

    const response = await fetch(`${backendUrl}/api/storage/upload/sensitive-verification`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${idToken}`,
        },
        body: formData,
    });

    const result = await response.json();
    console.log('Result:', result);
    return result;
}


export {
    deletePostImagesFromStorage,
    uploadImage,
    uploadMedia,
    deleteProfilURLByUserID,
    fetchProfileByUserID,
    uploadCoverPhoto,
    uploadProfilePhoto,
    uploadStatusMedia,
    uploadSensitiveVerification,
};
