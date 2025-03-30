import React, { useEffect, useState, useCallback, useRef } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { fetchDataByUserID } from "../../routes/userRoutes";
import { fetchPosts } from "../../routes/postRoutes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartPie, faEye, faFilter } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/pagination/Pagination";
import Loading from "../../customs/Loading";
import data from "../../json/data.json";
import "../../styles/ManagePosts.scss";

// Status des annonces avec icônes
const STATUS_ICONS = {
    pending: "🟠 En attente",
    approved: "🟢 Accepté",
    refused: "🔴 Rejetée",
    expired: "⚫ Expirée",
    sold: "✅ Vendue"
};

// 🔍 Composant Filtres
const PostsFilter = ({ filters, onFilterChange }) => (
    <div className="filters">
        <input
            type="text"
            name="search"
            placeholder="Rechercher par titre ou ID"
            value={filters.search}
            onChange={onFilterChange}
        />
        <select name="status" value={filters.status} onChange={onFilterChange}>
            <option value="all">Tous les statuts</option>
            {Object.keys(STATUS_ICONS).map(status => (
                <option key={status} value={status}>{STATUS_ICONS[status]}</option>
            ))}
        </select>
        <select name="category" value={filters.category} onChange={onFilterChange}>
            <option value="all">Toutes les catégories</option>
            {data.categories.map(category => (
                <option key={category.key} value={category.categoryName}>
                    {category.categoryTitles.fr}
                </option>
            ))}
        </select>
        <input type="text" name="city" placeholder="Ville" value={filters.city} onChange={onFilterChange} />
        <input type="date" name="date" value={filters.date} onChange={onFilterChange} />
        <input type="number" name="views" placeholder="Nombre de vues minimum" value={filters.views} onChange={onFilterChange} />
    </div>
);

// 📝 Composant Annonce (Ligne)
const PostRow = ({ index, post, onAction, isSelected, onSelect }) => {
    const menuRef = useRef(null);
    const [postOwner, setPostOwner] = useState(null);
    const [showMenu, setShowMenu] = useState(false);

    const fetchOwner = useCallback(async () => {
        const result = await fetchDataByUserID(post.userID);
        if (result.success) setPostOwner(result.data);
    }, [post.userID]);

    useEffect(() => {
        fetchOwner();
    }, [fetchOwner]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <tr>
            <td>{index + 1}</td>
            <td>{post.PostID}</td>
            <td><img src={post.images[0]} alt="" width={50} height={50} /></td>
            <td>{post.details?.title}</td>
            <td>{post.details?.price} RUB</td>
            <td>{formatDistanceToNow(new Date(post.expiry_date), { locale: fr, addSuffix: true })}</td>
            <td>{STATUS_ICONS[post.status] || "⚪ Inconnu"}</td>
            <td>{postOwner?.displayName || "Inconnu"}</td>
            <td>
                <button title="Actions" onClick={() => setShowMenu(!showMenu)}>⋮</button>
                {showMenu && (
                    <div className="floating-menu" ref={menuRef}>
                        <button title="Voir l'annonce" onClick={() => onAction("view", post.PostID)}>
                            <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button title="Statistiques" onClick={() => onAction("stats", post.PostID)}>
                            <FontAwesomeIcon icon={faChartPie} />
                        </button>
                    </div>
                )}
            </td>
        </tr>
    );
};


// 🏡 Composant Principal
export default function ManagePosts() {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [postPerPage] = useState(10);
    const [openFilter, setOpenFilter] = useState(false);
    const [selectedPosts, setSelectedPosts] = useState([]);
    const navigate = useNavigate();

    // 🛠️ Initialisation des filtres
    const [filters, setFilters] = useState({
        search: "",
        status: "all",
        category: "all",
        city: "",
        date: "",
        views: ""
    });

    // 📡 Récupération des annonces
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const data = await fetchPosts();
                if (data) {
                    setPosts(data.posts?.allAds || []);
                    setFilteredPosts(data.posts?.allAds || []);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des annonces:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    // 📌 Filtrage des annonces
    useEffect(() => {
        const filtered = posts.filter(post =>
            (filters.search === "" ||
                post.details.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                post.PostID.toLowerCase().includes(filters.search.toLowerCase())) &&
            (filters.status === "all" || post.status === filters.status) &&
            (filters.category === "all" || post.category === filters.category) &&
            (filters.city === "" || post.location.city.toLowerCase().includes(filters.city.toLowerCase())) &&
            (filters.date === "" || format(new Date(post.expiry_date), "yyyy-MM-dd") === filters.date) &&
            (filters.views === "" || post.views >= Number(filters.views))
        );
        setFilteredPosts(filtered);
    }, [filters, posts]);

    // 📍 Gestion du changement de page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    // 🚀 Gestion des actions (navigation)
    const handleAction = (action, PostID) => {
        navigate(`${PostID.toLowerCase()}${action === "stats" ? "/statistics" : ""}`);
    };

    // 🎯 Gestion des filtres
    const handleFilterChange = useCallback((e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    }, []);

    // 📌 Gestion de la sélection des annonces
    const handleSelect = (postID) => {
        setSelectedPosts(prev => prev.includes(postID)
            ? prev.filter(id => id !== postID)
            : [...prev, postID]
        );
    };

    if (loading) return <Loading />;

    return (
        <div className="ads-section">
            <div className="head">
                <h2>Gestion des Annonces</h2>
                <div className="filters-container" onClick={() => setOpenFilter(!openFilter)}>
                    <FontAwesomeIcon icon={faFilter} />
                </div>
            </div>

            {/* 🔍 Filtres */}
            {openFilter && <PostsFilter filters={filters} onFilterChange={handleFilterChange} />}

            <div className="ads-list">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Post ID</th>
                                <th>Image</th>
                                <th>Titre</th>
                                <th>Prix</th>
                                <th>Expiration</th>
                                <th>Statut</th>
                                <th>Annonceur</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPosts.length ? currentPosts.map((post, index) => (
                                <PostRow
                                    key={post.postID}
                                    index={index}
                                    post={post}
                                    isSelected={selectedPosts.includes(post.postID)}
                                    onAction={handleAction}
                                    onSelect={() => handleSelect(post.postID)}
                                />
                            )) : (
                                <tr><td colSpan="9">Aucune annonce trouvée.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination currentPage={currentPage} elements={filteredPosts} elementsPerPage={postPerPage} paginate={paginate} />
            </div>
        </div>
    );
}
