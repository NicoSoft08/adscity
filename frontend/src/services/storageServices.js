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
const uploadProfilURLByUserID = async (userID, file) => {
    if (!file) {
        console.error('Aucun fichier sélectionné');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${process.env.BACKEND_URL}/upload-profile/${userID}`, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Photo de profil mise à jour avec succès', result);

            return result;
        } else {
            console.error('Erreur lors de la mise à jour de la photo de profil');
        }
    } catch (error) {
        console.error('Erreur lors de l\'upload:', error);
    }
};


const uploadProfilePhoto = async (userID, file) => {
    const formData = new FormData();
    formData.append('profilURL', file);

    const response = await fetch(`${backendUrl}/api/upload/${userID}/profile`, {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();
    return data;
};





export {
    deleteProfilURLByUserID,
    fetchProfileByUserID,
    uploadProfilURLByUserID,
    uploadProfilePhoto,
};
