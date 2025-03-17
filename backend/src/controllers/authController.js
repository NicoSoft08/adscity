const { createUser, signinUser, logoutUser, deletionUser, verifyCode, updatePassword, addNewAdmin, authorizeDevice, desableDevice } = require("../firebase/auth");
const { checkIfPhoneNumberExists } = require("../func");
const { getFirebaseErrorMessage } = require("../utils/firebaseErrorHandler");


const registerUser = async (req, res) => {
    const { address, city, country, email, password, firstName, lastName, phoneNumber, displayName } = req.body;

    const phoneAlreadyExists = await checkIfPhoneNumberExists(phoneNumber);
    if (phoneAlreadyExists) {
        return res.status(400).json({
            success: false,
            message: 'Le numéro de téléphone est déjà associé à un compte. Veuillez vous connecter ou utiliser un autre numéro de téléphone.'
        });
    }

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

    if (!userID) {
        return res.status(400).json({
            success: false,
            message: "Données incomplètes. Veuillez fournir l'identifiant.",
        });
    }

    try {
        const signInResult = await signinUser(userID, deviceInfo);

        if (!signInResult.success) {
            return res.status(400).json({
                success: false,
                message: signInResult.message || "Échec de la connexion.",
            });
        }

        res.status(200).json({
            success: true,
            message: signInResult.message,
            role: signInResult.role,
        });

    } catch (error) {
        console.error('❌ Erreur lors de la connexion de l\'utilisateur :', error);

        return res.status(500).json({
            success: false,
            message: 'Erreur technique, réessayez plus tard.',
        });
    }
};

const loginAdmin = async (req, res) => { 
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
        console.error('Erreur lors de la connexion de l\'administrateur :', error);
        return res.status(500).json({
            success: false,
            error: errorMessage,
            message: 'Erreur technique, réessayez plus tard.'
        });
    };
};

const signoutUser = async (req, res) => {
    const { userID } = req.user;
    try {
        if (!userID) {
            return res.status(401).json({
                success: false,
                message: "Utilisateur non authentifié.",
            });
        }

        console.log(`🟡 Tentative de déconnexion pour : ${userID}`);

        const isSignedOut = await logoutUser(userID);
        console.log(`🔹 isSignedOut: ${isSignedOut}`); // Voir la valeur retournée

        if (!isSignedOut) {
            console.error(`❌ Erreur lors de la déconnexion de ${userID}`);
            return res.status(400).json({
                success: false,
                message: "Erreur lors de la déconnexion ou utilisateur introuvable.",
            });
        }

        console.log(`✅ Réponse envoyée : Déconnexion réussie`);
        res.status(200).json({
            success: true,
            message: "Déconnexion réussie. À bientôt !",
        });

    } catch (error) {
        console.error("❌ Erreur dans `signoutUser` :", error.message);
        return res.status(500).json({
            success: false,
            message: "Erreur technique, réessayez plus tard.",
            error: error.message,
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
    const { userID } = req.user;

    try {
        const isDeviceValidated = await authorizeDevice(deviceID, verificationToken, userID);
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
    const { userID } = req.user;

    try {
        const isDeviceRefused = await desableDevice(deviceID, verificationToken, userID);
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
    loginAdmin,
    loginUser,
    signoutUser,
    deleteUser,
    refuseDevice,
    validateDevice,
    verifyOTPCode,
};