import React, { useEffect, useState, useCallback, useContext, useRef } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { fetchDataByUserID } from "../../routes/userRoutes";
import { fetchPosts } from "../../routes/postRoutes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/pagination/Pagination";
import Loading from "../../customs/Loading";
import data from "../../json/data.json";
import { AuthContext } from "../../contexts/AuthContext";
import Toast from "../../customs/Toast";
import { logAdminAction } from "../../routes/apiRoutes";
import { debounce } from "lodash";
import { LanguageContext } from "../../contexts/LanguageContext";
import "../../styles/ManagePosts.scss";

// Status des annonces avec icônes
const STATUS_ICONS = (language) => ({
    pending: language === 'FR' ? "🟠 En attente" : "🟠 Pendin",
    approved: language === 'FR' ? "🟢 Accepté" : "🟢 Approved",
    refused: language === 'FR' ? "🔴 Rejeté" : "🔴 Rejected",
    expired: language === 'FR' ? "⚫ Expiré" : "⚫ Expired",
    sold: language === 'FR' ? "✅ Vendu" : "✅ Sold",
});

// 🔍 Composant Filtres
const PostsFilter = ({ onFilterChange, onExport, language }) => {
    // 🛠️ Initialisation des filtres
    const [filters, setFilters] = useState({
        search: "",
        status: "all",
        category: "all",
        city: "",
        startDate: "", // Date de début
        endDate: "",   // Date de fin
        views: ""
    });

    // Référence pour la fonction debounce
    const debouncedFilterChangeRef = useRef(null);

    // Initialisation de la fonction debounce
    useEffect(() => {
        debouncedFilterChangeRef.current = debounce((newFilters) => {
            onFilterChange(newFilters);
        }, 300);

        // Nettoyage lors du démontage du composant
        return () => {
            if (debouncedFilterChangeRef.current?.cancel) {
                debouncedFilterChangeRef.current.cancel();
            }
        };
    }, [onFilterChange]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Validation des dates
        let updatedFilters = { ...filters, [name]: value };

        // S'assurer que la date de début n'est pas après la date de fin
        if (name === "startDate" && updatedFilters.endDate && updatedFilters.startDate > updatedFilters.endDate) {
            updatedFilters.endDate = updatedFilters.startDate;
        }

        // S'assurer que la date de fin n'est pas avant la date de début
        if (name === "endDate" && updatedFilters.startDate && updatedFilters.endDate < updatedFilters.startDate) {
            updatedFilters.startDate = updatedFilters.endDate;
        }

        setFilters(updatedFilters);

        // Appel de la fonction debounce
        if (debouncedFilterChangeRef.current) {
            debouncedFilterChangeRef.current(updatedFilters);
        }
    };

    return (
        <div className="filters">
            <input
                type="text"
                name="search"
                placeholder={language === 'FR' ? "Rechercher par titre ou ID" : "Search by title or ID"}
                value={filters.search}
                onChange={handleChange}
            />
            <select name="status" value={filters.status} onChange={handleChange}>
                <option value="all">{language === 'FR' ? "Toutes les statuts" : "All status"}</option>
                {Object.keys(STATUS_ICONS).map(status => (
                    <option key={status} value={status}>{STATUS_ICONS[status]}</option>
                ))}
            </select>
            <select name="category" value={filters.category} onChange={handleChange}>
                <option value="all">{language === 'FR' ? "Toutes les catégories" : "All categories"}</option>
                {data.categories.map(category => (
                    <option key={category.key} value={category.categoryName}>
                        {category.categoryTitles.fr}
                    </option>
                ))}
            </select>
            <input
                type="text"
                name="city"
                placeholder={language === 'FR' ? "Ville" : "City"}
                value={filters.city}
                onChange={handleChange}
            />
            <div className="date-range">
                <input
                    type="date"
                    name="startDate"
                    placeholder="Date de début"
                    value={filters.startDate}
                    onChange={handleChange}
                />
                <input
                    type="date"
                    name="endDate"
                    placeholder="Date de fin"
                    value={filters.endDate}
                    onChange={handleChange}
                />
            </div>
            <input
                type="number"
                name="views"
                placeholder={language === 'FR' ? "Nombre de vues minimum" : "Minimum views"}
                value={filters.views}
                onChange={handleChange}
            />
            <button onClick={onExport}>
                {language === 'FR' ? " Exporter en CSV" : " Export to CSV"}
            </button>
        </div>
    )
};

