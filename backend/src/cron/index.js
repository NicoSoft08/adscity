const { admin, firestore, messaging } = require("../config/firebase-admin");


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

const paymentStatusChecker = async () => {
    try {
        const currentDate = new Date();

        // Récupérer les paiements en cours et expirés
        const paymentsSnapshot = await firestore.collection('PAYMENTS')
            .where('status', '==', 'processing')
            .where('expireAt', '<', currentDate)
            .get();

        if (paymentsSnapshot.empty) {
            console.log('Aucun paiement en attente expiré.');
            return;
        }

        console.log(`Paiements à vérifier : ${paymentsSnapshot.size}`);

        // Mettre à jour les statuts en parallèle
        const updatePromises = paymentsSnapshot.docs.map(async (doc) => {
            const payment = doc.data();
            const now = new Date();

            try {
                if (payment.expireAt.toDate() < now) {
                    await doc.ref.update({
                        status: 'expired',
                        updatedAt: admin.firestore.FieldValue.serverTimestamp()
                    });
                    console.log(`Paiement expiré : ${doc.id}`);
                }
            } catch (updateError) {
                console.error(`Erreur lors de la mise à jour du paiement ${doc.id}:`, updateError);
            }
        });

        await Promise.all(updatePromises);
        console.log('Vérification des paiements terminée.');

    } catch (error) {
        console.error('Erreur lors de la vérification des paiements:', error);
    }
};

const markPostsAsExpired = async () => {
    const now = new Date();
    const postsSnapshot = await firestore.collection('POSTS')
        .where('expiry_date', '<=', now)
        .where('status', '==', 'active') // Filtrer les annonces encore actives
        .get();

    const batch = firestore.batch();

    postsSnapshot.forEach((doc) => {
        batch.update(doc.ref, {
            status: 'expired',
            updatedAt: now, // Stocke la date d'expiration
        });
    });

    await batch.commit();
    console.log("Annonces expirées mises à jour !");
};

const deleteOldExpiredPosts = async () => {
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1); // Remonter d'un mois

    const expiredAdsSnapshot = await firestore.collection('POSTS')
        .where('status', '==', 'expired')
        .where('updatedAt', '<=', oneMonthAgo) // Si expirée depuis plus d'un mois
        .get();

    const batch = firestore.batch();

    expiredAdsSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
    });

    await batch.commit();
    console.log("Annonces expirées depuis plus d'un mois supprimées !");
};

// Envoyer une notification avant la suppression (Tous les dimanches à 8h)
const deletionReminder = async () => {
    const now = new Date();
    const threeWeeksAgo = new Date();
    threeWeeksAgo.setDate(now.getDate() - 21); // 21 jours après expiration

    const postsSnapshot = await firestore.collection('POSTS')
        .where("status", "==", "expired")
        .where("updatedAt", "<=", threeWeeksAgo) // Expiré depuis 21 jours
        .get();

    postsSnapshot.forEach(async (doc) => {
        const postData = doc.data();
        const userRef = firestore.collection('USERS').doc(postData.userID);
        const userSnap = await userRef.get();

        if (userSnap.exists) {
            const userData = userSnap.data();
            const notification = {
                type: 'ad_deletion',
                title: "Votre annonce expirée sera supprimée bientôt",
                message: `L'annonce "${postData.adDetails.title}" sera supprimée dans 7 jours. Republiez-la si vous souhaitez la conserver.`,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                isRead: false,
            }
            console.log(`🔔 Notification envoyée à ${userData.email}`);
            await userRef.collection('NOTIFICATIONS').add(notification);
        }
    });
};

module.exports = {
    checkFreeTrialExpiry,
    deleteOldExpiredPosts,
    deletionReminder,
    markPostsAsExpired,
    paymentStatusChecker,
}