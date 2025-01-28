const { auth, firestore, admin } = require("../config/firebase-admin");

const getUsers = async () => {
    try {
        const adsCollection = firestore.collection('USERS').orderBy('createdAt', 'desc');

        const querySnapshot = await adsCollection.get();

        if (querySnapshot.empty) {
            return [];
        };

        const allUsers = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        return allUsers
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        throw error;
    }
};


const getUser = async (userID) => {
    try {
        const userRecord = auth.getUser(userID);
        const userDoc = await firestore.collection('USERS').doc((await userRecord).uid).get();

        if (userDoc.exists) {
            return {
                ...(await userRecord).toJSON(),
                ...userDoc.data(),
            };
        } else {
            return (await userRecord).toJSON();
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        throw error;
    }
};


const collectUsersOnline = async () => {
    try {
        const usersRef = firestore.collection('USERS').where('isOnline', '==', true);
        const querySnapshot = await usersRef.get();
        
        if (querySnapshot.empty) {
            console.log('Aucun utilisateur en ligne trouvé.');
            return [];
        };

        const usersOnline = querySnapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
        }));
        return usersOnline
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs en ligne:', error);
        throw error;
    }
};


const collectUsersOffline = async () => {
    try {
        const usersRef = firestore.collection('USERS').where('isOnline', '==', true);
        const querySnapshot = await usersRef.get();

        if (querySnapshot.empty) {
            console.log('Aucun utilisateur hors ligne trouvé.');
            return [];
        };

        const usersOffline = querySnapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
        }));
        return usersOffline
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs déconnectés:', error);
        throw error;
    }
};


const collectUserPermissions = async (userID) => {
    try {
        const userRef = firestore.collection('USERS').doc(userID);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            console.log(`Utilisateur ${userID} introuvable.`);
            return;
        };

        const userData = userDoc.data();
        const permissions = userData.permissions || [];
        return permissions;
    } catch (error) {
        console.error('Erreur lors de la récupération des permissions de l\'utilisateur :', error);
        throw error;
    }
};


const setUserOnlineStatus = async (userID, isOnline) => {
    try {
        await firestore
            .collection('USERS')
            .doc(userID)
            .update({
                isOnline: isOnline,
                lastOnline: admin.firestore.FieldValue.serverTimestamp()
            });
        return true;
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'état en ligne :", error);
        return false;
    }
};


const updateUserFields = async (userID, updatedFields) => {
    try {
        const userRef = firestore.collection('USERS').doc(userID);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            console.log("Utilisateur non trouvé");
            return false;
        };
        await userRef.update(updatedFields);
        return true;
    } catch (error) {
        console.error("Erreur lors de la mise à jour des champs de l'utilisateur :", error);
        return false;
    }
};


const updateUserInteraction = async (userID, adID) => {
    try {
        const userRef = firestore.collection('USERS').doc(userID);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            console.log("Utilisateur non trouvé");
            return false;
        }

        const userData = userDoc.data();
        const adsClicked = userData.adsClicked || [];

        // Si l'utilisateur a déjà cliqué sur cette annonce, ne pas mettre à jour les compteurs
        if (adsClicked.includes(adID)) {
            console.log("L'utilisateur a déjà cliqué sur cette annonce");
            return false;
        }

        // Mise à jour des interactions
        await userRef.update({
            clicksOnAds: admin.firestore.FieldValue.increment(1),
            totalAdsViewed: admin.firestore.FieldValue.increment(1),
            adsClicked: admin.firestore.FieldValue.arrayUnion(adID) // Ajouter l'ID de l'annonce
        });

        console.log("Interaction de l'utilisateur mise à jour");
        return true;
    } catch (error) {
        console.error("Erreur lors de la mise à jour des interactions utilisateur", error);
        return false;
    }
};

const addRemoveFavorites = async (postID, userID) => {
    try {
        const userRef = firestore.collection('USERS').doc(userID);
        const postRef = firestore.collection('POSTS').doc(postID);

        const [userDoc, postDoc] = await Promise.all([userRef.get(), postRef.get()]);

        if (!userDoc.exists || !postDoc.exists) {
            console.log("Utilisateur ou annonce non trouvé");
            return false;
        };

        const isFavorite = (postDoc.data().favoritedBy || []).includes(userID);

        if (isFavorite) {
            await Promise.all([
                postRef.update({
                    favoritedBy: admin.firestore.FieldValue.arrayRemove(userID),
                    favorites: admin.firestore.FieldValue.increment(-1)
                }),
                userRef.update({
                    adsSaved: admin.firestore.FieldValue.arrayRemove(postID)
                })
            ]);
            console.log("Annonce retirée des favoris");
        } else {
            await Promise.all([
                postRef.update({
                    favoritedBy: admin.firestore.FieldValue.arrayUnion(userID),
                    favorites: admin.firestore.FieldValue.increment(1)
                }),
                userRef.update({
                    adsSaved: admin.firestore.FieldValue.arrayUnion(postID)
                })
            ]);
            console.log("Annonce ajoutée aux favoris");
        }
        return true;
    } catch (error) {
        console.error("Erreur lors de la mise à jour des favoris de l'utilisateur", error);
        return false;
    };
};

const collectUserFavorites = async (userID) => {
    try {
        const userRef = firestore.collection('USERS').doc(userID);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            console.log("Utilisateur non trouvé");
            return false;
        };

        const userData = userDoc.data();
        const postsSaved = userData.adsSaved || [];
        return postsSaved;
    } catch (error) {
        console.error("Erreur lors de la récupération des favoris de l'utilisateur", error);
        return false;
    };
};

const collectUserNotifications = async (userID) => {
    try {
        const userRef = firestore.collection('USERS').doc(userID);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            console.log("Utilisateur non trouvé");
            return false;
        };

        const notificationRef = userRef.collection('NOTIFICATIONS');
        const snapshot = await notificationRef.get();
        const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return notifications;
    } catch (error) {
        console.error("Erreur lors de la récupération des notifications de l'utilisateur", error);
        return false;
    };
};

const markNotificationAsRead = async (userID, notificationID) => {
    try {
        const userRef = firestore.collection('USERS').doc(userID);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            console.log("Utilisateur non trouvé");
            return false;
        };

        const notificationRef = userRef.collection('NOTIFICATIONS').doc(notificationID);
        const notificationDoc = await notificationRef.get();
        if (!notificationDoc.exists) {
            console.error("Notification non trouvée");
            return false;
        };

        console.log("Notification marquée comme lue avec succès !");
        await notificationRef.update({ isRead: true });
        return true;
    } catch (error) {
        console.error("Erreur lors de la lecture de la notification de l'utilisateur", error);
        return false;
    };
};


module.exports = {
    addRemoveFavorites,
    collectUserFavorites,
    getUser,
    getUsers,
    collectUserNotifications,
    collectUsersOffline,
    collectUsersOnline,
    collectUserPermissions,
    markNotificationAsRead,
    setUserOnlineStatus,
    updateUserFields,
    updateUserInteraction,
};