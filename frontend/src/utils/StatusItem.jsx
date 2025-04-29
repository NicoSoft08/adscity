import React from 'react';
import '../styles/StatusItem.scss';

export default function StatusItem({ status, onClick, hasViewed, user, isCurrentUser }) {
    const displayName = user ? `${user.firstName} ${user.lastName}` : 'Utilisateur';
    return (
        <div
        className={`status-item ${hasViewed ? 'viewed' : 'unviewed'} ${isCurrentUser ? 'my-status' : ''}`}
            onClick={() => onClick && onClick(status)}
        >
            <div className="status-avatar-container">
                <div className="status-ring">
                    <img src={user?.profilURL} alt={displayName} className="status-avatar" />
                </div>

                <div className="status-username">
                    {isCurrentUser ? 'Mon statut' : displayName}
                </div>
            </div>
        </div>
    );
};