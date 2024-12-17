const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getUserProfileURL } = require("../firebase/firestore");
const { uploadUserBannerPicture, uploadUserProfilePicture } = require("../firebase/storage");
const { admin } = require('../config/firebase-admin');


const upload = multer({
    storage: multer.memoryStorage(), // On stocke temporairement le fichier en mémoire
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite à 5MB pour l'image de profil
});


// Route pour charger la photo de profil d'un utilisateur
router.post('/upload/:userID/profile', upload.single('profilURL'), async (req, res) => {
    const { userID } = req.params;
    const file = req.file;


    try {
        const profilURL = await uploadUserProfilePicture(file, userID);

        res.status(200).send({ message: 'Photo de profil mise à jour avec succès', profilURL });
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors du téléchargement de la photo de profil.' });
    }
});


// Route pour collecter la photo de profile d'un utilisateur
router.get('/fetch/:userID/profilURL', async (req, res) => {
    const { userID } = req.params;

    try {
        const profilURL = await getUserProfileURL(userID);

        res.status(200).send({ message: 'Photo de profil collectée', profilURL });
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la collecte de la photo de profil.' });
    }
});


// Route pour charger la photo de couverture d'un utilisateur
router.post('/upload/:userID/banner', upload.single('coverURL'), async (req, res) => {
    const { userID } = req.params;
    const file = req.file;

    try {
        const coverURL = await uploadUserBannerPicture(file, userID);

        res.status(200).send({ message: 'Photo de couverture mise à jour avec succès', coverURL });
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors du téléchargement de la photo de couverture.' });
    }
});


// Route pour ulpoader les images des annonces
router.post('/upload/image', upload.single('image'), async (req, res) => {
    const file = req.file;
    const { userID } = req.body;

    if (!file) {
        return res.status(400).json({ error: 'Aucun fichier fourni.' });
    }

    const uniqueFolderID = userID;
    const currentDate = new Date().toISOString().slice(0, 10);
    const folderPath = `PHOTOS/POSTS/${uniqueFolderID}/${currentDate}/`;

    try {
        const storageRef = admin
            .storage()
            .bucket(process.env.FIREBASE_STORAGE_BUCKET)
            .file(`${folderPath}${file.originalname}`);

        await storageRef.save(file.buffer);


        const [imageUrl] = await storageRef.getSignedUrl({
            action: 'read',
            expires: '03-09-2491',
        });

        res.status(200).json({ imageUrl });
    } catch (error) {
        console.error('Erreur lors du téléversement des images:', error);
        res.status(500).json({ error: 'Erreur lors du téléversement des images.' });
    }
});


module.exports = router;

