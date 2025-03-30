import React, { useEffect } from 'react';
import '../../styles/RulesPage.scss';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebaseConfig';

export default function RulesPage() {
    useEffect(() => {
        logEvent(analytics, 'rules_page_view', { page_path: '/rules' });
    }, [])

    return (
        <div className='rules'>
            <h1>Règles de Diffusion d'Annonces sur AdsCity</h1>
            <p>Pour garantir une <strong>expérience sécurisée, fiable et qualitative</strong>, AdsCity impose les règles suivantes pour la publication d'annonces. Toute annonce ne respectant pas ces règles pourra être <strong>supprimée</strong> ou <strong>refusée</strong> pour modification par notre équipe de modération.</p>

            <h2>Conditions Générales</h2>
            <p>L’annonce doit être <strong>claire, complète et véridique</strong>.</p>
            <p>Le contenu ne doit <strong>pas contenir de fausses informations</strong> ou être <strong>trompeur</strong>.</p>
            <p>Une annonce doit être publiée <strong>dans la bonne catégorie</strong>.</p>
            <p>Les images doivent <strong>représenter fidèlement</strong> le produit ou service proposé.</p>
            <p><strong>Interdiction du plagiat</strong> : Il est interdit de copier du contenu d’autres annonces ou sites.</p>
            <p><strong>Un utilisateur ne peut pas publier plusieurs fois la même annonce</strong>.</p>

            <h2>Contenus Interdits</h2>
            <p>Produits illégaux (drogues, armes, produits contrefaits, documents officiels falsifiés...).</p>
            <p>Annonces discriminatoires, diffamatoires ou incitant à la haine.</p>
            <p>Contenus à caractère pornographique ou adulte.</p>
            <p>Escroqueries et arnaques (fausses offres d’emploi, ventes frauduleuses...).</p>
            <p>Annonces de jeux de hasard et paris non autorisés.</p>
            <p>Pratiques financières douteuses (prêts frauduleux, Ponzi, MLM illégal...).</p>

            <h2>Annonces Sensibles (Vérification Supplémentaire)</h2>
            <p>Certaines catégories nécessitent une vérification avant publication pour éviter les abus :</p>
            <p><strong>Immobilier</strong> (documents de propriété ou mandat d’agence).</p>
            <p><strong>Automobile</strong> (certificat d’immatriculation).</p>
            <p><strong>Emploi</strong> (informations claires sur l’entreprise et le poste proposé).</p>
            <p><strong>Services financiers</strong> (preuve d’activité légale).</p>
            <p><strong>Nous travaillons activement sur un système de vérification qui sera disponible très bientôt.</strong></p>

            <h2>Qualité des Annonces</h2>
            <p>Les titres doivent être <strong>pertinents et concis</strong> (pas de majuscules excessives, pas de spam).</p>
            <p>La description doit être <strong>détaillée et honnête</strong>.</p>
            <p>Les photos doivent être <strong>de bonne qualité, sans filigrane ni publicité</strong>.</p>
            <p><strong>Pas de liens externes</strong> non autorisés.</p>

            <h2>Modération & Sanctions</h2>
            <p><strong>Toute violation des règles peut entraîner </strong>:</p>
            <p><strong>Un avertissement</strong> (message de mise en conformité).</p>
            <p><strong>Le refus ou la suppression de l’annonce</strong>.</p>
            <p><strong>La suspension ou le bannissement du compte</strong> en cas de récidive.</p>
            <p><strong>L’équipe de modération d’AdsCity se réserve le droit de modifier ces règles à tout moment pour améliorer la sécurité et la qualité des annonces.</strong></p>

            <p>En publiant une annonce sur AdsCity, vous acceptez ces règles et vous engagez à les respecter.</p>
            <p>Pour toute question ou clarification concernant ces règles, veuillez nous contacter à l'adresse suivante : <a href="mailto:support@adscity.net">support@adscity.net</a></p>
        </div>
    );
};
