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
        const response = await fetch(`${process.env.BACKEND_URL}/api/delete-profile/${userID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Photo de profil supprimée avec succès', result);

            return result;
        } else {
            console.error('Erreur lors de la suppression de la photo de profil');
        }
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
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

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération de la photo de profile.');
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur:', error);
        return null;
    }
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

const uploadMedia = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${backendUrl}/api/storage/upload/media`, {
        method: 'POST',
        body: formData,
    });

    const result = await response.json();
    return result;
};


export {
    deletePostImagesFromStorage,
    uploadImage,
    deleteProfilURLByUserID,
    fetchProfileByUserID,
    uploadProfilePhoto,
    uploadMedia,
    uploadCoverPhoto,
};
