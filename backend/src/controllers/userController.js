const { firestore, messaging } = require("../config/firebase-admin");
const {
    getUsers,
    getUser,
    setUserOnlineStatus,
    collectUsersOnline,
    collectUsersOffline,
    collectUserPermissions,
    updateUserFields,
    addRemoveFavorites,
    collectUserFavorites,
    collectUserNotifications,
    markNotificationAsRead
} = require("../firebase/user");


const getUsersData = async (req, res) => {
    try {
        const allUsers = await getUsers();
        if (!allUsers) {
            return res.status(404).json({
                success: false,
                message: "Aucun utilisateur trouvé"
            });
        };
        res.status(200).json({
            success: true,
            message: "Données des utilisateurs récupérées avec succès",
            allUsers: allUsers,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur :", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des données utilisateur"
        });
    }
};

const getUserData = async (req, res) => {
    const { userID } = req.params;

    if (!userID) {
        return res.status(400).json({
            success: false,
            message: "ID de l'utilisateur manquant"
        });
    };

    try {
        const data = await getUser(userID);
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Utilisateur non trouvé"
            });
        };
        res.status(200).json({
            success: true,
            message: "Données de l'utilisateur récupérées avec succès",
            data: data
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur :", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des données utilisateur"
        });

    }
};

const setUserOnline = async (req, res) => {
    const { userID, isOnline } = req.body;

    if (!userID || isOnline === undefined) {
        return res.status(400).json({
            success: false,
            message: "ID de l'utilisateur ou statut en ligne manquant"
        });
    };

    try {
        const isOnlineUpdated = await setUserOnlineStatus(userID, isOnline);
        if (!isOnlineUpdated) {
            return res.status(404).json({
                success: false,
                message: "Utilisateur non trouvé"
            });
        };
        res.status(200).json({
            success: true,
            message: "Statut en ligne de l'utilisateur mis à jour avec succès"
        });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du statut en ligne de l'utilisateur :", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la mise à jour du statut en ligne de l'utilisateur"
        });
    }
};

const getUsersOnline = (req, res) => {
    try {
        const usersOnline = collectUsersOnline();
        if (!usersOnline) {
            return res.status(404).json({
                success: false,
                message: "Aucun utilisateur en ligne trouvé"
            });
        };
        res.status(200).json({
            success: true,
            message: "Utilisateurs en ligne récupérés avec succès",
            usersOnline: usersOnline
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs en ligne :", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des utilisateurs en ligne"
        });

    }
};

const getUsersOffline = (req, res) => {
    try {
        const usersOffline = collectUsersOffline();
        if (!usersOffline) {
            return res.status(404).json({
                success: false,
                message: "Aucun utilisateur hors ligne trouvé"
            });
        };
        res.status(200).json({
            success: true,
            message: "Utilisateurs hors ligne récupérés avec succès",
            usersOffline: usersOffline
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs hors ligne :", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des utilisateurs hors ligne"
        });

    }
};

const sendUserNotification = async (userID, title, message) => {
    try {
        // Récupère le token FCM de l'utilisateur
        const userRef = firestore.collection('USERS').doc(userID);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            console.log(`Utilisateur ${userID} introuvable.`);
            return;
        }

        const userData = userDoc.data();
        const fcmToken = userData.fcmToken;

        if (!fcmToken) {
            console.log(`Aucun token FCM pour l'utilisateur ${userID}`);
            return;
        }

        // Créer le message de notification
        const messagePayload = {
            notification: {
                title: title,
                body: message,
            },
            token: fcmToken,
        };

        // Envoie la notification via Firebase Cloud Messaging
        const response = await messaging.send(messagePayload);
        console.log('Notification envoyée avec succès:', response);
    } catch (error) {
        console.error('Erreur lors de l\'envoi de la notification:', error);
    }
};

const updateInteractionByUserID = async (userID, postID) => {};