// 📝 Composant Annonce (Ligne)
const PostRow = ({ index, post, onAction, language }) => {
    const [postOwner, setPostOwner] = useState(null);

    const fetchOwner = useCallback(async () => {
        try {
            const result = await fetchDataByUserID(post.userID);
            if (result.success) setPostOwner(result.data);
        } catch (error) {
            console.error("Erreur lors de la récupération du propriétaire:", error);
        }
    }, [post.userID]);

    useEffect(() => {
        fetchOwner();
    }, [fetchOwner]);

    return (
        <tr onClick={() => onAction(post)}>
            <td>{index + 1}</td>
            <td>{post.PostID}</td>
            <td>{post.images && post.images.length > 0 ?
                <img src={post.images[0]} alt="" width={40} height={40} /> :
                <div style={{ width: 40, height: 40, backgroundColor: '#eee' }}></div>
            }</td>
            <td>{post.details?.title || "Sans titre"}</td>
            <td>{post.details?.price || 0} RUB</td>
            <td>{post.expiry_date ?
                formatDistanceToNow(new Date(post.expiry_date), { locale: language === 'FR' ? fr : enUS, addSuffix: true }) :
                "Non défini"
            }</td>
            <td>{STATUS_ICONS(language)[post.status] || "⚪ Inconnu"}</td>
            <td>{postOwner?.firstName} {postOwner?.lastName}</td>
        </tr>
    );
};

