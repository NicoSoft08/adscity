const { createUser, signinUser, logoutUser, deletionUser, verifyCode, updatePassword, addNewAdmin, authorizeDevice, desableDevice } = require("../firebase/auth");
const { getFirebaseErrorMessage } = require("../utils/firebaseErrorHandler");


const registerUser = async (req, res) => {
    const { address, city, country, email, password, firstName, lastName, phoneNumber, displayName } = req.body;

    try {
        const newUser = await createUser(address, city, country, email, password, firstName, lastName, phoneNumber, displayName);
        if (!newUser) {
            return res.status(400).json({
                success: false,
                message: 'Une erreur est survenue lors de la création de votre compte. Veuillez réessayer plus tard.'
            });
        };

        res.status(200).json({
            success: true,
            message: 'Votre compte a été créé avec succès. Veuillez vérifier votre adresse e-mail pour confirmer votre compte.'
        });
    } catch (error) {
        const errorMessage = getFirebaseErrorMessage(error);
        console.error('Erreur lors de la création de l\'utilisateur :', error);
        return res.status(500).json({
            success: false,
            error: errorMessage,
            message: 'Une erreur est survenue lors de la création de votre compte. Veuillez réessayer plus tard.'
        });
    }
};

const loginUser = async (req, res) => {
    const { userID, deviceInfo } = req.body;
    console.log('Device Info:', deviceInfo);

    try {
        const signInResult = await signinUser(userID, deviceInfo);
        if (!signInResult || !signInResult.success) {
            return res.status(400).json({
                success: false,
                message: signInResult?.message || "Échec de la connexion.",
            });
        }
        res.status(200).json({
            success: signInResult.success,
            message: signInResult.message,
            status: signInResult.status,
        });
    } catch (error) {
        const errorMessage = getFirebaseErrorMessage(error);
        console.error('Erreur lors de la connexion de l\'utilisateur :', error);
        return res.status(500).json({
            success: false,
            error: errorMessage,
            message: 'Erreur technique, réessayez plus tard.'
        });
    }
};

const signoutUser = async (req, res) => {
    const { email } = req.user;

    try {
        const isSignedOut = await logoutUser(email);
        if (!isSignedOut) {
            return res.status(400).json({
                success: false,
                message: 'L\'utilisateur n\'a pas été trouvé ou n\'a pas encore vérifié son email.'
            });
        };

        res.status(200).json({
            success: true,
            message: 'Déconnexion réussie. À bientôt !',
        });
    } catch (error) {
        const errorMessage = getFirebaseErrorMessage(error);
        console.error('Erreur lors de la déconnexion de l\'utilisateur :', error);
        return res.status(500).json({
            success: false,
            error: errorMessage,
            message: 'Erreur technique, réessayez plus tard.'
        });

    }
};

const deleteUser = async (req, res) => {
    const { userID } = req.params;

    try {
        const isDeleted = await deletionUser(userID);
        if (!isDeleted) {
            return res.status(400).json({
                success: false,
                message: 'L\'utilisateur n\'a pas été trouvé ou n\'a pas encore vérifié son email.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Votre compte a été supprimé avec succès.',
        });
    } catch (error) {
        const errorMessage = getFirebaseErrorMessage(error);
        console.error('Erreur lors de la suppression de l\'utilisateur :', error);
        return res.status(500).json({
            success: false,
            error: errorMessage,
            message: 'Erreur technique, réessayez plus tard.'
        });
    }
};

const verifyOTPCode = async (req, res) => {
    const { email, code } = req.body;

    try {
        const isVerified = await verifyCode(email, code);
        if (!isVerified) {
            return res.status(400).json({
                success: false,
                message: 'Code incorrect ou expiré'
            });
        };
        res.status(200).json({
            success: true,
            message: 'Code vérifié avec succès'
        });
    } catch (error) {
        console.error('Erreur lors de la vérification du code OTP :', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur technique, réessayez plus tard.'
        });
    };
};

const changePassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const isChanged = await updatePassword(email, newPassword);
        if (!isChanged) {
            return res.status(400).json({
                success: false,
                message: 'Mot de passe incorrect ou expiré'
            });
        };
        res.status(200).json({
            success: true,
            message: 'Mot de passe modifié avec succès'
        });
    } catch (error) {
        const errorMessage = getFirebaseErrorMessage(error);
        console.error('Erreur lors de la modification du mot de passe :', error);
        return res.status(500).json({
            success: false,
            error: errorMessage,
            message: 'Erreur technique, réessayez plus tard.'
        });
    };
};

const createNewAdmin = async (req, res) => {
    const { firstName, lastName, email, phoneNumber, password, permissions } = req.body;

    try {
        const isAdminCreated = await addNewAdmin(firstName, lastName, email, phoneNumber, password, permissions);
        if (!isAdminCreated) {
            return res.status(400).json({
                success: false,
                message: 'L\'administrateur n\'a pas été créé'
            });
        };
        res.status(200).json({
            success: true,
            message: 'Administrateur créé avec succès'
        });
    } catch (error) {
        const errorMessage = getFirebaseErrorMessage(error);
        console.error('Erreur lors de la création du nouvel administrateur :', error);
        return res.status(500).json({
            success: false,
            error: errorMessage,
            message: 'Erreur technique, réessayez plus tard.'
        });
    };
};

const validateDevice = async (req, res) => {
    const { deviceID } = req.params;
    const { verificationToken } = req.body;

    try {
        const isDeviceValidated = await authorizeDevice(deviceID, verificationToken);
        if (!isDeviceValidated) {
            return res.status(400).json({
                success: false,
                message: 'Le dispositif n\'a pas été validé'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Le dispositif a été validé avec succès'
        });
    } catch (error) {
        const errorMessage = getFirebaseErrorMessage(error);
        console.error('Erreur lors de la validation du dispositif :', error);
        return res.status(500).json({
            success: false,
            error: errorMessage,
            message: 'Erreur technique, réessayez plus tard.'
        });
    };
};

const refuseDevice = async (req, res) => {
    const { deviceID } = req.params;
    const { verificationToken } = req.body;

    try {
        const isDeviceRefused = await desableDevice(deviceID, verificationToken);
        if (!isDeviceRefused) {
            return res.status(400).json({
                success: false,
                message: 'Le dispositif n\'a pas été refusé'
            });
        };
        res.status(200).json({
            success: true,
            message: 'Le dispositif a été refusé avec succès'
        });
    } catch (error) {
        const errorMessage = getFirebaseErrorMessage(error);
        console.error('Erreur lors de la validation du dispositif :', error);
        return res.status(500).json({
            success: false,
            error: errorMessage,
            message: 'Erreur technique, réessayezz plus tard.'
        });
    }
};


module.exports = {
    changePassword,
    createNewAdmin,
    registerUser,
    loginUser,
    signoutUser,
    deleteUser,
    refuseDevice,
    validateDevice,
    verifyOTPCode,
};