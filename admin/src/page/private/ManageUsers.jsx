import React, { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { fetchUsers } from '../../routes/userRoutes';
import Toast from '../../customs/Toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleExclamation, faFilter } from '@fortawesome/free-solid-svg-icons';
import { IconAvatar } from '../../config/images';
import Pagination from '../../components/pagination/Pagination';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import { formatDistanceToNow } from 'date-fns';
import { logAdminAction } from '../../routes/apiRoutes';
import Loading from '../../customs/Loading';
import { LanguageContext } from '../../contexts/LanguageContext';
import '../../styles/ManageUsers.scss';

// Status des utilisateur avec icônes
const formatUserStatut = (isOnline, language) => (
    isOnline
        ? (language === 'FR' ? "🟢 En ligne" : "🟢 Online")
        : (language === 'FR' ? "🔴 Hors ligne" : "🔴 Offline")
);

const UsersFilter = ({ onFilterChange, onClick, language }) => {
    const [filters, setFilters] = useState({
        search: "",
        role: "all", // "all", "admin", "user"
        status: "all", // "all", "active", "suspended", "banned"
        city: "",
        subscription: "all", // "all", "free", "pro", "business"
        startDate: "",  // Date de début du filtre
        endDate: "",
        emailVerified: "all", // "all", "true", "false"
    });

    // Create a ref to store the debounced function
    const debouncedFilterChangeRef = useRef(null);

    // Initialize the debounced function once
    useEffect(() => {
        debouncedFilterChangeRef.current = debounce((newFilters) => {
            onFilterChange(newFilters);
        }, 300);

        // Clean up the debounced function when component unmounts
        return () => {
            if (debouncedFilterChangeRef.current?.cancel) {
                debouncedFilterChangeRef.current.cancel();
            }
        };
    }, [onFilterChange]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Handle date validation
        let updatedFilters = { ...filters, [name]: value };

        // Ensure startDate is not after endDate
        if (name === "startDate" && updatedFilters.endDate && updatedFilters.startDate > updatedFilters.endDate) {
            updatedFilters.endDate = updatedFilters.startDate;
        }

        // Ensure endDate is not before startDate
        if (name === "endDate" && updatedFilters.startDate && updatedFilters.endDate < updatedFilters.startDate) {
            updatedFilters.startDate = updatedFilters.endDate;
        }

        setFilters(updatedFilters);

        // Call the debounced function
        if (debouncedFilterChangeRef.current) {
            debouncedFilterChangeRef.current(updatedFilters);
        }
    };

    return (
        <div className='filters'>
            <input
                type="text"
                name='search'
                placeholder={language === 'FR' ? "Rechercher par nom ou email" : "Search by name or email"}
                value={filters.search}
                onChange={handleChange}
            />
            <select name='role' value={filters.role} onChange={handleChange}>
                <option value="all">{language === 'FR' ? "Tous les rôles" : "All role"}</option>
                <option value="user">{language === 'FR' ? "Utilisateur" : "Users"}</option>
                <option value="admin">{language === 'FR' ? "Admin" : "Admin"}</option>
            </select>
            <select name='status' value={filters.status} onChange={handleChange}>
                <option value="all">{language === 'FR' ? "Toutes les statuts" : "All status"}</option>
                <option value="active">{language === 'FR' ? "🟢 Actif" : "🟢 Active"}</option>
                <option value="suspended">{language === 'FR' ? "🟠 Suspendu" : '🟠 Suspended'}</option>
                <option value="banned">{language === 'FR' ? "🔴 Banni" : "🔴 Banned"}</option>
            </select>
            <input
                type="text"
                name='city'
                placeholder={language === 'FR' ? "Ville" : "City"}
                value={filters.city}
                onChange={handleChange}
            />
            <select name='subscription' value={filters.subscription} onChange={handleChange}>
                <option value="all">{language === 'FR' ? "Tous les abonnements" : "All subscriptions"}</option>
                <option value="free">{language === 'FR' ? "Gratuit" : "Free"}</option>
                <option value="pro">{language === 'FR' ? "Professionnel" : "Professional"}</option>
                <option value="business">{language === 'FR' ? "Entreprise" : "Business"}</option>
            </select>
            <select
                name='emailVerified'
                value={filters.emailVerified}
                onChange={handleChange}
            >
                <option value="all">{language === 'FR' ? "Tous les emails" : "All emails"}</option>
                <option value="true">{language === 'FR' ? "Vérifiés" : "Verified"}</option>
                <option value="false">{language === 'FR' ? "Non vérifiés" : "Unverified"}</option>
            </select>
            <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleChange}
            />
            <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleChange}
            />
            <button onClick={onClick}>
                {language === 'FR' ? " Exporter en CSV" : " Export to CSV"}
            </button>
        </div>
    );
};

