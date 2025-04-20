import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchPostsByUserID } from '../../routes/userRoutes';
import { deletePost, markAsSold, updatePost } from '../../routes/postRoutes';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { deletePostImagesFromStorage } from '../../routes/storageRoutes';
import Pagination from '../../components/pagination/Pagination';
import Toast from '../../customs/Toast';
import Modal from '../../customs/Modal';
import Tab from '../../customs/Tab';
import Spinner from '../../customs/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie, faEye, faFilter } from '@fortawesome/free-solid-svg-icons';
import data from '../../json/data.json';
import { useNavigate } from 'react-router-dom';
import '../../styles/MyPosts.scss';
import Loading from '../../customs/Loading';

const STATUS_ICONS = {
    pending: "🟠 En attente",
    approved: "🟢 Accepté",
    refused: "🔴 Rejetée",
    expired: "⚫ Expirée",
    sold: "✅ Vendue"
};

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
                {data.categories.map(category => (
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

const PostRow = ({ index, post, onAction, isSelected, onSelect }) => {

    return (
        <tr className={isSelected ? 'selected' : ''}>
            <td>
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelect(post.PostID)}
                />
            </td>
            <td>{index + 1}</td>
            <td>{post.PostID}</td>
            <td><img src={post.images[0]} alt='' width={40} height={40} /></td>
            <td>{post.details?.title}</td>
            <td>{post.details?.price} RUB </td>
            <td>{formatDistanceToNow(new Date(post.expiry_date), { locale: fr, addSuffix: true })}</td>
            <td>{STATUS_ICONS[post.status] || "⚪ Inconnu"}</td>

            {/* 📌 Div flottante affichée si l'annonce est sélectionnée */}
            {isSelected && (
                <div className="floating-menu">
                    <button title="Voir l'annonce" onClick={() => onAction('view', post.PostID)}>
                        <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button title='Statistiques' onClick={() => onAction('stats', post.PostID)}>
                        <FontAwesomeIcon icon={faChartPie} />
                    </button>
                </div>
            )}
        </tr>
    );
};

export default function ManagePosts({ currentUser }) {
    const [selectedPosts, setSelectedPosts] = useState([]);
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [showEditModal, setShowEditModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [confirm, setConfirm] = useState({ willDelete: false, willUpdate: false, willMarkAsSold: false });
    const [postToEdit, setPostToEdit] = useState(null);
    const [postToMarkAsSold, setPostToMarkAsSold] = useState(null);
    const [postToDelete, setPostToDelete] = useState(null);
    const [editData, setEditData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [openFilter, setOpenFilter] = useState(false);
    const [postPerPage] = useState(5);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        // Add loading state
        setIsLoading(true);

        const fetchPosts = async () => {
            try {
                // Validate user is logged in
                if (!currentUser?.uid) {
                    setIsLoading(false);
                    return;
                }

                const userID = currentUser.uid;

                try {
                    const data = await fetchPostsByUserID(userID);

                    if (isMounted) {
                        // Validate and set data
                        const postsArray = data.postsData?.allAds || [];
                        setPosts(postsArray);
                        setFilteredPosts(postsArray);

                        // Update loading state
                        setIsLoading(false);
                    }
                } catch (error) {
                    console.error('Erreur lors de la récupération des annonces:', error);

                    if (isMounted) {
                        // Set error state for user feedback
                        setPosts([]);
                        setFilteredPosts([]);
                        setIsLoading(false);
                    }
                }
            } catch (error) {
                console.error('Erreur inattendue:', error);

                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchPosts();

        return () => {
            isMounted = false;
            controller.abort(); // Cancel any pending requests
        };
    }, [currentUser]);


    const currentPosts = useMemo(() => {
        const indexOfLastPost = currentPage * postPerPage;
        const indexOfFirstPost = indexOfLastPost - postPerPage;
        return filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    }, [filteredPosts, currentPage, postPerPage]);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Gérer la sélection d'une annonce
    const handleSelect = (postID) => {
        setSelectedPosts(prev => {
            const newSelection = new Set(prev);
            if (newSelection.has(postID)) {
                newSelection.delete(postID);
            } else {
                newSelection.add(postID);
            }
            return Array.from(newSelection);
        });
    };

    // Vérifier si tous les posts sont sélectionnés
    const allSelected = useMemo(() => selectedPosts.length === posts.length, [selectedPosts, posts]);

    // Sélectionner/Désélectionner tout
    const toggleSelectAll = () => {
        setSelectedPosts(allSelected ? [] : posts.map(post => post.PostID));
    };


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
        setIsLoading(true);

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
            setIsLoading(false);
        }
    };

    const handleDeletePost = async (postID) => {
        if (!postID) return;

        setPostToDelete(postID);
        setConfirm({ ...confirm, willDelete: true });
    };

    const confirmDeletePost = async () => {
        if (!postToDelete) return;
        setIsLoading(true);

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
            setIsLoading(false);
        }
    };

    const handleMarkAsSold = async (post) => {
        if (!post) return;
        setPostToMarkAsSold(post);
        setConfirm({ ...confirm, willMarkAsSold: true });
    };

    const confirmMarkAsSold = async () => {
        if (!postToMarkAsSold) return;
        setIsLoading(true);

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
            setIsLoading(false);
        }
    };

    const handleAction = (action, postID) => {
        switch (action) {
            case 'view':
                navigate(`${postID}`);
                break;
            case 'stats':
                navigate(`${postID}/statistics`);
                break;
            default:
                break;
        }
    };

    // Fonction pour appliquer les filtres
    const handleFilterChange = useCallback((filters) => {
        setFilteredPosts(posts.filter(post =>
            (filters.search === "" ||
                post.details.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                post.PostID.toLowerCase().includes(filters.search.toLowerCase())) &&
            (filters.status === "all" || post.status === filters.status || post.isSold === true) &&
            (filters.category === "all" || post.category === filters.category) &&
            (filters.city === "" || post.location.city.toLowerCase().includes(filters.city.toLowerCase())) &&
            (filters.date === "" || format(new Date(post.expiry_date), "yyyy-MM-dd") === filters.date) &&
            (filters.views === "" || post.stats?.views >= Number(filters.views))
        ));
    }, [posts]);

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
                <h2>Annonces</h2>
                <div className="filters-container" onClick={() => setOpenFilter(!openFilter)}>
                    <FontAwesomeIcon icon={faFilter} />
                </div>
            </div>

            {/* Filtres */}
            {openFilter && (
                <PostsFilter onFilterChange={handleFilterChange} />
            )}

            {isLoading && <Loading />}

            <div className="ads-list">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th>#</th>
                                <th>ID</th>
                                <th>Image</th>
                                <th>Titre</th>
                                <th>Prix</th>
                                <th>Expiration</th>
                                <th>Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPosts.length > 0 ? (
                                currentPosts.map((post, index) => (
                                    <PostRow
                                        key={post.id}
                                        index={index}
                                        post={post}
                                        onAction={handleAction}
                                        isSelected={selectedPosts.includes(post.PostID)}
                                        onSelect={handleSelect}
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

                {posts.length > postPerPage && (
                    <Pagination
                        currentPage={currentPage}
                        elements={posts}
                        elementsPerPage={postPerPage}
                        paginate={paginate}
                    />
                )}
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
