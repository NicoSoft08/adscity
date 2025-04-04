import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { faChartPie, faChevronLeft, faEllipsisH, faPauseCircle, faTrash, faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useParams } from 'react-router-dom';
import { adminDeletePost, fetchPostById } from '../../routes/postRoutes';
import Loading from '../../customs/Loading';
import PostCard from '../../components/card/PostCard';
import { AuthContext } from '../../contexts/AuthContext';
import Modal from '../../customs/Modal';
import Spinner from '../../customs/Spinner';
import { logAdminAction } from '../../routes/apiRoutes';
import '../../styles/ManagePostID.scss';

export default function ManagePostID() {
    const { post_id } = useParams();
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const {  currentUser, userData } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [confirm, setConfirm] = useState({ willDelete: false });
    const [post, setPost] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' })

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
            action: () => confirmDeletePost(post?.id)
        }
    ];

    const handleMenuClick = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    // Suspendre une annonce
    const handleSuspend = async () => { 
        if (currentUser && !userData.permissions.includes('MANAGE_POSTS')) {
            setToast({ show: true, type: 'error', message: 'Vous n\'avez pas les autorisations pour suspendre les annonces.' });
            return;
        }

        await logAdminAction(
            currentUser.uid, 
            "Suspension d'annonce", 
            "L'admin a suspendu une annonce."
        );
    };

    // Restaurer une annonce
    const handleRestore = async () => { 
        if (currentUser && !userData.permissions.includes('MANAGE_POSTS')) {
            setToast({ show: true, type: 'error', message: 'Vous n\'avez pas les autorisations pour restaurer les annonces.' });
            return;
        }

        await logAdminAction(
            currentUser.uid, 
            "Restauration d'annonce", 
            "L'admin a restauré une annonce."
        );
    };

    // Voir les statistiques d'une annonce
    const handleStatistics = async () => {
        navigate("statistics");
    }

    // Supprimer une annonce
    const handleDelete = useCallback(async () => {
        if (currentUser && !userData.permissions.includes('MANAGE_POSTS')) {
            setToast({ show: true, type: 'error', message: 'Vous n\'avez pas les autorisations pour supprimer les annonces.' });
            return;
        }

        await logAdminAction(
            currentUser.uid, 
            "Suppression d'annonce", 
            "L'admin a supprimé une annonce."
        );

        if (!post) return;

        setLoading(true);
        try {
            const result = await adminDeletePost(post.postID);
            if (result.success) {
                setToast({ show: true, type: 'success', message: 'Annonce supprimée avec succès.' });
                closeModal();
                navigate('/admin/dashboard/posts');
            } else {
                setToast({ show: true, type: 'error', message: result.message });
            }
        } catch (error) {
            setToast({ show: true, type: 'error', message: 'Une erreur est survenue.' });
        } finally {
            setLoading(false);
        }
    }, [userData, post, currentUser, navigate]);

    // Confirmer la suppression
    const confirmDeletePost = () => {
        setConfirm({ willDelete: true });
    };

    const closeModal = () => {
        setPost(null);
        setConfirm({ willDelete: false });
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

            {confirm?.willDelete && (
                <Modal title={"Suppression d'annonce"} onShow={confirm?.willDelete} onHide={() => setConfirm({ ...confirm, willDelete: false })}>
                    <p>Êtes-vous sûr de vouloir supprimer cette annonce définitivement ?</p>
                    <div className="ad-details-buttons">
                        <button className='modal-button approve-button' onClick={handleDelete}>
                            {loading ? <Spinner /> : 'Confirmer'}
                        </button>
                        <button className='modal-button delete-button' onClick={closeModal}>Annuler</button>
                    </div>
                </Modal>
            )}
        </div>
    );
};
