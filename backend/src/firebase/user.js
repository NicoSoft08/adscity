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

const collectUserData = async (user_id) => {
    try {
        const UserID = user_id.toLocaleUpperCase();
        const userRef = firestore.collection('USERS');
        const userSnap = await userRef
            .where('UserID', '==', UserID)
            .limit(1)
            .get();

        if (userSnap.empty) {
            console.log('Aucun utilisateur trouvé avec cet ID');
            return null;
        };
        const userData = userSnap.docs[0].data();
        return userData;
    } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur :', error);
        throw error;
    };
};

const collectAllUsersWithStatus = async () => {
    try {
        const usersSnapshot = await firestore.collection('USERS').get();
        const allUsers = [];
        const onlineUsers = [];
        const offlineUsers = [];

        usersSnapshot.forEach(doc => {
            const user = { id: doc.id, ...doc.data() };
            allUsers.push(user);

            if (user.isOnline) onlineUsers.push(user);
            else offlineUsers.push(user);
        });

        return { allUsers, onlineUsers, offlineUsers };
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
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

        const notificationRef = userRef.collection('NOTIFICATIONS').orderBy('timestamp', 'desc');
        const snapshot = await notificationRef.get();
        const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return notifications;
    } catch (error) {
        console.error("Erreur lors de la récupération des notifications de l'utilisateur", error);
        return false;
    };
};

const collectUserUnreadNotifications = async (userID) => {
    try {
        const userRef = firestore.collection('USERS').doc(userID);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            console.log("Utilisateur non trouvé");
            return false;
        };

        const notificationRef = userRef.collection('NOTIFICATIONS').where('isRead', '==', false);
        const snapshot = await notificationRef.get();
        const unreadNotifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return unreadNotifications;
    } catch (error) {
        console.error("Erreur lors de la récupération des notifications non lues de l'utilisateur", error);
        return false;
    }
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

const storeDeviceToken = async (deviceToken, userID) => {
    try {
        console.log("✅ Début de la fonction storeDeviceToken");
        const userRef = firestore.collection('USERS').doc(userID);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            console.log("Utilisateur non trouvé dans Firestore.");
            return false;
        }

        await userRef.update({ deviceToken: deviceToken });
        console.log("✅ Token de l'utilisateur mis à jour avec succès !");
        return true;
    } catch (error) {
        console.error("❌ Erreur lors de la mise à jour du token :", error);
        return false;
    };
};


const collectInterlocutorProfile = async (userID) => {
    try {
        // 📌 Déterminer l'interlocuteur (l'autre utilisateur dans la conversation)
        const interlocutorID = chat.senderID === userID ? chat.receiverID : chat.senderID;

        // 🔍 Récupérer les infos du profil depuis Firestore
        const userDoc = await firestore.collection('USERS').doc(interlocutorID).get();
        if (!userDoc.exists) {
            console.error(`❌ Profil de l'interlocuteur introuvable pour l'ID : ${interlocutorID}`);
            return null;
        }

        // 📦 Retourner les données du profil de l'interlocuteur
        const userData = userDoc.data();
        return userData
    } catch (error) {
        console.error("❌ Erreur lors de la récupération du profil de l'interlocuteur :", error);
        return null;
    }
};



module.exports = {
    addRemoveFavorites,
    collectInterlocutorProfile,
    collectUserFavorites,
    getUser,
    getUsers,
    collectUserData,
    collectAllUsersWithStatus,
    collectUserNotifications,
    collectUserUnreadNotifications,
    collectUserPermissions,
    markNotificationAsRead,
    setUserOnlineStatus,
    storeDeviceToken,
    updateUserFields,
    updateUserInteraction,
};