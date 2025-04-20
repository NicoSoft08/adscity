import { firestore } from '../firebaseConfig';
import { format, isToday, isYesterday } from 'date-fns';
import { doc, setDoc } from 'firebase/firestore';
import { fr } from 'date-fns/locale';

const parseTimestamp = (timestamp) => {
    const timestampDate = new Date(timestamp?._seconds * 1000 + timestamp?._nanoseconds / 1000000);
    return timestampDate;
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

const calculateExpiryDate = (durationInDays) => {
    const currentDate = new Date();
    const expiryDate = new Date(currentDate.setDate(currentDate.getDate() + durationInDays));
    return expiryDate;
};

// Fonction pour sauvegarder le token sur le serveur
const saveFcmToken = async (userID, token) => {
    try {
        const userRef = doc(firestore, 'USERS', userID);
        await setDoc(userRef, { fcmToken: token }, { merge: true });
        console.log('Token FCM sauvegardé avec succès.');
    } catch (error) {
        console.error('Erreur lors de la sauvegarde du token FCM:', error);
    }
};

const formatViewCount = (count) => {
    if (!count && count !== 0) {
        return '0'; // Default to 0 if count is undefined or null
    }

    if (count >= 1000000) {
        return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (count >= 1000) {
        return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return count.toString();
};

const formatSpecialFeatures = (features) => {
    if (!features) return '';

    // If features is an array, join with commas
    if (Array.isArray(features)) {
        return features.join(', ');
    }

    // If features is an object, get selected values
    if (typeof features === 'object') {
        const selectedFeatures = Object.entries(features)
            .filter(([_, selected]) => selected)
            .map(([feature]) => feature);
        return selectedFeatures.join(', ');
    }

    return features;
};


const calculateEndDate = (duration) => {
    const today = new Date();
    
    switch (duration) {
        case '7 Jours':
            return new Date(today.setDate(today.getDate() + 7)).toISOString();
        case 'Mois':
            return new Date(today.setMonth(today.getMonth() + 1)).toISOString();
        case '3 Mois':
            return new Date(today.setMonth(today.getMonth() + 3)).toISOString();
        default:
            return today.toISOString();
    }
};


const validatePhoneNumber = (phoneNumber) => {
    const e164Regex = /^\+?[1-9]\d{1,14}$/;
    return e164Regex.test(phoneNumber);
};



export {
    parseTimestamp,
    calculateExpiryDate,
    formateDate,
    formateDateTimestamp,
    saveFcmToken,
    formatSpecialFeatures,
    calculateEndDate,
    validatePhoneNumber,
    formatViewCount,
};