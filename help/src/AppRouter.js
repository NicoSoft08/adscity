import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// layouts
import { HelpLayout } from './layouts/help';
import AccountFAQs from './pages/public/AccountFAQs';
import AnnounceFAQs from './pages/public/AnnounceFAQs';
import SecurityAdvices from './pages/public/SecurityAdvices';
import PubsFAQs from './pages/public/PubsFAQs';
import StoreFAQs from './pages/public/StoreFAQs';

export default function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<HelpLayout />}>
                    <Route path='account' element={<AccountFAQs />} />
                    <Route path='posts' element={<AnnounceFAQs />} />
                    <Route path='safety' element={<SecurityAdvices />} />
                    <Route path='pubs' element={<PubsFAQs />} />
                    <Route path='stores' element={<StoreFAQs />} />
                </Route>
            </Routes>
        </Router>
    );
};
