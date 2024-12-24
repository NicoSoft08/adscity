const multer = require('multer');
const { UAParser } = require('ua-parser-js');
const { format, isToday, isYesterday } = require('date-fns');
const { fr } = require('date-fns/locale');
const crypto = require('crypto');
const { admin, firestore } = require('../config/firebase-admin');


const generateVerificationToken = () => {
    // Generate a 32-byte random token
    const token = crypto.randomBytes(32).toString('hex');
    
    // Add timestamp to ensure uniqueness
    const timestamp = Date.now().toString(36);
    
    return `${token}${timestamp}`;
};


// Generate a random ticket
const generateTicketID = () => {
    // Get current date
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    
    // Format the date part as YYYYMMDD
    const datePart = `${year}${month}${day}`;
    
    // Generate a 5-digit random number
    const randomPart = Math.floor(10000 + Math.random() * 90000); // Ensures a 5-digit number

    const ticketID = `${datePart}${randomPart}`;
    
    // Combine everything to form the ticket ID
    return ticketID;
}

// Fonction pour générer un numéro de profil unique (exemple simple)
const getUserProfileNumber = () => {
    return 'USER - ' + Math.floor(Math.random() * 1000000); // Numéro aléatoire à 6 chiffres
};

// Fonction pour générer un code de vérification
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000); // Génère un code à 6 chiffres
};

const monthNames = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
];


const greetings = () => {
    const hours = new Date().getHours();
    let say = "";

    if (hours <= 12) {
        say = "Bonjour";
    } else if (hours > 12 && hours < 18) {
        say = "Bonsoir";
    } else {
        say = "Bonne nuit";
    }

    return say;
};

const formateDate = (newDate) => {
    const date = new Date(newDate);

    if (isToday(date)) {
        return `Aujourd'hui à ${format(date, 'HH:mm', { locale: fr })}`;
    }

    if (isYesterday(date)) {
        return `Hier à ${format(date, 'HH:mm', { locale: fr })}`;
    }

    return format(date, "d MMMM yyyy 'à' HH:mm", { locale: fr });
}


const formateDateTimestamp = (adTimestamp) => {
    const adDate = new Date(adTimestamp * 1000); // Convertir le timestamp en millisecondes
    const now = new Date();

    const diffTime = now - adDate; // Différence en millisecondes
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Convertir en jours

    const options = { hour: '2-digit', minute: '2-digit' }; // Format de l'heure

    if (diffDays === 0) {
        // Aujourd'hui
        return `Aujourd'hui à ${adDate.toLocaleTimeString('fr-FR', options)}`;
    } else if (diffDays === 1) {
        // Hier
        return `Hier à ${adDate.toLocaleTimeString('fr-FR', options)}`;
    } else if (diffDays === 2) {
        // Avant-hier
        return `Avant-hier à ${adDate.toLocaleTimeString('fr-FR', options)}`;
    } else {
        // Date plus ancienne
        return adDate.toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' }) +
            ` à ${adDate.toLocaleTimeString('fr-FR', options)}`;
    }
};


const trackFirstLoginDevice = async (userID, deviceInfo) => {
    const userDeviceRef = admin.firestore().doc(`USERS/${userID}/DEVICES/INITIAL`);
    
    await userDeviceRef.set({
        firstLoginDate: admin.firestore.FieldValue.serverTimestamp(),
        device: {
            browser: deviceInfo.browser,
            os: deviceInfo.os,
            ipAddress: deviceInfo.ipAddress,
            location: deviceInfo.location,
            deviceType: deviceInfo.deviceType
        },
        isActive: true
    });
    
    return true;
};


const trackUserDevice = async () => {
    const parser = new UAParser();
    const result = parser.getResult();

    const deviceInfo = {
        browser: `${result.browser.name} ${result.browser.version}`,
        os: `${result.os.name} ${result.os.version}`,
        device: result.device.type || 'desktop',
        timestamp: Date.now(),
        ipAddress: await fetchIPAddress()
    };

    return deviceInfo;
};

const fetchIPAddress = async () => {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
};


const upload = multer({
    storage: multer.memoryStorage(),
});


const isDeviceKnown = (deviceInfo, existingDevices) => {
    return existingDevices.some(device =>
        device.browser.name === deviceInfo.browser.name &&
        device.browser.version === deviceInfo.browser.version &&
        device.os.name === deviceInfo.os.name &&
        device.os.version === deviceInfo.os.version &&
        device.ipAddress === deviceInfo.ipAddress
    );
};

const handleDeviceVerification = async (userID, deviceInfo) => {
    const devicesSnapshot = await firestore
        .collection('USERS')
        .doc(userID)
        .collection('DEVICES')
        .get();

    const existingDevices = devicesSnapshot.docs.map(doc => doc.data());

    if (isDeviceKnown(deviceInfo, existingDevices)) {
        return { isKnown: true };
    }

    // Si l'appareil est inconnu, envoyez une alerte et enregistrez-le
    const newDeviceRef = await firestore
        .collection('USERS')
        .doc(userID)
        .collection('DEVICES')
        .add({
            ...deviceInfo,
            lastLogin: admin.firestore.FieldValue.serverTimestamp(),
        });

    return { 
        isKnown: false, 
        deviceID: newDeviceRef.id,
        reason: "Un nouvel appareil a été détecté."
    };
};




module.exports = { 
    formateDateTimestamp,
    generateVerificationCode, 
    generateVerificationToken,
    monthNames, 
    getUserProfileNumber, 
    greetings,
    upload, 
    formateDate,
    generateTicketID,
    trackUserDevice,
    trackFirstLoginDevice,
    handleDeviceVerification,
};