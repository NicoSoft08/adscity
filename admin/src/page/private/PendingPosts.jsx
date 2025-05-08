import React, { useContext, useEffect, useState, useCallback } from 'react';
import { fetchPosts, onApprovePost, onRefusePost, adminDeletePost } from '../../routes/postRoutes';
import { formateDateTimestamp } from '../../func';
import Modal from '../../customs/Modal';
import Tab from '../../customs/Tab';
import Toast from '../../customs/Toast';
import Spinner from '../../customs/Spinner';
import { AuthContext } from '../../contexts/AuthContext';
import { faCheck, faEye, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Pagination from '../../components/pagination/Pagination';
import { logAdminAction } from '../../routes/apiRoutes';
import '../../styles/PendingPosts.scss';
import { LanguageContext } from '../../contexts/LanguageContext';

const PostRow = ({ index, post, onView, language }) => (
    <tr>
        <td>{index + 1}</td>
        <td><img src={post.images[0]} alt='' width={40} height={40} /></td>
        <td>{post.details.title}</td>
        <td>{post.details.price} RUB</td>
        <td>{formateDateTimestamp(post.posted_at._seconds)}</td>
        <td>
            <button title={language === 'FR' ? "Voir l'annonce" : "View ad"} onClick={() => onView(post)}>
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
    const { language } = useContext(LanguageContext);
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
                // Get the authentication token if user is logged in
                let idToken;

                if (currentUser) {
                    idToken = await currentUser.getIdToken(true);
                }
                const data = await fetchPosts(idToken);
                if (isMounted && data) {
                    setPostsPending(data.posts?.pendingAds || []);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des annonces:', error);
            }
        };

        fetchAllData();
        return () => { isMounted = false; };
    }, [currentUser]);

    const handleApprove = useCallback(async () => {
        const idToken = await currentUser.getIdToken();

        if (!currentUser && !userData.permissions.includes('MANAGE_POSTS')) {
            setToast({
                show: true,
                type: 'error',
                message: language === 'FR'
                    ? 'Vous n\'avez pas les autorisations nécessaires pour approuver les annonces.'
                    : 'You do not have the necessary permissions to approve ads.'
            });
            return;
        }

        await logAdminAction(
            currentUser.uid,
            language === 'FR'
                ? "Validation d'annonce"
                : "Approval of an ad",
            language === 'FR'
                ? "L'admin a validé une annonce."
                : "The admin approved an ad."
        );

        if (!selectedPost) return;
        setIsLoading(true);
        const result = await onApprovePost(selectedPost.postID, idToken);
        setIsLoading(false);

        if (result.success) {
            setPostsPending(postsPending.filter(post => post.PostID !== selectedPost.PostID));
            setToast({
                show: true,
                type: 'success',
                message: language === 'FR'
                    ? 'Annonce approuvée avec succès.'
                    : 'Ad approved successfully.'
            });
            closeModal();
        } else {
            setToast({
                show: true,
                type: 'error',
                message: result.message
            });
        }
    }, [selectedPost, postsPending, currentUser, userData, language]);


    const handleReject = useCallback(async () => {
        if (!currentUser && !userData.permissions.includes('MANAGE_POSTS')) {
            setToast({
                show: true,
                type: 'error',
                message: language === 'FR'
                    ? 'Vous n\'avez pas les autorisations nécessaires pour refuser les annonces.'
                    : 'You do not have the necessary permissions to reject ads.'
            });
            return;
        }

        await logAdminAction(
            currentUser.uid,
            language === 'FR'
                ? "Refus d'annonce"
                : "Refusal of an ad",
            language === 'FR'
                ? "L'admin a refusé une annonce."
                : "The admin refused an ad."
        );

        if (!selectedPost || refusalReason.trim() === '') {
            setToast({
                show: true,
                type: 'error',
                message: language === 'FR'
                    ? 'Veuillez fournir un motif avant de refuser l\'annonce.'
                    : 'Please provide a reason before rejecting the ad.'
            });
            return;
        }

        setIsLoading(true);
        const result = await onRefusePost(selectedPost.postID, refusalReason);
        setIsLoading(false);

        if (result.success) {
            setPostsPending(postsPending.filter(post => post.postID !== selectedPost.postID));
            setToast({
                show: true,
                type: 'success',
                message: language === 'FR'
                    ? 'Annonce refusée avec succès.'
                    : 'Ad rejected successfully.'
            });
            closeModal();
        } else {
            setToast({
                show: true,
                type: 'error',
                message: result.message
            });
        }
    }, [selectedPost, postsPending, refusalReason, currentUser, userData, language]);


    const handleDelete = useCallback(async () => {
        if (!currentUser && !userData.permissions.includes('MANAGE_POSTS')) {
            setToast({
                show: true,
                type: 'error',
                message: language === 'FR'
                    ? 'Vous n\'avez pas les autorisations nécessaires pour supprimer les annonces.'
                    : 'You do not have the necessary permissions to delete ads.'
            });
            return;
        }

        await logAdminAction(
            currentUser.uid,
            language === 'FR'
                ? "Suppression d'annonce"
                : "Deletion of an ad",
            language === 'FR'
                ? "L'admin a supprimé une annonce."
                : "The admin deleted an ad."
        );

        if (!selectedPost) return;

        setIsLoading(true);
        const result = await adminDeletePost(selectedPost.postID);
        setIsLoading(false);

        if (result.success) {
            setPostsPending(postsPending.filter(post => post.postID !== selectedPost.postID));
            setToast({
                show: true,
                type: 'success',
                message: language === 'FR'
                    ? 'Annonce supprimée avec succès.'
                    : 'Ad deleted successfully.'
            });
            closeModal();
        } else {
            setToast({
                show: true,
                type: 'error',
                message: result.message
            });
        }
    }, [currentUser, userData, selectedPost, postsPending, language]);

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
            <h3>{language === 'FR' ? "Annonces en attente" : "Pending ads"}</h3>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Photo</th>
                            <th>{language === 'FR' ? "Titre" : "Title"}</th>
                            <th>{language === 'FR' ? "Prix" : "Price"}</th>
                            <th>{language === 'FR' ? "Date de Publication" : "Date of Publication"}</th>
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
                                <td colSpan="6" align='center'>
                                    {language === 'FR' ? "Aucune annonce en attente." : "No pending ads."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedPost && (
                <Modal title={language === 'FR' ? "Confirmation" : "Confirmation"} onShow={!!selectedPost} onHide={closeModal}>
                    <Tab formData={selectedPost} />

                    <div className="ad-details-buttons">
                        <button className='modal-button approve-button' onClick={() => setModalType('approve', selectedPost)}>
                            {language === 'FR' ? "Approuver" : "Approve"}
                        </button>

                        <button className='modal-button reject-button' onClick={() => setModalType('refuse', selectedPost)}>
                            {language === 'FR' ? "Refuser" : "Decline"}
                        </button>
                        <button className='modal-button delete-button' onClick={() => setModalType('delete', selectedPost)}>
                            {language === 'FR' ? "Supprimer" : "Delete"}
                        </button>
                    </div>

                </Modal>
            )}

            {modalType === 'approve' && (
                <Modal title={language === 'FR' ? "Confirmation" : "Confirmation"} onShow={!!selectedPost} onHide={closeModal}>
                    <p>Êtes-vous sûr de vouloir approuver cette annonce ?</p>
                    <div className="ad-details-buttons">
                        <button className='modal-button approve-button' onClick={handleApprove}>
                            {isLoading ? <Spinner /> : <><FontAwesomeIcon icon={faCheck} /> {language === 'FR' ? "Confirmer" : "Confirm"}</>}
                        </button>
                        <button className='modal-button delete-button' onClick={closeModal}>
                            <FontAwesomeIcon icon={faTimes} /> {language === 'FR' ? "Annuler" : "Cancel"}
                        </button>
                    </div>
                </Modal>
            )}

            {modalType === 'delete' && (
                <Modal title={language === 'FR' ? "Confirmation" : "Confirmation"} onShow={!!selectedPost} onHide={closeModal}>
                    <p>
                        {language === 'FR'
                            ? "Êtes-vous sûr de vouloir supprimer cette annonce définitivement ?"
                            : "Are you sure you want to delete this ad permanently ?"
                        }
                    </p>
                    <div className="ad-details-buttons">
                        <button className='modal-button approve-button' onClick={handleDelete}>
                            {isLoading ? <Spinner /> : <><FontAwesomeIcon icon={faCheck} /> {language === 'FR' ? "Confirmer" : "Confirm"}</>}
                        </button>
                        <button className='modal-button delete-button' onClick={closeModal}>
                            <FontAwesomeIcon icon={faTimes} /> {language === 'FR' ? "Annuler" : "Cancel"}
                        </button>
                    </div>
                </Modal>
            )}

            {modalType === 'refuse' && (
                <Modal title={language === 'FR' ? "Confirmation" : "Confirmation"} onShow={!!selectedPost} onHide={closeModal}>
                    {confirm ? (
                        <>
                            <p>
                                {language === 'FR'
                                    ? "Êtes-vous certain de vouloir refuser cette annonce ? Cette action est définitive et ne pourra pas être annulée."
                                    : "Are you sure you want to reject this ad? This action is irreversible and cannot be undone."
                                }
                            </p>
                        </>
                    ) : (
                        <>
                            <label htmlFor="report_reason">
                                {language === 'FR' ? "Motif du refus" : "Reason for rejection"}:
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
                            {confirm
                                ? (language === 'FR' ? 'Confirmer' : 'Confirm')
                                : isLoading
                                    ? <Spinner />
                                    : (language === 'FR' ? 'Refuser' : 'Decline')
                            }
                        </button>
                        <button className='modal-button delete-button' onClick={closeModal}>
                            <FontAwesomeIcon icon={faTimes} /> {language === 'FR' ? "Annuler" : "Cancel"}
                        </button>
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
