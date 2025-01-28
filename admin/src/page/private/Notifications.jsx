import React, { useEffect, useState } from 'react';
import { fetchNotifications } from '../../services/notificationServices';
import NotificationList from '../../components/notification/Notifications';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const getNotifications = async () => {
            const result = await fetchNotifications();
            if (result.success) {
                setNotifications(result?.notifications);
            }
        }

        getNotifications();
    }, []);

    return (
        <div className='notification-list'>
            <NotificationList
                notifications={notifications}
                setNotifications={setNotifications}
            />
        </div>
    );
};
