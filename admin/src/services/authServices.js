import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const addNewAdmin = async (adminData) => {
    const response = await fetch(`${backendUrl}/api/auth/add-new-admin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminData),
    });
    const result = await response.json();
    return result;
}

const signinUser = async (email, password) => {
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
        });


        const result = await response.json();
        return result;
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


export {
    addNewAdmin,
    signinUser,
    logoutUser,
    deleteUser,
    updateUserPassword,
    sendVerificationCode,
    verifyCodeAndUpdateEmail,
};