import React, { useContext, useEffect, useState } from 'react'
import { fetchAllUsers } from '../../routes/userRoutes';
import { deleteUser } from '../../routes/authRoutes';
import UserManagementTable from './UserManagementTable';
import { AuthContext } from '../../contexts/AuthContext';
import Toast from '../../customs/Toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import '../../styles/ManageUsers.scss';


export default function ManageUsers() {
    const { currentUser, userData } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [openFilter, setOpenFilter] = useState(false);
    const [filters, setFilters] = useState({ createdAt: '', role: '', isActive: '' });

    useEffect(() => {
        const fetchUsers = async () => {
            const all = await fetchAllUsers();
            if (all.success) {
                setUsers(all?.allUsers);
                setFilteredUsers(all?.allUsers);
            }
        };

        fetchUsers();
    }, []);


    const convertFirebaseTimestampToDate = (timestamp) => {
        if (timestamp?._seconds) {
            const date = new Date(timestamp._seconds * 1000); // Convertir les secondes en millisecondes
            return date.toISOString().slice(0, 10); // Retourner uniquement la partie date sous format YYYY-MM-DD
        }
        return null;
    };


    // Fonction pour appliquer les filtres
    const applyFilters = () => {
        const { createdAt, role, isActive } = filters;

        const filtered = users.filter(user => {
            const userCreationDate = convertFirebaseTimestampToDate(user.createdAt);

            const matchesCreatedAt = createdAt ? userCreationDate === createdAt : true;
            const matchesRole = role ? user.role === role : true;
            const matchesIsActive = isActive !== '' ? user.isActive === (isActive === 'true') : true;

            return matchesCreatedAt && matchesRole && matchesIsActive;
        });
        setFilteredUsers(filtered);
    };


    // Fonction pour réinitialiser (annuler) les filtres
    // const resetFilters = () => {
    //     setFilters({
    //         createdAt: '',
    //         accountType: '',
    //         isActive: ''
    //     });
    //     setFilteredUsers(users); // Réinitialiser la liste filtrée à la liste complète
    // };


    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
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

    return (
        <div className='manage-user'>
            <div className="head">
                <h2>Gestion des Utilisateurs</h2>
                <div className="filters-container" onClick={() => setOpenFilter(!openFilter)}>
                    <FontAwesomeIcon icon={faFilter} />
                </div>
            </div>

            {/* Filtres */}
            {openFilter && (
                <div className='filters'>
                    <label>
                        Création:
                        <input
                            type="date"
                            name="createdAt"
                            value={filters.createdAt}
                            onChange={handleFilterChange}
                        />
                    </label>

                    <label>
                        Role:
                        <select
                            name="role"
                            value={filters.role}
                            onChange={handleFilterChange}>
                            <option value="">Tous</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>
                    </label>

                    <label>
                        Statut:
                        <select
                            name="isActive"
                            value={filters.isActive}
                            onChange={handleFilterChange}>
                            <option value="">Tous</option>
                            <option value="true">Actif</option>
                            <option value="false">Inactif</option>
                        </select>
                    </label>

                    <button onClick={applyFilters}>Appliquer</button>
                </div>
            )}

            <UserManagementTable
                users={filteredUsers}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
            />

            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ show: false, ...toast })} />
        </div>
    )
}
