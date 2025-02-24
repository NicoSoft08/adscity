const { admin, auth, firestore } = require("../config/firebase-admin");
const { sendAdminEmail } = require("../controllers/emailController");
const { getUserProfileNumber } = require("../func");


const createDefaultAdmin = async () => {
    const adminEmail = 'koffigalloharistide@gmail.com';
    const adminPassword = 'admin1234';
    const firstName = "Aristide";
    const lastName = "GALLOH";
    const country = 'Russie';
    const city = 'Rostov-Na-Donu';
    const address = 'Ulitsa 2-ya Krasnodarskaya 113/1';
    const adminPhoneNumber = '+79001220465';
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
            console.log('L\'administrateur existe déjà dans Firestore.');
        } else {
            await sendAdminEmail(adminEmail, adminPassword, `${firstName} ${lastName}`);

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
                permissions: ["MANAGE_USERS", "MANAGE_ADS"],
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            console.log('Administrateur ajouté dans Firestore.');
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

            console.log(`Administrateur créé : ${newAdmin.email}`);

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
                permissions: ["MANAGE_USERS", "MANAGE_ADS"],
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            console.log('Administrateur ajouté dans Firestore.');
        } else {
            console.error('Erreur lors de la création de l\'administrateur:', error);
        }
    }
};

const createDefaultSuperAdmin = async () => {
    const adminEmail = 'admin@adscity.net';
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
        // 🔹 Vérifie si l'utilisateur existe déjà dans Firebase Authentication
        let userRecord;
        try {
            userRecord = await auth.getUserByEmail(adminEmail);
            console.log(`✅ Super administrateur existant : ${userRecord.email}`);
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                console.log("⚠️ Super administrateur introuvable, création en cours...");
                userRecord = await auth.createUser({
                    email: adminEmail,
                    password: adminPassword,
                    disabled: false,
                    emailVerified: true,
                    phoneNumber: adminPhoneNumber,
                    displayName: `${firstName} ${lastName}`,
                    profilURL: profilURL,
                });
                console.log(`✅ Super administrateur créé : ${userRecord.email}`);
            } else {
                throw error;
            }
        }

        // 🔹 Vérifie si le document existe déjà dans Firestore
        const userRef = firestore.collection('USERS').doc(userRecord.uid);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
            console.log('✅ Le super administrateur existe déjà dans Firestore.');
            return;
        }

        // 📌 Récupérer le dernier utilisateur créé (trié par `UserID`)
        const lastUserSnapshot = await firestore.collection('USERS').orderBy('UserID', 'desc').limit(1).get();
        let lastUserID = "USER000";
        
        if (!lastUserSnapshot.empty) {
            lastUserID = lastUserSnapshot.docs[0].data().UserID;
        }

        // 📌 Extraire le numéro et incrémenter
        const lastNumber = parseInt(lastUserID.replace("USER", ""), 10);
        const newNumber = lastNumber + 1;
        const newUserID = `USER${String(newNumber).padStart(3, "0")}`; // Format USER001, USER002, etc.

        // 📌 Ajouter le super admin dans Firestore
        await userRef.set({
            displayName: `${firstName} ${lastName}`,
            email: adminEmail,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: adminPhoneNumber,
            UserID: newUserID,  // 🔥 Ajout de l'ID généré
            city: city,
            country: country,
            address: address,
            emailVerified: true,
            isActive: true,
            isOnline: false,
            profileNumber: profileNumber,
            location: `${country}, ${city}, ${address}`,
            profilURL: profilURL,
            role: 'admin',
            userID: userRecord.uid,
            permissions: ["SUPER_ADMIN", "MANAGE_USERS", "MANAGE_ADS", "MANAGE_PAYMENTS"],
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log(`🚀 Super administrateur ajouté dans Firestore avec UserID: ${newUserID}`);

        // 🔹 Envoi des identifiants par email
        await sendAdminEmail(adminEmail, adminPassword, `${firstName} ${lastName}`);
    } catch (error) {
        console.error('❌ Erreur lors de la création du super administrateur:', error);
    }
};



const createAdmin = async (firstName, lastName, email, phoneNumber, password, permissions) => {

    try {
        const userRecord = await auth.createUser({
            email: email,
            password: password,
            phoneNumber: phoneNumber,
            displayName: `${firstName} ${lastName}`,
            disabled: false,
            emailVerified: true,
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
            phoneNumber: phoneNumber,
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
    } catch (error) {
        console.error('Erreur lors de la création de l\'admin:', error);
    }
}


module.exports = {
    createDefaultSuperAdmin,
    createDefaultAdmin,
    createAdmin,
};
