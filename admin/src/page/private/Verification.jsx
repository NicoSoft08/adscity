import React, { useContext, useEffect, useState } from 'react';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fetchVerifications } from '../../routes/apiRoutes';
import { format, isToday, isYesterday } from 'date-fns';
import { fr } from 'date-fns/locale';
import Loading from '../../customs/Loading';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../components/pagination/Pagination';
import { AuthContext } from '../../contexts/AuthContext';
import '../../styles/Verification.scss';

const STATUS_ICONS = {
    pending: "🟠 En attente",
    approved: "🟢 Approuvé",
    refused: "🔴 Rejeté",
};

// 🔍 Composant Filtres
const VerificationFilter = ({ onFilterChange, onClick }) => {
    const [filters, setFilters] = useState({
        search: "",
        status: "all", // all, pending, approved, rejected
        startDate: "",  // Date de début du filtre
        endDate: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedFilters = {
            ...filters,
            [name]: value
        };

        // Validate date range
        if (name === "startDate" && updatedFilters.endDate && updatedFilters.startDate > updatedFilters.endDate) {
            updatedFilters.endDate = updatedFilters.startDate;
        }
        if (name === "endDate" && updatedFilters.startDate && updatedFilters.endDate < updatedFilters.startDate) {
            updatedFilters.startDate = updatedFilters.endDate;
        }

        setFilters(updatedFilters);
        onFilterChange(updatedFilters);
    };

    return (
        <div className="filters">
            <input
                type="text"
                name="search"
                placeholder="Rechercher par nom ou email"
                value={filters.search}
                onChange={handleChange}
            />
            <select name="status" value={filters.status} onChange={handleChange}>
                <option value="all">Tous les statuts</option>
                {Object.keys(STATUS_ICONS).map(status => (
                    <option key={status} value={status}>{STATUS_ICONS[status]}</option>
                ))}
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

            <button onClick={onClick}>Exporter en CSV</button>
        </div>
    );
}

const VerificationItem = ({ index, user, onAction }) => {

    const formatDate = (dateValue) => {
        if (!dateValue) return 'Date inconnue';

        let date;
        // Handle Firestore Timestamp
        if (dateValue && dateValue._seconds) {
            date = new Date(dateValue._seconds * 1000);
        }
        // Handle string or Date object
        else {
            date = new Date(dateValue);
        }

        if (isNaN(date.getTime())) {
            return 'Date invalide';
        }

        if (isToday(date)) {
            return `Aujourd'hui à ${format(date, 'HH:mm', { locale: fr })}`;
        }

        if (isYesterday(date)) {
            return `Hier à ${format(date, 'HH:mm', { locale: fr })}`;
        }

        return format(date, "d MMMM yyyy 'à' HH:mm", { locale: fr });
    };

    return (
        <tr onClick={() => onAction(user)}>
            <td>{index + 1}</td>
            <td>{user.firstName} {user.lastName}</td>
            <td>{user.email}</td>
            <td>{user.phoneNumber}</td>
            <td>{formatDate(user.updatedAt)}</td>
            <td>{STATUS_ICONS[user.verificationStatus] || "⚪ Inconnu"}</td>
        </tr>
    )
}

export default function Verification() {
    const { currentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [verifications, setVerifications] = useState([]);
    const [filteredVerifications, setFilteredVerifications] = useState([]);
    const [openFilter, setOpenFilter] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [verifPerPage] = useState(10);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const idToken = await currentUser.getIdToken();
                const result = await fetchVerifications(idToken);
                if (result.success) {
                    setVerifications(result.data);
                } else {
                    setVerifications([]);
                }
            } catch (error) {
                console.error("Error fetching verifications:", error);
                setVerifications([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentUser]);

    useEffect(() => {
        setFilteredVerifications(verifications);
    }, [verifications]);

    // Pagination
    const indexOfLastVerif = currentPage * verifPerPage;
    const indexOfFirstVerif = indexOfLastVerif - verifPerPage;
    const currentVerifs = filteredVerifications.slice(indexOfFirstVerif, indexOfLastVerif);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Application des filtres
    // Application des filtres
    const handleFilterChange = (filters) => {
        let filtered = verifications.filter(user => {
            const userDate = user.registrationDateISO; // Ex: "2025-03-30"

            // Status filter logic
            const statusMatch =
                filters.status === "all" ||
                user.verificationStatus === filters.status;

            // Search filter logic
            const searchMatch =
                filters.search === "" ||
                user.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
                user.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
                user.email.toLowerCase().includes(filters.search.toLowerCase());

            // Date range filter logic
            const startDateMatch = filters.startDate === "" || userDate >= filters.startDate;
            const endDateMatch = filters.endDate === "" || userDate <= filters.endDate;

            return statusMatch && searchMatch && startDateMatch && endDateMatch;
        });

        setFilteredVerifications(filtered);
    };



    const handleAction = (UserID) => {
        const user_id = UserID?.toLowerCase();
        navigate(`/admin/dashboard/users/${user_id}`);
    };


    return (
        <div className='manage-verifications'>
            <div className="head">
                <h2>Gestion des Vérifications</h2>
                <div className="filters-container" onClick={() => setOpenFilter(!openFilter)}>
                    <FontAwesomeIcon icon={faFilter} />
                </div>
            </div>

            {/* Filtres */}
            {openFilter && (
                <VerificationFilter onFilterChange={handleFilterChange} onClick={() => { }} />
            )}

            {loading && <Loading />}

            <div className="table-container">
                {filteredVerifications.length === 0 ? (
                    <div className="no-data">Aucun document de vérification n'a été soumis.</div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Utilisateur</th>
                                <th>Email</th>
                                <th>Téléphone</th>
                                <th>Date de soumission</th>
                                <th>Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentVerifs.map((user, index) => (
                                <VerificationItem
                                    key={user.UserID}
                                    index={index}
                                    user={user}
                                    onAction={(user) => handleAction(user?.UserID)}
                                />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            {filteredVerifications.length > verifPerPage && (
                <Pagination
                    currentPage={currentPage}
                    elementsPerPage={verifPerPage}
                    elements={filteredVerifications}
                    paginate={paginate}
                />
            )}
        </div>
    );
}
