const { auth, firestore, admin } = require('../config/firebase-admin');
const { sendCode, sendAdminEmail, sendNewDeviceAlert } = require('../controllers/emailController');
const { monthNames, generateVerificationCode, getUserProfileNumber } = require('../func');
const { trackUserDevice } = require('../services/apiServices');


const currentDate = new Date();
const expirationTime = new Date().setMinutes(currentDate.getMinutes() + 15); // Ajouter 15 minutes
const oneMonthLater = new Date(currentDate);
oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);


const createUser = async (address, city, country, email, password, firstName, lastName, phoneNumber, displayName) => {
    try {
        const userRecord = await auth.createUser({
            email: email,
            password: password,
            disabled: false,
            emailVerified: false,
            phoneNumber: phoneNumber,
            displayName: `${firstName} ${lastName}`
        });

        console.log('Utilisateur créé avec succès:', userRecord.uid);

        const code = generateVerificationCode();
        const profileNumber = getUserProfileNumber();

        // Récupération de la promotion active
        const promotionsRef = firestore.collection('PROMOTIONS').doc('launchOffer');
        const promotionDoc = await promotionsRef.get();

        let maxAds = 3;
        let maxPhotos = 3;
        let expiryDate = null;

        if (promotionDoc.exists) {
            const promotion = promotionDoc.data();
            const now = new Date();

            if (promotion.enabled && promotion.startDate.toDate() <= now && now <= promotion.endDate.toDate()) {
                console.log("Promotion active, application des limites promotionnelles.");
                maxAds = promotion.features.maxAdsPerMonth;
                maxPhotos = promotion.features.maxPhotosPerAd;
                expiryDate = promotion.endDate;
            }
        }

        // Ajouter les informations de l'utilisateur dans Firestore
        const userRef = firestore.collection('USERS').doc(userRecord.uid);
        await userRef.set({
            address,
            adHistory: [],
            adsClicked: [],
            adsCount: 0,
            adsPostedThisMonth: 0,
            adsSaved: [],
            adsViewed: [],
            categoriesViewed: [],
            city,
            clicksOnAds: 0,
            country,
            coverChanges: { count: 0, lastUpdated: null },
            coverURL: null,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            currentMonth: monthNames[currentDate.getMonth()],
            currentYear: new Date().getFullYear(),
            displayName: `${firstName} ${lastName}`,
            email,
            emailVerified: false,
            expirationTime: expirationTime,
            firstName,
            isActive: true,
            isOnline: false,
            lastName,
            location: `${country}, ${city}, ${address}`,
            loginCount: 0,
            phoneNumber,
            plans: {
                individual: {
                    max_ads: maxAds,
                    max_photos: maxPhotos,
                    isActive: true,
                    type: 'individual',
                    subscriptionDate: admin.firestore.FieldValue.serverTimestamp(),
                    expiryDate: expiryDate,
                },
            },
            profilChanges: { count: 0, lastUpdated: null },
            profileType: "Particulier",
            profileViewed: 0,
            profileNumber: profileNumber,
            profilURL: null,
            ratings: {
                average: 0,
                total: 0,
                count: 0,
                distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            },
            role: 'user',
            reviews: {
                received: [],
                given: [],
                lastReviewDate: null,
                totalReviews: 0,
                pendingReviews: [],
                reportedReviews: [],
                verifiedReviews: 0,
                helpfulVotes: 0,
            },
            searchHistory: [],
            socialLinks: null,
            timeSpent: 0,
            totalAdsViewed: 0,
            userID: userRecord.uid,
            verificationCode: code,
        });

        // Envoi du code de vérification par email
        sendCode(displayName, email, code)
            .then(() => console.log('Code de vérification envoyé avec succès:', code))
            .catch(error => console.error('Erreur:', error.message));

        console.log('Utilisateur enregistré avec succès', userRecord.uid);

        return { userRecord, code };
    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur:", error);
    }
};


