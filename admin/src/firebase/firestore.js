const backendUrl = process.env.REACT_APP_BACKEND_URL;







// Delete a User
const enableUser = async (userID) => {
    try {
        const response = await fetch(`${backendUrl}/api/enable/user/${userID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de l\'activation de l\'utilisateur');
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
};


// Delete a User
const disableUser = async (userID) => {
    try {
        const response = await fetch(`${backendUrl}/api/disable/user/${userID}`, {
            method: 'POST'
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la déscativation de l\'utilisateur');
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
};


// Delete a User
const deleteUser = async (userID) => {
    try {
        const response = await fetch(`${backendUrl}/api/delete/user/${userID}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la suppression de l\'utilisateur');
        }

        const data = await response.json();
        console.log(data.message); // "Utilisateur supprimé avec succès."
    } catch (error) {
        console.error('Erreur:', error);
    }
};

export {
    enableUser,
    disableUser,
    deleteUser,
};
