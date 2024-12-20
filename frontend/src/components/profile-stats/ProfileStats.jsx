import React from 'react';
import './ProfileStats.scss';

export default function ProfileStats({ user }) {
    return (
        <div className="profile-stats-card">
            <div className="stats-grid">
                <div className="stat-item">
                    <span className="stat-label">Visiteurs:</span>
                    <span className="stat-value">{user.profileViewed || 0}</span>
                </div>
                {/* <div className="stat-item">
                    <span className="stat-value">{user.contact_clicks || 0}</span>
                    <span className="stat-label">Contacts</span>
                </div> */}
            </div>
        </div>
    );
};
