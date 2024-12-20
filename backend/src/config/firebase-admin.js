const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount");


// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),    
});

const auth = admin.auth();
const firestore = admin.firestore();
const storage = admin.storage();


// Export the Firebase Admin SDK objects
module.exports = {
    admin,
    auth,
    firestore,
    storage
};