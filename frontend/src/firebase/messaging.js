import { getToken } from "firebase/messaging";
import { messaging } from "../firebaseConfig";


// 🔔 Demander la permission de notification
const requestPermission = async () => {
    try {
        console.log("📢 Demande de permission pour les notifications...");
        const permission = await Notification.requestPermission();
        
        if (permission === "granted") {
            console.log("✅ Permission de notification accordée.");
            return true;
        } else {
            console.warn("❌ Permission de notification refusée.");
            return false;
        }
    } catch (error) {
        console.error("Erreur lors de la demande de permission :", error);
        return false;
    }
};

// 🔑 Récupérer le token de notification FCM
const getDeviceToken = async () => {
    try {
        const token = await getToken(messaging, { 
            vapidKey: "BM_4BRgXL1sgoh2aetxYGTKMYvlnvzvzxIPHlR7X-IRl6vusSnORFSW6s8s6bWsm9QvZDAFs0HBUINN3fi3ztu4" 
        });

        if (token) {
            console.log("✅ Token de notification récupéré :", token);
            return token;
        } else {
            console.log("⚠️ Aucun token de notification disponible.");
            return null;
        }
    } catch (error) {
        console.error("Erreur lors de la récupération du token de notification :", error);
        return null;
    }
};

export { 
    getDeviceToken,
    requestPermission, 
};