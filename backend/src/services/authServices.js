const express = require('express');
const router = express.Router();
const { firestore, admin, auth } = require('../config/firebase-admin');
const { createUser } = require("../firebase/auth");
const { sendWelcomeEmail, sendNewDeviceAlert } = require('../controllers/emailController');
const { verifyToken, signinUser } = require('../controllers/userController');
const { handleDeviceVerification } = require('../func');


// Route pour créer un utilisateur
router.post('/create/user', async (req, res) => {
    const { email, password, firstName, lastName, phoneNumber, displayName, country, city, address } = req.body;

    try {
        const newUser = await createUser(email, password, lastName, firstName, phoneNumber, displayName, country, city, address
        );
        res.status(200).json({
            success: true,
            message: 'Utilisateur créé avec succès',
            user: newUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: 'Erreur lors de la création de l\'utilisateur'
        });
    }
});


// Route pour désactiver une utilisateur
router.post('/disable/user/:userID', async (req, res) => {
    const { userID } = req.params;

    try {
        await admin.auth().updateUser(userID, {
            disabled: true,
        });
        console.log(`Utilisateur désactivé avec succès`);
        res.status(200).send('Utilisateur désactivé avec succès');
    } catch (error) {
        console.error("Erreur lors de la désactivation de l'utilisateur:", error);
        res.status(500).send({ message: "Erreur lors de la désactivation de l'utilisateur:", error: error.message });
    }
});



// Route pour connecter un utlisateur
router.post('/signin', async (req, res) => {
    const { email } = req.body;

    try {
        const result = await signinUser(email);

        if (result) {
            res.status(200).json({ message: 'Connexion réussie' });
        } else {
            res.status(400).json({ message: 'Erreur lors de la connexion' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la connexion', error: error.message });
    }
});



// Route pour vérifier le Token d'un utilisateur
router.post('/verify/user-token', verifyToken, async (req, res) => {
    try {
        const user = req.user;
        const { deviceInfo } = req.body;

        if (!user || !user.uid) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non authentifié',
            });
        }

        if (user.disabled) {
            return res.status(403).json({
                success: false,
                message: 'Compte désactivé',
            });
        }

        // Validation de deviceInfo
        if (!deviceInfo?.browser?.name || !deviceInfo?.os?.name || !deviceInfo?.ipAddress) {
            return res.status(400).json({
                success: false,
                message: 'Informations du périphérique manquantes ou invalides',
            });
        }

        const userID = user.uid;
        const userDoc = await admin.firestore().collection('USERS').doc(userID).get();

        if (!userDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur introuvable',
            });
        }

        const userData = userDoc.data();
        const { email, displayName, loginCount = 0, role } = userData;

        // Si c'est la première connexion
        if (loginCount === 0) {
            // Stocker l'appareil comme "de confiance"
            await admin.firestore()
                .collection('USERS')
                .doc(userID)
                .collection('DEVICES')
                .add({
                    browser: deviceInfo.browser,
                    os: deviceInfo.os,
                    device: deviceInfo.device,
                    ipAddress: deviceInfo.ipAddress,
                    isTrusted: true,
                    lastUsed: admin.firestore.FieldValue.serverTimestamp(),
                });

            // Envoyer un email de bienvenue
            await sendWelcomeEmail(email, displayName);

            // Mettre à jour loginCount
            await admin.firestore().collection('USERS').doc(userID).update({
                loginCount: 1,
                lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            return res.status(200).json({
                success: true,
                message: 'Bienvenue sur votre compte',
                user: { email, displayName, role },
            });
        }

        // Vérification des appareils connus pour les connexions suivantes
        const deviceSnapshot = await admin.firestore()
            .collection('USERS')
            .doc(userID)
            .collection('DEVICES')
            .where('browser.name', '==', deviceInfo.browser.name)
            .where('os.name', '==', deviceInfo.os.name)
            .where('device', '==', deviceInfo.device)
            .where('ipAddress', '==', deviceInfo.ipAddress)
            .get();

        if (deviceSnapshot.empty) {
            // Appareil inconnu détecté
            const deviceID = admin.firestore().collection('USERS').doc().id;

            // Désactiver l'utilisateur immédiatement
            await admin.auth().updateUser(userID, { disabled: true });

            // Envoyer une alerte pour l'appareil inconnu
            await sendNewDeviceAlert(email, displayName, deviceInfo, deviceID);

            console.log('Appareil inconnu détecté');
            return res.status(401).json({
                success: false,
                message: 'Votre compte a été désactivé en raison d’un appareil inconnu détecté.',
                actionRequired: 'Vérifiez vos emails pour autoriser ou refuser cet appareil.',
            });
        }

        // Si l'appareil est connu, mettre à jour la dernière utilisation
        const deviceRef = deviceSnapshot.docs[0].ref;
        await deviceRef.update({ lastUsed: admin.firestore.FieldValue.serverTimestamp() });

        // Mettre à jour loginCount et lastLoginAt
        await admin.firestore().collection('USERS').doc(userID).update({
            loginCount: admin.firestore.FieldValue.increment(1),
            lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        return res.status(200).json({
            success: true,
            message: 'Connexion réussie',
            user: { email, displayName, role },
        });
    } catch (error) {
        console.error('Erreur lors de la vérification du jeton utilisateur :', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur',
        });
    }
});


// Route pour autoriser un appareil
router.post('/verify-device/:deviceID/:verificationToken', verifyToken, async (req, res) => {
    try {
        const { deviceID, verificationToken } = req.params;
        const user = req.user;

        if (!user || !user.uid) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non authentifié',
            });
        }

        const userID = user.uid;
        const userDoc = await admin.firestore().collection('USERS').doc(userID).get();

        if (!userDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur introuvable',
            });
        }

        const tokenDoc = await admin.firestore().collection('DEVICE_VERIFY_TOKENS').doc(deviceID).get();
        if (!tokenDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'Token de vérification introuvable',
            });
        }

        const tokenData = tokenDoc.data();
        if (tokenData.token !== verificationToken) {
            return res.status(400).json({
                success: false,
                message: 'Token de vérification invalide',
            });
        }

        if (tokenData.expiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Token de vérification expiré',
            });
        }

        // Désactiver le compte utilisateur
        await admin.auth().updateUser(userID, { disabled: true });

        // Approuver l'appareil
        await admin.firestore()
            .collection('USERS')
            .doc(userID)
            .collection('DEVICES')
            .doc(deviceID)
            .update({ isTrusted: true });

        // Marquer le token comme utilisé
        await tokenDoc.ref.update({ used: true });

        res.status(200).json({
            success: true,
            message: 'Appareil approuvé avec succès',
        });
    } catch (error) {
        console.error('Erreur lors de la vérification du jeton utilisateur :', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur',
        });
    }
});


