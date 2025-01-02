const express = require('express');
const router = express.Router();
const { firestore, admin } = require("../config/firebase-admin");
const { monthNames } = require('../func');
const { sendUserAdsRefusedEmail, sendUserAdsApprovedEmail } = require('../controllers/emailController');
const { getRelatedAds, getUserInactiveAds, getUserActiveAds, getUserAds } = require('../controllers/adsController');
const { getRefusedAdsByUserID, getApprovedAdsByUserID, getPendingAdsByUserID } = require('../controllers/adIdController');
const { saveLocation } = require('../firebase/firestore');


// Route pour créer une annonce
router.post('/create', async (req, res) => {
    const { adData, userID } = req.body;

    try {
        // Get user data to check limits
        const userRef = firestore.collection('USERS').doc(userID);
        const userDoc = await userRef.get();

        const { location } = adData;


        if (!userDoc.exists) {
            res.status(404).send({
                success: false,
                message: 'Utilisateur non trouvé.'
            });
        }

        const userData = userDoc.data();

        const { isActive, plans, adsPostedThisMonth } = userData;

        // Check if the user is disabled
        if (!isActive) {
            res.status(403).send({
                success: false,
                message: 'Utilisateur inactif. Veuillez contacter le support.'
            });
        }

        // Get user's plan max_ads
        const userPlan = Object.keys(plans).find(plan =>
            plans[plan].max_ads !== undefined
        );
        const maxAds = plans[userPlan].max_ads;

        // Check if the user has reached the maximum number of ads for the current plan
        if (adsPostedThisMonth >= maxAds) {
            console.log('Limite d\'annonces atteinte');
            res.status(403).json({
                success: false,
                message: 'Limite d\'annonces atteinte'
            });
        }

        // Create the ad
        const adRef = await admin.firestore().collection('POSTS').add({
            userID: userID,
            ...adData,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            expiry_date: null,
            views: 0,
            clicks: 0,
            interactedUsers: [],
            contact_clicks: 0,
            favorites: 0,
            shares: 0,
            comments: 0,
            posted_at: admin.firestore.FieldValue.serverTimestamp(),
            updated_at: null,
            isActive: false,
            status: 'pending',
            refusal_reason: null,
            conversion_rate: 0,  // Taux de conversion initial
            engagement_rate: 0,  // Taux d'engagement initial
            report_reason: null,  // Motif de signalement (si applicable)
            reported: false  // Indicateur de signalement
        });

        // Check if month has changed
        const currentMonth = monthNames[new Date().getMonth()];

        if (userData.currentMonth !== currentMonth) {
            // New month: Reset monthly count and update month
            await userRef.update({
                adsCount: admin.firestore.FieldValue.increment(1),
                adsPostedThisMonth: 1,
                currentMonth: currentMonth
            });
        } else {
            // Same month: Increment both counters
            await userRef.update({
                adsCount: admin.firestore.FieldValue.increment(1),
                adsPostedThisMonth: admin.firestore.FieldValue.increment(1)
            });
        }


        // Save location first
        await saveLocation(location.country, location.city);


        // Respond with success
        console.log('Annonce créée avec succès', adRef.id);
        res.status(200).json({
            success: true,
            message: 'Annonce créée avec succès',
            adId: adRef.id
        });
    } catch (error) {
        console.error('Ad Creation Error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur technique, réessayez plus tard'
        });
    }
});


// Route pour approuver une annonce
router.post('/approve', async (req, res) => {
    const {  adID } = req.body;

    
    try {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);

        await firestore.collection('POSTS').doc(adID).update({
            status: 'approved',
            isActive: true,
            moderated_at: admin.firestore.FieldValue.serverTimestamp(),
            expiry_date: expiryDate.toISOString(),
        });

        const adRef = firestore.collection('POSTS').doc(adID);
        const adDoc = await adRef.get();

        if (!adDoc.exists) {
            console.error('Annonce non trouvée.');
            res.status(404).send({ 
                success: false,
                message: 'Annonce non trouvée.' 
            });
        }

        const adData = adDoc.data();
        const { adDetails: { title }, posted_at, userID } = adData;

        const userRef = firestore.collection('USERS').doc(userID);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            console.error('Utilisateur non trouvé.');
            return res.status(404).send({ 
                success: false,
                message: 'Utilisateur non trouvé.' 
            });
        }

        const { displayName, email } = userDoc.data();

        // Enregistrer la notification pour l'utilisateur
        const notification = {
            type: 'ad_approval',
            title: 'Annonce approuvée',
            message: `Votre annonce "${title}" a été approuvée.`,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            isRead: false,
            link: `/ads/${adID}`, // Lien vers l'annonce dans le tableau de bord
        };

        await userRef.collection('NOTIFICATIONS').add(notification);


        await sendUserAdsApprovedEmail(displayName, email, title, posted_at);

        console.log('Annonce approuvée avec succès et expire le :', expiryDate)
        res.status(200).send({ 
            success: true,
            message: 'Annonce approuvée avec succès' 
        });
    } catch (error) {
        console.error('Erreur lors de l\'approbation de l\'annonce :', error);
        res.status(500).send({
            success: false,
            message: 'Erreur technique, réessayez plus tard'
        });
    }
});


