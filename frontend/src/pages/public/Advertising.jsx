import React from 'react';
import { useNavigate } from 'react-router-dom';
import { faArrowRight, faBullhorn, faChartLine, faGlobe, faHandshake, faLightbulb, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../styles/Advertising.scss';

// Advertising advantages data
const advantages = [
    {
        icon: faUsers,
        title: 'Audience Ciblée',
        description: 'Atteignez des milliers d\'utilisateurs activement à la recherche de produits et services dans votre secteur.'
    },
    {
        icon: faChartLine,
        title: 'Visibilité Maximale',
        description: 'Augmentez votre visibilité avec des emplacements stratégiques sur notre plateforme à fort trafic.'
    },
    {
        icon: faGlobe,
        title: 'Portée Internationale',
        description: 'Étendez votre portée au-delà des frontières avec notre audience internationale diversifiée.'
    },
    {
        icon: faHandshake,
        title: 'Partenariat Personnalisé',
        description: 'Bénéficiez de solutions publicitaires sur mesure adaptées à vos objectifs et à votre budget.'
    },
    {
        icon: faBullhorn,
        title: 'Impact Immédiat',
        description: 'Obtenez des résultats rapides avec une mise en ligne immédiate de vos campagnes publicitaires.'
    },
    {
        icon: faLightbulb,
        title: 'Insights Détaillés',
        description: 'Accédez à des analyses détaillées pour mesurer l\'efficacité de vos campagnes et optimiser vos résultats.'
    }
];

// Advertising options data
const adOptions = [
    {
        title: 'Bannière Publicitaire',
        description: 'Bannières visuellement attrayantes placées stratégiquement sur notre plateforme.'
    },
    {
        title: 'Vidéo Promotionnelle',
        description: 'Vidéos engageantes pour captiver l\'attention des utilisateurs et présenter votre offre.'
    },
    {
        title: 'Annonce Intégrée',
        description: 'Annonces natives qui s\'intègrent naturellement à l\'expérience utilisateur.'
    }
];

// Placement options data
const placementOptions = [
    {
        title: 'Page Principale',
        description: 'Visibilité maximale sur notre page d\'accueil à fort trafic.'
    },
    {
        title: 'Pages des Catégories',
        description: 'Ciblage précis des utilisateurs parcourant des catégories spécifiques.'
    },
    {
        title: 'Pages de Détails d\'un Produit',
        description: 'Atteindre les utilisateurs au moment crucial de leur décision d\'achat.'
    }
];

export default function Advertising() {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/pubs/create');
    };

    return (
        <div className="advertising-landing-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Propulsez Votre Entreprise avec AdsCity</h1>
                    <p>Atteignez des milliers de clients potentiels avec nos solutions publicitaires personnalisées.</p>
                    <button className="cta-button" onClick={handleGetStarted}>
                        Commencer Maintenant
                        <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>
                <div className="hero-image">
                    {/* You can add an image here representing advertising on AdsCity */}
                    <img src={require('../../imgs/adscity-pub.png')} alt="AdsCity Advertising" />
                </div>
            </section>

            {/* Advantages Section */}
            <section id="advantages" className="advantages-section">
                <h2>Pourquoi choisir AdsCity pour votre publicité ?</h2>
                <div className="advantages-grid">
                    {advantages.map((advantage, index) => (
                        <div className="advantage-card" key={index}>
                            <div className="advantage-icon">
                                <FontAwesomeIcon icon={advantage.icon} />
                            </div>
                            <h3>{advantage.title}</h3>
                            <p>{advantage.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Ad Options Section */}
            <section id="options" className="ad-options-section">
                <h2>Options Publicitaires Flexibles</h2>
                <div className="options-container">
                    {adOptions.map((option, index) => (
                        <div className="option-card" key={index}>
                            <h3>{option.title}</h3>
                            <p>{option.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Placement Options Section */}
            <section id="placements" className="placement-section">
                <h2>Emplacements Stratégiques</h2>
                <div className="options-container">
                    {placementOptions.map((option, index) => (
                        <div className="option-card" key={index}>
                            <h3>{option.title}</h3>
                            <p>{option.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2>Prêt à Développer Votre Entreprise ?</h2>
                    <p>Commencez dès aujourd'hui et donnez à votre entreprise la visibilité qu'elle mérite.</p>
                    <button className="cta-button" onClick={handleGetStarted}>
                        Créer Votre Publicité
                        <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>
            </section>
        </div>
    );
};
