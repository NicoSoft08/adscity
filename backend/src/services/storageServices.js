const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getUserProfileURL } = require("../firebase/firestore");
const { uploadUserBannerPicture, uploadUserProfilePicture } = require("../firebase/storage");
const { admin } = require('../config/firebase-admin');
const { generateTicketID } = require('../func');
const { sendUserEmailWithTicket } = require('../controllers/emailController');

const storage_bucket = process.env.FIREBASE_STORAGE_BUCKET

const upload = multer({
    storage: multer.memoryStorage(), // On stocke temporairement le fichier en mémoire
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite à 5MB pour l'image de profil
});


// Route pour charger la photo de profil d'un utilisateur
router.post('/upload/:userID/profile', upload.single('profilURL'), async (req, res) => {
    const { userID } = req.params;
    const file = req.file;

    if (!userID || !file) {
        return res.status(400).send({
            success: false,
            message: 'Requête invalide : utilisateur ou fichier manquant.'
        });
    }

    const result = await uploadUserProfilePicture(file, userID);
    if (result.success) {
        res.status(200).send({
            success: true,
            message: result.message,
            profilURL: result.profilURL
        });
    } else {
        res.status(500).send({
            success: false,
            message: result.message
        });
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
        res.status(400).json({
            success: false,
            message: 'Aucun fichier fourni.'
        });
    }

    const uniqueFolderID = userID;
    const currentDate = new Date().toISOString().slice(0, 10);
    const folderPath = `PHOTOS/POSTS/${uniqueFolderID}/${currentDate}/`;

    try {
        const storageRef = admin
            .storage()
            .bucket(storage_bucket)
            .file(`${folderPath}${file.originalname}`);

        await storageRef.save(file.buffer);


        const [imageUrl] = await storageRef.getSignedUrl({
            action: 'read',
            expires: '03-09-2491',
        });

        res.status(200).json({
            success: true,
            message: 'Images téléversées avec succès',
            imageUrl: imageUrl,
        });
    } catch (error) {
        console.error('Erreur lors du téléversement des images:', error);
        res.status(500).json({ 
            success: false,
            message: 'Erreur lors du téléversement des images.' 
        });
    }
});


router.post('/contact', async (req, res) => {
    const { formData } = req.body;

    try {
        const { firstName, lastName, email, object, message } = formData;
        const ticketID = generateTicketID();

        await sendUserEmailWithTicket(firstName, lastName, email, object, message, ticketID);
        res.status(200).json({
            success: true,
            message: 'Email envoyé avec succès'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'envoi de l\'email'
        });
    }
});


module.exports = router;

