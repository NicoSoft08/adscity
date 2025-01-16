const { auth, firestore, admin } = require('../config/firebase-admin');
const { sendCode, sendAdminEmail } = require('../controllers/emailController');
const { monthNames, generateVerificationCode, getUserProfileNumber } = require('../func');

const currentDate = new Date();
const expirationTime = new Date().setMinutes(currentDate.getMinutes() + 15); // Ajouter 15 minutes
const oneMonthLater = new Date(currentDate);
oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);


const createDefaultAdmin = async () => {
    const adminEmail = 'n.dahpenielnicolas123@gmail.com';
    const adminPassword = 'admin1234';
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
        const userRecord = await auth.getUserByEmail(adminEmail);
        console.log(`Super administrateur existant : ${userRecord.email}`);

        // Vérifiez si le document existe déjà dans Firestore
        const userRef = firestore.collection('USERS').doc(userRecord.uid);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
            console.log('Le super administrateur existe déjà dans Firestore.');
        } else {
            await sendAdminEmail(adminEmail, `${firstName} ${lastName}`, adminPassword);

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
                permissions: ["SUPER_ADMIN", "MANAGE_USERS", "MANAGE_ADS", "MANAGE_PAYMENTS"],
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            console.log('Super administrateur ajouté dans Firestore.');
        }
    } catch (error) {
        if (error.code === 'auth/user-not-found') {
            // Si l'utilisateur n'existe pas, créez-le dans Firebase Authentication
            const newAdmin = await auth.createUser({
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
            const userRef = firestore.collection('USERS').doc(newAdmin.uid);

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
                permissions: ["SUPER_ADMIN", "MANAGE_USERS", "MANAGE_ADS", "MANAGE_PAYMENTS"],
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            console.log('Super administrateur ajouté dans Firestore.');
        } else {
            console.error('Erreur lors de la création du super administrateur:', error);
        }
    }
}


const createAdmin = async (firstName, lastName, email, password, permissions) => {
    const cleanedEmail = email.trim();
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!validateEmail(cleanedEmail)) {
        return res.status(400).json({
            success: false,
            message: "L'adresse e-mail est invalide.",
        });
    }

    try {
        const userRecord = await auth.createUser({
            email: email,
            password: password,
            displayName: `${firstName} ${lastName}`,
            disabled: false,
            emailVerified: true,
            phoneNumber: null,
            photoURL: null,
        });
        console.log('Admin créé avec succès:', userRecord.uid);

        const profileNumber = getUserProfileNumber();

        // Ajouter les informations de l'utilisateur dans Firestore
        const userRef = firestore.collection('USERS').doc(userRecord.uid);
        await userRef.set({
            displayName: `${firstName} ${lastName}`,
            email,
            firstName,
            lastName,
            phoneNumber: null,
            profileNumber: profileNumber,
            city: null,
            country: null,
            address: null,
            emailVerified: true,
            permissions,
            isActive: true,
            isOnline: false,
            location: null,
            profilURL: null,
            role: 'admin',
            userID: userRecord.uid,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        })
        await sendAdminEmail(email, `${firstName} ${lastName}`, password);
        console.log('Super administrateur ajouté dans Firestore.', userRecord.uid);

        // Enregistrer une notification pour l'admin
        const notification = {
            type: 'new_admin',
            title: 'Nouvel Admin',
            message: `Un nouvel utilisateur ajouté : ${displayName} avec les identifiants suivants : ${email}, ${password}`,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            read: false,
        };

        await firestore.collection('NOTIFICATIONS').add(notification);
    } catch (error) {
        console.error('Erreur lors de la création de l\'admin:', error);
    }
}


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

        // Enregistrer une notification pour l'admin
        const notification = {
            type: 'new_user',
            title: 'Nouvelle inscription',
            message: `Un nouvel utilisateur s'est inscrit : ${displayName}. Code de vérification : ${code}`,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            isRead: false,
        };

        await firestore.collection('NOTIFICATIONS').add(notification);

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


const updateUser = async (email, updatedData) => {
    try {
        const userSnapshot = await firestore.collection('USERS')
            .where('email', '==', email)
            .limit(1)
            .get();

        if (userSnapshot.empty) {
            console.log('Utilisateur non trouvé');
            return false;
        }

        const userDocID = userSnapshot.docs[0].id;

        await firestore.collection('USERS').doc(userDocID).update(updatedData);
        console.log('Données utilisateur mises à jour avec succès');
        return true;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        return false;
    }
};


module.exports = {
    createDefaultAdmin,
    createAdmin,
    createUser,
    updateUser
};