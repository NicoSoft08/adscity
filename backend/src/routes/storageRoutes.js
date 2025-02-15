const express = require('express');
const { upload } = require('../func');

// Importation des controleurs
const { 
    uploadImage, 
    uploadProfileURL, 
    uploadBannerURL, 
    getUserProfilePicture, 
    deletePostImages
} = require('../controllers/storageController');

const router = express.Router();

// Route liées stockage
router.post('/upload/image', upload.single('image'), uploadImage);
router.post('/upload/:userID/profile', upload.single('profilURL'), uploadProfileURL);
router.post('/upload/:userID/banner', upload.single('coverURL'), uploadBannerURL);
router.get('/user/:userID/profilURL', getUserProfilePicture);
router.delete('/delete/post-images/:postID', deletePostImages);

module.exports = router;