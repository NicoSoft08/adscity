import React from 'react';
import '../../styles/Business.scss';

export default function Business() {
    return (
        <div className='business'>
            <h1>AdsCity pour les entreprises</h1>
            <p>Boostez votre visibilité, attirez des clients et augmentez vos ventes avec nos outils publicitaires performants.</p>

            <section class="features">
                <h2>Pourquoi choisir AdsCity ?</h2>
                <div class="feature-list">
                    <div class="feature">
                        <h3>Publicité ciblée</h3>
                        <p>Atteignez les bonnes personnes grâce à nos outils de ciblage par catégorie, localisation et profil utilisateur.</p>
                    </div>
                    <div class="feature">
                        <h3>Plans flexibles</h3>
                        <p>Choisissez un plan adapté à votre budget et vos besoins, avec des options allant d’une visibilité locale à nationale.</p>
                    </div>
                    <div class="feature">
                        <h3>Statistiques détaillées</h3>
                        <p>Suivez les performances de vos annonces avec des rapports en temps réel sur les clics, impressions et conversions.</p>
                    </div>
                </div>
            </section>

            <div className="coming-soon">
                <h2>Bientot disponible !</h2>
            </div>
        </div>
    );
};
