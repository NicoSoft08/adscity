const express = require('express');
const router = express.Router();
const { admin, firestore } = require("../config/firebase-admin");
const { verifyCode } = require('../controllers/emailController');
const { updateUserByField } = require('../firebase/firestore');


// Update Interaction
router.post('/update/interaction', async (req, res) => {
    const { adID, userID, category } = req.body;

    if (!adID || !userID) {
        return res.status(400).json({
            success: false,
            message: "Identifiants requis"
        });
    }

    try {
        const adRef = firestore.collection('POSTS').doc(adID);
        const userRef = firestore.collection('USERS').doc(userID);

        const adData = adDoc.data();
        const userData = userDoc.data();

        // Vérifier si l'utilisateur a déjà vu l'annonce
        const hasAlreadyViewed = adData.interactedUsers?.includes(userID);

        if (!hasAlreadyViewed) {
            // Ajouter l'utilisateur à la liste des utilisateurs ayant vu l'annonce
            const uniqueInteractedUsers = new Set([
                ...(adData.interactedUsers || []),
                userID
            ]);

            await adRef.update({
                clicks: admin.firestore.FieldValue.increment(1),
                views: admin.firestore.FieldValue.increment(1),
                interactedUsers: Array.from(uniqueInteractedUsers)
            });
        }

        // Ajouter l'annonce à la liste des annonces vues par l'utilisateur
        const uniqueViewedIDs = new Set([
            ...(userData.adsViewed || []),
            adID
        ]);

        await userRef.update({
            totalAdsViewed: admin.firestore.FieldValue.increment(1),
            adsViewed: Array.from(uniqueViewedIDs),
            categoriesViewed: admin.firestore.FieldValue.arrayUnion(category)
        });

        return res.status(200).json({
            success: true,
            message: "Interaction enregistrée"
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour des interactions:', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour des interactions'
        });
    }
});



// Route pour mettre à jour Contact Click
router.post('/update/contact-click', async (req, res) => {
    const { userID } = req.body;

    if (!userID) {
        return res.status(400).json({
            success: false,
            message: "Identifiant requis"
        });
    }

    try {
        const userRef = firestore.collection('USERS').doc(userID);

        await userRef.update({
            profileViewed: admin.firestore.FieldValue.increment(1),
        });
        return res.status(200).json({
            success: true,
            message: "Contact Click enregistré"
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour des interactions:', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour des interactions'
        });

    }
});


// Route pour valider le Code de vérification
router.post('/verify/code', async (req, res) => {
    const { email, code } = req.body;

    try {
        const result = await verifyCode(email, code);

        if (result) {
            res.status(200).json({
                success: true,
                message: 'Code vérifié avec succès'
            });
            return;
        }

        res.status(400).json({
            success: false,
            message: 'Code incorrect ou expiré'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur interne lors de la vérification du code',
            error: error.message
        });
    }
});


// Route pour mettre à jour les champs d'un utilisateur
router.put('/update/user/:userID/:field', async (req, res) => {
    const { userID, field } = req.params;
    const { value } = req.body;

    try {
        const result = updateUserByField(userID, field, value)

        if (result) {
            res.status(200).json({ message: 'Mise à jour réussie' });
        } else {
            res.status(400).json({ message: 'Mise à jour a échouée' });
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour' });
    }
});



// Route pour vérifier le status de l'utilisateur
router.get('/check/:userID/free-trial-status', async (req, res) => {
    const { userID } = req.params;

    try {
        const userDoc = await firestore.collection('USERS').doc(userID).get();

        if (!userDoc.exists) {
            console.log(`Utilisateur avec l'ID ${userID} non trouvé.`);
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        const currentDate = new Date();
        const userData = userDoc.data();
        if (userData.freeTrial && userData.freeTrial.isActive) {
            const endDate = new Date(userData.freeTrial.endDate.seconds * 1000); // Conversion du timestamp Firestore en date JavaScript

            // Vérifier si l'essai est toujours actif
            const isFreeTrialActive = currentDate < endDate;

            // Retourner le statut de la période d'essai
            return res.status(200).json({ isFreeTrialActive });
        } else {
            // Si l'utilisateur n'a pas d'essai gratuit ou si ce n'est plus actif
            return res.status(200).json({ isFreeTrialActive: false });
        }
    } catch (error) {
        console.error('Erreur lors de la vérification de la période d\'essai:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});


router.get('/search-results', async (req, res) => {
    const { query } = req.query;
    const searchTerms = query.toLowerCase().split(' ');

    // Vérifier si la requête de recherche est présente
    if (!query) {
        return res.status(400).json({ 
            error: 'La requête de recherche est requise' 
        });
    }

    // Effectuer la recherche dans Firestore
    const searchResults = await firestore
        .collection('POSTS')
        .where('searchableTerms', 'array-contains-any', searchTerms)
        .limit(10)
        .get();

    const results = [];
    searchResults.forEach(doc => {
        results.push({
            id: doc.id,
            ...doc.data()
        });
    });

    res.json(results);
});


// Route pour signaler une annonce
router.post('/report/ad', async (req, res) => {
    const { adID, userID, reason } = req.body;

    if (!adID || !userID || !reason) {
        return res.status(400).json({
            success: false,
            message: 'Tous les champs sont requis'
        });
    }

    const userRef = firestore.collection('USERS').doc(userID);
    const adRef = firestore.collection('POSTS').doc(adID);

    try {
        const userDoc = await userRef.get();
        const adDoc = await adRef.get();

        if (!userDoc.exists || !adDoc.exists) {
            return res.status(404).json({ 
                successs: false,
                message: 'Utilisateur ou annonce non trouvé' 
            });
        }

        // Rechercher un rapport existant pour cet utilisateur et cette annonce
        const existingReportQuery = await firestore
            .collection('REPORTS')
            .where('adID', '==', adID)
            .where('userID', '==', userID)
            .get();

        // Si un rapport existe, refuser l'opération
        if (!existingReportQuery.empty) {
            res.status(400).send({ 
                success: false, 
                message: "Vous avez déjà signalé cette annonce." 
            });
        }

        await firestore.collection('REPORTS').add({
            adID,
            userID,
            reason,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        await adRef.update({
            reportCount: admin.firestore.FieldValue.increment(1)
        });

        res.status(200).json({
            success: true,
            message: 'Signalement enregistré avec succès'
        });
    } catch (error) {
        console.error('Erreur lors du signalement:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors du signalement'
        });
    }
});



module.exports = router;
