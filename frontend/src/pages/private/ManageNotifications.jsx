import React, { useContext, useEffect, useState } from 'react';
import NotificationList from '../../components/notification/Notifications';
import { AuthContext } from '../../contexts/AuthContext';
import { fetchNotifications } from '../../routes/userRoutes';
import Loading from '../../customs/Loading';


export default function ManageNotifications() {
    const { currentUser } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getNotifications = async () => {
            const userID = currentUser.uid;
            setIsLoading(true);
            const result = await fetchNotifications(userID);
            if (result.success) {
                setNotifications(result?.data);
                setIsLoading(false);
            }
        }

        getNotifications();
    }, [currentUser]);

    return (
        <div>
            {isLoading && <Loading />}
            <NotificationList
                userID={currentUser.uid}
                notifications={notifications}
                setNotifications={setNotifications}
            />
        </div>
    );
};
