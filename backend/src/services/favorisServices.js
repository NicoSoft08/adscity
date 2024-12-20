const express = require('express');
const router = express.Router();
const { onToggleFavorite } = require("../controllers/adIdController");



// Route pour mettre à jour User's AdsSaved
router.post('/toggle', async (req, res) => {
    const { adID, userID } = req.body;

    if (!adID || !userID) {
        throw new Error('Identifiants requis');
    }

    try {
        await onToggleFavorite(adID, userID);

        return res.status(200).json({
            success: true,
            message: 'Statut des favoris mis à jour'
        });
    } catch (error) {
        console.error('Erreur favoris:', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour des favoris'
        });
    }
});



module.exports = router;