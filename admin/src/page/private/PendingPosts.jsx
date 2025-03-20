import React, { useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { fetchPosts, onApprovePost, onRefusePost } from '../../routes/postRoutes';
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

const PostRow = ({ index, post, isSelected, onSelect, onView }) => (
    <tr className={isSelected ? 'selected' : ''}>
        <td>
            <input type="checkbox" checked={isSelected} onChange={() => onSelect(post.PostID)} />
        </td>
        <td>{index + 1}</td>
        <td><img src={post.images[0]} alt='' width={40} height={40} /></td>
        <td>{post.details.title}</td>
        <td>{post.details.price} RUB</td>
        <td>{formateDateTimestamp(post.posted_at._seconds)}</td>
        {isSelected && (
            <div className="floating-menu">
                <button title="Voir l'annonce" onClick={() => onView(post.PostID)}>
                    <FontAwesomeIcon icon={faEye} />
                </button>
            </div>
        )}
    </tr>
);

export default function PendingPosts() {
    const [postsPending, setPostsPending] = useState([]);
    const [selectedPosts, setSelectedPosts] = useState([]);
    const { currentUser, userData } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [isOpen, setIsOpen] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [refusalReason, setRefusalReason] = useState('');
    const [selectedPostID, setSelectedPostID] = useState(null);
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

    const allSelected = useMemo(() => selectedPosts.length === postsPending.length, [selectedPosts, postsPending]);

    const toggleSelectAll = () => {
        setSelectedPosts(allSelected ? [] : postsPending.map(post => post.PostID));
    };

    const handleSelect = (postID) => {
        setSelectedPosts(prev => prev.includes(postID) ? prev.filter(id => id !== postID) : [...prev, postID]);
    };

    const handleApprove = useCallback(async (id) => {
        if (!currentUser || !userData.permissions.includes('SUPER_ADMIN')) {
            setToast({ show: true, type: 'error', message: "Vous n'avez pas les autorisations nécessaires." });
            return;
        }

        setIsLoading(true);
        const result = await onApprovePost(id);
        setIsLoading(false);

        if (result.success) {
            setToast({ show: true, type: 'success', message: result.message });
            setPostsPending(postsPending.filter(post => post.id !== id));
            handleCloseModal();
        } else {
            setToast({ show: true, type: 'error', message: result.message });
        }
    }, [currentUser, userData, postsPending]);

    const handleReject = async () => {
        // if (!selectedPostID) return;

        if (refusalReason.trim() === '') {
            setToast({ type: 'error', message: 'Veuillez fournir un motif avant de refuser l\'annonce.' });
            return;
        }

        handleCloseModal(); // Fermer le modal avant d'envoyer la requête

        const result = await onRefusePost(selectedPostID, refusalReason);

        if (result?.success) {
            setToast({
                show: true,
                type: 'success',
                message: 'Annonce refusée avec succès.',
            });
        } else {
            setToast({
                show: true,
                type: 'error',
                message: result?.error || 'Erreur lors du refus de l\'annonce.',
            });
        }
    };

    const handleOpenModal = (postID) => {
        setSelectedPostID(postID);
        setRefusalReason("En vertu des règles de publication, votre annonce a été refusée car les images ne correspondent pas au titre."); // Texte par défaut
        setToast({ show: false, type: '', message: '' }); // Réinitialiser les messages d'erreur
        setIsOpen(true);
    };

    const handleCloseModal = () => {
        setIsOpen(false);
        setConfirm(false);
        setRefusalReason(''); // Réinitialisation du champ motif
    };

    const currentPendingPosts = postsPending.slice((currentPage - 1) * pendingPostPerPage, currentPage * pendingPostPerPage);

    return (
        <div className='pending-ads'>
            <h3>Annonces en attente</h3>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th><input type="checkbox" checked={allSelected} onChange={toggleSelectAll} /></th>
                            <th>#</th>
                            <th>Photo</th>
                            <th>Titre</th>
                            <th>Prix</th>
                            <th>Date de Publication</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPendingPosts.length > 0 ? (
                            currentPendingPosts.map((post, index) => (
                                <PostRow
                                    key={post.PostID}
                                    index={index}
                                    post={post}
                                    isSelected={selectedPosts.includes(post.PostID)}
                                    onSelect={handleSelect}
                                    onView={setSelectedPostID}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" align='center'>Aucune annonce en attente.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedPostID && (
                <Modal title="Détails de l'annonce" onShow={!!selectedPostID} onHide={() => setSelectedPostID(null)} isNext={false}>
                    <div className='ad-details'>
                        {postsPending.filter(ad => ad.PostID === selectedPostID).map(pendingAd => (
                            <React.Fragment key={pendingAd.PostID}>
                                <Tab formData={pendingAd} />
                                <div className="ad-details-buttons">
                                    <button className="modal-button approve-button" onClick={() => handleApprove(pendingAd.id)}>
                                        {isLoading ? <Spinner /> : 'Approuver'}
                                    </button>
                                    <button className="modal-button reject-button" onClick={() => handleOpenModal(pendingAd.id)}>
                                        Refuser
                                    </button>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </Modal>
            )}

            {isOpen && (
                <Modal
                    title={"Confirmation requise"}
                    onShow={isOpen}
                    onHide={handleCloseModal}
                >
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
                        <button className="modal-button approve-button" onClick={() => {
                            if (confirm) {
                                handleReject();
                            } else {
                                setConfirm(true);
                            }
                        }}
                        >
                            {isLoading ? <Spinner /> : 'Approuver'}
                        </button>
                        <button className="modal-button reject-button" onClick={handleCloseModal}>
                            Refuser
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
