import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/dashboard-header/Header';

export default function AdminLayout() {
    return (
        <div>
            <Header />

            <Outlet />

        </div>
    );
};
