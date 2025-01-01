import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/QuickStartGuide.scss';

export default function QuickStartGuide() {
    return (
        <div className="quick-start-guide">
            <h1>Guide de démarrage rapide</h1>
            <p>Suivez ces étapes simples pour commencer avec AdsCity.</p>

            <ul className="steps-list">
                <li>
                    <h3>Étape 1 : Créez un compte</h3>
                    <p>Inscrivez-vous gratuitement en tant que particulier ou professionnel.</p>
                    <Link to="/auth/create-user" className="link">Créer un compte</Link>
                </li>
                <li>
                    <h3>Étape 2 : Choisissez un plan</h3>
                    <p>Explorez nos plans pour trouver celui qui correspond à vos besoins.</p>
                    <Link to="/pricing" className="link">Voir les plans et tarifs</Link>
                </li>
                <li>
                    <h3>Étape 3 : Publiez une annonce</h3>
                    <p>Ajoutez vos annonces et attirez l'attention de vos clients potentiels.</p>
                    <Link to="/auth/create-announcement" className="link">Publier une annonce</Link>
                </li>
                <li>
                    <h3>Étape 4 : Gérer votre compte</h3>
                    <p>Accédez à votre tableau de bord pour gérer vos annonces et vos informations.</p>
                    <Link to="/user/dashboard" className="link">Accéder au tableau de bord</Link>
                </li>
            </ul>

            <div className="cta-section">
                <h2>Besoin d'aide ?</h2>
                <p>Consultez notre FAQ ou contactez notre support client.</p>
                <Link to="/help-center/faq" className="btn">Voir la FAQ</Link>
            </div>
        </div>
    );
};
