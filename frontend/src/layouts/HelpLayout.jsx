import React from 'react';
import { Outlet } from 'react-router-dom';
import { IconHelpCenter } from '../config/images';
import Footer from '../components/footer/Footer';
import '../styles/HelpLayout.scss';

export default function HelpLayout() {
    return (
        <div className='help-layout'>

            <div className="heading">
                <img src={IconHelpCenter} alt="hel-center-logo" />                
            </div>

            {/* <section className="help-hero">
                <h1>Bonjour, comment pouvons-nous vous aider?</h1>
                <p>Explorez notre centre d'aide pour trouver des réponses à vos questions.</p>
            </section> */}

            <Outlet />

            <Footer />
        </div>
    );
};
