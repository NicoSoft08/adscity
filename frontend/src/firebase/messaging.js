import { getToken } from "firebase/messaging";
import { messaging } from "../firebaseConfig";

export const requestPermission = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            console.log('Permission pour notifications accordée.');
            return true;
        } else {
            console.warn('Permission pour notifications refusée.');
            return false;
        }
    } catch (error) {
        console.error('Erreur lors de la demande de permission:', error);
        return false;
    }
};


export const getFCMToken = async () => {
    try {
        const hasPermission = await requestPermission();

        if (!hasPermission) {
            throw new Error('Permission de notifications non accordée.');
        }

        const fcmToken = await getToken(messaging, { 
            vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
        });
        
        if (fcmToken) {
            console.log('Token FCM obtenu:', fcmToken);
            return fcmToken;
        } else {
            console.warn('Aucun token FCM disponible.');
            return null;
        }
    } catch (error) {
        console.error('Erreur lors de l\'obtention du token FCM:', error);
        return null;
    }
};