const express = require('express');

// Importation des controleurs
const { 
    setUserOnline, 
    getUsersData, 
    getUserData, 
    modifyUserFields,
    toggleFavorites,
    getUserFavorites,
    getUserNotifications,
    readUserNotification,
    updateDeviceToken,
    getAllUsersWithStatus,
    fetchInterlocutorProfile,
    getUserUnreadNotifications,
    getDataFromUserID,
    updateSearchHistory,
    getAnyUserData
} = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Route liées à l'uttilisateur
router.get('/all', getUsersData);
router.get('/all/status', getAllUsersWithStatus);
router.get('/:userID', getUserData);
router.get('/user/:user_id', getDataFromUserID);
router.get('/user/:userID', getAnyUserData);
// router.get('/:interlocutorID', fetchInterlocutorProfile);
router.post('/user/status', setUserOnline);
router.get('/:userID/favorites', getUserFavorites);
router.put('/:userID/profile-fields/update', modifyUserFields);
router.post('/:userID/favorites/add-remove', toggleFavorites);
router.get('/:userID/notifications', getUserNotifications);
router.get('/:userID/notifications/unread', getUserUnreadNotifications);
router.post('/:userID/notifications/:notificationID/read', readUserNotification);
router.post('/update-device-token', verifyToken, updateDeviceToken);
router.post('/:userID/update-search-history', updateSearchHistory);

module.exports = router;