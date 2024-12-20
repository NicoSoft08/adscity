const backendUrl = process.env.REACT_APP_BACKEND_URL;

// Upload User Profile URL
const uploadProfilURLByUserID = async (userID, file) => {
    if (!file) {
        console.error('Aucun fichier sélectionné');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${backendUrl}/api/upload-profile/${userID}`, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();

            return result;
        } else {
            console.error('Erreur lors de la mise à jour de la photo de profil');
        }
    } catch (error) {
        console.error('Erreur lors de l\'upload:', error);
    }
};


// Delete User Profile URL
const deleteProfilURLByUserID = async (userID) => {
    try {
        const response = await fetch(`${backendUrl}/api/delete-profile/${userID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const result = await response.json();

            return result;
        } else {
            console.error('Erreur lors de la suppression de la photo de profil');
        }
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
    }
};


export {
    uploadProfilURLByUserID,
    deleteProfilURLByUserID
}