import React, { useContext, useEffect, useState } from 'react';
import NotificationList from '../../components/notification/Notifications';
import { AuthContext } from '../../contexts/AuthContext';
import { fetchNotifications } from '../../services/notificationServices';


export default function MyNotifications() {
    const { currentUser } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const getNotifications = async () => {
            const userID = currentUser.uid;
            const result = await fetchNotifications(userID);
            if (result.success) {
                setNotifications(result?.notifications);
            }
        }

        getNotifications();
    }, [currentUser]);

    return (
        <div>
            <NotificationList
                userID={currentUser.uid}
                notifications={notifications}
                setNotifications={setNotifications}
            />
        </div>
    );
};
