import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// layouts
// import AuthLayout from './layouts/AuthLayout';
import HelpLayout from './layouts/HelpLayout';
import HomeLayout from './layouts/HomeLayout';

// pages
import AccessDenied from './pages/public/AccessDenied';
import CategoryNamePage from './pages/public/CategoryNamePage';
import CategoryPage from './pages/public/CategoryNamePage';
import ConditionPage from './pages/public/ConditionPage';
import ContactPage from './pages/public/ContactPage';
import FAQsPage from './pages/public/FAQsPage';
import HomePage from './pages/public/HomePage';
// import LoginPage from './pages/auth/LoginPage';
import NotFoundPage from './pages/public/NotFoundPage';
// import PlansPage from './pages/public/PlansPage';
import PrivacyPage from './pages/public/PrivacyPage';
import RulesPage from './pages/private/RulesPage';
import SearchResultPage from './pages/public/SearchResultPage';
import ShowUserPage from './pages/public/ShowUserPage';
// import SignupPage from './pages/auth/SignUpPage';
// import SignupSuccess from './pages/auth/SignupSuccess';
import TeamPage from './pages/public/TeamPage';
import UserHome from './pages/private/UserHome';
import CheckoutProceed from './pages/private/CheckoutProceed';
import SecurityAdvices from './pages/public/SecurityAdvices';
// import { DeclineDevice, VerifyDevice } from './pages/auth/DeviceActions';
import Business from './pages/public/Business';
import QuickStartGuide from './pages/public/QuickStartGuide';
import FeedbackForm from './pages/private/FeedbackForm';
import PostDetailPage from './pages/public/PostDetailPage';
import CreatePostPage from './pages/public/CreatePostPage';
// import FiltersPage from './pages/public/FiltersPage';
import PaymentPage from './pages/private/PaymentPage';
import UserProfile from './pages/private/UserProfile';
import DashboardPanel from './pages/private/DashboardPanel';
import { AuthContext } from './contexts/AuthContext';
// import Settings from './pages/private/Settings';
// import Messages from './pages/private/Messages';
import ManagePosts from './pages/private/ManagePosts';
import ManagePostID from './pages/private/ManagePostID';
import PostIDPage from './pages/public/PostIDPage';
import ManageNotifications from './pages/private/ManageNotifications';
import ManagePayments from './components/payment/ManagePayments';
import EditPostID from './pages/private/EditPostID';
import StatsPostID from './pages/private/StatsPostID';
import ManageFavorites from './pages/private/ManageFavorites';
// import Forfaits from './pages/public/Forfaits';
import Verification from './pages/private/Verification';
// import PasswordResetPage from './pages/auth/PasswordResetPage';
// import RequestPasswordResetPage from './pages/auth/RequestPasswordResetPage';
// import SignupVerifyEmail from './pages/auth/SignupVerifyEmail';
// import EmailVerified from './pages/auth/EmailVerified';
import Advertising from './pages/public/Advertising';
import AdvertisingLayout from './layouts/AdvertisingLayout';
import PubCreationPage from './pages/public/PubCreationPage';
import StatusCreator from './components/status/StatusCreator';
import Status from './components/status/Status';
import StoreLayout from './layouts/StoreLayout';
import Stores from './pages/public/Stores';
import StoreCreationPage from './pages/public/StoreCreationPage';
import StoreFAQs from './pages/public/StoreFAQs';
import PubsFAQs from './pages/public/PubsFAQs';
import AccountFAQs from './pages/public/AccountFAQs';
import AnnounceFAQs from './pages/public/AnnounceFAQs';

