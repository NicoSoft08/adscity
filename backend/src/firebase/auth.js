const { auth, firestore, admin } = require('../config/firebase-admin');
const { sendCode, sendWelcomeEmail, sendAdminEmail } = require('../controllers/emailController');
const { monthNames, generateVerificationCode, getUserProfileNumber } = require('../func');

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


        // Ajouter les informations de l'utilisateur dans Firestore
        const userRef = firestore.collection('USERS').doc(userRecord.uid);

        await userRef.set({
            address,
            adHistory: [], // Liste des annonces vues
            adsClicked: [],
            adsCount: 0,
            adsPostedThisMonth: 0, // Nombre d'annonces postées
            adsSaved: [], // Liste des annonces sauvegardées (ID d'annonces)
            adsViewed: [], // Liste des annonces vues


            categoriesViewed: [], // Catégories d'annonces les plus vues
            city,
            clicksOnAds: 0,
            country,
            coverChanges: {
                count: 0,
                lastUpdated: null,
            },
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
            loginCount: 0, // Nombre de fois que l'utilisateur s'est connecté

            phoneNumber,
            plans: {
                individual: {
                    max_ads: 3,
                    max_photos: 3,
                    isActive: true,
                    type: 'individual', // Par défaut: 'individual', professional, company
                    subscriptionDate: admin.firestore.FieldValue.serverTimestamp(),
                    expiryDate: null,
                },
            },
            profilChanges: {
                count: 0,
                lastUpdated: null,
            },
            profileType: "Particulier", // Par défaut: Particulier, Entrprise, Professionnel
            profileViewed: 0, // Nombre de fois que le profil a été consulté
            profileNumber: profileNumber, // Numéro de profil unique
            profilURL: null,

            // Rating System
            ratings: {
                average: 0,
                total: 0,
                count: 0,
                distribution: {
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0
                }
            },
            role: 'user', // superadmin, admin, moderator, user

            // Reviews System
            reviews: {
                received: [],        // Reviews received from others
                given: [],          // Reviews given to others
                lastReviewDate: null,
                totalReviews: 0,
                pendingReviews: [],  // Reviews waiting for response
                reportedReviews: [], // Reviews that were reported
                verifiedReviews: 0,  // Number of verified reviews
                helpfulVotes: 0      // Total helpful votes received
            },

            searchHistory: [], // Historique des recherches effectuées

            timeSpent: 0, // Durée totale passée dans l'application
            totalAdsViewed: 0,

            userID: userRecord.uid,

            verificationCode: code,
        });


        // Envoi du code par email
        sendCode(displayName, email, code)
            .then(() => {
                console.log('Code de vérification envoyé avec succès:', code);
            })
            .catch(error => {
                console.error('Erreur:', error.message);
            });


        console.log('Utilisateur créé avec succès', userRecord.uid);

        return { userRecord, code };
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
    }
};

const signinUser = async (email, emailVerified) => {
    try {
        if (!emailVerified) {
            throw new Error("L'email de l'utilisateur n'est pas encore vérifié.");
        }

        // Récupération de l'utilisateur dans Firebase Authentication
        const userRecord = await auth.getUserByEmail(email);
        if (!userRecord) {
            throw new Error("Utilisateur introuvable dans Firebase Authentication.");
        }

        if (!userRecord.emailVerified) {
            throw new Error("L'email de l'utilisateur n'est pas encore vérifié dans Firebase.");
        }

        // Récupération des données utilisateur dans Firestore
        const userRef = firestore.collection('USERS').doc(userRecord.uid);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            throw new Error("Les données utilisateur sont introuvables dans la base Firestore.");
        }

        const userData = userDoc.data();
        const { displayName, loginCount = 0, role } = userData;

        // Si c'est la première connexion, envoie un email de bienvenue
        if (loginCount === 0) {
            try {
                console.log("Appel à sendWelcomeEmail...");
                await sendWelcomeEmail(displayName, email);
                console.log("Email de bienvenue envoyé.");
            } catch (error) {
                console.error("Erreur lors de l'envoi de l'email de bienvenue :", error);
            }

            // Mise à jour des données utilisateur
            await userRef.update({
                isOnline: true,
                loginCount: 1,
                lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
            });
        } else {
            // Mise à jour de la date de dernière connexion
            await userRef.update({
                isOnline: true,
                lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
            });
        }

        console.log("Connexion réussie", userRecord.uid);
        return { userData, role };
    } catch (error) {
        console.error("Erreur dans signinUser :", error.message);
        throw error; // Propagation de l'erreur au contrôleur
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

module.exports = {
    addNewAdmin,
    createUser,
    signinUser,
    logoutUser,
    deletionUser,
    updatePassword,
    verifyCode,
};