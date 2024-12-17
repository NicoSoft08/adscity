const admin = require('firebase-admin');

const uploadUserProfilePicture = async (file, userID) => {
    try {
        const userDoc = admin.firestore().collection('USERS').doc(userID);
        const userSnapshot = await userDoc.get();

        if (!userSnapshot.exists) {
            throw new Error('Utilisateur non trouvé');
        }

        const userData = userSnapshot.data();
        const profilChanges = userData.profilChanges || { count: 0, lastUpdated: null };

        const now = new Date();
        const lastUpdateDate = profilChanges.lastUpdated ? new Date(profilChanges.lastUpdated) : null;
        const isSameMonth = lastUpdateDate && now.getMonth() === lastUpdateDate.getMonth() && now.getFullYear() === lastUpdateDate.getFullYear();
        
        if (isSameMonth && profilChanges.count >= 3) {
            throw new Error('Vous avez atteint la limite de changement de photo de profile pour ce mois.');
        }

        const newCount = isSameMonth ? profilChanges.count + 1 : 1; // Incrémenter ou réinitialiser

        // Téléchargement dans Firebase Storage
        const storage = admin.storage();
        const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET);
        const fileName = `PHOTOS/PROFILES/${userID}/${file.originalname}`;

        const fileUpload = bucket.file(fileName);

        await fileUpload.save(file.buffer, {
            metadata: {
                contentType: file.mimetype,
            },
        });

        await fileUpload.makePublic();

        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;

        await userDoc.update({
            profilURL: publicUrl,
            profilChanges: {
                count: newCount,
                lastUpdated: now.toISOString(),
            },
        });

        console.log('Téléchargement de la photo de profil réussi et Firestore mis à jour');
        return publicUrl;
    } catch (error) {
        console.error('Erreur lors du téléchargement de la photo de profil:', error);
        throw new Error('Échec du téléchargement de la photo de profil');
    }
};


const uploadUserBannerPicture = async (file, userID) => {
    try {
        const userDoc = admin.firestore().collection('USERS').doc(userID);
        const userSnapshot = await userDoc.get();

        if (!userSnapshot.exists) {
            throw new Error('Utilisateur non trouvé');
        }

        const userData = userSnapshot.data();
        const coverChanges = userData.coverChanges || { count: 0, lastUpdated: null };

        const now = new Date();
        const lastUpdateDate = coverChanges.lastUpdated ? new Date(coverChanges.lastUpdated) : null;
        const isSameMonth = lastUpdateDate && now.getMonth() === lastUpdateDate.getMonth() && now.getFullYear() === lastUpdateDate.getFullYear();
        
        if (isSameMonth && coverChanges.count >= 3) {
            throw new Error('Vous avez atteint la limite de changement de photo de couverture pour ce mois.');
        }

        const newCount = isSameMonth ? coverChanges.count + 1 : 1; // Incrémenter ou réinitialiser

        // Téléchargement dans Firebase Storage
        const storage = admin.storage();
        const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET);
        const fileName = `PHOTOS/BANNERS/${userID}/${file.originalname}`;

        const fileUpload = bucket.file(fileName);

        await fileUpload.save(file.buffer, {
            metadata: {
                contentType: file.mimetype,
            },
        });

        await fileUpload.makePublic();

        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;

        await userDoc.update({
            coverURL: publicUrl,
            coverChanges: {
                count: newCount,
                lastUpdated: now.toISOString(),
            },
        });

        console.log('Téléchargement de la photo de couverture réussi et Firestore mis à jour');
        return publicUrl;
    } catch (error) {
        console.error('Erreur lors du téléchargement de la photo de couverture:', error);
        throw new Error('Échec du téléchargement de la photo de couverture');
    }
};



module.exports = { 
    uploadUserBannerPicture,
    uploadUserProfilePicture, 
};