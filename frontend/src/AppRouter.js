import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


// layouts
import AuthLayout from './layouts/AuthLayout';
import HelpLayout from './layouts/HelpLayout';
import HomeLayout from './layouts/HomeLayout';
import UserLayout from './layouts/UserLayout';


// pages
import AccessDenied from './pages/public/AccessDenied';
import AdDetailPage from './pages/public/AdDetailPage';
import CategoryNamePage from './pages/public/CategoryNamePage';
import CategoryPage from './pages/public/CategoryNamePage';
import ConditionPage from './pages/public/ConditionPage';
import ContactPage from './pages/public/ContactPage';
import CreateAdPage from './pages/public/CreateAdPage';
import FAQsPage from './pages/public/FAQsPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import HelpPage from './pages/public/HelpPage';
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/auth/LoginPage';
import NotFoundPage from './pages/public/NotFoundPage';
import PlansPage from './pages/public/PlansPage';
import PrivacyPage from './pages/public/PrivacyPage';
import RulesPage from './pages/private/client/RulesPage';
import SearchResultPage from './pages/public/SearchResultPage';
import ShowUserPage from './pages/public/ShowUserPage';
import SignupPage from './pages/auth/SignUpPage';
import SignupSuccess from './pages/auth/SignupSuccess';
import TeamPage from './pages/public/TeamPage';
import UserHome from './pages/private/client/UserHome';
import CheckoutProceed from './pages/private/CheckoutProceed';
import SecurityAdvices from './pages/public/SecurityAdvices';
import { DeclineDevice, VerifyDevice } from './pages/auth/DeviceActions';

export default function AppRouter() {

    return (
        <Router>
            <Routes>
                <Route element={<HomeLayout />}>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/category' element={<CategoryPage />} />
                    <Route path='/category/:categoryName' element={<CategoryNamePage />} />
                    <Route path='/auth/create-announcement' element={<CreateAdPage />} />

                    <Route path='/contact-us' element={<ContactPage />} />

                    <Route path='/pricing' element={<PlansPage />} />
                    <Route path='/search-results' element={<SearchResultPage />} />

                    <Route path='/legal/privacy' element={<PrivacyPage />} />
                    <Route path='/legal/terms' element={<ConditionPage />} />
                    <Route path='/legal/announcement-rules' element={<RulesPage />} />

                    <Route path='/about' element={<TeamPage />} />
                    <Route path="/ads/:category/:subcategory/:adID" element={<AdDetailPage />} />
                    <Route path='/users/show/:userID' element={<ShowUserPage />} />
                    <Route path='/proceed-to-checkout' element={<CheckoutProceed />} />

                </Route>
                <Route path='/help-center' element={<HelpLayout />}>
                    <Route index element={<HelpPage />} />
                    <Route path='faq' element={<FAQsPage />} />
                    <Route path='safety' element={<SecurityAdvices />} />
                </Route>

                <Route element={<AuthLayout />}>
                    <Route path='/auth/signin' element={<LoginPage />} />
                    <Route path='/auth/signin/:email?' element={<LoginPage />} />
                    <Route path='/auth/create-user' element={<SignupPage />} />
                    <Route path='/auth/signup-success' element={<SignupSuccess />} />
                    <Route path='/auth/reset-password/:email?' element={<ForgotPasswordPage />} />
                    <Route path="/auth/verify-device/:deviceID/:verificationToken" element={<VerifyDevice />} />
                    <Route path="/auth/decline-device/:deviceID/:verificationToken" element={<DeclineDevice />} />
                </Route>

                <Route path='/user/dashboard' element={<UserLayout />}>
                    <Route index element={<UserHome />} />
                </Route>

                <Route path='/access-denied' element={<AccessDenied />} />
                <Route path='*' element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
};