const UserRow = ({ index, user, onAction, language }) => {
    const getProfilePicture = (user) => user.profilURL || IconAvatar;
    const userStatus = formatUserStatut(user.isOnline, language);

    return (
        <tr onClick={() => onAction(user)}>
            <td>{index + 1}</td>
            <td>{user.UserID}</td>
            <td><img src={getProfilePicture(user)} alt={user.displayName || `${user.firstName} ${user.lastName}`} width="40" height="40" className="profile-img" /></td>
            <td>{user.firstName} {user.lastName}</td>
            <td>{user.phoneNumber || "Non renseigné"}</td>
            <td>{user.email}</td>
            <td>
                <FontAwesomeIcon
                    icon={user.emailVerified
                        ? faCircleCheck
                        : faCircleExclamation
                    }
                    color={user.emailVerified ? '#28a745' : '#00aaff'}
                /> Email
            </td>
            <td>{userStatus}</td>
        </tr>
    );
};

export default function ManageUsers() {
    const { currentUser, userData } = useContext(AuthContext);
    const { language } = useContext(LanguageContext);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [userPerPage] = useState(10);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [openFilter, setOpenFilter] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const idToken = await currentUser.getIdToken(true);
                const data = await fetchUsers(idToken);
                if (data) {
                    setUsers(data.users?.allUsers || []);
                    setFilteredUsers(data.users?.allUsers || []);
                }
            } catch (err) {
                console.error('Erreur technique:', err);
                setToast({
                    show: true,
                    type: 'error',
                    message: language === 'FR'
                        ? 'Erreur lors du chargement des utilisateurs'
                        : 'Error loading users'
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [language, currentUser]);

    // Pagination
    const indexOfLastUser = currentPage * userPerPage;
    const indexOfFirstUser = indexOfLastUser - userPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Application des filtres avec logique corrigée
    const handleFilterChange = (filters) => {
        let filtered = users.filter(user => {
            const userDate = user.registrationDateISO; // Ex: "2025-03-30"

            // Role filter
            const roleMatch = filters.role === "all" || user.role === filters.role;

            // Status filter - corrected logic
            let statusMatch = true;
            if (filters.status !== "all") {
                if (filters.status === "active") {
                    statusMatch = user.isActive === true;
                } else if (filters.status === "suspended") {
                    statusMatch = user.isActive === false && !user.isBanned;
                } else if (filters.status === "banned") {
                    statusMatch = user.isBanned === true;
                }
            }

            // City filter
            const cityMatch = filters.city === "" ||
                (user.city && user.city.toLowerCase().includes(filters.city.toLowerCase()));

            // Subscription filter
            const subscriptionMatch = filters.subscription === "all" ||
                user.subscription === filters.subscription;

            // Search filter
            const searchMatch = filters.search === "" ||
                user.firstName?.toLowerCase().includes(filters.search.toLowerCase()) ||
                user.lastName?.toLowerCase().includes(filters.search.toLowerCase()) ||
                user.email?.toLowerCase().includes(filters.search.toLowerCase());

            // Email verification filter
            const emailVerifiedMatch = filters.emailVerified === "all" ||
                (filters.emailVerified === "true" ? user.emailVerified === true : user.emailVerified === false);

            // Date range filter
            const startDateMatch = filters.startDate === "" ||
                (userDate && userDate >= filters.startDate);
            const endDateMatch = filters.endDate === "" ||
                (userDate && userDate <= filters.endDate);

            return roleMatch && statusMatch && cityMatch && subscriptionMatch &&
                searchMatch && emailVerifiedMatch && startDateMatch && endDateMatch;
        });

        setFilteredUsers(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    };

    const exportToCSV = async () => {
        if (currentUser && !userData.permissions?.includes('MANAGE_USERS')) {
            setToast({
                show: true,
                type: 'error',
                message: language === 'FR'
                    ? 'Vous n\'avez pas les autorisations pour exporter les utilisateurs.'
                    : 'You do not have permission to export users.'
            });
            return;
        }

        try {
            await logAdminAction(
                currentUser.uid,
                language === 'FR'
                    ? "Exportation utilisateurs"
                    : "Users export",
                language === 'FR'
                    ? "L'admin a exporté la liste des utilisateurs."
                    : "The admin exported the user list.",
            );

            // Escape CSV values to handle commas and quotes in data
            const escapeCSV = (value) => {
                if (value === null || value === undefined) return '';
                const stringValue = String(value);
                if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                    return `"${stringValue.replace(/"/g, '""')}"`;
                }
                return stringValue;
            };

            const headers = language === 'FR'
                ? ["Firstname,Lastname,Email,Verified,Phone,Ville,Pays,Date\n"]
                : ["Firstname,Lastname,Email,Verified,Phone,City,Country,Created\n"];
            const rows = filteredUsers.map(user => {
                const createdDate = user.createdAt?._seconds
                    ? formatDistanceToNow(new Date(user.createdAt._seconds * 1000))
                    : 'N/A';

                return [
                    escapeCSV(user.firstName),
                    escapeCSV(user.lastName),
                    escapeCSV(user.email),
                    user.emailVerified ? 'True' : 'False',
                    escapeCSV(user.phoneNumber),
                    escapeCSV(user.city),
                    escapeCSV(user.country),
                    escapeCSV(createdDate)
                ].join(',');
            }).join("\n");

            const blob = new Blob([headers + rows], { type: "text/csv" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `utilisateurs_export_${new Date().toISOString().split('T')[0]}.csv`;
            link.click();

            setToast({
                show: true,
                type: 'success',
                message: language === 'FR'
                    ? 'Export réussi!'
                    : 'Export successful!'
            });
        } catch (error) {
            console.error('Erreur lors de l\'export:', error);
            setToast({
                show: true,
                type: 'error',
                message: language === 'FR'
                    ? 'Erreur lors de l\'export des données'
                    : 'Error exporting data'
            });
        }
    };

    const handleAction = (user) => {
        if (user?.UserID) {
            navigate(`${user.UserID}`);
        }
    };

    return (
        <div className='manage-users'>
            <div className="head">
                <h2>{language === 'FR' ? "Gestion des Utilisateurs" : "Users Management"} {filteredUsers.length} </h2>
                <div className="filters-container" onClick={() => setOpenFilter(!openFilter)}>
                    <FontAwesomeIcon icon={faFilter} />
                </div>
            </div>

            {/* Filtres */}
            {openFilter && (
                <UsersFilter onFilterChange={handleFilterChange} onClick={exportToCSV} />
            )}

            {loading
                ? <Loading />
                : (
                    <>
                        <div className='table-container'>
                            <table>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>User ID</th>
                                        <th>Profile</th>
                                        <th>{language === 'FR' ? "Nom complet" : "Full Name"}</th>
                                        <th>{language === 'FR' ? "Téléphone" : "Phone Number"}</th>
                                        <th>{language === 'FR' ? "Email" : "Email Address"}</th>
                                        <th>{language === 'FR' ? "Vérifié" : "Verified"}</th>
                                        <th>{language === 'FR' ? "Statut" : "Status"}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentUsers.length > 0 ? (
                                        currentUsers.map((user, index) => (
                                            <UserRow
                                                key={user.UserID || index}
                                                user={user}
                                                index={indexOfFirstUser + index}
                                                onAction={handleAction}
                                            />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" style={{ textAlign: 'center' }}>
                                                Aucun utilisateur trouvé
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {filteredUsers.length > userPerPage && (
                            <Pagination
                                currentPage={currentPage}
                                elements={filteredUsers}
                                elementsPerPage={userPerPage}
                                paginate={paginate}
                            />
                        )}
                    </>
                )}

            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast({ ...toast, show: false })}
            />
        </div>
    );
}