export default function AppRouter() {
    const { currentUser, userData } = useContext(AuthContext);

    return (
        <Router>
            <Routes>
                <Route element={<HomeLayout />}>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/category' element={<CategoryPage />} />
                    <Route path='/category/:categoryName' element={<CategoryNamePage />} />
                    <Route path='/auth/create-post' element={<CreatePostPage />} />

                    <Route path='/contact-us' element={<ContactPage />} />

                    {/* <Route path='/forfait' element={<Forfaits />} /> */}
                    <Route path='/search-results' element={<SearchResultPage />} />
                    {/* <Route path="/filters" element={<FiltersPage />} /> */}

                    <Route path='/legal/privacy-policy' element={<PrivacyPage />} />
                    <Route path='/legal/terms' element={<ConditionPage />} />
                    <Route path='/legal/post-rules' element={<RulesPage />} />

                    <Route path='/business' element={<Business />} />
                    <Route path='/about' element={<TeamPage />} />
                    <Route path="/posts/:category/:subcategory/:post_id" element={<PostDetailPage />} />
                    <Route path="/posts/:category/:subcategory/:postID" element={<PostIDPage />} />
                    <Route path='/users/user/:UserID/profile/show' element={<ShowUserPage />} />
                    <Route path='/payment/:id' element={<PaymentPage />} />
                    <Route path='/proceed-to-checkout/:id' element={<CheckoutProceed />} />

                    <Route path='/start-guide' element={<QuickStartGuide />} />

                    <Route path='/feedback-tests' element={<FeedbackForm />} />
                    <Route path='/faq' element={<FAQsPage />} />
                </Route>
                <Route path='/pubs' element={<AdvertisingLayout />}>
                    <Route index element={<Advertising />} />
                    <Route path='create' element={<PubCreationPage />} />
                </Route>

                <Route path='/stores' element={<StoreLayout />}>
                    <Route index element={<Stores />} />
                    <Route path='create' element={<StoreCreationPage />} />
                </Route>

                <Route path='/help' element={<HelpLayout />}>
                    <Route path='account' element={<AccountFAQs />} />
                    <Route path='posts' element={<AnnounceFAQs />} />
                    <Route path='safety' element={<SecurityAdvices />} />
                    <Route path='pubs' element={<PubsFAQs />} />
                    <Route path='stores' element={<StoreFAQs />} />
                </Route>

                {/* <Route element={<AuthLayout />}>
                    <Route path='/auth/signin' element={<LoginPage />} />
                    <Route path='/auth/signin/:email?' element={<LoginPage />} />
                    <Route path='/auth/signup' element={<SignupPage />} />
                    <Route path='/auth/validate-email' element={<SignupSuccess />} />
                    <Route path='/auth/signup-verify-email' element={<SignupVerifyEmail />} />
                    <Route path='/auth/email-verified' element={<EmailVerified />} />
                    <Route path='/auth/forgot-password' element={<RequestPasswordResetPage />} />
                    <Route path='/auth/reset-password/:token' element={<PasswordResetPage />} />
                </Route> */}

                <Route path='/user/dashboard' element={<UserHome />}>
                    <Route path="panel" element={<DashboardPanel />} />
                    <Route path="status" element={<Status />} />
                    <Route path="status/new" element={<StatusCreator />} />
                    <Route path="documents" element={<Verification currentUser={currentUser} userData={userData} />} />
                    <Route path="favoris" element={<ManageFavorites currentUser={currentUser} />} />
                    <Route path="posts" element={<ManagePosts currentUser={currentUser} />} />
                    <Route path='posts/:post_id' element={<ManagePostID currentUser={currentUser} />} />
                    <Route path='posts/:post_id/edit' element={<EditPostID currentUser={currentUser} userData={userData} />} />
                    <Route path='posts/:post_id/statistics' element={<StatsPostID />} />
                    <Route path="payments" element={<ManagePayments userID={currentUser?.uid} />} />
                    {/* <Route path="messages" element={<Messages currentUser={currentUser} />} /> */}
                    <Route path="notifications" element={<ManageNotifications />} />
                    <Route path="profile" element={<UserProfile />} />
                    {/* <Route path="settings" element={<Settings />} /> */}
                </Route>

                <Route path='/access-denied' element={<AccessDenied />} />
                <Route path='*' element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
};
