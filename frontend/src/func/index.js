import { format, isToday, isYesterday } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';

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


const formateDate = (newDate, language) => {
    const date = new Date(newDate);

    if (isToday(date)) {
        return language === 'FR'
            ? `Aujourd'hui à ${format(date, 'HH:mm', { locale: fr })}`
            : `Today at ${format(date, 'HH:mm', { locale: enUS })}`;
    }

    if (isYesterday(date)) {
        return language === 'FR'
            ? `Hier à ${format(date, 'HH:mm', { locale: fr })}`
            : `Yesterday at ${format(date, 'HH:mm', { locale: enUS })}`;
    }

    return language === 'FR'
        ? format(date, "d MMMM yyyy 'à' HH:mm", { locale: fr })
        : format(date, "MMMM d, yyyy 'at' HH:mm", { locale: enUS });
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


const formatTimeDistance = (timestamp) => {
    // Vérification si le timestamp est un Firestore timestamp
    if (typeof timestamp === 'object' && '_seconds' in timestamp) {
        timestamp = new Date(timestamp._seconds * 1000); // Conversion des secondes en millisecondes
    } else if (typeof timestamp === 'string' || timestamp instanceof Date) {
        timestamp = new Date(timestamp); // Conversion directe pour les chaînes de date ou instances Date
    } else {
        return 'Date non valide';
    }

    // Vérifier si la date est valide
    if (isNaN(timestamp.getTime())) {
        return 'Date non valide';
    }

    const now = new Date();
    const seconds = Math.floor((now - timestamp) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} y`;
    if (weeks > 0) return `${weeks} w`;
    if (days > 0) return `${days} d`;
    if (hours > 0) return `${hours} h`;
    if (minutes > 0) return `${minutes} min`;
    return `${seconds} sec`;
}

const interpolationSearch = (arr, target) => {
    let low = 0, high = arr.length - 1;

    while (low <= high && target >= arr[low] && target <= arr[high]) {
        // Calcul de la position estimée
        let pos = low + Math.floor(((target - arr[low]) * (high - low)) / (arr[high] - arr[low]));

        // Si on trouve l'élément
        if (arr[pos] === target) return pos;

        // Ajustement des bornes
        if (arr[pos] < target) low = pos + 1;
        else high = pos - 1;
    }
    return -1; // Élément non trouvé
};

const extractSuggestions = (categories, lang = "fr") => {
    let suggestions = [];

    categories.forEach(category => {
        const categoryName = category.categoryTitles[lang];

        // Ajouter chaque sous-catégorie avec sa catégorie principale
        category.container.forEach(sub => {
            suggestions.push({
                id: sub.sousCategoryId,
                name: sub.sousCategoryTitles[lang], // Nom de la sous-catégorie
                category: categoryName, // Catégorie principale
                type: "subCategory",
            });
        });

        // Ajouter la catégorie principale comme suggestion aussi
        suggestions.push({
            id: category.categoryId,
            name: categoryName,
            category: null, // Pas de catégorie parent pour une catégorie principale
            type: "category",
        });
    });

    return suggestions;
};

export {
    calculateExpiryDate,
    formateDate,
    formateDateTimestamp,
    formatViewCount,
    formatPostedAt,
    parseTimestamp,
    calculateEndDate,
    formatTimeDistance,
    formatSpecialFeatures,
    interpolationSearch,
    extractSuggestions,
};