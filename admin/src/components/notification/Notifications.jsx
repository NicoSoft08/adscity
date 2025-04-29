import React, { useContext, useEffect, useRef, useState } from 'react';
import { faCheck, faCheckCircle, faEllipsisH, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formateDate, parseTimestamp } from '../../func';
import { letterWhiteBgBlue } from '../../config/logos';
import {
    deleteNotification,
    deteleteAllNotifications,
    markAllNotificationsAsRead,
    markNotificationAsRead
} from '../../routes/userRoutes';
import Toast from '../../customs/Toast';
import Modal from '../../customs/Modal';
import Spinner from '../../customs/Spinner';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebaseConfig';
import { AuthContext } from '../../contexts/AuthContext';
import Pagination from '../pagination/Pagination';
import { logAdminAction } from '../../routes/apiRoutes';
import './Notifications.scss';

const NotificationItem = ({ userID, notification, setNotifications }) => {
    const sentAt = parseTimestamp(notification?.timestamp);
    const menuRef = useRef(null);
    const { currentUser } = useContext(AuthContext);
    const [showMenu, setShowMenu] = useState(false);
    const [loading, setLoading] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const options = [
        {
            label: 'Marquer comme lu',
            icon: faCheck, // Vous pouvez utiliser une icône appropriée comme une coche
            action: () => handleMarkAsRead(notification?.id)
        },
        {
            label: 'Supprimer',
            icon: faTrash, // Vous pouvez utiliser une icône appropriée comme une poubelle
            action: () => handleDelete(notification?.id)
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
            const idToken = await currentUser.getIdToken();
            const hasRead = await markNotificationAsRead(userID, idToken, notificationID);
            if (hasRead.success) {
                setToast({ show: true, type: 'info', message: 'Notification marquée comme lue' })
                logEvent(analytics, 'admin_mark_notification_as_read');
                logAdminAction(
                    userID,
                    'Lecture de notification',
                    "L'admin a marqué une notification comme lue"
                );
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

    const handleDelete = async () => {
        setShowMenu(!showMenu);
        setConfirm(true);
    };

    // Confirmer la suppression
    const confirmDelete = async () => {
        const notificationID = notification?.id;
        try {
            setLoading(true);
            const idToken = await currentUser.getIdToken();
            const result = await deleteNotification(userID, idToken, notificationID);
            if (result.success) {
                setToast({ show: true, type: 'success', message: 'Notification supprimée' });
                logEvent(analytics, 'admin_delete_notification');
                logAdminAction(
                    userID,
                    'Suppression de notification',
                    "L'admin a supprimé une notification"
                );
                setNotifications((prev) => prev.filter((notif) => notif.id !== notificationID));
                setConfirm(false);
            }
        } catch (error) {
            console.error(error);
            setToast({ show: true, type: 'error', message: 'Une erreur est survenue' })
            setConfirm(false);
        } finally {
            setLoading(false);
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
                <span className="more-options" title="Plus d'options" onClick={handleMenuClick}>
                    <FontAwesomeIcon icon={faEllipsisH} />
                </span>
                {showMenu &&
                    <div className="options-menu" ref={menuRef}>
                        {options.map((option, index) => (
                            <div key={index} className="options-menu-item" onClick={option.action}>
                                <FontAwesomeIcon icon={option.icon} />
                                <span>{option.label}</span>
                            </div>
                        ))}
                    </div>
                }
            </div>
            <div className="notification-content">
                <p className='title'>{notification.title}</p>
                <p className='type'>
                    {notification.type === 'new_post' && notification.message}
                    {notification.type === 'id_verification' && notification.message}
                    {notification.type === 'ad_refusal' && notification.message}
                </p>
                <span className="timestamp">
                    {formateDate(sentAt)}
                </span>
            </div>
            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />

            {confirm && (
                <Modal title={"Suppression de la notification"} onShow={confirm} onHide={() => setConfirm(false)}>
                    <p>Êtes-vous sûr de vouloir supprimer cette notification ?</p>
                    <div className="ad-details-buttons">
                        <button className="modal-button approve-button" onClick={confirmDelete}>
                            {loading ? <Spinner /> : 'Confirmer'}
                        </button>
                        <button className="modal-button reject-button" onClick={() => setConfirm(false)}>
                            Annuler
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default function NotificationList({ notifications, setNotifications }) {
    const menuRef = useRef(null);
    const { currentUser } = useContext(AuthContext);
    const [showMenu, setShowMenu] = useState(false);
    const [loading, setLoading] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [notifPerPage] = useState(5);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const indexOfLastPost = currentPage * notifPerPage;
    const indexOfFirstPost = indexOfLastPost - notifPerPage;
    const currentNotifications = notifications.slice(indexOfFirstPost, indexOfLastPost);

    const options = [
        {
            label: 'Marquer tout comme lu',
            icon: faCheck, // Vous pouvez utiliser une icône appropriée comme une coche
            action: () => handleMarkAllAsRead()
        },
        {
            label: 'Supprimer tout',
            icon: faTrash, // Vous pouvez utiliser une icône appropriée comme une poubelle
            action: () => handleDeleteAll()
        }
    ];

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleMenuClick = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    const handleMarkAllAsRead = async () => {
        setShowMenu(!showMenu);

        const userID = currentUser.uid;

        try {
            const result = await markAllNotificationsAsRead(userID);
            if (result.success) {
                setToast({ show: true, type: 'info', message: 'Toutes les notifications ont été marquées comme lues.' });
                logEvent(analytics, 'admin_mark_all_notifications_as_read');
                logAdminAction(
                    userID,
                    'Lecture des notifications',
                    "L'admin a marqué toutes les notifications comme lues"
                );
            } else {
                setToast({ show: true, type: 'error', message: result.message });
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour des notifications :', error);
            setToast({ show: true, type: 'error', message: 'Erreur technique, réessayez plus tard.' });
        }
    }

    const handleDeleteAll = async () => {
        setShowMenu(!showMenu);
        setConfirm(true);
    };

    const confirmDeleteAll = async () => {
        try {
            setLoading(true);

            const userID = currentUser.uid;

            const result = await deteleteAllNotifications(userID);
            if (result.success) {
                setToast({ show: true, type: 'success', message: 'Toutes les notifications ont été supprimées.' });
                logEvent(analytics, 'admin_delete_all_notifications');
                logAdminAction(
                    userID,
                    'Suppression des notifications',
                    "L'admin a supprimé toutes les notifications"
                );
                setNotifications([]);
                setConfirm(false);
            }
        } catch (error) {
            console.error(error);
            setToast({ show: true, type: 'error', message: 'Une erreur est survenue' });
            setConfirm(false);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='notification-list'>
            <div className="head">
                <h2>Notifications</h2>
                <span className="more-options" title="Plus d'options">
                    <FontAwesomeIcon icon={faEllipsisH} onClick={handleMenuClick} />
                </span>
                {showMenu &&
                    <div className="options-menu" ref={menuRef}>
                        {options.map((option, index) => (
                            <div key={index} className="options-menu-item" onClick={option.action}>
                                <FontAwesomeIcon icon={option.icon} />
                                <span>{option.label}</span>
                            </div>
                        ))}
                    </div>
                }
            </div>
            {currentNotifications.length > 0
                ?
                currentNotifications.map((notification, index) => (
                    <NotificationItem
                        key={index}
                        userID={currentUser?.uid}
                        notification={notification}
                        setNotifications={setNotifications}
                    />
                ))
                : <p>Vous n'avez aucunes notifications</p>
            }

            {notifications.length > notifPerPage && (
                <Pagination
                    currentPage={currentPage}
                    elements={notifications}
                    elementsPerPage={notifPerPage}
                    paginate={paginate}
                />
            )}


            {confirm && (
                <Modal title={"Suppression de toutes les notifications"} onShow={confirm} onHide={() => setConfirm(false)}>
                    <p>Êtes-vous sûr de vouloir supprimer toutes les notifications ?</p>
                    <div className="ad-details-buttons">
                        <button className="modal-button approve-button" onClick={confirmDeleteAll}>
                            {loading ? <Spinner /> : 'Confirmer'}
                        </button>
                        <button className="modal-button reject-button" onClick={() => setConfirm(false)}>
                            Annuler
                        </button>
                    </div>
                </Modal>
            )}

            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    );
};
