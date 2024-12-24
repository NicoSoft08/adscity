import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

const backendUrl = process.env.REACT_APP_BACKEND_URL;


const signinUser = async (email, password, deviceInfo) => {
    try {
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
            body: JSON.stringify({ deviceInfo })
        });

        if (!response.ok) {
            throw new Error('Echec de vérification depuis le serveur.');
        }

        const verificationResult = await response.json();

        return verificationResult;
    } catch (error) {
        throw new Error(error.message);
    }
};


const logoutUser = async (userID) => {
    const response = await fetch(`${backendUrl}/api/auth/logout/user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID }),
    });

    const result = await response.json();
    return result;
};


const deleteUser = async (userID) => {
    const response = await fetch(`${backendUrl}/api/auth/delete/user`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID }),
    });

    const result = await response.json();
    return result;
}


export {
    signinUser,
    logoutUser,
    deleteUser,
};