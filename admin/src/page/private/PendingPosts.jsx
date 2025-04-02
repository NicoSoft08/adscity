import React, { useContext, useEffect, useState, useCallback } from 'react';
import { fetchPosts, onApprovePost, onRefusePost, adminDeletePost } from '../../routes/postRoutes';
import { formateDateTimestamp } from '../../func';
import Modal from '../../customs/Modal';
import Tab from '../../customs/Tab';
import Toast from '../../customs/Toast';
import Spinner from '../../customs/Spinner';
import { AuthContext } from '../../contexts/AuthContext';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Pagination from '../../components/pagination/Pagination';
import '../../styles/PendingPosts.scss';

const PostRow = ({ index, post, onView }) => (
    <tr>
        <td>{index + 1}</td>
        <td><img src={post.images[0]} alt='' width={40} height={40} /></td>
        <td>{post.details.title}</td>
        <td>{post.details.price} RUB</td>
        <td>{formateDateTimestamp(post.posted_at._seconds)}</td>
        <td>
            <button title="Voir l'annonce" onClick={() => onView(post)}>
                <FontAwesomeIcon icon={faEye} />
            </button>
        </td>
    </tr>
);

export default function PendingPosts() {
    const [postsPending, setPostsPending] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [modalType, setModalType] = useState(null); // 'approve', 'reject', 'delete'
    const { currentUser, userData } = useContext(AuthContext);
    const [confirm, setConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [refusalReason, setRefusalReason] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pendingPostPerPage = 10;

    useEffect(() => {
        let isMounted = true;
        const fetchAllData = async () => {
            try {
                const data = await fetchPosts();
                if (isMounted && data) {
                    setPostsPending(data.posts?.pendingAds || []);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des annonces:', error);
            }
        };

        fetchAllData();
        return () => { isMounted = false; };
    }, []);

    const handleApprove = useCallback(async () => {
        if (!currentUser && !userData.permissions.includes('MANAGE_POSTS')) {
            setToast({ show: true, type: 'error', message: 'Vous n\'avez pas les autorisations nécessaires pour approuver cette annonce.' });
            return;
        }
        if (!selectedPost) return;
        setIsLoading(true);
        const result = await onApprovePost(selectedPost.postID);
        setIsLoading(false);

        if (result.success) {
            setPostsPending(postsPending.filter(post => post.PostID !== selectedPost.PostID));
            setToast({ show: true, type: 'success', message: 'Annonce approuvée avec succès.' });
            closeModal();
        } else {
            setToast({ show: true, type: 'error', message: result.message });
        }
    }, [selectedPost, postsPending, currentUser, userData]);

    const handleReject = useCallback(async () => {
        if (!currentUser && !userData.permissions.includes('MANAGE_POSTS')) {
            setToast({ show: true, type: 'error', message: 'Vous n\'avez pas les autorisations nécessaires pour approuver cette annonce.' });
            return;
        }
        if (!selectedPost || refusalReason.trim() === '') {
            setToast({ show: true, type: 'error', message: 'Veuillez fournir un motif avant de refuser l\'annonce.' });
            return;
        }

        setIsLoading(true);
        const result = await onRefusePost(selectedPost.postID, refusalReason);
        setIsLoading(false);

        if (result.success) {
            setPostsPending(postsPending.filter(post => post.postID !== selectedPost.postID));
            setToast({ show: true, type: 'success', message: 'Annonce refusée avec succès.' });
            closeModal();
        } else {
            setToast({ show: true, type: 'error', message: result.message });
        }
    }, [selectedPost, postsPending, refusalReason, currentUser, userData]);

    const handleDelete = useCallback(async () => {
        if (!currentUser && !userData.permissions.includes('MANAGE_POSTS')) {
            setToast({ show: true, type: 'error', message: 'Vous n\'avez pas les autorisations pour supprimer cette annonce.' });
            return;
        }

        if (!selectedPost) return;

        setIsLoading(true);
        const result = await adminDeletePost(selectedPost.postID);
        setIsLoading(false);

        if (result.success) {
            setPostsPending(postsPending.filter(post => post.postID !== selectedPost.postID));
            setToast({ show: true, type: 'success', message: 'Annonce supprimée avec succès.' });
            closeModal();
        } else {
            setToast({ show: true, type: 'error', message: result.message });
        }
    }, [currentUser, userData, selectedPost, postsPending]);

    const openModal = (post, type) => {
        setSelectedPost(post);
        setModalType(type);
        setRefusalReason("En vertu des règles de publication, votre annonce a été refusée car les images ne correspondent pas au titre.");
    };

    const closeModal = () => {
        setSelectedPost(null);
        setModalType(null);
        setRefusalReason('');
        setConfirm(false);
    };

    const currentPendingPosts = postsPending.slice((currentPage - 1) * pendingPostPerPage, currentPage * pendingPostPerPage);

    return (
        <div className='pending-ads'>
            <h3>Annonces en attente</h3>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Photo</th>
                            <th>Titre</th>
                            <th>Prix</th>
                            <th>Date de Publication</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPendingPosts.length > 0 ? (
                            currentPendingPosts.map((post, index) => (
                                <PostRow index={index} post={post} onView={() => openModal(post, 'view')} />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" align='center'>Aucune annonce en attente.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedPost && (
                <Modal title="Confirmation" onShow={!!selectedPost} onHide={closeModal}>
                    <Tab formData={selectedPost} />

                    <div className="ad-details-buttons">
                        <button className='modal-button approve-button' onClick={() => setModalType('approve', selectedPost)}>
                            Approuver
                        </button>

                        <button className='modal-button reject-button' onClick={() => setModalType('refuse', selectedPost)}>
                            Refuser
                        </button>
                        <button className='modal-button delete-button' onClick={() => setModalType('delete', selectedPost)}>
                            Supprimer
                        </button>
                    </div>

                </Modal>
            )}

            {modalType === 'approve' && (
                <Modal title="Confirmation" onShow={!!selectedPost} onHide={closeModal}>
                    <p>Êtes-vous sûr de vouloir approuver cette annonce ?</p>
                    <div className="ad-details-buttons">
                        <button className='modal-button approve-button' onClick={handleApprove}>
                            {isLoading ? <Spinner /> : 'Confirmer'}
                        </button>
                        <button className='modal-button delete-button' onClick={closeModal}>Annuler</button>
                    </div>
                </Modal>
            )}

            {modalType === 'delete' && (
                <Modal title="Confirmation" onShow={!!selectedPost} onHide={closeModal}>
                    <p>Êtes-vous sûr de vouloir supprimer cette annonce définitivement ?</p>
                    <div className="ad-details-buttons">
                        <button className='modal-button approve-button' onClick={handleDelete}>
                            {isLoading ? <Spinner /> : 'Confirmer'}
                        </button>
                        <button className='modal-button delete-button' onClick={closeModal}>Annuler</button>
                    </div>
                </Modal>
            )}

            {modalType === 'refuse' && (
                <Modal title="Confirmation" onShow={!!selectedPost} onHide={closeModal}>
                    {confirm ? (
                        <>
                            <p>
                                Êtes-vous certain de vouloir refuser cette annonce ? Cette action est définitive et ne pourra pas être annulée.
                            </p>
                        </>
                    ) : (
                        <>
                            <label htmlFor="report_reason">
                                Motif du refus
                                <textarea
                                    name='report_reason'
                                    value={refusalReason}
                                    rows={5}
                                    onChange={(e) => setRefusalReason(e.target.value)}
                                />
                            </label>
                        </>
                    )}
                    <div className="ad-details-buttons">
                        <button className='modal-button approve-button' onClick={() => {
                            if (confirm) {
                                handleReject();
                            } else {
                                setConfirm(true);
                            }
                        }}>
                            {confirm ? 'Confirmer' : isLoading ? <Spinner /> : 'Refuser'}
                        </button>
                        <button className='modal-button delete-button' onClick={closeModal}>Annuler</button>
                    </div>
                </Modal>
            )}

            {postsPending.length > pendingPostPerPage && (
                <Pagination currentPage={currentPage} elements={postsPending} elementsPerPage={pendingPostPerPage} paginate={setCurrentPage} />
            )}

            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    );
}
