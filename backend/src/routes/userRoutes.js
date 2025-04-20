const express = require('express');

// Importation des controleurs
const { 
    setUserOnline, 
    getUserData, 
    modifyUserFields,
    toggleFavorites,
    getUserFavorites,
    getUserNotifications,
    readUserNotification,
    updateDeviceToken,
    getAllUsersWithStatus,
    getDataFromUserID,
    updateSearchHistory,
    getAnyUserData,
    getUserLoginActivity,
    readUserAllNotifications,
    deleteUserNotification,
    deleteUserAllNotifications,
    getUsers,
    getAdminNotifications,
    readAdminNotification,
    readAdminAllNotifications,
    deleteAdminNotification,
    deleteAdminAllNotifications,
    getUserIDLoginActivity,
    getUserLocations,
    getUserVerificationData
} = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Route liées à l'uttilisateur
router.get('/', getUsers);
router.get('/locations', getUserLocations);
router.get('/all/status', getAllUsersWithStatus);
router.get('/:userID', getUserData);
router.get('/user/:user_id', getDataFromUserID);
router.get('/user/:userID', getAnyUserData);
// router.get('/:interlocutorID', fetchInterlocutorProfile);
router.post('/user/status', setUserOnline);
router.get('/:userID/favorites', getUserFavorites);
router.put('/:userID/profile-field/update', verifyToken, modifyUserFields);
router.post('/:userID/favorites/add-remove', toggleFavorites);

router.get('/:userID/admin/notifications', getAdminNotifications);
router.post('/:userID/admin/notifications/:notificationID/read', readAdminNotification);
router.post('/:userID/admin/notifications/read-all', readAdminAllNotifications);

router.get('/:userID/notifications', getUserNotifications);

router.delete('/:userID/notifications/:notificationID/delete', deleteUserNotification);
router.delete('/:userID/notifications/delete-all', deleteUserAllNotifications);

router.delete('/:userID/admin/notifications/:notificationID/delete', deleteAdminNotification);
router.delete('/:userID/admin/notifications/delete-all', deleteAdminAllNotifications);

router.post('/:userID/notifications/:notificationID/read', readUserNotification);
router.post('/:userID/notifications/read-all', readUserAllNotifications);

router.post('/update-device-token', verifyToken, updateDeviceToken);
router.post('/:userID/update-search-history', updateSearchHistory);
router.get('/:userID/login-activity', getUserLoginActivity);
router.get('/user/:UserID/login-activity', getUserIDLoginActivity);

router.get('/verification/:userID', getUserVerificationData);

module.exports = router;