// Route pour refuser un appareil
router.post('/decline-device/:deviceID/:verificationToken', verifyToken, async (req, res) => {
    try {
        const { deviceID, verificationToken } = req.params;
        const user = req.user;

        if (!user || !user.uid) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non authentifié',
            });
        }

        const userID = user.uid;
        const userDoc = await admin.firestore().collection('USERS').doc(userID).get();

        if (!userDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur introuvable',
            });
        }

        const tokenDoc = await admin.firestore().collection('DEVICE_VERIFY_TOKENS').doc(deviceID).get();
        if (!tokenDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'Token de vérification introuvable',
            });
        }

        const tokenData = tokenDoc.data();
        if (tokenData.token !== verificationToken) {
            return res.status(400).json({
                success: false,
                message: 'Token de vérification invalide',
            });
        }

        if (tokenData.expiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Token de vérification expiré',
            });
        }

        // Désactiver le compte utilisateur
        await admin.auth().updateUser(userID, { disabled: true });

        // Marquer le token comme utilisé
        await tokenDoc.ref.update({ used: true });

        res.status(200).json({
            success: true,
            message: 'Appareil rejeté. Compte sécurisé.',
        });
    } catch (error) {
        console.error('Erreur lors de la vérification du jeton utilisateur :', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur',
        });
    }
})
    



// Route pour activer une utilisateur
router.post('/enable/user/:userID', async (req, res) => {
    const { userID } = req.params;

    try {
        await admin.auth().updateUser(userID, {
            disabled: false,
        });
        console.log(`Utilisateur activé avec succès`);
        res.status(200).send('Utilisateur activé avec succès');
    } catch (error) {
        console.error("Erreur lors de la activation de l'utilisateur:", error);
        res.status(500).send({ message: "Erreur lors de la activation de l'utilisateur:", error: error.message });
    }
});



// Route pour déconnecter
router.post('/logout/user', verifyToken, async (req, res) => {
    const user = req.user;
    const userID = user.uid;

    if (!userID) {
        return res.status(400).json({
            success: false,
            message: 'ID de l\'utilisateur manquant'
        });
    }

    try {
        const userRef = firestore.collection('USERS').doc(userID);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        await userRef.update({
            lastLogoutAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        await auth.revokeRefreshTokens(userID);
        console.log(`Déconnexion réussie pour l'utilisateur ${userID}`);

        res.status(200).json({
            success: true,
            message: 'Déconnexion réussie'
        });
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la déconnexion',
            error: error.message
        });
    }
});




module.exports = router;