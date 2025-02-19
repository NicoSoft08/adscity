const express = require('express');

// Importation des controleurs
const { 
    registerUser, 
    signoutUser, 
    loginUser, 
    deleteUser, 
    verifyOTPCode,
    changePassword,
    createNewAdmin,
    validateDevice,
    refuseDevice,
    loginAdmin
} = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Route liées à l'authentification
router.post('/create-user', registerUser);
router.post('/login-user', verifyToken, loginUser);
router.post('/logout-user', verifyToken, signoutUser);
router.post('/delete-user', deleteUser);
router.post('/verify-code', verifyOTPCode);
router.post('/verify-device/:deviceID', verifyToken, validateDevice);
router.post('/decline-device/:deviceID', verifyToken, refuseDevice);
router.post('/update-password', changePassword);
router.post('/new-admin/add', createNewAdmin);

module.exports = router;