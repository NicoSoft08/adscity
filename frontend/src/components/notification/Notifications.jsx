import React, { useState } from 'react';
import { faCheck, faCheckCircle, faEnvelope, faEnvelopeOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formateDate, parseTimestamp } from '../../func';
import { letterWhiteBgBlue } from '../../config/logos';
import Menu from '../../customs/Menu';
import { markNotificationAsRead } from '../../routes/userRoutes';
import Toast from '../../customs/Toast';
import './Notifications.scss';


const NotificationItem = ({ userID, notification, setNotifications }) => {
    const sentAt = parseTimestamp(notification?.timestamp);

    const [showMenu, setShowMenu] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    const options = [
        {
            label: 'Marquer comme lu',
            icon: faCheck, // Vous pouvez utiliser une icône appropriée comme une coche
            action: () => handleMarkAsRead(notification?.id)
        }
    ];


    const handleMenuClick = (e, isRead) => {
        if (isRead) return;
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    const handleMarkAsRead = async (notificationID) => {
        setShowMenu(!showMenu);

        try {
            const hasRead = await markNotificationAsRead(userID, notificationID);
            if (hasRead.success) {
                setToast({ show: true, type: 'info', message: 'Notification marquée comme lue' })
                // Mettre à jour localement
                setNotifications((prev) =>
                    prev.map((notif) =>
                        notif.id === notificationID ? { ...notif, isRead: true } : notif
                    )
                );
            }
        } catch (error) {
            console.error(error);
        }

    }

    return (
        <div
            key={notification.id}
            className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
        >
            <div className="avatar-container">
                <img
                    src={letterWhiteBgBlue}
                    alt={'moderation team'}
                    className="user-avatar"
                />
                <div className="username-wrapper">
                    <h3>AdsCity Moderation</h3>
                    <span className="verified-badge" title='Compte vérifié'>
                        <FontAwesomeIcon icon={faCheckCircle} />
                    </span>
                </div>
            </div>
            <div className="notification-content">
                <p className='title'>{notification.title}</p>
                <p className='type'>
                    {notification.type === 'ad_approval' && notification.message}
                    {notification.type === 'ad_refusal' && notification.message}
                </p>
                <span className="timestamp">
                    {formateDate(sentAt)}
                </span>
            </div>
            <FontAwesomeIcon
                className='options'
                icon={notification.isRead ? faEnvelopeOpen : faEnvelope}
                onClick={(e) => handleMenuClick(e, notification.isRead)}
            />
            <Menu options={options} isOpen={showMenu} onClose={() => setShowMenu(false)} />
            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
        </div>

    )
}

export default function NotificationList({ notifications, setNotifications, userID }) {

    return (
        <div className='notification-list'>
            {notifications.length > 0
                ?
                notifications.map((notification, index) => (
                    <NotificationItem
                        key={index}
                        userID={userID}
                        notification={notification}
                        setNotifications={setNotifications}
                    />
                ))
                : <p>Vous n'avez aucunes notifications</p>
            }
        </div>
    );
};
