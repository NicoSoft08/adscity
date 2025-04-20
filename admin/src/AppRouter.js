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
import UserProfile from './page/private/UserProfile';
import ManagePubs from './page/private/ManagePubs';
import CreatePub from './page/private/CreatePub';
import CreateAdmin from './page/private/CreateAdmin';
// import ManagePayments from './page/private/ManagePayments';
import ManageUserID from './page/private/ManageUserID';
import ManagePostID from './page/private/ManagePostID';
import ManagePubID from './page/private/ManagePubID';
import StatsPostID from './page/private/StatsPostID';
import ManageNotifications from './page/private/ManageNotifications';
import Verification from './page/private/Verification';
import PaymentAccountsManager from './page/private/PaymentAccountsManager';


export default function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<LoginPage />} />
                <Route path='/admin/dashboard' element={<AdminHome />}>
                    <Route path="panel" element={<DashboardPanel />} />
                    <Route path="verifications" element={<Verification />} />
                    <Route path="panel/create-admin" element={<CreateAdmin />} />
                    <Route path='posts' element={<ManagePosts />} />
                    <Route path='posts/:post_id' element={<ManagePostID />} />
                    <Route path='posts/:post_id/statistics' element={<StatsPostID />} />
                    <Route path='payments/manage-payment-accounts' element={<PaymentAccountsManager />} />
                    <Route path='users' element={<ManageUsers />} />
                    <Route path='users/:user_id' element={<ManageUserID />} />
                    <Route path='pubs' element={<ManagePubs />} />
                    <Route path='pubs/:pub_id' element={<ManagePubID />} />
                    <Route path='pubs/create-pub' element={<CreatePub />} />
                    {/* <Route path='payments' element={<ManagePayments />} /> */}
                    <Route path='notifications' element={<ManageNotifications />} />
                    <Route path='profile' element={<UserProfile />} />
                </Route>
                <Route path='/access-denied' element={<AccessDenied />} />
                <Route path='*' element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
};
