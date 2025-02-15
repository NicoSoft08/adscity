import { UAParser } from 'ua-parser-js';

// 📌 Fonction pour récupérer les informations du périphérique
const collectDeviceInfo = async () => {
    try {
        const parser = new UAParser();
        const result = parser.getResult();

        return {
            browser: result.browser.name || 'Unknown',
            os: result.os.name || 'Unknown',
            device: result.device.type || 'desktop',
            model: result.device.model || 'Unknown',
            ip: await fetchIPAddress(),
        };
    } catch (error) {
        console.error("Erreur lors de la collecte des infos du périphérique :", error);
        return {
            browser: 'Unknown',
            os: 'Unknown',
            device: 'Unknown',
            ip: 'Unknown',
        };
    }
};


// 📌 Fonction pour récupérer l'adresse IP de l'utilisateur
const fetchIPAddress = async () => {
    try {
        const controller = new AbortController();
        const timeoutID = setTimeout(() => controller.abort(), 5000);
        const response = await fetch('https://api.ipify.org?format=json', { signal: controller.signal });
        clearTimeout(timeoutID);

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération de l\'IP');
        }

        const data = await response.json();
        return data.ip || "Unknown";
    } catch (error) {
        console.error("Erreur lors de la récupération de l'IP :", error);
        return 'Unknown';
    }
};



export { collectDeviceInfo };