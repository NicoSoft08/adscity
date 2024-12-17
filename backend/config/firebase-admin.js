const  admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");


// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: "https://your-project-id.firebaseio.com"
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