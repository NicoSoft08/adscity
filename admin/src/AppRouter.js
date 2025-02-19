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
import Notifications from './page/private/Notifications';
import UserProfile from './page/private/UserProfile';
import Settings from './page/private/Settings';
import ManagePubs from './page/private/ManagePubs';
import CreatePub from './page/private/CreatePub';
import CreateAdmin from './page/private/CreateAdmin';
import ManagePayments from './page/public/ManagePayments';
import ManageUserID from './page/private/ManageUserID';
import ManagePostID from './page/private/ManagePostID';
import ManagePubID from './page/private/ManagePubID';


export default function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<LoginPage />} />
                <Route path='/admin/dashboard' element={<AdminHome />}>
                    <Route path="panel" element={<DashboardPanel />} />
                    <Route path="panel/create-admin" element={<CreateAdmin />} />
                    <Route path='posts' element={<ManagePosts />} />
                    <Route path='posts/:post_id' element={<ManagePostID />} />
                    <Route path='users' element={<ManageUsers />} />
                    <Route path='users/:user_id' element={<ManageUserID />} />
                    <Route path='pubs' element={<ManagePubs />} />
                    <Route path='pubs/:pub_id' element={<ManagePubID />} />
                    <Route path='pubs/create-pub' element={<CreatePub />} />
                    <Route path='payments' element={<ManagePayments />} />
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
