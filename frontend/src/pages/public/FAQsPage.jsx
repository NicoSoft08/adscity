import React, { useEffect, useState } from 'react';
import {
    IconCreateAd,
    IconCreateAdButton,
    IconRegister
} from '../../config/images';
import { analytics } from '../../firebaseConfig';
import { logEvent } from 'firebase/analytics';
import '../../styles/FAQsPage.scss';

export default function FAQsPage() {
    const [activeIndex, setActiveIndex] = useState(null);

    useEffect(() => {
        logEvent(analytics, 'page_view', { page_path: '/faqs' });
    }, []);


    const handleToggle = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="faq-page">
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
                    <p>Pour modifier vos informations personnelles, allez dans votre espace personnel, puis dans les paramètres de votre compte.</p>
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
                    <p>Nous acceptons les paiements par Transfert Bancaire (SberBank, Tinkoff, VTB Bank, Alpha Bank).</p>
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

            <div className="faq-category">
                <h2>Abonnements</h2>
                <div className={`faq-item ${activeIndex === 13 ? 'active' : ''}`} onClick={() => handleToggle(13)}>
                    <h3> Quels sont les différents types de plans disponibles ?</h3>
                    <p>Nous proposons trois types de plans adaptés à vos besoins :</p>
                    <p>
                        <ul>
                            <li>
                                <p><strong>Particulier (Gratuit)</strong> : Pour les utilisateurs qui souhaitent publier jusqu'à 3 annonces par mois avec une visibilité basique.</p>
                            </li>
                            <li>
                                <p><strong>Professionnel</strong> : Pour les petites entreprises ou freelances, avec jusqu'à 10 annonces, une visibilité améliorée, et un support 24/7.</p>
                            </li>
                            <li>
                                <p><strong>Entreprise</strong> : Pour les entreprises souhaitant une visibilité premium avec jusqu'à 20 annonces par mois.</p>
                            </li>
                        </ul>
                    </p>
                </div>
                <div className={`faq-item ${activeIndex === 14 ? 'active' : ''}`} onClick={() => handleToggle(14)}>
                    <h3>Comment choisir le plan qui me convient ?</h3>
                    <p>Le choix dépend de vos besoins :</p>
                    <p>
                        <ul>
                            <li>
                                <p>Si vous êtes un particulier avec des besoins limités, le plan gratuit est idéal.</p>
                            </li>
                            <li>
                                <p>Si vous êtes un professionnel avec des besoins réguliers de visibilité, optez pour le plan Professionnel.</p>
                            </li>
                            <li>
                                <p>Si vous êtes une entreprise cherchant à maximiser votre impact, le plan Entreprise est fait pour vous.</p>
                            </li>
                        </ul>
                    </p>
                </div>
                <div className={`faq-item ${activeIndex === 15 ? 'active' : ''}`} onClick={() => handleToggle(15)}>
                    <h3>Puis-je changer de plan après avoir souscrit ?</h3>
                    <p>Oui, vous pouvez changer de plan à tout moment. Si vous passez à un plan supérieur, la différence sera calculée au prorata de la durée restante de votre abonnement actuel.</p>
                </div>
                <div className={`faq-item ${activeIndex === 16 ? 'active' : ''}`} onClick={() => handleToggle(16)}>
                    <h3>Comment fonctionne le paiement ?</h3>
                    <p>Pour les plans payants, vous serez redirigé vers une page de paiement sécurisée après avoir sélectionné votre plan. Nous acceptons les paiements par carte bancaire ou via des services de paiement en ligne.</p>
                </div>
                <div className={`faq-item ${activeIndex === 17 ? 'active' : ''}`} onClick={() => handleToggle(17)}>
                    <h3>Que se passe-t-il lorsque la validité de mon plan expire ?</h3>
                    <p>
                        <ul>
                            <li>
                                <p>Pour les plans payants, vous recevrez une notification avant l'expiration. Vous pourrez alors renouveler votre abonnement.</p>
                            </li>
                            <li>
                                <p>Si vous ne renouvelez pas, votre compte sera automatiquement basculé vers le plan gratuit, et certaines fonctionnalités seront restreintes.</p>
                            </li>
                        </ul>
                    </p>
                </div>
                <div className={`faq-item ${activeIndex === 18 ? 'active' : ''}`} onClick={() => handleToggle(18)}>
                    <h3>Les annonces publiées avec le plan gratuit auront-elles une bonne visibilité ?</h3>
                    <p>Les annonces du plan gratuit bénéficient d'une visibilité basique, ce qui signifie qu'elles apparaîtront dans les résultats de recherche mais avec une priorité moindre par rapport aux plans payants.</p>
                </div>
                <div className={`faq-item ${activeIndex === 19 ? 'active' : ''}`} onClick={() => handleToggle(19)}>
                    <h3>Que signifie "support 24/7" ?</h3>
                    <p>Nos plans payants incluent une assistance prioritaire. Vous pouvez contacter notre équipe à tout moment (24 heures sur 24, 7 jours sur 7) pour résoudre vos problèmes ou répondre à vos questions.</p>
                </div>
                <div className={`faq-item ${activeIndex === 20 ? 'active' : ''}`} onClick={() => handleToggle(20)}>
                    <h3>Puis-je publier plus d'annonces que le maximum autorisé par mon plan ?</h3>
                    <p>Non, chaque plan a une limite spécifique d'annonces par mois. Si vous atteignez cette limite, vous devrez passer à un plan supérieur ou attendre le renouvellement de votre abonnement.</p>
                </div>
                <div className={`faq-item ${activeIndex === 21 ? 'active' : ''}`} onClick={() => handleToggle(21)}>
                    <h3>Puis-je bénéficier d'une réduction pour un abonnement à long terme ?</h3>
                    <p>Oui, nous offrons des réductions pour les abonnements annuels. Contactez notre équipe commerciale pour plus de détails.</p>
                </div>
                <div className={`faq-item ${activeIndex === 22 ? 'active' : ''}`} onClick={() => handleToggle(22)}>
                    <h3>Puis-je résilier mon abonnement à tout moment ?</h3>
                    <p>Oui, vous pouvez résilier votre abonnement à tout moment. Cependant, les frais déjà payés ne sont pas remboursables.</p>
                </div>
            </div>


            <div className="faq-contact">
                <h2>Besoin de plus d'aide ?</h2>
                <p>Si vous n'avez pas trouvé la réponse à votre question, veuillez contacter notre support client à l'adresse email suivante : <strong>support@adscity.net</strong>.</p>
            </div>
        </div>
    );
};
