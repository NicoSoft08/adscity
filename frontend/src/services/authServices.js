import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const createUser = async (address, city, country, email, password, firstName, lastName, phoneNumber, displayName) => {
    // Envoyer une requête POST à ton serveur pour enregistrer l'utilisateur
    const response = await fetch(`${backendUrl}/api/auth/create/user`, {
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

    const result = await response.json();

    return result;
};


const getCurrentUser = () => {
    const user = auth.currentUser;

    if (user) {
        // Si l'utilisateur est connecté, retourne ses informations
        return {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            // Ajoutez d'autres propriétés que vous voulez utiliser
        };
    } else {
        // Si aucun utilisateur n'est connecté, retourne null
        return null;
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


const checkEmailAvailability = async (email) => {
    const response = await fetch(`${backendUrl}/api/auth/check-email-availability`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });
    const result = await response.json();
    return result;
};



const signinUser = async (email, password) => {
    // User authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
        throw new Error('Veuillez vérifier votre email avant de continuer.');
    }

    // Token verification with device info
    const idToken = await user.getIdToken();
    const response = await fetch(`${backendUrl}/api/auth/verify/user-token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Echec de vérification depuis le serveur.');
    }

    const verificationResult = await response.json();

    return verificationResult;
};


const updateUserPassword = async (userID, newPassword) => {
    const response = await fetch(`${backendUrl}/api/auth/update-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID, newPassword }),
    });

    const result = await response.json();
    console.log(result);
    return result;
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



const logoutUser = async () => {
    const user = auth.currentUser;

    // Token verification with device info
    const idToken = await user.getIdToken(true);

    const response = await fetch(`${backendUrl}/api/auth/logout/user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
    });

    const result = await response.json();
    return result;
};


export {
    createUser,
    checkEmailAvailability,
    getCurrentUser,
    logoutUser,
    passwordReset,
    signinUser,
    validateDevice,
    refuseDevice,
    updateUserPassword,
    sendVerificationCode,
    verifyCodeAndUpdateEmail
};

