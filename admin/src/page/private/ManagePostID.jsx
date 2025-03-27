import React, { useContext, useEffect, useRef, useState } from 'react';
import { faChartPie, faChevronLeft, faEllipsisH, faPauseCircle, faTrash, faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useParams } from 'react-router-dom';
import { deletePost, fetchPostById } from '../../routes/postRoutes';
import Loading from '../../customs/Loading';
import PostCard from '../../components/card/PostCard';
import { AuthContext } from '../../contexts/AuthContext';
import Modal from '../../customs/Modal';
import Spinner from '../../customs/Spinner';
import '../../styles/ManagePostID.scss';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebaseConfig';
import { deletePostImagesFromStorage } from '../../routes/storageRoutes';

export default function ManagePostID() {
    const { post_id } = useParams();
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const { currentUser, userData } = useContext(AuthContext);
    const [confirm, setConfirm] = useState({ willDelete: false, willUpdate: false, willMarkAsSold: false });
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' })

    const permissions = userData.permissions || [];

    const handleBack = () => {
        navigate('/admin/dashboard/posts');
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
            const result = await fetchPostById(post_id);
            if (result.success) {
                setPost(result.data);
                setLoading(false);
            }
        };

        if (post_id) {
            fetchData();
        }
    }, [post_id]);

    const options = [
        {
            label: 'Suspendre',
            icon: faPauseCircle, // Icône pour suspendre
            action: () => handleSuspend(post?.id)
        },
        {
            label: 'Restaurer',
            icon: faUndo, // Icône pour restaurer
            action: () => handleRestore(post?.id)
        },
        {
            label: 'Statistiques',
            icon: faChartPie,
            action: () => handleStatistics(post?.id)
        },
        {
            label: 'Supprimer',
            icon: faTrash,
            action: () => handleDelete(post?.id)
        }
    ];

    const handleMenuClick = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    // Suspendre une annonce
    const handleSuspend = async () => { };

    // Restaurer une annonce
    const handleRestore = async () => { };

    // Voir les statistiques d'une annonce
    const handleStatistics = async () => {
        navigate("statistics");
    }

    // Supprimer une annonce
    const handleDelete = async () => {
        if (!permissions.includes('MANAGE_ADS')) {
            setToast({ show: true, type: 'error', message: 'Vous n\'avez pas les permissions pour supprimer une annonce' });
            return;
        }
        setShowMenu(!showMenu);
        setConfirm({ ...confirm, willDelete: true });
    }

    // Confirmer la suppression
    const confirmDeletePost = async () => {
        try {
            setLoading(true);

            // 🔥 Supprimer d'abord les images de Firebase Storage
            await deletePostImagesFromStorage(post?.id).then(() => {
                logEvent(analytics, 'delete_images');
            });

            // 🔥 Ensuite, supprimer l'annonce de Firestore
            const result = await deletePost(post?.id, currentUser?.uid);
            if (result.success) {
                setToast({ show: true, type: 'info', message: result.message });
                logEvent(analytics, 'admin_delete_post');
            } else {
                setToast({ show: true, type: 'error', message: result.message });
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'annonce :', error);
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className='manage-post'>
            <div className="head">
                <FontAwesomeIcon icon={faChevronLeft} title='Go Back' onClick={handleBack} />
                <h2>Annonce: {post_id.toLocaleUpperCase()}</h2>

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

            <PostCard post={post} toast={toast} setToast={setToast} />

            {confirm.willDelete && (
                <Modal title={"Suppression d'annonce"} onShow={confirm.willDelete} onHide={() => setConfirm({ ...confirm, willDelete: false })}>
                    <p>Êtes-vous sûr de vouloir supprimer cette annonce ?</p>
                    <div className="ad-details-buttons">
                        <button className="modal-button approve-button" onClick={confirmDeletePost}>
                            {loading ? <Spinner /> : 'Confirmer'}
                        </button>
                        <button className="modal-button reject-button" onClick={() => setConfirm({ ...confirm, willDelete: false })}>
                            Annuler
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};
