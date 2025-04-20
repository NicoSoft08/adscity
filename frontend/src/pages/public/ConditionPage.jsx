import React, { useEffect } from 'react';
import '../../styles/ConditionPage.scss';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebaseConfig';

export default function ConditionPage() {
    useEffect(() => {
        logEvent(analytics, 'page_view', { page_path: '/conditions' });
    }, [])

    return (
        <div className='terms'>
            <h1>Conditions Générales d'Utilisation</h1>
            <p>Bienvenue sur AdsCity, votre plateforme de petites annonces en ligne. Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation des services fournis par AdsCity. En accédant à notre site et en utilisant nos services, vous acceptez ces conditions dans leur intégralité.</p>

            <h2>Objet</h2>
            <p>Les présentes CGU ont pour objet de définir les modalités de mise à disposition des services de la plateforme AdsCity et les conditions de vente des annonces proposées par les utilisateurs.</p>

            <h2>Services</h2>
            <p>AdsCity propose une plateforme en ligne permettant aux Utilisateurs de publier et consulter des petites annonces dans diverses catégories (vente de biens, offres d'emploi, services, etc.). Les services proposés par AdsCity comprennent notamment la mise en ligne des annonces, leur diffusion sur le site, ainsi que la possibilité de contacter les annonceurs.</p>

            <h2>Inscription et utilisation</h2>
            <p>Pour bénéficier des services d'AdsCity, l'Utilisateur doit créer un compte en remplissant le formulaire d'inscription en ligne. L'Utilisateur s'engage à fournir des informations exactes et à mettre à jour ses données en cas de changement. AdsCity se réserve le droit de suspendre ou de supprimer tout compte en cas de violation des présentes CGU ou de la réglementation en vigueur.</p>

            <h2>Publication des annonces</h2>
            <p>La publication d'une annonce sur AdsCity est gratuite pour les particuliers dans la limite d'un certain nombre d'annonces par mois. Au-delà de ce quota, des frais de publication seront appliqués selon les tarifs indiqués sur le site et peuvent être modifiés à tout moment par AdsCity.</p>

            <h2>Paiement</h2>
            <p>Les paiements peuvent être effectués par transfert bancaire, ou tout autre moyen de paiement accepté par AdsCity.</p>

            <h2>Facturation</h2>
            <p>Une facture sera émise pour chaque paiement effectué. Les utilisateurs peuvent accéder à leurs factures dans leur espace personnel.</p>

            <h2>Responsabilités</h2>
            <p>L'Utilisateur est seul responsable du contenu des annonces publiées sur AdsCity. Il garantit AdsCity contre toute réclamation ou action en justice résultant de la publication de ces annonces. AdsCity ne peut être tenue responsable des dommages indirects ou immatériels subis par l'Utilisateur.</p>

            <h2>Propriété intellectuelle</h2>
            <p>Les éléments créés par AdsCity dans le cadre de la prestation de services (interface, logos, etc.) demeurent sa propriété exclusive. L'Utilisateur n'acquiert qu'un droit d'utilisation non exclusif et non cessible sur ces éléments, limité à l'utilisation des services d'AdsCity.</p>

            <h2>Données personnelles</h2>
            <p>AdsCity s'engage à respecter la réglementation en vigueur en matière de protection des données personnelles. Les données collectées dans le cadre de la prestation de services sont utilisées uniquement pour les besoins de cette prestation et ne sont pas cédées à des tiers, sauf accord exprès de l'Utilisateur.</p>

            <h2>Modifications de la politique</h2>
            <p>AdsCity se réserve le droit de modifier les présentes CGU à tout moment. Toute modification sera publiée sur cette page. Les utilisateurs seront informés de toute modification via le site.</p>

            <h2>Contact</h2>
            <p>Pour toute question ou réclamation, veuillez nous contacter à l'adresse suivante : <a href="mailto:support@adscity.net">support@adscity.net</a>.</p>
        </div>
    );
};
