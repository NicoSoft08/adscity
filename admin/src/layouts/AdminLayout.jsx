import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Header from '../components/dashboard-header/Header';
import { AuthContext } from '../contexts/AuthContext';

export default function AdminLayout({ allowedRole }) {
    const { currentUser, userRole } = useContext(AuthContext);
    
    if (!currentUser) {
        return <Navigate to='/' replace />
    };

    if (allowedRole && !allowedRole.includes(userRole)) {
        return <Navigate to='/access-denied' replace />
    }

    return (
        <div>
            <Header />

            <Outlet />

        </div>
    );
};
