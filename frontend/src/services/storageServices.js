const backendUrl = process.env.REACT_APP_BACKEND_URL;


// Delete User Profile URL
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

// Fetch User Profile URL
const fetchProfileByUserID = async (userID) => {
    try {
        const response = await fetch(`${backendUrl}/api/fetch/${userID}/profilURL`, {
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


// Upload User Profile URL
const uploadProfilePhoto = async (userID, file) => {
    const formData = new FormData();
    formData.append('profilURL', file);

    const response = await fetch(`${backendUrl}/api/upload/${userID}/profile`, {
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

    const response = await fetch(`${backendUrl}/api/upload/image`, {
        method: 'POST',
        body: formData,
    });

    const result = await response.json();
    return result;
}





export {
    uploadImage,
    deleteProfilURLByUserID,
    fetchProfileByUserID,
    uploadProfilePhoto,
};
