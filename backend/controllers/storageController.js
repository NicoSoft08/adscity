const admin = require('firebase-admin');

const uploadFile = async (file) => {
    if (!file) {
        console.log('Aucun fichier téléchargé');
    }

    try {
        const bucketName = process.env.FIRBASE_STORAGE_BUCKET;
        const bucket = admin.storage().bucket(bucketName);
        
        const fileName = `profile-images/${Date.now()}_${file}`;
        const fileUpload = bucket.file(fileName);

        await fileUpload.save(file.buffer, {
            metadata: { contentType: file.mimetype },
        });

        // Générer l'URL de téléchargement public
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(fileName)}?alt=media`;

        console.log("profileUrl: ", publicUrl);

        return publicUrl;
    } catch (error) {
        console.error('Erreur lors de l\'upload de l\'image:', error);
    }
};


module.exports = { uploadFile };