const signinUser = async (userID, deviceInfo) => {
    try {
        if (!userID || !deviceInfo) {
            throw new Error("Données incomplètes.");
        }

        const userRef = firestore.collection('USERS').doc(userID);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            throw new Error("Utilisateur introuvable.");
        }

        const userData = userDoc.data();
        const { displayName, email, loginCount = 0 } = userData;

        if (loginCount === 0) {
            // Première connexion : enregistrement de l'appareil comme vérifié
            const userDevicesRef = userRef.collection('DEVICES');
            await userDevicesRef.add({
                ...deviceInfo,
                verified: true,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            // Mettre à jour le loginCount et statut de connexion
            await userRef.update({
                loginCount: 1,
                isOnline: true,
                lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            console.log("Première connexion validée :", userID);
            return {
                success: true,
                message: "Connexion réussie (première connexion).",
            };
        }

        // 🔹 Vérification de l'appareil pour les connexions suivantes
        const { requiresVerification, deviceID } = await trackUserDevice(userID, deviceInfo, email, displayName);

        if (requiresVerification) {
            // 📩 Envoi de l'alerte email pour validation de l'appareil
            await sendNewDeviceAlert(email, displayName, deviceInfo, deviceID);
            return {
                success: false,
                status: "pending_verification",
                message: "Nouvel appareil détecté. Vérifiez votre email pour autoriser la connexion.",
            };
        }

        // 🔹 Mise à jour des informations utilisateur après connexion réussie
        await userRef.update({
            isOnline: true,
            lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
            loginCount: admin.firestore.FieldValue.increment(1),
        });

        console.log("Connexion réussie :", userID);
        return {
            success: true,
            message: "Connexion réussie.",
        };
    } catch (error) {
        console.error("Erreur dans signinUser :", error.message);
        return { success: false, message: error.message };
    }
};

const logoutUser = async (email) => {
    try {
        const userRecord = await auth.getUserByEmail(email);
        if (!userRecord) {
            throw new Error("Utilisateur introuvable dans Firebase Authentication.");
        };
        const userSnapshot = await firestore.collection('USERS').doc(userRecord.uid).get();

        if (!userSnapshot.exists) {
            throw new Error("Les données utilisateur sont introuvables dans la base Firestore.");
        }

        await userSnapshot.ref.update({
            isOnline: false,
            lastLogoutAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        await auth.revokeRefreshTokens(userRecord.uid);

        console.log('Déconnexion réussie');
        return true;
    } catch (error) {
        console.error('Erreur lors de la déconnexion', error);
    }
};

const deletionUser = async (userID) => {
    try {
        const userSnapshot = await firestore.collection('USERS')
            .where('userID', '==', userID)
            .limit(1)
            .get();

        if (userSnapshot.empty) {
            console.log('Utilisateur non trouvé');
            return false;
        }
        const userDocID = userSnapshot.docs[0].id;
        await auth.revokeRefreshTokens(userID);
        await firestore.collection('USERS').doc(userDocID).delete();
        await auth.deleteUser(userID);
        console.log('Utilisateur supprimé avec succès');
        return true;
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        return false;
    }
};

const verifyCode = async (email, code) => {
    try {
        // Recherche l'utilisateur dans Firestore par email
        const userSnapshot = await firestore.collection('USERS')
            .where('email', '==', email)
            .limit(1)
            .get();

        if (userSnapshot.empty) {
            console.log('Utilisateur non trouvé');
            return false;
        }

        console.log('Utilisateur trouvé');

        // Récupère le document de l'utilisateur
        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data();
        const { verificationCode, expirationTime } = userData

        console.log('Code stocké dans la base de données:', verificationCode);
        console.log('Code fourni par l\'utilisateur:', code);

        // Comparer le code fourni avec le code stocké
        if (verificationCode !== parseInt(code)) {
            console.error('Code incorrect');
            throw new Error('Code incorrect');
        }

        // Check expiration using Timestamp comparison
        const currentTime = Date.now();
        const expirationMillis = expirationTime._seconds * 1000;

        if (currentTime > expirationMillis) {
            throw new Error('Code expiré');
        }

        // Si tout est correct
        console.log('Code vérifié avec succès');

        const userRecord = await auth.getUserByEmail(email);
        await auth.updateUser(userRecord.uid, {
            emailVerified: true,
        });


        await firestore.collection('USERS').doc(userDoc.id).update({
            emailVerified: true,
            verificationCode: null,
            expirationTime: null,
        });

        console.log('Utilisateur mis à jour avec succès');
        return true;
    } catch (error) {
        console.error('Erreur lors de la vérification du code:', error);
        return false;
    }
};

const updatePassword = async (email, newPassword) => {
    try {
        const userRecord = await auth.getUserByEmail(email);
        await auth.updateUser(userRecord.uid, {
            password: newPassword,
        });
        console.log('Mot de passe mis à jour avec succès');
        return true;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du mot de passe:', error);
        return false;
    };
};

const addNewAdmin = async (firstName, lastName, email, phoneNumber, password, permissions) => {
    try {
        const userRef = firestore
            .collection('USERS')
            .where('email', '==', email)
            .limit(1);

        const userSnapshot = await userRef.get();
        if (!userSnapshot.empty) {
            console.log('Utilisateur déjà existant');
            return false;
        }

        const profileNumber = getUserProfileNumber();

        const user = await auth.createUser({
            email: email,
            emailVerified: true,
            password: password,
            displayName: `${firstName} ${lastName}`,
            phoneNumber: phoneNumber,
            disabled: false,
        });

        await firestore.collection('USERS').doc(user.uid).set({
            userID: user.uid,
            displayName: `${firstName} ${lastName}`,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            isOnline: false,
            lastActivity: admin.firestore.FieldValue.serverTimestamp(),
            permissions: permissions,
            city: null,
            country: null,
            address: null,
            emailVerified: true,
            isActive: true,
            isOnline: false,
            location: null,
            profilURL: null,
            role: 'admin',
            profileNumber: profileNumber,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log('Utilisateur admin créé avec succès');

        await sendAdminEmail(email, password, `${firstName} ${lastName}`);

        return true;
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur admin:', error);
        return false;
    };
};

const authorizeDevice = async (deviceID, verificationToken) => {
    try {
        const tokenDoc = await firestore.collection('DEVICE_VERIFY_TOKENS').doc(deviceID).get();
        if (!tokenDoc.exists) {
            return {
                success: false,
                message: 'Token invalide',
            };
        }

        const tokenData = tokenDoc.data();
        if (tokenData.token !== verificationToken) {
            return {
                success: false,
                message: 'Token invalide',
            };
        }

        if (tokenData.expiresAt < new Date()) {
            return {
                success: false,
                message: 'Token expiré',
            };
        }

        await firestore.collection('DEVICE_VERIFY_TOKENS').doc(deviceID).delete();

        await firestore.collection('USERS').doc(userID).collection('DEVICES').doc(deviceID).update({
            verified: true,
        });

        console.log('Périphérique autorisé avec succès');

        return {
            success: true,
            message: 'Périphérique autorisé avec succès',
        };
    } catch (error) {
        console.error('Erreur lors de l\'autorisation du périphérique:', error);
        return false;
    }
};

const desableDevice = async (deviceID, verificationToken) => {
    try {
        const tokenDoc = await firestore.collection('DEVICE_VERIFY_TOKENS').doc(deviceID).get();
        if (!tokenDoc.exists) {
            return {
                success: false,
                message: 'Token invalide',
            };
        };

        const tokenData = tokenDoc.data();
        if (tokenData.token !== verificationToken) {
            return {
                success: false,
                message: 'Token invalide',
            };
        };

        if (tokenData.expiresAt < new Date()) {
            return {
                success: false,
                message: 'Token expiré',
            };
        };

        await firestore.collection('DEVICE_VERIFY_TOKENS').doc(deviceID).delete();
        await firestore.collection('USERS').doc(userID).collection('DEVICES').doc(deviceID).delete();

        console.log('Périphérique désactivé avec succès');
        return {
            success: true,
            message: 'Périphérique désactivé avec succès',
        };
    } catch (error) {

    }
};

module.exports = {
    addNewAdmin,
    authorizeDevice,
    createUser,
    desableDevice,
    signinUser,
    logoutUser,
    deletionUser,
    updatePassword,
    verifyCode,
};