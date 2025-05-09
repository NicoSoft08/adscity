import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { collectDeviceInfo } from "../services/apiServices";

const backendUrl = process.env.REACT_APP_BACKEND_URL;
    

const addNewAdmin = async (displayName, firstName, lastName, email, phoneNumber, password, permissions, address, city, country, captchaToken, idToken) => {
    const response = await fetch(`${backendUrl}/api/auth/new-admin/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ displayName, firstName, lastName, email, phoneNumber, password, permissions, address, city, country, captchaToken }),
    });
    const result = await response.json();
    return result;
};

const signinUser = async (email, password, captchaToken) => {
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
            body: JSON.stringify({ userID: user.uid, deviceInfo, captchaToken }),
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

        return { success: true, message: result.message || "Déconnexion réussie." };

    } catch (error) {
        throw error;
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

        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
};

const disableUser = async (userID) => {
    try {
        const response = await fetch(`${backendUrl}/api/auth/disable-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userID }),
        });
        const result = await response.json();
        return result;

    } catch (error) {
        throw error;
    }
};

const restoreUser = async (userID) => {
    try {
        const response = await fetch(`${backendUrl}/api/auth/restore-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userID }),
        });
        const result = await response.json();
        console.log(result);
        return result;
    } catch (error) {
        throw error;
    }
};

export {
    addNewAdmin,
    disableUser,
    restoreUser,
    deleteUser,
    logoutUser,
    sendVerificationCode,
    signinUser,
    updateUserPassword,
    verifyCodeAndUpdateEmail
};