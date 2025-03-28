import React, { useEffect, useMemo, useState } from 'react'
import { fetchUsers } from '../../routes/userRoutes';
import Toast from '../../customs/Toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartSimple, faCircleCheck, faCircleExclamation, faEye, faFilter } from '@fortawesome/free-solid-svg-icons';
import { IconAvatar } from '../../config/images';
import Pagination from '../../components/pagination/Pagination';
import { useNavigate } from 'react-router-dom';
import '../../styles/ManageUsers.scss';

const UsersFilter = ({ onFilterChange }) => {
    const [filters, setFilters] = useState({
        search: "",
        role: "all", // "all", "admin", "user"
        status: "all", // "all", "active", "suspended", "banned"
        city: "",
        subscription: "all", // "all", "free", "pro", "business"
        registrationDate: "",
        emailVerified: "all", // "all", "true", "false"
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedFilters = { ...filters, [name]: value };
        setFilters(updatedFilters);
        onFilterChange(updatedFilters);
    };


    return (
        <div className='filters'>
            <input
                type="text"
                name='search'
                placeholder="Rechercher par nom ou email"
                value={filters.search}
                onChange={handleChange}
            />

            <select name='role' value={filters.role} onChange={handleChange}>
                <option value="all">Tous les rôles</option>
                <option value="user">Utilisateur</option>
                <option value="admin">Admin</option>
            </select>

            <select name='status' value={filters.status} onChange={handleChange}>
                <option value="all">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="suspended">Suspendu</option>
                <option value="banned">Banni</option>
            </select>

            <input
                type="text"
                name='city'
                placeholder="Ville"
                value={filters.city}
                onChange={handleChange}
            />

            <select name='subscription' value={filters.subscription} onChange={handleChange}>
                <option value="all">Tous les abonnements</option>
                <option value="free">Gratuit</option>
                <option value="pro">Professionnel</option>
                <option value="business">Business</option>
            </select>

            <select name='emailVerified' value={filters.emailVerified} onChange={handleChange}>
                <option value="all">Tous les emails</option>
                <option value="true">Vérifiés</option>
                <option value="false">Non vérifiés</option>
            </select>

            <input
                type="date"
                name='registrationDate'
                value={filters.registrationDate}
                onChange={handleChange}
            />
        </div>
    );
};

const UserRow = ({ index, user, onAction, isSelected, onSelect }) => {

    const getProfilePicture = (user) => user.profilURL || IconAvatar;

    const formatUserStatut = (isOnline) => (isOnline ? "🟢 En ligne" : "🔴 Hors ligne");

    return (
        <tr className={isSelected ? 'selected' : ''}>
            <td>
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelect(user.UserID)}
                />
            </td>
            <td>{index + 1}</td>
            <td>{user.UserID}</td>
            <td><img src={getProfilePicture(user)} alt={user.displayName} width="50" height="50" className="profile-img" /></td>
            <td>{user.displayName}</td>
            <td>{user.phoneNumber}</td>
            <td>{user.email}</td>
            <td><FontAwesomeIcon icon={user.emailVerified ? faCircleCheck : faCircleExclamation} color={user.emailVerified ? '#28a745' : '#00aaff'} /> Email</td>
            <td>{formatUserStatut(user.isOnline)}</td>
            {/* 📌 Div flottante affichée si l'annonce est sélectionnée */}
            {isSelected && (
                <div className="floating-menu">
                    <button title="Voir l'utilisateur" onClick={() => onAction('view', user.UserID)}>
                        <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button title='Activités' onClick={() => onAction('activity', user.UserID)}>
                        <FontAwesomeIcon icon={faChartSimple} />
                    </button>
                </div>
            )}
        </tr>
    );
}

export default function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [userPerPage] = useState(10);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [openFilter, setOpenFilter] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchUsers();
                if (data) setUsers(data.users?.allUsers || []);
            } catch (err) {
                console.error('Erreur technique:', err);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        setFilteredUsers(users);
    }, [users]);

    // Pagination
    const indexOfLastUser = currentPage * userPerPage;
    const indexOfFirstUser = indexOfLastUser - userPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Application des filtres
    const handleFilterChange = (filters) => {
        let filtered = users.filter(user => (
            (filters.role === "all" || user.role === filters.role) &&
            (filters.status === "all" || user.isActive === (filters.status === "active")) &&
            (filters.city === "" || user.city?.toLowerCase().includes(filters.city.toLowerCase())) &&
            (filters.subscription === "all" || user.subscription === filters.subscription) &&
            (filters.search === "" || user.displayName.toLowerCase().includes(filters.search.toLowerCase()) || user.email.toLowerCase().includes(filters.search.toLowerCase())) &&
            (filters.emailVerified === "all" || user.emailVerified === (filters.emailVerified === "true")) &&
            (filters.registrationDate === "" || new Date(user.createdAt) <= new Date(filters.registrationDate))
        ));
        setFilteredUsers(filtered);
    };

    const handleAction = (action, UserID) => {
        const user_id = UserID.toLowerCase();

        switch (action) {
            case 'view':
                navigate(`${user_id}`)
                break;
            case 'activity':
                navigate(`${user_id}/activity`, { state: { user_id: user_id } });
                break;
            default:
                return null;
        }
    };

    // Gérer la sélection d'une annonce
    const handleSelect = (userID) => {
        setSelectedUsers(prev => {
            const newSelection = new Set(prev);
            if (newSelection.has(userID)) {
                newSelection.delete(userID);
            } else {
                newSelection.add(userID);
            }
            return Array.from(newSelection);
        });
    };

    // Vérifier si tous les posts sont sélectionnés
    const allSelected = useMemo(() => selectedUsers.length === users.length, [selectedUsers, users]);

    // Sélectionner/Désélectionner tout
    const toggleSelectAll = () => {
        setSelectedUsers(allSelected ? [] : users.map(user => user.UserID));
    };

    return (
        <div className='manage-users'>
            <div className="head">
                <h2>Gestion des Utilisateurs</h2>
                <div className="filters-container" onClick={() => setOpenFilter(!openFilter)}>
                    <FontAwesomeIcon icon={faFilter} />
                </div>
            </div>

            {/* Filtres */}
            {openFilter && (
                <UsersFilter onFilterChange={handleFilterChange} />
            )}

            <div className='table-container'>
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
                            <th>User ID</th>
                            <th>Profile</th>
                            <th>Nom Complet</th>
                            <th>Téléphone</th>
                            <th>Email</th>
                            <th>Vérifié</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map((user, index) => (
                            <UserRow
                                key={user.id}
                                user={user}
                                index={index}
                                isSelected={selectedUsers.includes(user.UserID)}
                                onAction={handleAction}
                                onSelect={handleSelect}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
            {users.length > userPerPage && (
                <Pagination
                    currentPage={currentPage}
                    elements={users}
                    elementsPerPage={userPerPage}
                    paginate={paginate}
                />
            )}

            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ show: false, ...toast })} />
        </div>
    )
}
