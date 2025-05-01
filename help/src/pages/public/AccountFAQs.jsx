import React, { useState } from 'react';
import '../../styles/help.scss';

export default function AccountFAQs() {
    const [activeIndex, setActiveIndex] = useState(null);

    const handleToggle = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="faq-page">
            <div className="faq-intro">
                <h1>Compte</h1>
                <p>Gérer votre profil, vos informations et préférences.</p>
            </div>

            <div className="faq-category">
                <div className={`faq-item ${activeIndex === 0 ? 'active' : ''}`} onClick={() => handleToggle(0)}>
                    <h3>Comment créer un compte AdsCity ?</h3>
                    <p>Pour créer un compte:</p>
                    <p>1. Cliquez sur le bouton <strong>Inscription</strong> en haut à droite de la page d'accueil et accédez à la page d'inscription.</p>
                    <p>2. Renseignez vos informations personnelles, telles que votre nom et prénom, puis cliquez sur le bouton <strong>Suivant</strong>.</p>
                    <p>3. Renseignez vos informations de contact, telles que email et numéro de téléphone, puis cliquez sur le bouton <strong>Suivant</strong></p>
                    <p>4. Renseignez vos informations de résidence, telles que le pays, la ville et l'adresse de domicile, puis cliquez sur le bouton <strong>Suivant</strong></p>
                    <p>5. Renseignez vos informations de sécurité, telles que le mot de passe et la confirmation du mot de passe, puis cliquez sur le bouton <strong>Suivant</strong>. Vous serez alors redirigés vers la page suivante.</p>
                    <p>7. Saisissez <strong>le code à 6 chiffres qui sera envoyé à l'adresse email que vous aurez fournie</strong>. Une fois le code vérifié, vous verrez une fenêtre indiquant que votre inscription a réussi.</p>
                </div>
                <div className={`faq-item ${activeIndex === 1 ? 'active' : ''}`} onClick={() => handleToggle(1)}>
                    <h3>Comment modifier mes informations personnelles ?</h3>
                    <p>Pour modifier vos informations personnelles:</p>
                    <p>1. Cliquez sur l'icône ou votre photo de profile en haut à droite de la page d'accueil et accédez à votre espace personnel.</p>
                    <p>2. Cliquez sur l'onglet avec l'icône utilisateur</p>
                    <p>3. Cliquez sur l'icône en forme de crayon situé à coté de l'élément à modifier.</p>
                    <p>4. Une fenêtre ou boite de dialogue s'ouvrira et vous pourrez modifier l'information souhaitée et cliquez sur le bouton <strong>Valider</strong>.</p>
                </div>
                <div className={`faq-item ${activeIndex === 2 ? 'active' : ''}`} onClick={() => handleToggle(2)}>
                    <h3>J'ai oublié mon mot de passe, que faire ?</h3>
                    <p>Pour réinitialiser votre mot de passe:, cliquez sur "Mot de passe oublié ?" sur la page de connexion et suivez les instructions.</p>
                </div>
            </div>
        </div>
    );
};