// Route pour refuser une annonce
router.post('/refuse', async (req, res) => {
    const { adID, reason } = req.body;

    if (!adID) {
        res.status(400).send({
            success: false,
            message: "Identifiant manquant"
        });
    }

    try {
        await firestore.collection('POSTS').doc(adID).update({
            status: 'refused',
            refusal_reason: reason,
        });

        const adRef = firestore.collection('POSTS').doc(adID);
        const adDoc = await adRef.get();

        if (!adDoc.exists) {
            console.error('Annonce non trouvée.');
            res.status(404).send({
                success: false,
                message: 'Annonce non trouvée.'
            });
        }

        const adData = adDoc.data();
        const { adDetails: { title }, posted_at, userID } = adData;


        const userRef = firestore.collection('USERS').doc(userID);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            console.error('Utilisateur non trouvé.');
            res.status(404).send({
                success: false,
                message: 'Utilisateur non trouvé.'
            });
        }

        const { displayName, email } = userDoc.data();

        // Envoi de l'email de notification à l'utilisateur
        await sendUserAdsRefusedEmail(displayName, email, title, posted_at, reason);
        console.log('Annonce refusée avec succès')
        res.status(200).send({ 
            success: true,
            message: 'Annonce refusée avec succès' 
        });
    } catch (error) {
        console.error('Erreur lors de l\'approbation de l\'annonce :', error);
        res.status(500).send({
            success: false,
            message: 'Erreur technique, réessayez plus tard'
        });
    }
});


