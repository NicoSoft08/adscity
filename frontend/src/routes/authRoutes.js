import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";


const backendUrl = process.env.REACT_APP_BACKEND_URL;

const createUser = async (address, city, country, email, password, firstName, lastName, phoneNumber, displayName) => {
    try {
        const response = await fetch(`${backendUrl}/api/auth/create-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                address, city, country,
                email, password, firstName,
                lastName, phoneNumber, displayName,
            }),  // Si tu envoies le mot de passe, assure-toi que c'est sécurisé
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la création de l\'utilisateur');
        };

        const result  = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur :', error);
        throw error;
    };
};

const signinUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (!user.emailVerified) {
            throw new Error('Veuillez vérifier votre email avant de continuer.');
        };

        const idToken = await user.getIdToken();
        
        const response = await fetch(`${backendUrl}/api/auth/login-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la connexion de l\'utilisateur');
        };

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de la connexion de l\'utilisateur :', error);
        throw error;
    };
};

const logoutUser = async () => {
    try {
        const  user = auth.currentUser;
        const idToken = await user.getIdToken();

        const response = await fetch(`${backendUrl}/api/auth/logout-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la déconnexion de l\'utilisateur');
        };

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de la déconnexion de l\'utilisateur :', error);
        throw error;
    };
};

const sendVerificationCode = async (userID, newEmail) => {
    const response = await fetch(`${backendUrl}/api/auth/send-verification-code`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID, newEmail }),
    });

    const result = await response.json();
    console.log(result);
    return result;
};

const verifyCodeAndUpdateEmail = async (userID, verificationCode, newEmail) => {
    const response = await fetch(`${backendUrl}/api/auth/verify-code-and-update-email`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID, verificationCode, newEmail }),
    });

    const result = await response.json();
    console.log(result);
    return result;
}

const passwordReset = async (email) => {
    try {
        const response = await fetch(`${backendUrl}/api/auth/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),  // Si tu envoies le mot de passe, assure-toi que c'est sécurisé
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la réinitialisation sur le serveur');
        }

        console.log('Mot de passe réinitialisé sur le serveur');
    } catch (error) {
        console.error('Réinitialisation échouée: ', error);
    }
};

const updateUserPassword = async (email, newPassword) => {
    const response = await fetch(`${backendUrl}/api/auth/update-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword }),
    });

    const result = await response.json();
    console.log(result);
    return result;
};

const checkCode = async (email, code) => {

    try {
        const response = await fetch(`${backendUrl}/api/auth/verify-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, code }),
        });

        if (!response.ok) {
            // Si le statut de la réponse n'est pas "OK", retourne un objet avec un message d'erreur
            const errorData = await response.json();
            return { error: errorData.message || 'Erreur lors de la vérification du code' };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la requête vers le serveur :', error);
        throw error;
    }
};

// Delete a User
const deleteUser = async (userID) => {
    try {
        const response = await fetch(`${backendUrl}/api/auth/delete-user`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userID }),
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

const validateDevice = async (deviceID, verificationToken) => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('Utilisateur non connecté');
    }

    const idToken = await user.getIdToken();

    const response = await fetch(`${backendUrl}/api/auth/verify-device/${deviceID}/${verificationToken}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Erreur de validation : ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log(result);

    return result;
};

const refuseDevice = async (deviceID, verificationToken) => {
    const user = auth.currentUser;
    const idToken = await user.getIdToken();
    // Envoyer une requête POST à ton serveur pour refuser l'appareil
    const response = await fetch(`${backendUrl}/api/auth/decline-device/${deviceID}/${verificationToken}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
    });

    const result = await response.json();
    console.log(result);
    return result;
};


export { 
    checkCode,
    createUser,
    deleteUser,
    logoutUser,
    passwordReset,
    refuseDevice,
    sendVerificationCode,
    signinUser,
    updateUserPassword,
    validateDevice,
    verifyCodeAndUpdateEmail 
};