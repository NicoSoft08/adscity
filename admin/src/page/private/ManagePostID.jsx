import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { faChartPie, faCheck, faChevronLeft, faEllipsisH, faPauseCircle, faTimes, faTrash, faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useParams } from 'react-router-dom';
import { adminDeletePost, fetchPostById } from '../../routes/postRoutes';
import Loading from '../../customs/Loading';
import PostCard from '../../components/card/PostCard';
import { AuthContext } from '../../contexts/AuthContext';
import Modal from '../../customs/Modal';
import Spinner from '../../customs/Spinner';
import { logAdminAction } from '../../routes/apiRoutes';
import { LanguageContext } from '../../contexts/LanguageContext';
import '../../styles/ManagePostID.scss';

export default function ManagePostID() {
    const { post_id } = useParams();
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const { currentUser, userData } = useContext(AuthContext);
    const { language } = useContext(LanguageContext);
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
            try {
                // Get the authentication token if user is logged in
                let idToken = null;
                if (currentUser) {
                    idToken = await currentUser.getIdToken(true);
                }

                const result = await fetchPostById(post_id, idToken);
                if (result.success) {
                    setPost(result.data);
                } else {
                    // Handle error from API
                    console.error("Error fetching post:", result.message);
                    // You might want to show an error message or redirect
                }
            } catch (error) {
                console.error("Error in fetchData:", error);
                // Handle unexpected errors
            } finally {
                setLoading(false);
            }
        };

        if (post_id) {
            fetchData();
        }
    }, [post_id, currentUser]); // Add currentUser as a dependency

    const options = [
        {
            label: language === 'FR' ? 'Suspendre' : 'Suspend',
            icon: faPauseCircle, // Icône pour suspendre
            action: () => handleSuspend(post?.id)
        },
        {
            label: language === 'FR' ? 'Restaurer' : 'Restore',
            icon: faUndo, // Icône pour restaurer
            action: () => handleRestore(post?.id)
        },
        {
            label: language === 'FR' ? 'Statistiques' : 'Statistics',
            icon: faChartPie,
            action: () => handleStatistics(post?.id)
        },
        {
            label: language === 'FR' ? 'Supprimer' : 'Delete',
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
            setToast({
                show: true,
                type: 'error',
                message: language === 'FR'
                    ? 'Vous n\'avez pas les autorisations pour suspendre les annonces.'
                    : 'You do not have permission to suspend posts.'
            });
            return;
        }

        await logAdminAction(
            currentUser.uid,
            language === 'FR'
                ? "Suspension d'annonce"
                : "Post suspension",
            language === 'FR'
                ? "L'admin a suspendu une annonce."
                : "The admin has suspended a post."
        );
    };

    // Restaurer une annonce
    const handleRestore = async () => {
        if (currentUser && !userData.permissions.includes('MANAGE_POSTS')) {
            setToast({
                show: true,
                type: 'error',
                message: language === 'FR'
                    ? 'Vous n\'avez pas les autorisations pour restaurer les annonces.'
                    : 'You do not have permission to restore posts.'
            });
            return;
        }

        await logAdminAction(
            currentUser.uid,
            language === 'FR'
                ? "Restauration d'annonce"
                : "Post restoration",
            language === 'FR'
                ? "L'admin a restauré une annonce."
                : "The admin has restored a post."
        );
    };

    // Voir les statistiques d'une annonce
    const handleStatistics = async () => {
        navigate("statistics");
    }

    // Supprimer une annonce
    const handleDelete = useCallback(async () => {
        const idToken = await currentUser.getIdToken();

        if (currentUser && !userData.permissions.includes('MANAGE_POSTS')) {
            setToast({
                show: true,
                type: 'error',
                message: language === 'FR'
                    ? 'Vous n\'avez pas les autorisations pour supprimer les annonces.'
                    : 'You do not have permission to delete posts.'
            });
            return;
        };

        if (!post) return;

        setLoading(true);
        try {
            const result = await adminDeletePost(post.postID, idToken);
            if (result.success) {
                await logAdminAction(
                    currentUser.uid,
                    language === 'FR'
                        ? "Suppression d'annonce"
                        : "Post deletion",
                    language === 'FR'
                        ? "L'admin a supprimé une annonce."
                        : "The admin has deleted a post."
                );
                setToast({
                    show: true,
                    type: 'success',
                    message: language === 'FR'
                        ? 'Annonce supprimée avec succès.'
                        : 'Post deleted successfully.'
                });
                closeModal();
                navigate('/admin/dashboard/posts');
            } else {
                setToast({
                    show: true,
                    type: 'error',
                    message: result.message
                });
            }
        } catch (error) {
            setToast({
                show: true,
                type: 'error',
                message: language === 'FR'
                    ? 'Une erreur est survenue.'
                    : 'An error occurred.'
            });
        } finally {
            setLoading(false);
        }
    }, [userData, post, currentUser, navigate, language]);

    // Confirmer la suppression
    const confirmDeletePost = () => {
        setConfirm({ willDelete: true });
    };

    const closeModal = () => {
        setPost(null);
        setConfirm({ willDelete: false });
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
        <div className='manage-post'>
            <div className="head">
                <div className="back">
                    <FontAwesomeIcon icon={faChevronLeft} title='Go Back' onClick={handleBack} />
                </div>
                <div className="title">
                    <h2>{language === 'FR' ? "Annonces" : "Ads"} /</h2>
                    <p>{post?.details.title}</p>
                </div>

                <div className="more-options" title={language === 'FR' ? "Plus d'options" : "More options"} onClick={handleMenuClick}>
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
                <span>Post ID: <strong>{post?.PostID}</strong></span>
                <span> {language === 'FR' ? "Date de publication" : "Publication date"}: <strong>{formatDate(post?.moderated_at)}</strong></span>
            </div>

            <PostCard post={post} toast={toast} setToast={setToast} language={language} />

            {confirm?.willDelete && (
                <Modal
                    title={language === 'FR'
                        ? "Suppression d'annonce"
                        : "Post deletion"}
                    onShow={confirm?.willDelete} onHide={() => setConfirm({ ...confirm, willDelete: false })}>
                    <p>{language === 'FR'
                        ? "Êtes-vous sûr de vouloir supprimer cette annonce définitivement ?"
                        : "Are you sure you want to delete this ad permanently?"
                    }
                    </p>
                    <div className="ad-details-buttons">
                        <button className='modal-button approve-button' onClick={handleDelete}>
                            {loading ? <Spinner /> : <><FontAwesomeIcon icon={faCheck} /> {language === 'FR' ? "Confirmer" : "Confirm"}</>}
                        </button>
                        <button className='modal-button delete-button' onClick={closeModal}>
                            <FontAwesomeIcon icon={faTimes} /> {language === 'FR' ? "Annuler" : "Cancel"}
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};
