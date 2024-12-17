const admin = require('firebase-admin');


const updateAdInteraction = async (adID, userID) => {
    try {
        const adRef = admin.firestore().collection('POSTS').doc(adID);
        const adDoc = await adRef.get();

        if (!adDoc.exists) {
            console.log("Annonce non trouvée");
            return false;
        }

        const adData = adDoc.data();
        const interactedUsers = adData.interactedUsers || [];

        // Check if the user has already interacted
        if (interactedUsers.includes(userID)) {
            console.log("L'utilisateur a déjà interagi avec cette annonce");
            return false;
        }

        // Add the userID to the list of interacted users
        await adRef.update({
            clicks: admin.firestore.FieldValue.increment(1),
            views: admin.firestore.FieldValue.increment(1),
            interactedUsers: admin.firestore.FieldValue.arrayUnion(userID)
        });

        console.log("Mise à jour réussie");
        return true;
    } catch (error) {
        console.error("Mise à jour échouée", error);
        return false;
    }
};

const onToggleFavorite = async (adID, userID) => {

    const adRef = admin.firestore().collection('POSTS').doc(adID);
    const userRef = admin.firestore().collection('USERS').doc(userID);

    // Get current data
    const [adDoc, userDoc] = await Promise.all([
        adRef.get(),
        userRef.get()
    ]);

    // Specific error messages for each case
    if (!adDoc.exists) {
        throw new Error('Annonce introuvable');
    }
    if (!userDoc.exists) {
        throw new Error('Utilisateur introuvable');
    }

    const favoritedBy = adDoc.data().favoritedBy || [];
    const adsSaved = userDoc.data().adsSaved || [];

    // Update both collections
    if (favoritedBy.includes(userID)) {
        await Promise.all([
            adRef.update({
                favoritedBy: favoritedBy.filter(id => id !== userID),
                favorites: admin.firestore.FieldValue.increment(-1)
            }),
            userRef.update({
                adsSaved: adsSaved.filter(id => id !== adID)
            })
        ]);
    } else {
        await Promise.all([
            adRef.update({
                favoritedBy: [...favoritedBy, userID],
                favorites: admin.firestore.FieldValue.increment(1)
            }),
            userRef.update({
                adsSaved: [...adsSaved, adID]
            })
        ]);
    }
};



const getApprovedAdsByUserID = async (userID) => {
    try {
        const adsCollection = admin.firestore().collection('POSTS');
        const approvedAdsQuery = adsCollection
            .where('userID', '==', userID) // Filtrer par l'ID de l'utilisateur
            .where('status', '==', 'approved'); // Filtrer par le statut "pending"

        const querySnapshot = await approvedAdsQuery.get();
        if (querySnapshot.empty) {
            return [];
        }

        const approvedAds = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return approvedAds;
    } catch (error) {
        console.error('Erreur lors de la récupération des annonces approuvées:', error);
        throw error;
    }
};


const getPendingAdsByUserID = async (userID) => {
    try {
        const adsCollection = admin.firestore().collection('POSTS');
        const pendingAdsQuery = adsCollection
            .where('userID', '==', userID) // Filtrer par l'ID de l'utilisateur
            .where('status', '==', 'pending'); // Filtrer par le statut "pending"

        const querySnapshot = await pendingAdsQuery.get();
        if (querySnapshot.empty) {
            return [];
        }

        const pendingAds = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return pendingAds;
    } catch (error) {
        console.error('Erreur lors de la récupération des annonces en attente:', error);
        throw error;
    }
};


const getRefusedAdsByUserID = async (userID) => {
    try {
        const adsCollection = admin.firestore().collection('POSTS');
        const refusedAdsQuery = adsCollection
            .where('userID', '==', userID) // Filtrer par l'ID de l'utilisateur
            .where('status', '==', 'refused'); // Filtrer par le statut "pending"

        const querySnapshot = await refusedAdsQuery.get();
        if (querySnapshot.empty) {
            return [];
        }

        const refusedAds = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return refusedAds;
    } catch (error) {
        console.error('Erreur lors de la récupération des annonces refusées:', error);
        throw error;
    }
};


module.exports = {
    onToggleFavorite,
    getApprovedAdsByUserID,
    getPendingAdsByUserID,
    getRefusedAdsByUserID,
    updateAdInteraction,
};