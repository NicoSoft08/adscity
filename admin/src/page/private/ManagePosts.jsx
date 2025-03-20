import React, { useEffect, useMemo, useState } from "react";
import { fr } from "date-fns/locale";
import { format, formatDistanceToNow } from "date-fns";
import { fetchDataByUserID } from "../../routes/userRoutes";
import { fetchPosts } from "../../routes/postRoutes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartPie, faEye, faFilter } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';
import Pagination from "../../components/pagination/Pagination";
import Loading from "../../customs/Loading";
import data from '../../json/data.json';
import "../../styles/ManagePosts.scss";

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
    const [postOwner, setPostOwner] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchDataByUserID(post.userID);
            if (result.success) setPostOwner(result.data);
        };

        if (post) {
            fetchData();
        }
    }, [post]);



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
            <td><img src={post.images[0]} alt='' width={50} height={50} /></td>
            <td>{post.details?.title}</td>
            <td>{post.details?.price} RUB</td>
            <td>{formatDistanceToNow(new Date(post.expiry_date), { locale: fr, addSuffix: true })}</td>
            <td>{STATUS_ICONS[post.status] || "⚪ Inconnu"}</td>
            <td>{postOwner?.displayName || "Inconnu"}</td>
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

export default function ManagePosts() {
    const [selectedPosts, setSelectedPosts] = useState([]);
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [openFilter, setOpenFilter] = useState(false);
    const [postPerPage] = useState(10);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        const fetchAllData = async () => {
            try {
                const data = await fetchPosts();

                if (isMounted && data) {
                    setPosts(data.posts?.allAds || []);
                    setFilteredPosts(data.posts?.allAds || []);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des annonces:', error);
                setLoading(false);
            }
        };

        fetchAllData();

        return () => { isMounted = false; };
    }, []);


    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleAction = (action, PostID) => {
        const post_id = PostID?.toLowerCase();

        switch (action) {
            case 'view':
                navigate(`${post_id}`);
                break;
            case 'stats':
                navigate(`${post_id}/statistics`);
                break;
            default:
                break;
        }
    };

    // Fonction pour appliquer les filtres
    const handleFilterChange = (filters) => {
        const filtered = posts.filter(post =>
            (filters.search === "" ||
                post.details.title.toLowerCase().includes(filters.search.toLowerCase()) ||
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

    // Vérifier si tous les posts sont sélectionnés
    const allSelected = useMemo(() => selectedPosts.length === posts.length, [selectedPosts, posts]);

    // Sélectionner/Désélectionner tout
    const toggleSelectAll = () => {
        setSelectedPosts(allSelected ? [] : posts.map(post => post.PostID));
    };

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


    if (loading) {
        return <Loading />
    }

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
                                <th>Post ID</th>
                                <th>Image</th>
                                <th>Titre</th>
                                <th>Prix</th>
                                <th>Expiration</th>
                                <th>Statut</th>
                                <th>Annonceur</th>
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
        </div>
    );
}
