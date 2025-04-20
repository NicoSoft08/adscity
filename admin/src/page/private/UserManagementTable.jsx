import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Pagination from '../../components/pagination/Pagination';
import { IconAvatar } from '../../config/images';
import '../../styles/UserManagementTable.scss';

export default function UserManagementTable({ users, onToggleActive, onDelete }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);

    // Get current users
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const formatUserStatus = (status) => {
        let title = "";

        if (status === true) {
            title = "Désactiver";
        } else {
            title = "Activer";
        }

        return title;
    };

    const getProfilePicture = (user) => {
        if (user.profilURL) {
            return user.profilURL;
        } else {
            return IconAvatar;
        }
    };

    return (
        <>
            <div className="user-management-table">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th> 📸Profile</th>
                            <th>👤 Nom Complet</th>
                            <th>✉️ Email</th>
                            <th>🏷️ No. Profile</th>
                            <th>📲Téléphone</th>
                            <th>⚡Status</th>
                            <th>🚨 Signalements</th>
                            <th>🛠️ Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map((user, index) => (
                            <tr key={user.id}>
                                <td>{index + 1}</td>
                                <td>
                                    <img
                                        src={getProfilePicture(user)}
                                        alt={user.displayName}
                                        width="50"
                                        height="50"
                                        className="profile-img"
                                    />
                                </td>
                                <td>{user.displayName}</td>
                                <td>{user.email}</td>
                                <td>{user.profileNumber}</td>
                                <td>{user.phoneNumber}</td>
                                <td>{user.isOnline ? '🟢 En ligne' : '🔴 Hors ligne'}</td>
                                <td>
                                    <button
                                        className={`status-btn ${user.isActive ? 'active' : 'inactive'}`}
                                        onClick={() => onToggleActive(user.id, !user.isActive)}
                                    >
                                        {formatUserStatus(user.isActive)}
                                    </button>
                                    <button title='Supprimer' className="delete-btn" onClick={() => onDelete(user.id)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination
                currentPage={currentPage}
                elements={users}
                elementsPerPage={usersPerPage}
                paginate={paginate}
            />
        </>
    );
};
