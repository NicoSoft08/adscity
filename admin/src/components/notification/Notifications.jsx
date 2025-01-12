import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { letterWhiteBgBlue } from "../../config/logos";
import { faCheck, faCheckCircle, faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { formateDate, parseTimestamp } from "../../func";
import Toast from "../../customs/Toast";
import Menu from "../../customs/Menu";
import './Notifications.scss';


const NotificationItem = ({ notification, setNotifications }) => {
    const sentAt = parseTimestamp(notification?.timestamp);
    const [showMenu, setShowMenu] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    const options = [
        {
            label: 'Marquer comme lu',
            icon: faCheck, // Vous pouvez utiliser une icône appropriée comme une coche
            action: () => handleMarkAsRead(notification.id)
        }
    ];

    const handleMenuClick = (e, read) => {
        if (read) return;
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    const handleMarkAsRead = async (notificationID) => {
        setShowMenu(!showMenu);

        setToast({ show: true, type: 'info', message: 'Notification marquée comme lue' })
        // Mettre à jour localement
        setNotifications((prev) =>
            prev.map((notif) =>
                notif.id === notificationID ? { ...notif, isRead: true } : notif
            )
        );
    }

    return (
        <div
            key={notification.id}
            className={`notification-item ${notification.read ? 'read' : 'unread'}`}
        >
            <div className="avatar-container">
                <img
                    src={letterWhiteBgBlue}
                    alt={'moderation team'}
                    className="user-avatar"
                />
                <div className="username-wrapper">
                    <h3>AdsCity</h3>
                    <span className="verified-badge" title='Compte vérifié'>
                        <FontAwesomeIcon icon={faCheckCircle} />
                    </span>
                </div>
            </div>
            <div className="notification-content">
                <p className='title'>{notification.title}</p>
                <p className='type'>
                    {notification.type === 'new_user' && notification.message}
                </p>
                <span className="timestamp">
                    {formateDate(sentAt)}
                </span>
            </div>
            {notification.isRead
                ? <span className='options'>Lu</span>
                : <FontAwesomeIcon
                    className='options'
                    icon={faEllipsisH}
                    onClick={(e) => handleMenuClick(e, notification.isRead)}
                />
            }
            <FontAwesomeIcon
                className='options'
                icon={notification.isRead ? "Lu" : faEllipsisH}
                onClick={(e) => handleMenuClick(e, notification.isRead)}
            />
            <Menu
                options={options}
                isOpen={showMenu}
                onClose={() => setShowMenu(false)}
            />
            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast({ ...toast, show: false })}
            />
        </div>
    );
};


export default function NotificationList({ notifications, setNotifications }) {

    return (
        <div className='notification-list'>
            {notifications.length > 0
                ?
                notifications.map((notification, index) => (
                    <NotificationItem
                        key={index}
                        notification={notification}
                        setNotifications={setNotifications}
                    />
                ))
                : <p>Vous n'avez aucunes notifications</p>
            }
        </div>
    );
};