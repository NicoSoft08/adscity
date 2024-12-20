const { admin } = require("../config/firebase-admin");


// Fonction pour vérifier et mettre à jour les périodes d'essai expirées
const checkFreeTrialExpiry = async () => {
    try {
        const usersRef = admin.firestore()
            .collection('USERS')
            .where('freeTrial.isActive', '==', true);
        const snapshot = await usersRef.get();

        snapshot.forEach(async (doc) => {
            const userData = doc.data();
            const currentDate = new Date();

            // Si la période d'essai est expirée
            if (new Date(userData.freeTrial.endDate) <= currentDate) {
                await doc.ref.update({
                    'freeTrial.isActive': false,
                    adLimits: {
                        adsPerMonth: 3,
                        photosPerAd: 5,
                        adValidity: 7 // Une semaine pour la validité des annonces
                    }
                });
                console.log(`Période d'essai expirée pour l'utilisateur ${doc.id}`);
            }
        });
    } catch (error) {
        console.error('Erreur lors de la vérification des périodes d\'essai :', error);
    }
};



const adStatusChecker = async () => {
    try {
        const adsRef = admin.firestore().collection('POSTS');
        const currentDate = new Date();
        
        const adsSnapshot = await adsRef
            .where('status', '==', 'active')
            .where('expiryDate', '<=', currentDate)
            .get();
        
        const batch = admin.firestore().batch();
        
        adsSnapshot.forEach((doc) => {
            batch.update(doc.ref, { 
                status: 'expired',
                updatedAt: currentDate 
            });
        });
        
        await batch.commit();
        console.log(`Updated ${adsSnapshot.size} expired ads`);
    } catch (error) {
        console.error('Error updating ad status:', error);
    }
}


module.exports = {
    adStatusChecker,
    checkFreeTrialExpiry
}