const getUserPermissions = async (req, res) => {
    const { userID } = req.params;

    if (!userID) {
        return res.status(400).json({
            success: false,
            message: "ID de l'utilisateur manquant"
        });
    };

    try {
        const userPermissions = await collectUserPermissions(userID);
        if (!userPermissions) {
            return res.status(404).json({
                success: false,
                message: "Permissions de l'utilisateur non trouvées"
            });
        };
        res.status(200).json({
            success: true,
            message: "Permissions de l'utilisateur récupérées avec succès",
            userPermissions: userPermissions
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des permissions de l'utilisateur :", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des permissions de l'utilisateur"
        });

    }
};

const modifyUserFields = async (req, res) => {
    const { userID } = req.params;
    const { updatedFields } = req.body;

    try {
        const fieldsUpdated = await updateUserFields(userID, updatedFields);
        if (!fieldsUpdated) {
            return res.status(404).json({
                success: false,
                message: "Champs de l'utilisateur non trouvés"
            });
        };
        res.status(200).json({
            success: true,
            message: "Champs de l'utilisateur modifiés avec succès",
        });
    } catch (error) {
        console.error("Erreur lors de la modification des champs de l'utilisateur :", error);
        res.status(500).json({
            success: false,
            message: "Erreur technique, réessayez plus tard"
        });
    };
};

const toggleFavorites = async (req, res) => {
    const { userID } = req.params;
    const { postID } = req.body;

    try {
        const status = await addRemoveFavorites(postID, userID);
        if (!status) {
            return res.status(404).json({
                success: false,
                message: "Erreur lors de la mise à jour des favoris"
            });
        };
        res.status(200).json({
            success: true,
            message: "Favoris mis à jour avec succès"
        });
    } catch (error) {
        console.error("Erreur réseau lors de la mise à jour des favoris :", error);
        res.status(500).json({
            success: false,
            message: "Erreur technique, réessayez plus tard"
        });
    };
};

const getUserFavorites = async (req, res) => {
    const { userID } = req.params;

    try {
        const postsSaved = await collectUserFavorites(userID);
        if (!postsSaved) {
            return res.status(404).json({
                success: false,
                message: "Aucun favori trouvé pour cet utilisateur"
            });
        };
        res.status(200).json({
            success: true,
            message: "Favoris récupérés avec succès",
            postsSaved: postsSaved
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des favoris de l'utilisateur :", error);
        res.status(500).json({
            success: false,
            message: "Erreur technique, réessayez plus tard"
        });
    };
};

const getUserNotifications = async (req, res) => {
    const { userID } = req.params;

    try {
        const data = await collectUserNotifications(userID);
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Aucune notification trouvée pour cet utilisateur"
            });
        };
        res.status(200).json({
            success: true,
            message: "Notifications récupérées avec succès",
            data: data
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des notifications de l'utilisateur :", error);
        res.status(500).json({
            success: false,
            message: "Erreur technique, réessayez plus tard"
        });
    };
};

const readUserNotification = async (req, res) => {
    const { userID, notificationID } = req.params;

    try {
        const isRead = await markNotificationAsRead(userID, notificationID);
        if (!isRead) {
            return res.status(404).json({
                success: false,
                message: "Notification non trouvée"
            });
        };
        res.status(200).json({
            success: true,
            message: "Notification marquée comme lue avec succès"
        });
    } catch (error) {
        console.error("Erreur lors de la lecture de la notification de l'utilisateur :", error);
        res.status(500).json({
            success: false,
            message: "Erreur technique, réessayez plus tard"
        });
    };
};


module.exports = {
    getUsersOnline,
    getUsersOffline,
    getUsersData,
    getUserData,
    getUserFavorites,
    getUserNotifications,
    getUserPermissions,
    modifyUserFields,
    readUserNotification,
    setUserOnline,
    sendUserNotification,
    toggleFavorites,
    updateInteractionByUserID
};