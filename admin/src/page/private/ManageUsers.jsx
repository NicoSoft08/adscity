import React, { useContext, useEffect, useState } from 'react'
import { fetchAllUsers } from '../../routes/userRoutes';
import { deleteUser } from '../../routes/authRoutes';
import { AuthContext } from '../../contexts/AuthContext';
import Toast from '../../customs/Toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { IconAvatar } from '../../config/images';
import Modal from '../../customs/Modal';
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

            <input
                type="date"
                name='registrationDate'
                value={filters.registrationDate}
                onChange={handleChange}
            />
        </div>
    );
};


const UserRow = ({ index, user, onAction }) => {

    const getProfilePicture = (user) => user.profilURL || IconAvatar;

    const formatUserStatut = (isOnline) => (isOnline ? "🟢 En ligne" : "🔴 Hors ligne");

    return (
        <tr>
            <td>{index + 1}</td>
            <td>{user.UserID}</td>
            <td><img src={getProfilePicture(user)} alt={user.displayName} width="50" height="50" className="profile-img" /></td>
            <td>{user.displayName}</td>
            <td>{user.email}</td>
            <td>{user.profileNumber}</td>
            <td>{user.phoneNumber}</td>
            <td>{formatUserStatut(user.isOnline)}</td>
            <td>{user.reportingCount || 0}</td>
            <td><button className="see-more" onClick={() => onAction(user)}>Voir</button></td>
        </tr>
    );
}

export default function ManageUsers() {
    const { currentUser, userData } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [userPerPage] = useState(10);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [openFilter, setOpenFilter] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalType, setModalType] = useState(null); // "desable" | "delete" | null
    const [reason, setReason] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            const all = await fetchAllUsers();
            if (all.success) {
                setUsers(all.allUsers);
                setFilteredUsers(all.allUsers);
            }
        };

        fetchUsers();
    }, []);

    const indexOfLastUser = currentPage * userPerPage;
    const indexOfFirstUser = indexOfLastUser - userPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    // Fonction pour appliquer les filtres
    const handleFilterChange = (filters) => {
        let filtered = users.filter(user => {
            return (
                (filters.role === "all" || user.role === filters.role) &&
                (filters.status === "all" || user.isActive === (filters.status === "active")) &&
                (filters.city === "" || user.city?.toLowerCase().includes(filters.city.toLowerCase())) &&
                (filters.subscription === "all" || user.subscription === filters.subscription) &&
                (filters.search === "" ||
                    user.displayName.toLowerCase().includes(filters.search.toLowerCase()) ||
                    user.email.toLowerCase().includes(filters.search.toLowerCase())
                )
            );
        });
        setFilteredUsers(filtered);
    };



    const handleToggleActive = (id, newStatus) => {
        setUsers(users.map(user => (user.id === id ? { ...user, isActive: newStatus } : user)));
        console.log(`User ${id} is now ${newStatus ? 'active' : 'inactive'}`);
    };


    const handleDelete = async (id) => {
        setUsers(users.filter(user => user.id !== id));
        if (!currentUser && userData.permissions.includes('SUPER_ADMIN')) {
            await deleteUser(id);
            setToast({ show: true, type: 'success', message: 'Utilisateur supprimé avec succès.' });
            console.log(`User ${id} deleted`);
        } else {
            setToast({ show: true, type: 'error', message: 'Vous n\'avez pas les permissions pour supprimer des utilisateurs.' });
            console.log(`User ${id} couldn't be deleted`);
        }
    };

    const handleAction = (user) => {
        const UserID = user.UserID;
        const user_id = UserID.toLowerCase();
        navigate(`${user_id}`);
    };

    const handleDesableUser = () => {
        setModalType('desable');
    };

    const handleDeleteUser = () => {
        setModalType('delete');
    };

    const handleConfirmAction = async () => {
        if (modalType === "delete" && selectedUser) {
            await deleteUser(selectedUser.id);
            setUsers(users.filter(u => u.id !== selectedUser.id));
        }
        setModalType(null);
    };

    const options = [
        {
            label: 'Désactiver',
            icon: '⏸️',
            action: () => handleDesableUser(),
        },
        {
            label: 'Supprimer',
            icon: '🗑️',
            action: () => handleDeleteUser(),
        },
    ];

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

            <div className="ads-list">
                <div className="card-list">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>User ID</th>
                                <th>📸 Profile</th>
                                <th>👤 Nom Complet</th>
                                <th>✉️ Email</th>
                                <th>🏷️ No. Profile</th>
                                <th>📲 Téléphone</th>
                                <th>⚡ Status</th>
                                <th>🚨 Signalements</th>
                                <th>🛠️ Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map((user, index) => (
                                <UserRow
                                    key={user.id}
                                    user={user}
                                    index={index}
                                    options={options}
                                    onAction={(user) => handleAction(user)}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={currentPage}
                    elements={users}
                    elementsPerPage={userPerPage}
                    paginate={paginate}
                />
            </div>

            {/* MODALE D'ACTION */}
            {modalType && (
                <Modal
                    title={modalType === "desable" ? "Désactiver l'utilisateur" : "Supprimer l'utilisateur"}
                    onShow={!!modalType}
                    onHide={() => setModalType(null)}
                >
                    <div className="action-menu">
                        <p><strong>Utilisateur :</strong> {selectedUser?.displayName}</p>
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

            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ show: false, ...toast })} />
        </div>
    )
}
