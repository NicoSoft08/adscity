import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { collectDeviceInfo } from "../services/apiServices";

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

        // 🔹 Vérifier si l'utilisateur est vérifié
        if (!user.emailVerified) {
            return { 
                success: false, 
                message: "Votre adresse email n'est pas vérifiée. Veuillez vérifier votre boîte de réception." 
            };
        }

        // 🔹 Récupérer le jeton Firebase
        const idToken = await user.getIdToken();

        // 🔹 Récupérer les informations sur le périphérique
        const deviceInfo = await collectDeviceInfo();
        
        // 🔹 Envoyer les données au backend
        const response = await fetch(`${backendUrl}/api/auth/login-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({ userID: user.uid, deviceInfo }),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de la connexion de l\'utilisateur :', error);
        throw error;
    };
};

const logoutUser = async () => {
    try {
        const user = auth.currentUser;

        const idToken = await user.getIdToken();

        const response = await fetch(`${backendUrl}/api/auth/logout-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
        });

        const result = await response.json();

        // 🔹 Déconnexion locale après validation côté serveur
        await signOut(auth);

        console.log(result);

        return { success: true, message: result.message || "Déconnexion réussie." };

    } catch (error) {
        console.error('❌ Erreur lors de la déconnexion :', error.message);
        return { success: false, message: error.message || "Une erreur est survenue." };
    }
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
    // console.log(result);
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
        throw error;
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
    // console.log(result);
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


        const result = await response.json();
        // console.log(data.message); 
        return result;
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

    const response = await fetch(`${backendUrl}/api/auth/verify-device/${deviceID}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ verificationToken }),
    });

    if (!response.ok) {
        throw new Error(`Erreur de validation : ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
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
    // console.log(result);
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