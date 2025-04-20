import React, { useContext, useEffect, useRef, useState } from 'react';
import { faChevronLeft, faEllipsisH, faPauseCircle, faTrash, faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchUserById } from '../../routes/userRoutes';
import Loading from '../../customs/Loading';
import UserCard from '../../components/card/UserCard';
import { deleteUser, disableUser, restoreUser } from '../../routes/authRoutes';
import Modal from '../../customs/Modal';
import Spinner from '../../customs/Spinner';
import { AuthContext } from '../../contexts/AuthContext';
import { logAdminAction } from '../../routes/apiRoutes';
import Toast from '../../customs/Toast';
import '../../styles/ManageUserID.scss';
import { LanguageContext } from '../../contexts/LanguageContext';

export default function ManageUserID() {
    const menuRef = useRef(null);
    const { currentUser, userData } = useContext(AuthContext);
    const { language } = useContext(LanguageContext);
    const { user_id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [openModal, setOpenModal] = useState({ type: '', open: false });
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    const handleBack = () => {
        navigate('/admin/dashboard/users');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchUserById(user_id);
            if (result.success) {
                setUser(result.data);
                setLoading(false);
            }
        };

        if (user_id) {
            fetchData();
        }
    }, [user_id]);

    const handleMenuClick = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    const options = [
        {
            label: language === 'FR' ? 'Suspendre' : 'Suspend',
            icon: faPauseCircle, // Icône pour suspendre
            action: () => setOpenModal({ type: 'suspend', open: true })
        },
        {
            label: language === 'FR' ? 'Restaurer' : 'Restore',
            icon: faUndo, // Icône pour restaurer
            action: () => handleRestore(user?.userID)
        },
        {
            label: language === 'FR' ? 'Supprimer' : 'Delete',
            icon: faTrash,
            action: () => setOpenModal({ type: 'delete', open: true })
        },
    ];

    const handleDelete = async () => {
        if (currentUser && !userData.permissions.includes('MANAGE_USERS')) {
            setToast({
                show: true,
                type: 'error',
                message: language === 'FR'
                    ? 'Vous n\'avez pas les autorisations pour supprimer les utilisateurs.'
                    : "You don't have permission to delete users."
            });
            return;
        }

        await logAdminAction(
            currentUser.uid,
            language === 'FR'
                ? "Suppression de compte utilisateur"
                : "User account deletion",
            language === 'FR'
                ? "L'admin a supprimé le compte d'un utilisateur."
                : "The admin has deleted a user's account."
        );

        try {
            const result = await deleteUser(user?.userID);
            if (result.success) {
                navigate('/admin/dashboard/users');
            }
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        }
    };

    const handleSuspend = async () => {
        if (currentUser && !userData.permissions.includes('MANAGE_USERS')) {
            setToast({
                show: true,
                type: 'error',
                message: language === 'FR'
                    ? 'Vous n\'avez pas les autorisations pour suspendre les utilisateurs.'
                    : "You don't have permission to suspend users."
            });
            return;
        }

        await logAdminAction(
            currentUser.uid,
            language === 'FR'
                ? "Suspension de compte utilisateur"
                : "User account suspension",
            language === 'FR'
                ? "L'admin a suspendu le compte d'un utilisateur."
                : "The admin has suspended a user's account."
        );

        try {
            const result = await disableUser(user?.userID);
            if (result.success) {
                navigate('/admin/dashboard/users');
            }
        } catch (error) {
            console.error('Erreur lors de la suspension:', error);
        }
    };

    const handleRestore = async () => {
        if (currentUser && !userData.permissions.includes('MANAGE_USERS')) {
            setToast({
                show: true,
                type: 'error',
                message: language === 'FR'
                    ? 'Vous n\'avez pas les autorisations pour restaurer les utilisateurs.'
                    : "You don't have permission to restore users."
            });
            return;
        }

        await logAdminAction(
            currentUser.uid,
            language === 'FR'
                ? "Restauration de compte utilisateur"
                : "User account restoration",
            language === 'FR'
                ? "L'admin a restauré le compte d'un utilisateur."
                : "The admin has restored a user's account."
        );

        try {
            const result = await restoreUser(user?.userID);
            if (result.success) {
                navigate('/admin/dashboard/users');
            }
        } catch (error) {
            console.error('Erreur lors de la restauration:', error);
        }
    };

    const formatDate = (timestamp) => {
        if (timestamp && timestamp._seconds) {
            const date = new Date(timestamp._seconds * 1000); // Convert to milliseconds
            let formattedDate = date.toLocaleDateString(language === 'FR' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });

            // Capitalize the first letter
            return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
        }
        return '';
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className='manage-user'>
            <div className="head">
                <div className="back">
                    <FontAwesomeIcon icon={faChevronLeft} title='Go Back' onClick={handleBack} />
                </div>
                <div className="title">
                    <h2>{language === 'FR' ? "Utilisateurs" : "Users"} /</h2>
                    <p>{user?.firstName} {user?.lastName}</p>
                </div>

                <div className="more-options" title="Plus d'options" onClick={handleMenuClick}>
                    <FontAwesomeIcon icon={faEllipsisH} />
                </div>
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

            <div className='user-info'>
                <span>User ID: <strong>{user?.profileNumber}</strong></span>
                <span>{language === 'FR' ? "Dernière connexion" : "Last login"}: <strong>{formatDate(user?.lastLoginAt)}</strong></span>
            </div>

            <UserCard user={user} />

            {openModal.open && (
                <Modal
                    onShow={openModal.open}
                    onHide={() => setOpenModal({ ...openModal, open: false })}
                    title={`${openModal.type === 'delete' ? "Supprimer" : "Suspendre"} l'utilisateur`}
                    isHide={false}
                    isNext={false}
                    hideText="Annuler"
                    nextText="Supprimer"
                >
                    <p>Êtes-vous sûr de vouloir {openModal.type === 'delete' ? "supprimer" : "suspendre"} cet utilisateur ?</p>
                    <div className='modal-buttons'>
                        <button className="modal-button approve" onClick={() => {
                            if (openModal.type === 'delete') {
                                handleDelete();
                            } else if (openModal.type === 'suspend') {
                                handleSuspend();
                            }
                        }}>
                            {loading ? <Spinner /> : language === 'FR'
                                ? openModal.type === 'delete' ? 'Supprimer' : 'Suspendre'
                                : openModal.type === 'delete' ? 'Delete' : 'Suspend'}
                        </button>
                        <button className="modal-button delete" onClick={handleDelete}>
                            {language === 'FR' ? 'Annuler' : 'Cancel'}
                        </button>
                    </div>
                </Modal>
            )}

            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ show: false, ...toast })} />
        </div>
    );
};
