const express = require('express');
const router = express.Router();
const { firestore, admin, auth } = require('../config/firebase-admin');
const { createUser } = require("../firebase/auth");
const { sendWelcomeEmail, sendNewDeviceAlert } = require('../controllers/emailController');
const { verifyToken, signinUser } = require('../controllers/userController');


// Route pour créer un utilisateur
router.post('/create/user', async (req, res) => {
    const { email, password, firstName, lastName, phoneNumber, displayName, country, city, address, deviceInfo } = req.body;
    console.log(deviceInfo)
    try {
        const newUser = await createUser(email, password, lastName, firstName, phoneNumber, displayName, country, city, address, deviceInfo
        );
        res.status(200).json({ message: 'Utilisateur créé avec succès', user: newUser });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
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
        const userID = user.uid;
        const { deviceInfo } = req.body;

        console.log('Device Info:', deviceInfo);

        const userRef = firestore.collection('USERS').doc(userID);
        const userDoc = await userRef.get();
        const userData = userDoc.data();
        const { displayName, email, role, loginCount } = userData;

        const deviceExist = await firestore
            .collection('USERS')
            .doc(userID)
            .collection('DEVICES')
            .where('browser', '==', deviceInfo.browser)
            .where('os', '==', deviceInfo.os)
            .where('ipAddress', '==', deviceInfo.ipAddress)
            .get();

        if (!deviceExist.empty) {
            await sendNewDeviceAlert(userID, email, displayName, deviceInfo, deviceExist.docs[0].id);

            return res.status(400).json({
                success: false,
                message: 'Vous êtes déjà connecté sur un autre appareil'
            });

        } else {
            await firestore
                .collection('USERS')
                .doc(userID)
                .collection('DEVICES')
                .add({
                    ...deviceInfo,
                    lastLogin: admin.firestore.FieldValue.serverTimestamp()
                });
            res.status(200).json({
                success: true,
                message: 'Device successfully added'
            })
        }

        await userRef.update({
            loginCount: userData.loginCount + 1,
            lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        if (loginCount === 1) {
            await sendWelcomeEmail(email, displayName);
        }

        return res.status(200).json({
            success: true,
            message: 'Token vérifié avec succès',
            role: role,
        });
    } catch (error) {
        console.error('User verification error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

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
