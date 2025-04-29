import React, { useContext, useEffect, useRef, useState } from 'react';
import { faChevronLeft, faEllipsisH, faPauseCircle, faRefresh, faTrash, faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchUserById } from '../../routes/userRoutes';
import Loading from '../../customs/Loading';
import UserCard from '../../components/card/UserCard';
import { deleteUser, disableUser, restoreUser } from '../../routes/authRoutes';
import Modal from '../../customs/Modal';
import Spinner from '../../customs/Spinner';
import { AuthContext } from '../../contexts/AuthContext';
import { logAdminAction, sendVerificationEmail } from '../../routes/apiRoutes';
import Toast from '../../customs/Toast';
import { LanguageContext } from '../../contexts/LanguageContext';
import '../../styles/ManageUserID.scss';

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
        // Suspend option - only show for active users
        user?.isActive !== false && {
            label: language === 'FR' ? 'Suspendre' : 'Suspend',
            icon: faPauseCircle,
            action: () => setOpenModal({ type: 'suspend', open: true })
        },

        // Restore option - only show for suspended users
        user?.isActive === false && !user?.isBanned && {
            label: language === 'FR' ? 'Restaurer' : 'Restore',
            icon: faUndo,
            action: () => handleRestore(user?.UserID) // Make sure to use the correct property name
        },

        // Send verification email - only show for unverified emails
        user?.emailVerified === false && {
            label: language === 'FR' ? 'Envoyer un email de vérification' : 'Send verification email',
            icon: faRefresh,
            action: () => setOpenModal({ type: 'verification', open: true })
        },

        // Delete option - available for all users
        {
            label: language === 'FR' ? 'Supprimer' : 'Delete',
            icon: faTrash,
            action: () => setOpenModal({ type: 'delete', open: true })
        },
    ].filter(Boolean); // Filter out any false/null values    

    const handleSendVerification = async () => {
        if (!user || !user.userID || !user.email) {
            setToast({
                show: true,
                type: 'error',
                message: language === 'FR'
                    ? "Informations utilisateur incomplètes"
                    : "Incomplete user information"
            });
            return;
        }

        try {
            setLoading(true);
            const response = await sendVerificationEmail(user.userID);

            if (response.success) {
                // Log admin action
                await logAdminAction(
                    currentUser.uid,
                    language === 'FR'
                        ? "Envoi email de vérification"
                        : "Send verification email",
                    language === 'FR'
                        ? `L'admin a envoyé un email de vérification à ${user.email}`
                        : `Admin sent verification email to ${user.email}`
                );

                setToast({
                    show: true,
                    type: 'success',
                    message: language === 'FR'
                        ? `Email de vérification envoyé à ${user.email}`
                        : `Verification email sent to ${user.email}`
                });

                // Close the modal
                setOpenModal({ type: '', open: false });
            } else {
                throw new Error(response.message || "Failed to send verification email");
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'email de vérification:', error);
            setToast({
                show: true,
                type: 'error',
                message: language === 'FR'
                    ? `Erreur lors de l'envoi de l'email: ${error.message}`
                    : `Error sending email: ${error.message}`
            });
        } finally {
            setLoading(false);
        }
    };

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

    return (
        <div className='manage-user'>
            {loading && <Loading />}
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

            {openModal.open && openModal.type === 'delete' && (
                <Modal
                    onShow={openModal.open}
                    onHide={() => setOpenModal({ open: false, type: null })}
                    title={language === 'FR'
                        ? "Supprimer l'utilisateur"
                        : "Delete User"
                    }
                >
                    <p>{language === 'FR'
                        ? `Êtes-vous sûr de vouloir supprimer l'utilisateur ${user?.firstName} ${user?.lastName}?`
                        : `Are you sure you want to delete user ${user?.firstName} ${user?.lastName}?`
                    }
                    </p>
                    <div className="modal-buttons">
                        <button
                            className="modal-button cancel"
                            onClick={() => setOpenModal({ type: '', open: false })}
                        >
                            {language === 'FR' ? "Annuler" : "Cancel"}
                        </button>
                        <button
                            className="modal-button delete"
                            onClick={handleDelete}
                            disabled={loading}
                        >
                            {loading ? <Spinner /> : (language === 'FR' ? "Supprimer" : "Delete")}
                        </button>
                    </div>
                </Modal>
            )}

            {openModal.open && openModal.type === 'suspend' && (
                <Modal
                    onShow={openModal.open} onHide={() => setOpenModal({ open: false, type: null })}
                    title={language === 'FR' ? "Suspendre l'utilisateur" : "Suspend User"}
                >
                    <p>
                        {language === 'FR'
                            ? `Êtes-vous sûr de vouloir suspendre l'utilisateur ${user?.firstName} ${user?.lastName}?`
                            : `Are you sure you want to suspend user ${user?.firstName} ${user?.lastName}?`}
                    </p>
                    <div className="modal-buttons">
                        <button
                            className="modal-button cancel"
                            onClick={() => setOpenModal({ type: '', open: false })}
                        >
                            {language === 'FR' ? "Annuler" : "Cancel"}
                        </button>
                        <button
                            className="modal-button delete"
                            onClick={handleSuspend}
                            disabled={loading}
                        >
                            {loading ? <Spinner /> : (language === 'FR' ? "Suspendre" : "Suspend")}
                        </button>
                    </div>
                </Modal>
            )}

            {/* New verification modal */}
            {openModal.open && openModal.type === 'verification' && (
                <Modal
                    onShow={openModal.open} onHide={() => setOpenModal({ open: false, type: null })}
                    title={language === 'FR' ? "Envoyer un email de vérification" : "Send Verification Email"}
                >
                    <p>
                        {language === 'FR'
                            ? `Voulez-vous envoyer un email de vérification à ${user?.firstName} ${user?.lastName} (${user?.email})?`
                            : `Do you want to send a verification email to ${user?.firstName} ${user?.lastName} (${user?.email})?`}
                    </p>
                    <div className="modal-buttons">
                        <button
                            className="modal-button cancel"
                            onClick={() => setOpenModal({ type: '', open: false })}
                        >
                            {language === 'FR' ? "Annuler" : "Cancel"}
                        </button>
                        <button
                            className="modal-button delete"
                            onClick={handleSendVerification}
                            disabled={loading}
                        >
                            {loading ? <Spinner /> : (language === 'FR' ? "Envoyer" : "Send")}
                        </button>
                    </div>
                </Modal>
            )}

            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ show: false, ...toast })} />
        </div>
    );
};
