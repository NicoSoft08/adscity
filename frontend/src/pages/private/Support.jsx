import React, { useState } from 'react';
import {
    IconCreateAd,
    IconCreateAdButton,
    IconRegister
} from '../../config/images';
import '../../../styles/Support.scss';


export default function Support({ onItemClick }) {
    const [activeIndex, setActiveIndex] = useState(null);

    const handleToggle = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };


    return (
        <div className='support'>
            <div className="faqs">
                <div className="faq-intro">
                    <h1>FAQ - Questions Fréquemment Posées</h1>
                    <p>Bienvenue sur la page FAQ d'AdsCity. Vous trouverez ici des réponses aux questions les plus courantes. Si vous ne trouvez pas la réponse à votre question, n'hésitez pas à contacter notre support.</p>
                </div>

                <div className="faq-category">
                    <h2>Compte</h2>
                    <div className={`faq-item ${activeIndex === 0 ? 'active' : ''}`} onClick={() => handleToggle(0)}>
                        <h3>Comment créer un compte AdsCity ?</h3>
                        <p>Pour créer un compte, cliquez sur le bouton <img className='faq-btn-register' src={IconRegister} alt='btn' /> en haut à droite de la page d'accueil et suivez les instructions.</p>
                    </div>
                    <div className={`faq-item ${activeIndex === 1 ? 'active' : ''}`} onClick={() => handleToggle(1)}>
                        <h3>Comment modifier mes informations personnelles ?</h3>
                        <p>Pour modifier vos informations personnelles, allez dans votre espace personnel, puis cliquez sur "Modifier mon profil".</p>
                    </div>
                    <div className={`faq-item ${activeIndex === 2 ? 'active' : ''}`} onClick={() => handleToggle(2)}>
                        <h3>J'ai oublié mon mot de passe, que faire ?</h3>
                        <p>Pour réinitialiser votre mot de passe, cliquez sur "Mot de passe oublié ?" sur la page de connexion et suivez les instructions.</p>
                    </div>
                </div>

                <div className="faq-category">
                    <h2>Annonces</h2>
                    <div className={`faq-item ${activeIndex === 3 ? 'active' : ''}`} onClick={() => handleToggle(3)}>
                        <h3>Comment publier une annonce ?</h3>
                        <p>Pour publier une annonce, connectez-vous à votre compte, puis, dépendamment de l'affichage de l'interface sur votre appareil (Smartphone ou Ordinateur), cliquez sur le bouton <img className='faq-btn-text' src={IconCreateAd} alt='btn' /> en haut à droite de la page d'accueil ou sur le bouton <img className='faq-btn' src={IconCreateAdButton} alt='btn' /> vers le bas à droite de la page d'accueil et suivez les instructions.</p>
                    </div>
                    <div className={`faq-item ${activeIndex === 4 ? 'active' : ''}`} onClick={() => handleToggle(4)}>
                        <h3>Comment modifier ou supprimer une annonce ?</h3>
                        <p>Pour modifier ou supprimer une annonce, allez dans votre espace personnel, trouvez l'annonce concernée et sélectionnez l'option souhaitée.</p>
                    </div>
                    <div className={`faq-item ${activeIndex === 5 ? 'active' : ''}`} onClick={() => handleToggle(5)}>
                        <h3>Comment signaler une annonce inappropriée ?</h3>
                        <p>Pour signaler une annonce inappropriée, cliquez sur le bouton "Signaler" présent sur l'annonce et remplissez le formulaire de signalement.</p>
                    </div>
                    <div className={`faq-item ${activeIndex === 6 ? 'active' : ''}`} onClick={() => handleToggle(6)}>
                        <h3>Combien de temps prend la vérification d'annonce ?</h3>
                        <p>Habituellement, la vérification prend entre 2 et 30 minutes, mais parfois cela peut prendre jusqu'à 2 jours.</p>
                    </div>
                    <div className={`faq-item ${activeIndex === 7 ? 'active' : ''}`} onClick={() => handleToggle(7)}>
                        <h3>Pourquoi la vérification d'annonce est-elle si longue ?</h3>
                        <p>Parce qu'il est important de tout vérifier — de la description aux photos. Cela ne signifie pas que quelque chose ne va pas avec votre annonce. Si la vérification est en cours depuis 2 jours, il est probable que cela est dû à un grand nombre d'annonces.</p>
                    </div>
                    <div className={`faq-item ${activeIndex === 8 ? 'active' : ''}`} onClick={() => handleToggle(8)}>
                        <h3>Si l'annonce est payante, vérifiez-vous plus rapidement ?</h3>
                        <p>Non, cela n'affecte pas la vitesse. Nous vérifions les annonces payantes et les annonces avec des services de promotion autant que les annonces gratuites — le plus souvent de 2 à 30 minutes (dans de rares cas — jusqu'à 2 jours).</p>
                    </div>
                </div>

                <div className="faq-category">
                    <h2>Paiements</h2>
                    <div className={`faq-item ${activeIndex === 9 ? 'active' : ''}`} onClick={() => handleToggle(9)}>
                        <h3>Quels sont les modes de paiement acceptés ?</h3>
                        <p>Nous acceptons les paiements par Virement Bancaire (SberBank, Tinkoff, VTB Bank, Alpha Bank), par Mobile Money (Orange Money, MTN Money, Moov Money) et Wallets (Wave, FlashSend).</p>
                    </div>
                    <div className={`faq-item ${activeIndex === 10 ? 'active' : ''}`} onClick={() => handleToggle(10)}>
                        <h3>Comment obtenir un remboursement ?</h3>
                        <p>Pour demander un remboursement, veuillez contacter notre service client avec les détails de votre paiement.</p>
                    </div>
                </div>

                <div className="faq-category">
                    <h2>Sécurité</h2>
                    <div className={`faq-item ${activeIndex === 11 ? 'active' : ''}`} onClick={() => handleToggle(11)}>
                        <h3>Comment sécuriser mon compte ?</h3>
                        <p>Utilisez un mot de passe fort, ne partagez pas vos informations de connexion et activez l'authentification à deux facteurs.</p>
                    </div>
                    <div className={`faq-item ${activeIndex === 12 ? 'active' : ''}`} onClick={() => handleToggle(12)}>
                        <h3>Que faire en cas de compte piraté ?</h3>
                        <p>Si vous pensez que votre compte a été piraté, changez immédiatement votre mot de passe et contactez notre support.</p>
                    </div>
                </div>

            </div>

            <div className="contact">
                <h2>Besoin de plus d'aide ?</h2>
               
            </div>
        </div>
    );
};
