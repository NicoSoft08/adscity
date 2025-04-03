import React, { useContext, useEffect, useRef, useState } from 'react';
import { faChartSimple, faChevronLeft, faEllipsisH, faPauseCircle, faTrash, faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchUserById } from '../../routes/userRoutes';
import Loading from '../../customs/Loading';
import UserCard from '../../components/card/UserCard';
import { deleteUser, disableUser, restoreUser } from '../../routes/authRoutes';
import '../../styles/ManageUserID.scss';
import Modal from '../../customs/Modal';
import Spinner from '../../customs/Spinner';
import { AuthContext } from '../../contexts/AuthContext';
import { logAdminAction } from '../../routes/apiRoutes';
import Toast from '../../customs/Toast';

export default function ManageUserID() {
    const menuRef = useRef(null);
    const { currentUser, userData } = useContext(AuthContext);
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
            label: 'Suspendre',
            icon: faPauseCircle, // Icône pour suspendre
            action: () => setOpenModal({ type: 'suspend', open: true })
        },
        {
            label: 'Activités',
            icon: faChartSimple,
            action: () => navigate('activity', { state: { UserID: user?.UserID } })
        },
        {
            label: 'Restaurer',
            icon: faUndo, // Icône pour restaurer
            action: () => handleRestore(user?.userID)
        },
        {
            label: 'Supprimer',
            icon: faTrash,
            action: () => setOpenModal({ type: 'delete', open: true })
        },
    ];

    const handleDelete = async () => {
        if (currentUser && !userData.permissions.includes('MANAGE_USERS')) {
            setToast({ show: true, type: 'error', message: 'Vous n\'avez pas les autorisations pour supprimer les utilisateurs.' });
            return;
        }

        await logAdminAction(
            currentUser.uid, 
            "Suppression de compte utilisateur", 
            "L'admin a supprimé le compte d'un utilisateur."
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
            setToast({ show: true, type: 'error', message: 'Vous n\'avez pas les autorisations pour suspendre les utilisateurs.' });
            return;
        }

        await logAdminAction(
            currentUser.uid, 
            "Suspension de compte utilisateur", 
            "L'admin a suspendu le compte d'un utilisateur."
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
            setToast({ show: true, type: 'error', message: 'Vous n\'avez pas les autorisations pour restaurer les utilisateurs.' });
            return;
        }

        await logAdminAction(
            currentUser.uid, 
            "Restauration de compte utilisateur", 
            "L'admin a restauré le compte d'un utilisateur."
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

    if (loading) {
        return <Loading />;
    }

    return (
        <div className='manage-user'>
            <div className="head">
                <FontAwesomeIcon icon={faChevronLeft} title='Go Back' onClick={handleBack} />
                <h2>Utilisateur: {user_id.toLocaleUpperCase()}</h2>

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
                            {loading ? <Spinner /> : openModal.type === 'delete' ? 'Supprimer' : 'Suspendre'}
                        </button>
                        <button className="modal-button delete" onClick={handleDelete}>
                            Annuler
                        </button>

                    </div>

                </Modal>
            )}

            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ show: false, ...toast })} />
        </div>
    );
};
