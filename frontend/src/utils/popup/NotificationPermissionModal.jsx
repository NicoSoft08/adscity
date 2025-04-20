import React, { useEffect, useState } from 'react';
import { letterWhiteBgBlue } from '../../config/logos';
import { updateUserWithDeviceToken } from '../../routes/userRoutes';
import { getDeviceToken } from '../../firebase/messaging';
import { auth } from '../../firebaseConfig';
import Spinner from '../../customs/Spinner';
import '../../styles/NotificationPermissionModal.scss';

function NotificationPermissionModal() {
    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Vérifie si la permission est déjà accordée
        if (Notification.permission !== "granted") {
            setShowPopup(true);
        }
    }, []);

    const handleRequestPermission = async () => {
        setLoading(true);
        try {
            const permission = await Notification.requestPermission();
            if (permission === "granted") {
                console.log("✅ Permission accordée.");
                new Notification("Notifications Enabled", {
                    body: "You will now receive important updates",
                    icon: "/logo192.png",
                });

                const user = auth.currentUser;
                const idToken = await user.getIdToken();

                // 🔥 Récupérer le token Firebase
                const token = await getDeviceToken();
                if (token) {
                    console.log("🔑 Token reçu :", token);
                    await updateUserWithDeviceToken(token, idToken);
                }
            } else {
                console.warn("❌ Permission refusée.");
            }
        } catch (error) {
            console.error("🚨 Erreur lors de la demande de permission :", error);
        } finally {
            setLoading(false);
            setShowPopup(false);
        }
    };

    if (!showPopup) return null;

    return (
        <div className="notification-popup">
            <div className='popup-modal'>
                <img src={letterWhiteBgBlue} alt="popup-pic" className='popup-pic' />
                <div>
                    <h2>🔔 Activer les notifications</h2>
                    <p>Recevez des alertes sur les promotions et nouveautés !</p>
                    <div className='buttons'>
                        <button className='install' onClick={handleRequestPermission} disabled={loading}>
                            {loading ? <Spinner /> : "Accepter"}
                        </button>
                        <button onClick={() => setShowPopup(false)} className='dismiss'>Non merci</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationPermissionModal;