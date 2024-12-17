import React from 'react';
import { Outlet } from 'react-router-dom';

// common
import Header from '../common/header/Header';
import Footer from '../components/footer/Footer';

export default function HomeLayout() {
    return (
        <div>

            <Header />


            <Outlet />


            <Footer />

        </div>
    );
};
