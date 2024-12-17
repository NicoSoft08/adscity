 import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// layouts
import AdminLayout from './layouts/AdminLayout';

// pages
import LoginPage from './page/auth/LoginPage';
import AccessDenied from './page/public/AccessDenied';
import NotFoundPage from './page/public/NotFoundPage';
import AdminHome from './page/private/AdminHome';


export default function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<LoginPage />} />
                <Route element={<AdminLayout />}>
                    <Route path='/admin' element={<AdminHome />} />
                </Route>
                <Route path='/access-denied' element={<AccessDenied />} />
                <Route path='*' element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
};
