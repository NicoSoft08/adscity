const { admin, auth, firestore, messaging } = require("../config/firebase-admin");

const getUserData = async (userID) => {
    try {
        const userRecord = auth.getUser(userID);

        const userDoc = await firestore
            .collection('USERS')
            .doc(userID)
            .get();

        if (userDoc.exists) {
            return {
                ...(await userRecord).toJSON(),
                ...userDoc.data(),
            };
        } else {
            return (await userRecord).toJSON();
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur :", error);
        throw error;
    }
};

const setUserOnlineStatus = async (userID, isOnline) => {
    try {
        await firestore
            .collection('USERS')
            .doc(userID)
            .update({
                isOnline: isOnline,
                lastOnline: admin.firestore.FieldValue.serverTimestamp()
            });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'état en ligne :", error);
    }
};


const saveFcmToken = async (userID, token) => {
    try {
        const userRef = firestore.collection('USERS').doc(userID);
        await userRef.update({ fcmToken: token });
        console.log('Token FCM enregistré avec succès');
        return { success: true };
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement du token FCM', error);
    }
};


const sendUserNotification = async (userID, title, message) => {
    try {
        // Récupère le token FCM de l'utilisateur
        const userRef = firestore.collection('USERS').doc(userID);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            console.log(`Utilisateur ${userID} introuvable.`);
            return;
        }

        const userData = userDoc.data();
        const fcmToken = userData.fcmToken;

        if (!fcmToken) {
            console.log(`Aucun token FCM pour l'utilisateur ${userID}`);
            return;
        }

        // Créer le message de notification
        const messagePayload = {
            notification: {
                title: title,
                body: message,
            },
            token: fcmToken,
        };

        // Envoie la notification via Firebase Cloud Messaging
        const response = await messaging.send(messagePayload);
        console.log('Notification envoyée avec succès:', response);
    } catch (error) {
        console.error('Erreur lors de l\'envoi de la notification:', error);
    }
};


const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token manquant ou invalide' });
        }

        const token = authHeader.split(' ')[1];

        const decodedToken = await auth.verifyIdToken(token);

        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            emailVerified: decodedToken.email_verified,
        };

        next();
    } catch (error) {
        console.error('Erreur lors de la vérification du token:', error);
        return res.status(403).json({ message: 'Accès refusé: token invalide ou expiré' });
    }
};


const signinUser = async (email) => {
    try {
        const user = auth.getUserByEmail(email);

        const userSnapshot = await firestore.collection('USERS')
            .where('email', '==', email)
            .limit(1)  // Limite à un seul résultat
            .get();

        if (userSnapshot.empty) {
            console.log('Aucun utilisateur trouvé avec cet email.');
            return null;
        }

        const userData = userSnapshot.docs[0].data();

        if (!userData.emailVerified) {
            return res.status(400).json({ message: 'Votre email n\'est pas encore vérifié. Veuillez vérifier votre email.' });
        }

        console.log('Connexion réussie', user.uid);
        return userData;
    } catch (error) {
        console.error('Erreur lors de la connexion', error);
    }
};


const updateUserInteraction = async (userID, adID) => {
    try {
        const userRef = firestore.collection('USERS').doc(userID);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            console.log("Utilisateur non trouvé");
            return;
        }

        const userData = userDoc.data();
        const adsClicked = userData.adsClicked || [];

        // Si l'utilisateur a déjà cliqué sur cette annonce, ne pas mettre à jour les compteurs
        if (adsClicked.includes(adID)) {
            console.log("L'utilisateur a déjà cliqué sur cette annonce");
            return;
        }

        // Mise à jour des interactions
        await userRef.update({
            clicksOnAds: admin.firestore.FieldValue.increment(1),
            totalAdsViewed: admin.firestore.FieldValue.increment(1),
            adsClicked: admin.firestore.FieldValue.arrayUnion(adID) // Ajouter l'ID de l'annonce
        });

        console.log("Interaction de l'utilisateur mise à jour");
    } catch (error) {
        console.error("Erreur lors de la mise à jour des interactions utilisateur", error);
    }
};





module.exports = {
    getUserData,
    saveFcmToken,
    setUserOnlineStatus,
    sendUserNotification,
    signinUser,
    verifyToken,
    updateUserInteraction
};