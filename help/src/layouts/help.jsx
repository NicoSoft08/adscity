import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import { helpCategories, letterWhiteBgBlue } from '../config';
import Footer from '../coomon/Footer';

const appURL = process.env.REACT_APP_HOME_URL;

export const HelpLayout = () => {
    const location = useLocation();

    // Est-ce qu'on est sur la racine de /help ?
    const isOnHelpHome = location.pathname === '/' || location.pathname === '/help';

    return (
        <div className='help-layout'>
            <div className="heading">
                <div className="logo" title='AdsCity' onClick={() => window.location.href = appURL}>
                    <img src={letterWhiteBgBlue} alt="logo" />
                    <h1>Centre d'aide</h1>
                </div>
                <div className="search-icon">
                    <Search />
                </div>
            </div>

            {/* Hero + catégories visibles uniquement à /help */}
            {isOnHelpHome && (
                <>
                    <section className="help-hero">
                        <h1>Comment pouvons-nous vous aider?</h1>
                        <p>Explorez notre centre d'aide pour trouver des réponses à vos questions.</p>
                    </section>

                    <section className="help-categories">
                        {helpCategories.map((cat, index) => (
                            <Link to={cat.link} key={index} className="help-card">
                                <div className="icon">{cat.icon}</div>
                                <div className="content">
                                    <h3>{cat.title}</h3>
                                    <p>{cat.description}</p>
                                </div>
                            </Link>
                        ))}
                    </section>
                </>
            )}

            <Outlet />

            <Footer />
        </div>
    );
}