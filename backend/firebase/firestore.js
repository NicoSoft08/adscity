const admin = require('firebase-admin');
const { sendDeviceVerificationEmail } = require('../controllers/emailController');

const sendUserNotification = async (userID, notification) => {
    try {
        if (notification) {
            await admin.firestore().collection('NOTIFICATIONS').add({
                userID: userID,
                title: notification.title,
                message: notification.message,
                time: admin.firestore.FieldValue.serverTimestamp(),
                isRead: false,
            });

            console.log('Une notification a été envoyée pour: ', notification.title);
        } else {
            throw new Error('Erreur d\'envoi de la notification');
        }
    } catch (error) {

    }
};


const paymentProcessing = async (paymentData, userID) => {
    try {

    } catch (error) {

    }
}


const getUserIncompleteField = async (userID) => {
    try {
        const userSnapshot = await admin.firestore().collection('USERS').doc(userID).get();

        if (userSnapshot.exists) {
            throw new Error('Utilisateur non trouvé');
        }

        const userData = userSnapshot.data();
        const notifications = [];

        const location = userData.location;
        const address = userData.address;

        if (!location) {
            notifications.push({
                title: 'Ville, Pays manquants',
                message: "Vous devez renseigner la ville et le pays d'où vous résidez, pour une meilleur expérience utilisateur.",
            });
        }

        if (!address) {
            notifications.push({
                title: 'Adresse manquants',
                message: "Vous devez renseigner une adresse, pour une meilleur expérience utilisateur.",
            });
        }

        return notifications;
    } catch (error) {
        console.error('Erreur lors de la récupération des champs incomplets:', error.message);
        throw new Error('Erreur lors du chargement des champs incomplets');
    }
};


const markNotificationAsRead = async (notificationID) => {
    try {
        const notificationRef = admin.firestore().collection('NOTIFICATIONS').doc(notificationID);
        await notificationRef.update({ read: true });
        console.log('Notification marquée comme lue.');
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la notification:', error);
        throw new Error('Erreur lors de la mise à jour de la notification.');
    }
};

// Fonction pour obtenir les données de l'utilisateur par son ID
const getUserDataByID = async (userID) => {
    try {
        const userSnapshot = await admin.firestore().collection('USERS').doc(userID).get();

        if (!userSnapshot.exists) {
            throw Error('Utilisateur non trouvé');
        }

        const userData = userSnapshot.data();

        return userData;
    } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
        throw Error('Erreur lors de la récupération des données utilisateur');
    }
};


const updateUserByField = async (userID, field, value) => {
    try {
        const userRef = admin.firestore().collection('USERS').doc(userID);

        await userRef.update({ [field]: value });

        const userDoc = await userRef.get();

        const userData = userDoc.data();

        const { firstName, lastName, city, country } = userData;

        await userRef.update({
            displayName: `${firstName} ${lastName}`,
            location: `${city}, ${country}`,
        });

        console.log('Mise à jour réussie');
    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
    }
};

// Fonction pour mettre à jour l'URL de profil
const updateUserProfileURL = async (userID, file) => {
    try {
        const userRef = admin.firestore().collection('USERS').doc(userID);

        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            throw new Error('Utilisateur non trouvé');
        }

        await userRef.update({ profilURL: file });

        console.log('URL de profil mise à jour avec succès');
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'URL de profil:', error);
        throw new Error('Échec de la mise à jour du profil');
    }
};

// Fonction pour récupérer l'URL de profil
const getUserProfileURL = async (userID) => {
    try {
        const userRef = admin.firestore().collection('USERS').doc(userID);

        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            throw new Error('Utilisateur non trouvé');
        }

        const userData = userDoc.data();
        const { profilURL } = userData;

        return profilURL;
    } catch (error) {
        console.error('Erreur lors de la collecte de l\'URL de profil:', error);
        throw new Error('Échec de la collecte du profil');
    }
}

// Fonction pour mettre à jour l'URL de couverture
const updateUserCoverURL = async (userID, file) => {
    try {
        const userRef = admin.firestore().collection('USERS').doc(userID);

        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            throw new Error('Utilisateur non trouvé');
        }

        await userRef.update({ coverURL: file });

        console.log('URL de profil mise à jour avec succès');
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'URL de profil:', error);
        throw new Error('Échec de la mise à jour du profil');
    }
};


const verifyUserDevice = async (userID, deviceInfo) => {
    try {
        const deviceRef = admin.firestore().collection('USERS').doc(userID).collection('DEVICES');
        const devicesSnapshot = await deviceRef.get();

        // First-time login case
        if (devicesSnapshot.empty) {
            const newDevice = await deviceRef.add({
                ...deviceInfo,
                lastUsed: admin.firestore.FieldValue.serverTimestamp(),
                status: 'verified'
            });

            return {
                verified: true,
                deviceId: newDevice.id,
                message: 'Premier périphérique vérifié'
            };
        }

        // Check against existing devices
        let isKnownDevice = false;
        devicesSnapshot.forEach(doc => {
            const device = doc.data();
            if (
                device.browser === deviceInfo.browser &&
                device.os === deviceInfo.os &&
                device.ipAddress === deviceInfo.ipAddress
            ) {
                isKnownDevice = true;
                deviceRef.doc(doc.id).update({
                    lastUsed: admin.firestore.FieldValue.serverTimestamp()
                });
            }
        });

        // New device detected - requires verification
        if (!isKnownDevice) {
            // Disable user account
            await admin.auth().updateUser(userID, {
                disabled: true
            });
            const userRef = admin.firestore().collection('USERS').doc(userID);
            const userDoc = await userRef.get();
            const { email, displayName } = userDoc.data();

            const newDeviceRef = await deviceRef.add({
                ...deviceInfo,
                lastUsed: admin.firestore.FieldValue.serverTimestamp(),
                status: 'pending_verification'
            });

            await sendDeviceVerificationEmail(email, displayName, deviceInfo, newDeviceRef.id);

            return {
                verified: false,
                requiresVerification: true,
                deviceId: newDeviceRef.id,
                accountStatus: 'disabled'
            };
        }

        return {
            verified: true,
            deviceId: deviceRef.id
        };
    } catch (error) {
        console.error('Device verification error:', error);
        throw error;
    }
};


const saveLocation = async (country, city) => {
    const locationRef = admin.firestore().collection('LOCATIONS');
    const countryDoc = locationRef.doc(country);

    const doc = await countryDoc.get();
    
    if (!doc.exists) {
        await countryDoc.set({
            cities: [city]
        });
    } else {
        if (!doc.data().cities.includes(city)) {
            await countryDoc.update({
                cities: admin.firestore.FieldValue.arrayUnion(city)
            });
        }
    }
};



module.exports = {
    getUserDataByID,
    getUserIncompleteField,
    getUserProfileURL,
    markNotificationAsRead,
    sendUserNotification,
    updateUserByField,
    updateUserCoverURL,
    updateUserProfileURL,
    verifyUserDevice,
    paymentProcessing,
    saveLocation,
};