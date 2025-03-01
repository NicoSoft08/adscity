import React, { useEffect, useState } from 'react';
import { fetchPostsByUserID } from '../../routes/userRoutes';
import { deletePost, markAsSold, updatePost } from '../../routes/postRoutes';
import { formatViewCount } from '../../func';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { deletePostImagesFromStorage } from '../../routes/storageRoutes';
import Pagination from '../../components/pagination/Pagination';
import Toast from '../../customs/Toast';
import Modal from '../../customs/Modal';
import Tab from '../../customs/Tab';
import Spinner from '../../customs/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { allCategories } from '../../data/database';
import { useNavigate } from 'react-router-dom';
import '../../styles/MyPosts.scss';

const PostsFilter = ({ onFilterChange }) => {
    const [filters, setFilters] = useState({
        search: '',
        status: 'all', // 
        category: 'all', //
        city: '',
        date: '',
        views: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedFilters = { ...filters, [name]: value };
        setFilters(updatedFilters);
        onFilterChange(updatedFilters);
    }


    return (
        <div className="filters">
            <input
                type="text"
                name="search"
                placeholder="Rechercher par titre ou ID"
                value={filters.search}
                onChange={handleChange}
            />

            <select name="status" value={filters.status} onChange={handleChange}>
                <option value="all">Tous les statuts</option>
                <option value="approved">Publiée</option>
                <option value="pending">En attente</option>
                <option value="refused">Refusée</option>
                <option value="expired">Expirée</option>
                <option value="sold">Vendue</option>
            </select>

            <select name="category" value={filters.category} onChange={handleChange}>
                <option value="all">Toutes les catégories</option>
                {allCategories.map(category => (
                    <option
                        key={category.key}
                        value={category.categoryName}>
                        {category.categoryTitles.fr}
                    </option>
                ))}
            </select>

            <input
                type="text"
                name="city"
                placeholder="Ville"
                value={filters.city}
                onChange={handleChange}
            />

            <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleChange}
            />

            <input
                type="number"
                name="views"
                placeholder="Nombre de vues minimum"
                value={filters.views}
                onChange={handleChange}
            />
        </div>
    );
};

const PostRow = ({ index, post, onAction }) => {
    return (
        <tr>
            <td>{index + 1}</td>
            <td>{post.PostID}</td>
            <td><img src={post.images[0]} alt='' width={50} height={50} /></td>
            <td>{post.adDetails.title}</td>
            <td>{post.adDetails.price} RUB </td>
            <td>{formatViewCount(post.views)}</td>
            <td>{formatViewCount(post.clicks)}</td>
            <td>{post.views > 0 ? ((post.clicks / post.views) * 100).toFixed(1) + "%" : "0%"}</td>
            <td>{post.reportingCount || 0}</td>
            <td>{formatDistanceToNow(new Date(post.expiry_date), { locale: fr, addSuffix: true })}</td>
            <td>{post.status === "pending" ? "🟠 En attente" : post.status === "approved" ? "🟢 Accepté" : "🔴 Rejetée"}</td>
            <td>
                <button className="see-more" onClick={() => onAction(post)}>Voir</button>
            </td>
        </tr>
    );
};

