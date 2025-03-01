import React, { useEffect, useState } from "react";
import { fr } from "date-fns/locale";
import { format, formatDistanceToNow } from "date-fns";
import { formatViewCount } from "../../func";
import { fetchDataByUserID, fetchUserData } from "../../routes/userRoutes";
import { fetchAllPosts } from "../../routes/postRoutes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { allCategories } from "../../data/database";
import { useNavigate } from 'react-router-dom';
import Pagination from "../../components/pagination/Pagination";
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

const PostRow = ({ index, post, onAction }) => {
    const [postOwner, setPostOwner] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!post) return;
            const result = await fetchDataByUserID(post.userID);
            if (result.success) setPostOwner(result.data);
        };
        fetchData();
    }, [post]);



    return (
        <tr>
            <td>{index + 1}</td>
            <td>{post.PostID}</td>
            <td><img src={post.images[0]} alt='' width={50} height={50} /></td>
            <td>{post.adDetails.title}</td>
            <td>{post.adDetails.price} RUB</td>
            <td>{formatViewCount(post.views)}</td>
            <td>{formatViewCount(post.clicks)}</td>
            <td>{post.views ? ((post.clicks / post.views) * 100).toFixed(1) + "%" : "0%"}</td>
            <td>{formatDistanceToNow(new Date(post.expiry_date), { locale: fr, addSuffix: true })}</td>
            <td>{post.status === "pending" ? "🟠 En attente" : post.status === "approved" ? "🟢 Accepté" : "🔴 Rejetée"}</td>
            <td>{postOwner?.displayName || "Inconnu"}</td>
            <td>{post.reportingCount || 0}</td>
            <td>
                <button className="see-more" onClick={() => onAction(post)}>Voir</button>
            </td>
        </tr>
    );
};

export default function ManagePosts() {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [openFilter, setOpenFilter] = useState(false);
    const [postPerPage] = useState(10);
    const navigate = useNavigate();

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
            (filters.status === "all" || post.status === filters.status) &&
            (filters.category === "all" || post.category === filters.category) &&
            (filters.city === "" || post.location.city.toLowerCase().includes(filters.city.toLowerCase())) &&
            (filters.date === "" || format(new Date(post.expiry_date), "yyyy-MM-dd") === filters.date) &&
            (filters.views === "" || post.views >= Number(filters.views))
        );
        setFilteredPosts(filtered);
    };

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
                            {currentPosts.length === 0 ? (
                                <tr>
                                    <td colSpan="12">Aucune annonce trouvée.</td>
                                </tr>
                            ) : null}
                            {currentPosts.map((post, index) => (
                                <PostRow
                                    key={post.id}
                                    index={index}
                                    post={post}
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
        </div>
    );
}
