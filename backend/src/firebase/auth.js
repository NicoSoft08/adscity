const admin = require('firebase-admin');
const { sendCode } = require('../controllers/emailController');
const { monthNames, generateVerificationCode, getUserProfileNumber } = require('../func');

const currentDate = new Date();
const expirationTime = new Date().setMinutes(currentDate.getMinutes() + 15); // Ajouter 15 minutes
const oneMonthLater = new Date(currentDate);
oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);


const createDefaultAdmin = async () => {
    const adminEmail = 'admin@adscity.net';
    const adminPassword = 'nico_soft08';
    const firstName = "Nicolas";
    const lastName = "N'DAH";
    const country = 'Russie';
    const city = 'Rostov-Na-Donu';
    const address = 'Ulitsa 2-ya Krasnodarskaya 113/1';
    const adminPhoneNumber = '+79017087027';
    const profilURL = null;
    const profileNumber = getUserProfileNumber();

    try {
        // Vérifiez si l'utilisateur existe déjà dans Firebase Authentication
        const userRecord = await admin.auth().getUserByEmail(adminEmail);
        console.log(`Super administrateur existant : ${userRecord.email}`);

        // Vérifiez si le document existe déjà dans Firestore
        const userRef = admin.firestore().collection('USERS').doc(userRecord.uid);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
            console.log('Le super administrateur existe déjà dans Firestore.');
        } else {
            // Ajoutez les informations supplémentaires dans Firestore si elles manquent
            await userRef.set({
                displayName: `${firstName} ${lastName}`,
                email: adminEmail,
                firstName: firstName,
                lastName: lastName,
                phoneNumber: adminPhoneNumber,
                profileNumber: profileNumber,
                city: city,
                country: country,
                address: address,
                emailVerified: true,
                isActive: true,
                isOnline: false,
                location: `${country}, ${city}, ${address}`,
                profilURL: profilURL,
                role: 'admin',
                userID: userRecord.uid,
                permissions: [
                    "MANAGE_USERS",          // Gérer les utilisateurs (création, modification, suppression)
                    "MANAGE_ADS",            // Modérer les annonces
                    "MANAGE_PAYMENTS",       // Gérer les abonnements et les paiements
                    "VIEW_REPORTS",          // Accéder aux rapports et statistiques
                    "ACCESS_ALL_DATA",       // Accès à toutes les données de la plateforme
                    "MODIFY_SETTINGS",       // Modifier les paramètres de la plateforme
                    "SEND_NOTIFICATIONS",    // Envoyer des notifications globales
                    "MANAGE_SECURITY",       // Gérer les configurations de sécurité
                    "MANAGE_TESTS",          // Superviser les tests et fonctionnalités bêta
                    "MANAGE_ROLES",
                ],
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            console.log('Super administrateur ajouté dans Firestore.');
        }
    } catch (error) {
        if (error.code === 'auth/user-not-found') {
            // Si l'utilisateur n'existe pas, créez-le dans Firebase Authentication
            const newAdmin = await admin.auth().createUser({
                email: adminEmail,
                password: adminPassword,
                disabled: false,
                emailVerified: true,
                phoneNumber: adminPhoneNumber,
                displayName: `${firstName} ${lastName}`,
                profilURL: profilURL,
            });

            console.log(`Super administrateur créé : ${newAdmin.email}`);

            // Ensuite, enregistrez-le dans Firestore
            const userRef = admin.firestore().collection('USERS').doc(newAdmin.uid);

            await userRef.set({
                displayName: `${firstName} ${lastName}`,
                email: adminEmail,
                firstName: firstName,
                lastName: lastName,
                phoneNumber: adminPhoneNumber,
                profileNumber: profileNumber,
                city: city,
                country: country,
                address: address,
                emailVerified: true,
                isActive: true,
                isOnline: false,
                location: `${country}, ${city}, ${address}`,
                profilURL: profilURL,
                role: 'admin',
                userID: newAdmin.uid,
                permissions: [
                    "MANAGE_USERS",          // Gérer les utilisateurs (création, modification, suppression)
                    "MANAGE_ADS",            // Modérer les annonces
                    "MANAGE_PAYMENTS",       // Gérer les abonnements et les paiements
                    "VIEW_REPORTS",          // Accéder aux rapports et statistiques
                    "ACCESS_ALL_DATA",       // Accès à toutes les données de la plateforme
                    "MODIFY_SETTINGS",       // Modifier les paramètres de la plateforme
                    "SEND_NOTIFICATIONS",    // Envoyer des notifications globales
                    "MANAGE_SECURITY",       // Gérer les configurations de sécurité
                    "MANAGE_TESTS",          // Superviser les tests et fonctionnalités bêta
                    "MANAGE_ROLES",
                ],
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            console.log('Super administrateur ajouté dans Firestore.');
        } else {
            console.error('Erreur lors de la création du super administrateur:', error);
        }
    }
}


const createUser = async (email, password, displayName, firstName, lastName, phoneNumber, country, city, address) => {
    try {
        const userRecord = await admin.auth().createUser({
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
        const userRef = admin.firestore().collection('USERS').doc(userRecord.uid);

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

        return userRecord;
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
    }
};


const updateUser = async (email, updatedData) => {
    try {
        const userSnapshot = await admin.firestore().collection('USERS')
            .where('email', '==', email)
            .limit(1)
            .get();

        if (userSnapshot.empty) {
            console.log('Utilisateur non trouvé');
            return false;
        }

        const userDocID = userSnapshot.docs[0].id;

        await admin.firestore().collection('USERS').doc(userDocID).update(updatedData);
        console.log('Données utilisateur mises à jour avec succès');
        return true;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        return false;
    }
};


module.exports = {
    createDefaultAdmin,
    createUser,
    updateUser
};