export default function ManagePosts({ currentUser }) {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [showEditModal, setShowEditModal] = useState(false);
    const [isLoading, setIsloading] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [confirm, setConfirm] = useState({ willDelete: false, willUpdate: false, willMarkAsSold: false });
    const [postToEdit, setPostToEdit] = useState(null);
    const [postToMarkAsSold, setPostToMarkAsSold] = useState(null);
    const [postToDelete, setPostToDelete] = useState(null);
    const [editData, setEditData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [openFilter, setOpenFilter] = useState(false);
    const [postPerPage] = useState(10);
    const navigate = useNavigate();

    useEffect(() => {
        const userID = currentUser?.uid;
        const fetchPosts = async () => {
            if (!userID) return;
            const result = await fetchPostsByUserID(userID);
            if (result.success) {
                setPosts(result?.postsData || []);
                setFilteredPosts(result.postsData || []);
            }
        };

        fetchPosts();
    }, [currentUser]);

    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    const handleEditPost = (post) => {
        if (!post) return;
        setPostToEdit(post);
        setShowEditModal(true);
    };

    const handleConfirmEdit = () => {
        setConfirm({ ...confirm, willUpdate: true });
    };

    const confirmEditPost = async () => {
        if (!postToEdit || !editData) return;
        setIsloading(true);

        try {
            // 🔥 Mettre à jour Firestore
            await updatePost(postToEdit.id, editData, currentUser?.uid);

            // 🔥 Mettre à jour l'affichage local
            setPosts((prev) =>
                prev.map((post) =>
                    post.id === postToEdit.id ? { ...post, ...editData } : post
                )
            );

            setToast({ show: true, type: 'success', message: "Annonce mise à jour avec succès !" });
        } catch (error) {
            // console.error("Erreur lors de la mise à jour :", error);
            setToast({ show: true, type: 'error', message: "Erreur lors de la mise à jour." });
        } finally {
            setShowEditModal(false);
            setConfirm({ ...confirm, willUpdate: false });
            setPostToEdit(null);
            setEditData(null);
            setIsloading(false);
        }
    };

    const handleDeletePost = async (postID) => {
        if (!postID) return;

        setPostToDelete(postID);
        setConfirm({ ...confirm, willDelete: true });
    };

    const confirmDeletePost = async () => {
        if (!postToDelete) return;
        setIsloading(true);

        try {
            // 🔥 Trouver l'annonce correspondante pour récupérer les images
            const postToRemove = posts.find(post => post.id === postToDelete);
            if (!postToRemove) {
                setToast({ show: true, type: 'error', message: "Annonce introuvable." });
                return;
            }

            // 🔥 Supprimer d'abord les images de Firebase Storage
            await deletePostImagesFromStorage(postToDelete);

            // 🔥 Ensuite, supprimer l'annonce de Firestore
            const result = await deletePost(postToDelete, currentUser?.uid);
            if (result.success) {
                setPosts((prev) => prev.filter((post) => post.id !== postToDelete));
                setToast({ show: true, type: 'info', message: result.message });
            } else {
                setToast({ show: true, type: 'error', message: result.message });
            }
        } catch (error) {
            // console.error("Erreur lors de la suppression de l'annonce :", error);
            setToast({ show: true, type: 'error', message: "Erreur lors de la suppression." });
        } finally {
            // Réinitialise le modal
            setConfirm({ ...confirm, willDelete: false });
            setPostToDelete(null);
            setIsloading(false);
        }
    };

    const handleMarkAsSold = async (post) => {
        if (!post) return;
        setPostToMarkAsSold(post);
        setConfirm({ ...confirm, willMarkAsSold: true });
    };

    const confirmMarkAsSold = async () => {
        if (!postToMarkAsSold) return;
        setIsloading(true);

        try {
            const result = await markAsSold(currentUser?.uid, postToMarkAsSold.id);
            if (result.success) {
                setPosts((prev) => prev.map(post =>
                    post.id === postToMarkAsSold.id ? { ...post, isSold: true } : post
                ));
                setToast({ show: true, type: 'info', message: result.message });
            } else {
                setToast({ show: true, type: 'error', message: result.message });
            }
        } catch (error) {
            // console.error("Erreur :", error);
            setToast({ show: true, type: 'error', message: "Une erreur est survenue." });
        } finally {
            setConfirm({ ...confirm, willMarkAsSold: false });
            setPostToMarkAsSold(null);
            setIsloading(false);
        }
    };

    const handleAction = (post) => {
        const PostID = post.PostID;
        const post_id = PostID.toLowerCase();
        navigate(`${post_id}`);
    };

    // Fonction pour appliquer les filtres
    const handleFilterChange = (filters) => {
        const filtered = posts.filter(post =>
            (filters.search === "" ||
                post.adDetails.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                post.PostID.toLowerCase().includes(filters.search.toLowerCase())
            ) &&
            (filters.status === "all" || post.status === filters.status || post.isSold === true) &&
            (filters.category === "all" || post.category === filters.category) &&
            (filters.city === "" || post.location.city.toLowerCase().includes(filters.city.toLowerCase())) &&
            (filters.date === "" || format(new Date(post.expiry_date), "yyyy-MM-dd") === filters.date) &&
            (filters.views === "" || post.views >= Number(filters.views))
        );
        setFilteredPosts(filtered);
    };

    const options = [
        {
            label: 'Modifier',
            icon: '✏️',
            action: () => handleEditPost(postToEdit),
            disabled: postToEdit?.isSold, // Désactiver si vendue
        },
        {
            label: 'Marquer comme vendu',
            icon: '✅',
            action: () => handleMarkAsSold(postToEdit.id),
            disabled: postToEdit?.isSold, // Désactiver si vendue
        },
        {
            label: 'Supprimer',
            icon: '🗑️',
            action: () => handleDeletePost(postToEdit.id),
        },
    ];

    return (
        <div className='my-ads'>
            <div className="head">
                <h2>Mes Annonces</h2>
                <div className="filters-container" onClick={() => setOpenFilter(!openFilter)}>
                    <FontAwesomeIcon icon={faFilter} />
                </div>
            </div>

            {/* Filtres */}
            {openFilter && (
                <PostsFilter onFilterChange={handleFilterChange} />
            )}

            <div className="ads-list">
                <div className="card-list">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Post ID</th>
                                <th>📸 Image</th>
                                <th>🏷️ Titre</th>
                                <th>💰 Prix</th>
                                <th>👀 Vues</th>
                                <th>📌 Clics</th>
                                <th>📊 Conversion (%)</th>
                                <th>🚨 Signalements</th>
                                <th>📅 Expiration</th>
                                <th>⚡ Statut</th>
                                <th>🛠️ Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPosts.length > 0 ? (
                                currentPosts.map((post, index) => (
                                    <PostRow
                                        key={post.id}
                                        index={index}
                                        post={post}
                                        onAction={(post) => handleAction(post)}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="12">Aucune annonce trouvée.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    currentPage={currentPage}
                    elements={posts}
                    elementsPerPage={postPerPage}
                    paginate={paginate}
                />
            </div>

            {showMenu && (
                <Modal onShow={showMenu} onHide={() => setShowMenu(false)} title={"Actions"}>
                    <div className="modal-menu">
                        {options.map((option, index) => (
                            <div key={index} className="menu-item" onClick={option.action}>
                                {/* <FontAwesomeIcon icon={option.icon} /> */}
                                <span>{option.icon}</span>
                                <span>{option.label}</span>
                            </div>
                        ))}
                    </div>
                </Modal>
            )}

            {showEditModal && postToEdit && (
                <Modal title={"Modification d'annonce"} onShow={showEditModal} onHide={() => setShowEditModal(false)}>
                    <div className='ad-details'>
                        <Tab post={postToEdit} key={postToEdit.id} />
                        <div className="ad-details-buttons">
                            <button className="modal-button approve-button" onClick={handleConfirmEdit}>
                                {isLoading ? <Spinner /> : 'Modifier'}
                            </button>
                            <button className="modal-button reject-button" onClick={() => setShowEditModal(false)}>
                                Annuler
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {confirm.willDelete && (
                <Modal title={"Suppression d'annonce"} onShow={confirm.willDelete} onHide={() => setConfirm({ ...confirm, willDelete: false })}>
                    <p>Êtes-vous sûr de vouloir supprimer cette annonce ?</p>
                    <div className="ad-details-buttons">
                        <button className="modal-button approve-button" onClick={confirmDeletePost}>
                            {isLoading ? <Spinner /> : 'Confirmer'}
                        </button>
                        <button className="modal-button reject-button" onClick={() => setConfirm({ ...confirm, willDelete: false })}>
                            Annuler
                        </button>
                    </div>
                </Modal>
            )}

            {confirm.willUpdate && (
                <Modal title={"Confirmation"} onShow={confirm.willUpdate} onHide={() => setConfirm({ ...confirm, willUpdate: false })}>
                    <p>Voulez-vous confirmer la mise à jour de cette annonce ?</p>
                    <div className="ad-details-buttons">
                        <button className="modal-button approve-button" onClick={confirmEditPost}>
                            {isLoading ? <Spinner /> : 'Confirmer'}
                        </button>
                        <button className="modal-button reject-button" onClick={() => setConfirm({ ...confirm, willUpdate: false })}>
                            Annuler
                        </button>
                    </div>
                </Modal>
            )}

            {confirm.willMarkAsSold && postToMarkAsSold && (
                <Modal title={"Confirmer la vente"} onShow={confirm.willMarkAsSold} onHide={() => setConfirm({ ...confirm, willMarkAsSold: false })}>
                    <p>Êtes-vous sûr de vouloir marquer cette annonce comme vendue ?</p>
                    <div className="ad-details-buttons">
                        <button className="modal-button approve-button" onClick={confirmMarkAsSold}>
                            {isLoading ? <Spinner /> : 'Confirmer'}
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
