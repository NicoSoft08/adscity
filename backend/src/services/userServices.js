const express = require('express');
const router = express.Router();
const { firestore, admin } = require("../config/firebase-admin");


// Route pour récupérer tous les utilisateurs
router.get('/all', async (req, res) => {
    try {
        // Utilisation correcte de Firebase Admin SDK
        const adsCollection = firestore.collection('USERS').orderBy('createdAt', 'desc');

        const querySnapshot = await adsCollection.get();

        const allUsers = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.status(200).json(allUsers);
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs.' });
    }
});


// Route pour récupérer tous les utilisateurs en ligne
router.get('/online', async (req, res) => {
    try {
        // Utilisation correcte de Firebase Admin SDK
        const adsCollection = firestore.collection('USERS');
        const querySnapshot = await adsCollection.where('isOnline', '==', true).get();

        const usersOnline = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.status(200).json(usersOnline);
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs en ligne:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs en ligne.' });
    }
});


// Route pour récupérer tous les utilisateurs offline
router.get('/offline', async (req, res) => {
    try {
        // Utilisation correcte de Firebase Admin SDK
        const adsCollection = firestore.collection('USERS');
        const querySnapshot = await adsCollection.where('isOnline', '==', false).get();

        const usersOffline = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.status(200).json(usersOffline);
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs offline:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs offline.' });
    }
});


// Route pour récupérer les données d'un Utilisateur
router.get('/user/:userID', async (req, res) => {
    const { userID } = req.params;

    try {
        const userDoc = await firestore.collection('USERS').doc(userID).get(); // Récupération du document utilisateur

        if (!userDoc.exists) {
            return res.status(404).json({ 
                success: false,
                message: 'Utilisateur non trouvé.'
            });
        }

        const userData = userDoc.data();
        res.status(200).json(userData);
    } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
        res.status(500).json({ 
            success: false,
            message: 'Erreur lors de la récupération des données utilisateur.' 
        });
    }
});




router.get('/auth/verify-device/:deviceId/:token', async (req, res) => {
    const { deviceId, token } = req.params;
    
    const tokenDoc = await admin.firestore()
        .collection('DEVICE_VERIFY_TOKENS')
        .doc(deviceId)
        .get();

    if (!tokenDoc.exists || tokenDoc.data().token !== token) {
        return res.status(400).json({
            success: false,
            message: 'Token invalide'
        });
    }

    if (tokenDoc.data().used || tokenDoc.data().expiresAt.toDate() < new Date()) {
        return res.status(400).json({
            success: false,
            message: 'Token expiré ou déjà utilisé'
        });
    }

    await admin.firestore()
        .collection('DEVICE_VERIFY_TOKENS')
        .doc(deviceId)
        .update({
            used: true,
            verifiedAt: admin.firestore.FieldValue.serverTimestamp()
        });

    return res.status(200).json({
        success: true,
        message: 'Appareil vérifié avec succès'
    });
});



router.get('/auth/decline-device/:deviceId/:token', async (req, res) => {
    const { deviceId, token } = req.params;
    
    // Mark device as suspicious and notify security team
    await admin.firestore()
        .collection('SUSPICIOUS_DEVICES')
        .add({
            deviceId,
            reportedAt: admin.firestore.FieldValue.serverTimestamp(),
            status: 'reported'
        });

    return res.status(200).json({
        success: true,
        message: 'Signalement enregistré'
    });
});


// Route pour collecter les résultats d'une recherche
router.get('/search-results', async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'La requête de recherche est vide.' });
    }

    try {
        const adsSnapshot = await firestore.collection('POSTS')
            .where('status', '==', 'approved')
            .where('formData.title', '>=', query)
            .where('formData.title', '<=', query + '\uf8ff') // Recherche "LIKE" en Firestore
            .get();


        const ads = [];
        adsSnapshot.forEach(doc => ads.push(doc.data()));

        if (ads.length === 0) {
            return res.status(404).json({ message: 'Aucun résultat trouvé.' });
        }

        return res.json(ads);
    } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        return res.status(500).json({ error: 'Erreur lors de la recherche.' });
    }
});



module.exports = router;