import React from 'react';
import { Outlet } from 'react-router-dom';

// component
import Header from '../components/dashboard-header/Header';

export default function UserLayout() {
    return (
        <div>

            <Header />


            <Outlet />

        </div>
    );
};
