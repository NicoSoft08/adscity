import React, { useEffect, useRef, useState } from 'react';
import { faChartPie, faCheckSquare, faChevronLeft, faEllipsisH, faPenToSquare, faShareFromSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../../customs/Loading';
import { deletePost, fetchPostById, markAsSold } from '../../routes/postRoutes';
import PostCard from '../../components/card/PostCard';
import Modal from '../../customs/Modal';
import Spinner from '../../customs/Spinner';
import { deletePostImagesFromStorage } from '../../routes/storageRoutes';
import Toast from '../../customs/Toast';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebaseConfig';
import { logClientAction } from '../../routes/apiRoutes';
import '../../styles/ManagePostID.scss';

export default function ManagePostID({ currentUser }) {
    const [confirm, setConfirm] = useState({ willDelete: false, willUpdate: false, willMarkAsSold: false });
    const menuRef = useRef(null);
    const [showMenu, setShowMenu] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState(null);
    const [postID, setPostID] = useState(null);
    const { post_id } = useParams();
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/user/dashboard/posts');
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
                setPostID(result.data.postID);
                setLoading(false);
            }
        };

        if (post_id) {
            fetchData();
        }
    }, [post_id]);

    const options = [
        {
            label: 'Modifier',
            icon: faPenToSquare, // Vous pouvez utiliser une icône appropriée comme une coche
            action: () => handleEdit(post?.id)
        },
        {
            label: 'Marquer comme vendu',
            icon: faCheckSquare, // Vous pouvez utiliser une icône appropriée comme une coche
            action: () => handleMarkAsSold(postID)
        },
        {
            label: 'Partager',
            icon: faShareFromSquare,
            action: () => handleShareLink(post?.id)
        },
        {
            label: 'Statistiques',
            icon: faChartPie,
            action: () => handleStatistics(post?.id)
        },
        {
            label: 'Supprimer',
            icon: faTrash, // Vous pouvez utiliser une icône appropriée comme une poubelle
            action: () => handleDelete(post?.id)
        }
    ]

    if (loading) {
        return <Loading />;
    }

    const handleMenuClick = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    // Modifier une annonce
    const handleEdit = async () => {
        navigate("edit");
        setShowMenu(!showMenu);
    }

    // Marquer une annonce comme lue
    const handleMarkAsSold = async () => {
        setShowMenu(!showMenu);
        setConfirm({ ...confirm, willMarkAsSold: true });
    }

    // Confirmer marquer une annonce comme lue
    const confirmMarkAsSold = async () => {
        try {
            setLoading(true);

            const result = await markAsSold(currentUser?.uid, postID);
            if (result.success) {
                setToast({
                    show: true,
                    type: 'success',
                    message: 'L\'annonce a été marquée comme vendue avec succès.'
                });
                await logClientAction(
                    currentUser?.uid,
                    "Annonce  vendue.",
                    "Vous avez marqué l'annonce comme vendue."
                );
                logEvent(analytics, 'mark_as_sold');
                setConfirm({ ...confirm, willMarkAsSold: false });
                setLoading(false);
            } else {
                setToast({
                    show: true,
                    type: 'error',
                    message: 'Une erreur est survenue lors de la mise à jour de l\'annonce.'
                });
                setLoading(false);
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'annonce :', error);
            setToast({
                show: true,
                type: 'error',
                message: 'Une erreur est survenue lors de la mise à jour de l\'annonce.'
            });
        }
    };

    // Partager un lien vers l'annonce
    const handleShareLink = async () => {
        setShowMenu(!showMenu);
        const shareLink = `${window.location.origin}/posts/${post?.category}/${post?.subcategory}/${post?.PostID}`;
        await navigator.clipboard.writeText(shareLink).then(() => {
            setToast({
                show: true,
                type: 'info',
                message: 'Le lien a été copié dans le presse-papiers.'
            });
            logEvent(analytics, 'share_link');
            logClientAction(
                currentUser?.uid,
                "Partage de lien.",
                "Vous avez partagé le lien de l'annonce."
            );
        }).catch((error) => {
            console.error('Erreur lors de la copie dans le presse-papiers :', error);
            setToast({
                show: true,
                type: 'error',
                message: 'Une erreur est survenue lors de la copie du lien dans le presse-papiers.'
            });
        });
    }

    // Supprimer une annonce
    const handleDelete = async () => {
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
                logEvent(analytics, 'delete_post');
                logClientAction(
                    currentUser?.uid,
                    "Suppression d'annonce.",
                    "Vous avez supprimé une annonce."
                );
                handleBack();
            } else {
                setToast({ show: true, type: 'error', message: result.message });
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'annonce :', error);
        }
    }

    const handleStatistics = async ()=> {
        navigate("statistics");
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
            
            <PostCard post={post} />

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

            {confirm.willMarkAsSold && !post.isSold  && (
                <Modal title={"Confirmer la vente"} onShow={confirm.willMarkAsSold} onHide={() => setConfirm({ ...confirm, willMarkAsSold: false })}>
                    <p>Êtes-vous sûr de vouloir marquer cette annonce comme vendue ?</p>
                    <div className="ad-details-buttons">
                        <button className="modal-button approve-button" onClick={confirmMarkAsSold}>
                            {loading ? <Spinner /> : 'Confirmer'}
                        </button>
                        <button className="modal-button reject-button" onClick={() => setConfirm({ ...confirm, willMarkAsSold: false })}>
                            Annuler
                        </button>
                    </div>
                </Modal>
            )}

            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    );
};