// Route pour récupérer toutes les annonces
router.get('/all', async (req, res) => {
    try {
        // Utilisation correcte de Firebase Admin SDK
        const adsCollection = firestore.collection('POSTS');

        const querySnapshot = await adsCollection.get();

        const allAds = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.status(200).json({
            success: true,
            message: 'Annonces récupérées avec succès',
            allAds: allAds
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des annonces:', error);
        res.status(500).json({ 
            success: false,
            message: 'Erreur lors de la récupération des annonces.' 
        });
    }
});


// Route pour récupérer toutes les annonces en attente
router.get('/pending', async (req, res) => {
    try {
        // Utilisation correcte de Firebase Admin SDK
        const adsCollection = firestore.collection('POSTS');
        const querySnapshot = await adsCollection
            .where('status', '==', 'pending')
            .get();

        const pendingAds = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.status(200).json({
            success: true,
            message: 'Annonces en attente récupérées avec succès',
            pendingAds: pendingAds,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des annonces en attente:', error);
        res.status(500).json({ 
            success: false,
            message: 'Erreur lors de la récupération des annonces en attente.' 
        });
    }
});


// Route pour récupérer toutes les annonces approuvées
router.get('/approved', async (req, res) => {
    try {
        // Utilisation correcte de Firebase Admin SDK
        const adsCollection = firestore.collection('POSTS');
        const querySnapshot = await adsCollection
            .where('status', '==', 'approved')
            .orderBy('moderated_at', 'desc') // Orders from newest to oldest
            .get();

        const approvedAds = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.status(200).json({
            success: true,
            message: 'Annonces approuvées récupérées avec succès',
            approvedAds: approvedAds
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des annonces approuvées:', error);
        res.status(500).json({ 
            success: false,
            message: 'Erreur lors de la récupération des annonces approuvées.' 
        });
    }
});


// Route pour récupérer toutes les annonces refusées
router.get('/refused', async (req, res) => {
    try {
        // Utilisation correcte de Firebase Admin SDK
        const adsCollection = firestore.collection('POSTS');
        const querySnapshot = await adsCollection
            .where('status', '==', 'refused')
            .get();

        const refusedAds = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.status(200).json({
            success: true,
            message: 'Annonces refusées récupérées avec succès',
            refusedAds: refusedAds,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des annonces refusées:', error);
        res.status(500).json({ 
            success: false,
            error: 'Erreur lors de la récupération des annonces refusées.' 
        });
    }
});


// Route pour récupérer une annonce avec adID
router.get('/:adID', async (req, res) => {
    const { adID } = req.params;

    if (!adID) {
        return res.status(400).json({
            success: false,
            message: 'ID de l\'annonce manquant.'
        });
    }

    try {
        const adDoc = await firestore.collection('POSTS').doc(adID).get();

        if (!adDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'Annonce non trouvée.'
            });
        }

        const adData = adDoc.data();
        if (adData.status !== 'approved') {
            return res.status(403).json({ 
                success: false,
                message: 'L\'annonce n\'est pas approuvée.' 
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Annonce récupérée avec succès.',
            adData: adData,
        });
    } catch (error) {
        console.error(`Erreur lors de la récupération de l\'annonce avec ${adID}:`, error);
        res.status(500).json({ 
            success: false,
            message: 'Erreur lors de la récupération de l\'annonce.' 
        });
    }
});


// Route pour collecter les annonces d'un utilisateur
router.get('/user/:userID', async (req, res) => {
    const { userID } = req.params;

    try {
        const userAds = await getUserAds(userID);
        res.status(200).json({
            success: true,
            message: 'Annonces récupérées avec succès.',
            userAds: userAds,
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Erreur lors de la récupération des annonces de l\'utilisateur.' 
        });
    }
});


// Route pour collecter les annonces en attente d'un utilisateur
router.get('/user/:userID/pending', async (req, res) => {
    const { userID } = req.params;

    try {
        const pendingAds = await getPendingAdsByUserID(userID); // Appel de la fonction pour récupérer les annonces en attente
        res.status(200).json({
            success: true,
            message: 'Annonces en attente récupérées avec succès.',
            pendingAds: pendingAds,
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Erreur lors de la récupération des annonces en attente de l\'utilisateur.' 
        });
    }
});


// Route pour collecter les annonces approuvées d'un utilisateur
router.get('/user/:userID/approved', async (req, res) => {
    const { userID } = req.params;

    try {
        const approvedAds = await getApprovedAdsByUserID(userID); // Appel de la fonction pour récupérer les annonces en attente
        res.status(200).json({
            success: true,
            message: 'Annonces approuvées récupérées avec succès.',
            approvedAds: approvedAds,
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Erreur lors de la récupération des annonces approuvées de l\'utilisateur.' 
        });
    }
});


// Route pour collecter les annonces refusées d'un utilisateur
router.get('/user/:userID/refused', async (req, res) => {
    const { userID } = req.params;

    try {
        const refusedAds = await getRefusedAdsByUserID(userID); // Appel de la fonction pour récupérer les annonces en attente
        res.status(200).json({
            success: true,
            message: 'Annonces refusées récupérées avec succès.',
            refusedAds: refusedAds,
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Erreur lors de la récupération des annonces refusées de l\'utilisateur.' 
        });
    }
});


// Route pour collecter les annonces actives et approuvées d'un utilisateur
router.get('/user/:userID/active', async (req, res) => {
    const { userID } = req.params;

    if (!userID) {
        res.status(400).json({ 
            success: false,
            message: 'ID utilisateur non fourni.' 
        });
    }

    try {
        const activeApprovedAds = await getUserActiveAds(userID);

        if (!activeApprovedAds || activeApprovedAds.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Aucune annonce active et approuvée trouvée pour cet utilisateur.' 
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Annonces actives et approuvées récupérées avec succès',
            activeApprovedAds: activeApprovedAds
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Erreur lors de la récupération des annonces actives et approuvées' 
        });
    }
});


// Route pour collecter les annonces inactives et approuvées d'un utilisateur
router.get('/user/:userID/outdated', async (req, res) => {
    const { userID } = req.params;

    if (!userID) {
        res.status(400).json({ 
            success: false,
            message: 'ID utilisateur non fourni.' 
        });
    }

    try {
        const inactiveApprovedAds = await getUserInactiveAds(userID);

        if (!inactiveApprovedAds || inactiveApprovedAds.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Aucune annonce inactive et approuvée trouvée pour cet utilisateur.' 
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Annonces inactives et approuvées récupérées avec succès',
            inactiveApprovedAds: inactiveApprovedAds
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Erreur lors de la récupération des annonces inactives et approuvées' 
        });
    }
});


// Route pour collecter les annonces en fonction de categoryName
router.post('/category', async (req, res) => {
    const { categoryName } = req.body;

    if (!categoryName) {
        res.status(400).send({ 
            success: false,
            message: 'Nom de catégorie requis' 
        });
    }

    try {
        const adsSnapshot = admin.firestore().collection('POSTS')
            .where('category', '==', categoryName) // Filtrer par catégorie
            .where('status', '==', 'approved') // Optionnel : ajouter une condition pour ne récupérer que les annonces approuvées
            .where('isActive', '==', true)
            .orderBy('moderated_at', 'desc'); // Orders from newest to oldest


        const adsSnapshotDoc = await adsSnapshot.get();

        if (adsSnapshotDoc.empty) {
            res.status(404).send({ 
                success: false,
                message: 'Aucune annonce trouvée pour cette catégorie' 
            });
        }

        const ads = [];

        adsSnapshotDoc.forEach(doc => {
            ads.push({ id: doc.id, ...doc.data() })
        })


        res.status(200).send({
            success: true,
            message: 'Annonces récupérées avec succès',
            ads: ads
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des annonces:', error);
        res.status(500).send({ 
            success: false,
            message: 'Erreur du serveur lors de la récupération des annonces' 
        });
    }
});


// Route pour collecter les annonces relative à la catégorie de l'actuelle annonce
router.post('/related-category', async (req, res) => {
    const { adID, category } = req.body;
    console.log(adID, category)

    if (!category) {
        res.status(400).json({
            success: false,
            message: 'Catégorie de l\'annonce requise pour la recherche des annonces similaires'
        });
        return;
    }

    try {
        const relatedAds = await getRelatedAds(adID, category);
        res.status(200).json({
            success: true,
            message: 'Annonces similaires récupérées avec succès',
            relatedAds: relatedAds
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des annonces similaires",
        });
    }
});

module.exports = router;