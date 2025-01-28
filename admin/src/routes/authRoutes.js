import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const addNewAdmin = async (firstName, lastName, email, phoneNumber, password, permissions) => {
    const response = await fetch(`${backendUrl}/api/auth/new-admin/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, phoneNumber, password, permissions }),
    });
    const result = await response.json();
    return result;
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

export { 
    addNewAdmin,
    deleteUser,
    logoutUser,
    sendVerificationCode,
    signinUser,
    updateUserPassword,
    verifyCodeAndUpdateEmail 
};