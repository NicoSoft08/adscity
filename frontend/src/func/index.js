import { format, isToday, isYesterday } from 'date-fns';
import { fr } from 'date-fns/locale';



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

const parseTimestamp = (timestamp) => {
    const timestampDate = new Date(timestamp?._seconds * 1000 + timestamp?._nanoseconds / 1000000);
    return timestampDate;
}


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

const formatPostedAt = (posted_at) => {
    const date = new Date(posted_at);

    if (isNaN(date)) {
        console.error("Invalid date:", posted_at);
        return "Date non valide"; // Fallback value if date is invalid
    }


    if (isToday(date)) {
        return `Aujourd'hui ${format(date, 'HH:mm', { locale: fr })}`;
    }

    if (isYesterday(date)) {
        return `Hier ${format(date, 'HH:mm', { locale: fr })}`;
    }

    return format(date, 'd MMMM HH:mm', { locale: fr });
}

const calculateExpiryDate = (durationInDays) => {
    const currentDate = new Date();
    const expiryDate = new Date(currentDate.setDate(currentDate.getDate() + durationInDays));
    return expiryDate;
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



const calculateEndDate = (duration) => {
    const startDate = new Date();
    let endDate = new Date(startDate);

    if (duration === '7 Jours') {
        endDate.setDate(startDate.getDate() + 7); // Adds 7 days
    } else if (duration === 'Mois') {
        endDate.setMonth(startDate.getMonth() + 1); // Adds 1 month
    } else if (duration === '3 Mois') {
        endDate.setMonth(startDate.getMonth() + 3); // Adds 3 months
    }

    return endDate.toISOString(); // Format the date in ISO format
};


export {
    calculateExpiryDate,
    formateDate,
    formateDateTimestamp,
    formatViewCount,
    formatPostedAt,
    parseTimestamp,
    calculateEndDate,
};