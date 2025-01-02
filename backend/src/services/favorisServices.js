const express = require('express');
const router = express.Router();
const { onToggleFavorite } = require("../controllers/adIdController");
const { getUserData } = require('../controllers/userController');
const { firestore } = require('../config/firebase-admin');



// Route pour mettre à jour User's AdsSaved
router.post('/toggle', async (req, res) => {
    const { adID, userID } = req.body;

    if (!adID || !userID) {
        return res.status(400).json({
            success: false,
            message: 'Identifiants requis',
        });
    }

    try {
        const status = await onToggleFavorite(adID, userID);

        return res.status(200).json({
            success: true,
            message: 'Statut des favoris mis à jour',
            isFavorite: status // Renvoie l'état actuel (ajouté ou retiré)
        });
    } catch (error) {
        console.error('Erreur favoris:', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour des favoris',
        });
    }
});


// Route pour récupérer les favoris d'un utilisateur
router.get('/users/:userID', async (req, res) => {
    const { userID } = req.params;

    if (!userID) {
        return res.status(400).json({
            success: false,
            message: 'Identifiant requis',
        });
    }

    try {
        // Charger les données utilisateur
        const userDoc = await firestore.collection('USERS').doc(userID).get();
        if (!userDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé',
            });
        }

        const userData = userDoc.data();
        const adsSaved = userData.adsSaved || [];

        // Charger les annonces favorites en fonction de leurs IDs
        const adsPromises = adsSaved.map(async (adID) => {
            const adDoc = await firestore.collection('POSTS').doc(adID).get();
            if (!adDoc.exists) {
                console.warn(`Annonce avec l'ID ${adID} non trouvée.`);
                return null; // Annonce non trouvée
            }
            return { id: adID, ...adDoc.data() };
        });

        // Attendre que toutes les annonces soient récupérées
        const favorisData = (await Promise.all(adsPromises)).filter((ad) => ad !== null);

        return res.status(200).json({
            success: true,
            message: 'Favoris récupérés avec succès',
            favorisData: favorisData,
        });
    } catch (error) {
        console.error('Erreur favoris:', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur',
        });
    }
});



module.exports = router;