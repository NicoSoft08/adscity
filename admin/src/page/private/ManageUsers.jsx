import React, { useEffect, useState } from 'react'
import { fetchAllUsers } from '../../services/userServices';
import { deleteUser } from '../../services/authServices';
import UserManagementTable from './UserManagementTable';
import '../../styles/ManageUsers.scss';


export default function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filters, setFilters] = useState({
        createdAt: '',
        role: '',
        isActive: ''
    });


    useEffect(() => {
        const fetchUsers = async () => {
            const allUsers = await fetchAllUsers();
            setUsers(allUsers);
            setFilteredUsers(allUsers);
        }

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
        await deleteUser(id);
        console.log(`User ${id} deleted`);
    };

    return (
        <div className='manage-user'>
            <h2>Gestion des Utilisateurs</h2>

            {/* Filtres */}
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

            <UserManagementTable
                users={filteredUsers}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
            />
        </div>
    )
}