// 🏡 Composant Principal
export default function ManagePosts() {
    const { currentUser, userData } = useContext(AuthContext);
    const { language } = useContext(LanguageContext);
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [postPerPage] = useState(10);
    const [openFilter, setOpenFilter] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const navigate = useNavigate();

    // 📡 Récupération des annonces
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);

                // Get the authentication token if user is logged in
                let idToken;

                if (currentUser) {
                    idToken = await currentUser.getIdToken(true);
                }

                const data = await fetchPosts(idToken);
                if (data) {
                    setPosts(data.posts?.allAds || []);
                    setFilteredPosts(data.posts?.allAds || []);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des annonces:", error);
                setToast({
                    show: true,
                    type: 'error',
                    message: 'Erreur lors du chargement des annonces'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [currentUser]); // Add currentUser as a dependency

    // 🎯 Gestion des filtres
    const handleFilterChange = (filters) => {
        let filtered = posts.filter(post => {
            // Convertir la date d'expiration en objet Date pour la comparaison
            const expiryDate = post.expiry_date ? new Date(post.expiry_date) : null;
            const formattedExpiryDate = expiryDate ? format(expiryDate, "yyyy-MM-dd") : null;

            // Filtrage par recherche (titre ou ID)
            const searchMatch = filters.search === "" ||
                (post.details?.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
                    post.PostID?.toLowerCase().includes(filters.search.toLowerCase()));

            // Filtrage par statut
            const statusMatch = filters.status === "all" || post.status === filters.status;

            // Filtrage par catégorie
            const categoryMatch = filters.category === "all" || post.category === filters.category;

            // Filtrage par ville
            const cityMatch = filters.city === "" ||
                (post.location?.city?.toLowerCase().includes(filters.city.toLowerCase()));

            // Filtrage par plage de dates
            const startDateMatch = !filters.startDate || !formattedExpiryDate ||
                formattedExpiryDate >= filters.startDate;

            const endDateMatch = !filters.endDate || !formattedExpiryDate ||
                formattedExpiryDate <= filters.endDate;

            // Filtrage par nombre de vues
            const viewsMatch = filters.views === "" ||
                (post.stats?.views && post.stats.views >= Number(filters.views));

            return searchMatch && statusMatch && categoryMatch && cityMatch &&
                startDateMatch && endDateMatch && viewsMatch;
        });

        setFilteredPosts(filtered);
        setCurrentPage(1); // Réinitialiser à la première page lors du changement de filtres
    };

    // 📊 Exportation en CSV
    const handleExportCSV = async () => {
        if (currentUser && !userData.permissions?.includes('MANAGE_USERS')) {
            setToast({
                show: true,
                type: 'error',
                message: 'Vous n\'avez pas les autorisations pour exporter les annonces.'
            });
            return;
        }

        try {
            await logAdminAction(
                currentUser.uid,
                "Exportation annonces",
                "L'admin a exporté la liste des annonces."
            );

            // Fonction pour échapper les valeurs CSV
            const escapeCSV = (value) => {
                if (value === null || value === undefined) return '';
                const stringValue = String(value);
                if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                    return `"${stringValue.replace(/"/g, '""')}"`;
                }
                return stringValue;
            };

            // Créer le contenu CSV
            const headers = language === 'FR'
                ? ["ID", "Titre", "Prix", "Statut", "Annonceur", "Date d'expiration", "Vues", "Clicks", "Ville"]
                : ["ID", "Title", "Price", "Status", "Advertiser", "Expiry Date", "Views", "Clicks", "City"];
            const csvContent = [
                headers.join(","),
                ...filteredPosts.map(post => [
                    escapeCSV(post.PostID),
                    escapeCSV(post.details?.title || ""),
                    post.details?.price || 0,
                    escapeCSV(post.status || ""),
                    escapeCSV(post.userID || ""),
                    post.expiry_date ? format(new Date(post.expiry_date), "yyyy-MM-dd") : "",
                    post.stats?.views || 0,
                    post.stats?.clicks || 0,
                    escapeCSV(post.location?.city || "")
                ].join(","))
            ].join("\n");

            // Créer et télécharger le fichier
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `annonces_export_${format(new Date(), "yyyy-MM-dd")}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setToast({
                show: true,
                type: 'success',
                message: language === 'FR'
                    ? 'Export réussi!'
                    : 'Export successful!'
            });
        } catch (error) {
            console.error("Erreur lors de l'exportation:", error);
            setToast({
                show: true,
                type: 'error',
                message: language === 'FR'
                    ? 'Erreur lors de l\'exportation'
                    : 'Error during export'
            });
        }
    };

    // 📍 Gestion du changement de page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    // 🚀 Gestion des actions (navigation)
    const handleAction = (post) => {
        if (post?.PostID) {
            navigate(`${post.PostID}`);
        }
    };

    return (
        <div className="ads-section">
            <div className="head">
                <h2>{language === 'FR' ? "Gestion des Annonces" : "Ads Management"} {filteredPosts.length} </h2>
                <div className="filters-container" onClick={() => setOpenFilter(!openFilter)}>
                    <FontAwesomeIcon icon={faFilter} />
                </div>
            </div>
            {/* 🔍 Filtres */}
            {openFilter && <PostsFilter onFilterChange={handleFilterChange} language={language} onExport={handleExportCSV} />}

            {loading && <Loading />}
            <div className="ads-list">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Post ID</th>
                                <th>Image</th>
                                <th>{language === 'FR' ? "Titre" : "Title"}</th>
                                <th>{language === 'FR' ? "Prix" : "Price"}</th>
                                <th>{language === 'FR' ? "Date d'expiration" : "Expiry Date"}</th>
                                <th>{language === 'FR' ? "Statut" : "Status"}</th>
                                <th>{language === 'FR' ? "Annonceur" : "Advertiser"}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPosts.length ? currentPosts.map((post, index) => (
                                <PostRow
                                    key={post.PostID || index}
                                    index={indexOfFirstPost + index}
                                    post={post}
                                    currentUser={currentUser}
                                    onAction={handleAction}
                                    language={language}
                                />
                            )) : (
                                <tr><td colSpan="8">
                                    {language === 'FR' ? "Aucune annonce trouvée" : "No ads found"}
                                </td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {posts.length > postPerPage && (
                    <Pagination currentPage={currentPage} elements={filteredPosts} elementsPerPage={postPerPage} paginate={paginate} />
                )}
            </div>
            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ show: false, ...toast })} />
        </div>
    );
}
