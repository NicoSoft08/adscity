import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Footer from '../components/footer/Footer';
import { letterWhiteBgBlue } from '../config/logos';
import { CreditCard, FileText, Search, ShieldCheck, User } from 'lucide-react';
import '../styles/HelpLayout.scss';

const helpCategories = [
    {
        title: 'Compte',
        description: 'Gérer votre profil, vos informations et préférences.',
        icon: <User size={32} />,
        link: 'account'
    },
    {
        title: 'Annonces',
        description: 'Créer, modifier, marquer comme vendu ou supprimer vos annonces.',
        icon: <FileText size={32} />,
        link: 'posts'
    },
    {
        title: 'Paiements',
        description: 'Comprendre les méthodes de paiement et facturation.',
        icon: <CreditCard size={32} />,
        link: 'payments'
    },
    {
        title: 'Sécurité',
        description: 'Protégez votre compte et signalez les activités suspectes.',
        icon: <ShieldCheck size={32} />,
        link: 'security'
    },
];

export default function HelpLayout() {
    const location = useLocation();

    // Est-ce qu'on est sur la racine de /help ?
    const isOnHelpHome = location.pathname === '/help';

    return (
        <div className='help-layout'>

            <div className="heading">
                <div className="logo" title='AdsCity' onClick={() => window.location.href = '/'}>
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
};
