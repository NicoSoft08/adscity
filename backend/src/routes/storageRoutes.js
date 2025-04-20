const express = require('express');
const { upload } = require('../func');

// Importation des controleurs
const {
    uploadImage,
    uploadProfileURL,
    getUserProfilePicture,
    deletePostImages,
    uploadMedia,
    uploadCoverURL,
    uploadSensitiveVerification
} = require('../controllers/storageController');

const router = express.Router();

// Route liées stockage
router.post('/upload/image', upload.single('image'), uploadImage);
router.post('/upload/:userID/profile', upload.single('profilURL'), uploadProfileURL);
router.post('/upload/:userID/cover', upload.single('coverURL'), uploadCoverURL);
router.get('/user/:userID/profilURL', getUserProfilePicture);
router.delete('/delete/post-images/:postID', deletePostImages);
router.post('/upload/media', upload.single('file'), uploadMedia);
router.post('/upload/sensitive-verification', upload.fields([
    { name: 'document', maxCount: 1 },
    { name: 'selfie', maxCount: 1 }
]), uploadSensitiveVerification);

module.exports = router;