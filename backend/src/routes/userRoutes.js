const express = require('express');

// Importation des controleurs
const { 
    setUserOnline, 
    getUsersData, 
    getUserData, 
    getUsersOnline, 
    getUsersOffline, 
    modifyUserFields,
    toggleFavorites,
    getUserFavorites,
    getUserNotifications,
    readUserNotification
} = require('../controllers/userController');

const router = express.Router();

// Route liées à l'uttilisateur
router.get('/all', getUsersData);
router.get('/all/online', getUsersOnline);
router.get('/all/offline', getUsersOffline);
router.get('/:userID', getUserData);
router.post('/user/status', setUserOnline);
router.get('/:userID/favorites', getUserFavorites);
router.put('/:userID/profile-fields/update', modifyUserFields);
router.post('/:userID/favorites/add-remove', toggleFavorites);
router.get('/:userID/notifications', getUserNotifications);
router.post('/:userID/notifications/:notificationID/read', readUserNotification);

module.exports = router;