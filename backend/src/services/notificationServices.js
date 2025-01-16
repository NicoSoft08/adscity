const express = require('express');
const router = express.Router();
const { firestore } = require('../config/firebase-admin');
const { markNotificationAsRead } = require('../firebase/firestore');

router.get('/all', async (req, res) => {

    try {
        const snapshot = await firestore.collection('NOTIFICATIONS').get();
        const notifications = [];
        snapshot.forEach((doc) => {
            notifications.push({
                id: doc.id,
                ...doc.data(),
            });
        });
        return res.status(200).json({
            success: true,
            message: 'Notifications récupérées avec succès',
            notifications: notifications,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des notifications',
        });
    }
});


router.patch('/:notificationID/read', async (req, res) => {
    const { notificationID } = req.params;

    try {
        await markNotificationAsRead(notificationID);

        res.status(200).json({ message: 'Notification marquée comme lue.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;