import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// pages
import LoginPage from './page/auth/LoginPage';
import AccessDenied from './page/public/AccessDenied';
import NotFoundPage from './page/public/NotFoundPage';
import AdminHome from './page/private/AdminHome';
import DashboardPanel from './page/private/DashboardPanel';
import ManagePosts from './page/private/ManagePosts';
import ManageUsers from './page/private/ManageUsers';
import PaymentIntents from './page/public/PaymentIntents';
import Notifications from './page/private/Notifications';
import UserProfile from './page/private/UserProfile';
import Settings from './page/private/Settings';


export default function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<LoginPage />} />
                <Route path='/admin/dashboard' element={<AdminHome />}>
                    <Route path="panel" element={<DashboardPanel />} />
                    <Route path='posts' element={<ManagePosts />} />
                    <Route path='users' element={<ManageUsers />} />
                    <Route path='payments' element={<PaymentIntents />} />
                    <Route path='notifications' element={<Notifications />} />
                    <Route path='profile' element={<UserProfile />} />
                    <Route path='settings' element={<Settings />} />
                </Route>
                <Route path='/access-denied' element={<AccessDenied />} />
                <Route path='*' element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
};
