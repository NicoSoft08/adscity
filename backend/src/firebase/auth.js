const admin = require('firebase-admin');
const { sendCode } = require('../controllers/emailController');
const { monthNames, generateVerificationCode, getUserProfileNumber } = require('../func');

const currentDate = new Date();
const expirationTime = new Date().setMinutes(currentDate.getMinutes() + 15); // Ajouter 15 minutes
const oneMonthLater = new Date(currentDate);
oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);


const createUser = async (email, password, firstName, lastName, phoneNumber, displayName, country, city, address, deviceInfo) => {
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

            displayName: displayName || `${firstName} ${lastName}`, // si displayName est fourni

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
            profilChanges: {
                count: 0,
                lastUpdated: null,
            },
            profileViewed: 0, // Nombre de fois que le profil a été consulté
            plans: {
                basic: {
                    price: 0, // Gratuit
                    validity_days: 30, // Validité 15 jours
                    max_ads: 3, // 1 annonce par mois
                    max_photos: 3, // Jusqu'à 3 photos gratuites
                    visibility: "Basique", // Visibilité normale
                    support: "Standard" // Assistance standard
                },
            },
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
            role: 'user', // admin, moderator, user

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

        await userRef.collection('DEVICES').add({
            ...deviceInfo,
            lastLogin: admin.firestore.FieldValue.serverTimestamp()
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
    createUser,
    updateUser
};