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

const uploadProfilePhoto = async (file, userID) => {
    const formData = new FormData();
    formData.append('profilURL', file);
    formData.append('userID', userID);

    const response = await fetch(`${backendUrl}/api/storage/upload/${userID}/profile`, {
        method: 'POST',
        body: formData,
    });

    const result = await response.json();
    return result;
};

const uploadCoverPhoto = async (file, userID) => {
    const formData = new FormData();
    formData.append('coverURL', file);
    formData.append('userID', userID);

    const response = await fetch(`${backendUrl}/api/storage/upload/${userID}/cover`, {
        method: 'POST',
        body: formData,
    });

    const result = await response.json();
    return result;
};

const uploadImage = async (file, userID) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('userID', userID);

    const response = await fetch(`${backendUrl}/api/storage/upload/image`, {
        method: 'POST',
        body: formData,
    });

    const result = await response.json();
    return result;
};

const uploadSensitiveVerification = async (userID, document, faceImage) => {
    // Create FormData for secure file upload
    const formData = new FormData();
    formData.append('userID', userID);
    formData.append('document', document);
    formData.append('selfie', faceImage);

    const response = await fetch(`${backendUrl}/api/storage/upload/sensitive-verification`, {
        method: 'POST',
        body: formData,
    });

    const result = await response.json();
    console.log('Result:', result); 
    return result;
}


export {
    deletePostImagesFromStorage,
    uploadImage,
    deleteProfilURLByUserID,
    fetchProfileByUserID,
    uploadCoverPhoto,
    uploadProfilePhoto,
    uploadSensitiveVerification,
};
