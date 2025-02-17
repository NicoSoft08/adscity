import React, { useEffect, useState } from "react";
import { fr } from "date-fns/locale";
import { format } from "date-fns";
import { formatViewCount } from "../../func";
import { fetchDataByUserID } from "../../routes/userRoutes";
import { fetchAllPosts, suspendPost, deletePost } from "../../routes/postRoutes";
import Modal from "../../customs/Modal";
import Pagination from "../../components/pagination/Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { allCategories } from "../../data/database";
import "../../styles/ManagePosts.scss";

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

const PostRow = ({ index, post, onAction, options }) => {
    const [postOwner, setPostOwner] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!post) return;
            const result = await fetchDataByUserID(post.userID);
            if (result.success) setPostOwner(result.data);
        };
        fetchData();
    }, [post]);


    const handleActionClick = () => {
        const postID = post.id;
        console.log(postID);
        onAction(post);
        setOpenModal(true);
    }

    return (
        <>
            <tr>
                <td>{index + 1}</td>
                <td>{post.PostID}</td>
                <td><img src={post.images[0]} alt='' width={50} height={50} /></td>
                <td>{post.adDetails.title}</td>
                <td>{post.adDetails.price} RUB</td>
                <td>{formatViewCount(post.views)}</td>
                <td>{formatViewCount(post.clicks)}</td>
                <td>{post.views ? ((post.clicks / post.views) * 100).toFixed(1) + "%" : "0%"}</td>
                <td>{format(new Date(post.expiry_date), "dd/MM/yyyy HH:mm", { locale: fr })}</td>
                <td>{post.status === "pending" ? "🟠 En attente" : post.status === "approved" ? "🟢 Accepté" : "🔴 Rejetée"}</td>
                <td>{postOwner?.displayName || "Inconnu"}</td>
                <td>{post.reportingCount || 0}</td>
                <td>
                    <button className="see-more" onClick={() => handleActionClick(post)}>Détails</button>
                </td>
            </tr>
            {openModal && (
                <Modal title={"Actions"} onShow={openModal} onHide={() => setOpenModal(false)}>
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
        </>
    );
};

export default function ManagePosts() {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const postPerPage = 10;
    const [selectedPost, setSelectedPost] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [reason, setReason] = useState("");
    const [openFilter, setOpenFilter] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const result = await fetchAllPosts();
            if (result.success) {
                setPosts(result.postsData || []);
                setFilteredPosts(result.postsData || []);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleAction = (post, action) => {
        setSelectedPost(post);
        setModalType(action);
    };

    // Fonction pour appliquer les filtres
    const handleFilterChange = (filters) => {
        const filtered = posts.filter(post =>
            (filters.search === "" ||
                post.adDetails.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                post.PostID.toLowerCase().includes(filters.search.toLowerCase())
            ) &&
            (filters.status === "all" || post.status === filters.status) &&
            (filters.category === "all" || post.category === filters.category) &&
            (filters.city === "" || post.location.city.toLowerCase().includes(filters.city.toLowerCase())) &&
            (filters.date === "" || format(new Date(post.expiry_date), "yyyy-MM-dd") === filters.date) &&
            (filters.views === "" || post.views >= Number(filters.views))
        );
        setFilteredPosts(filtered);
    };

    const handleConfirmAction = async () => {
        if (!selectedPost || !modalType || !reason.trim()) {
            alert("Veuillez entrer un motif.");
            return;
        }

        try {
            if (modalType === "suspend") {
                await suspendPost(selectedPost.id, reason);
            } else if (modalType === "delete") {
                await deletePost(selectedPost.id, reason);
            }
            setFilteredPosts(filteredPosts.filter(post => post.id !== selectedPost.id));
            setModalType(null);
        } catch (error) {
            console.error("Erreur :", error);
        }
    };

    const handleSuspendPost = () => {
        setModalType('suspend');
    };

    const handleDeletePost = () => {
        setModalType('delete');
    };

    const options = [
        {
            label: 'Suspendre',
            icon: '⏸️',
            action: () => handleSuspendPost(),
        },
        {
            label: 'Supprimer',
            icon: '🗑️',
            action: () => handleDeletePost(),
        },
    ];

    return (
        <div className="ads-section">
            <div className="head">
                <h2>Gestion des Annonces</h2>
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
                                <th>📅 Expiration</th>
                                <th>⚡ Statut</th>
                                <th>👤 Annonceur</th>
                                <th>🚨 Signalements</th>
                                <th>🛠️ Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPosts.map((post, index) => (
                                <PostRow
                                    key={post.id}
                                    index={index}
                                    post={post}
                                    options={options}
                                    onAction={(post) => handleAction(post)}
                                />
                            ))}
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

            {/* MODALE D'ACTION */}
            {modalType && (
                <Modal
                    title={modalType === "suspend" ? "Suspendre l'annonce" : "Supprimer l'annonce"}
                    onShow={!!modalType}
                    onHide={() => setModalType(null)}
                >
                    <div className="action-menu">
                        <p><strong>Annonce :</strong> {selectedPost?.adDetails?.title}</p>
                        <label>Motif de l'action :</label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Expliquez pourquoi cette action est nécessaire..."
                            rows="4"
                        />
                        <div className="modal-actions">
                            <button onClick={handleConfirmAction} className="confirm-btn">Confirmer</button>
                            <button onClick={() => setModalType(null)} className="cancel-btn">Annuler</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
