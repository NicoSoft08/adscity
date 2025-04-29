import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { fetchNotifications } from '../../routes/userRoutes';
import NotificationList from '../../components/notification/Notifications';

export default function ManageNotifications() {
    const { currentUser } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        let isMounted = true;

        const getNotifications = async () => {
            const userID = currentUser.uid;

            try {
                const idToken = await currentUser.getIdToken();
                const result = await fetchNotifications(userID, idToken);
                if (isMounted && result) {
                    setNotifications(result.data?.notifications || []);
                }
            } catch (error) {
                console.error("❌ Erreur lors de la récupération des notifications :", error);
            }
        }

        getNotifications();

        return () => { isMounted = false };
        
    }, [currentUser]);

    return (
        <div className='notification-list'>
            <NotificationList
                notifications={notifications}
                setNotifications={setNotifications}
            />
        </div>
    );
};
