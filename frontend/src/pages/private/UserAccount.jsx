import React from 'react';
import {
    basicAnnouncementDuration,
    basicAnnouncementPerMonth,
    basicMaxPhotoPerPost
} from '../../constants';
import '../../../styles/UserAccount.scss';

export default function UserAccount() {
    return (
        <div className='account-section'>
            <section className="section">
                <div className="account-intro">
                    <h1>Conditions d’Utilisation - Compte Basic</h1>
                    <p>Bienvenue sur notre plateforme <strong>AdsCity</strong> ! En tant que détenteur d'un Compte Basic, veuillez prendre connaissance des avantages suivants:</p>
                </div>

                <h2>Publication</h2>
                <p>Vous disposerez de {basicAnnouncementPerMonth} publications d’annonces par mois.</p>

                <h2>Visibilité des Annonces</h2>
                <p>Vos annonces n'apparaîtront dans les résultats de recherche lorsqu'un utilisateur effectuera une recherche, mais vous pourrez voir le nombre de vues de chacune de vos annonces.</p>

                <h2>Durée de Publication</h2>
                <p>Les annonces gratuites expirent après {basicAnnouncementDuration} jours n'apparaitront dans les résultats de recherche.</p>

                <h2>Nombre de Photos</h2>
                <p>Vous pouvez télécharger un maximum de {basicMaxPhotoPerPost} images par annonce avec votre Compte Basic.</p>

                <h2>Support Client</h2>
                <p>Un Support Client de base est fourni aux utilisateurs de Compte Basic.</p>

                <h2>Engagement</h2>
                <p>En utilisant un Compte Basic sur notre plateforme, vous vous engagez à respecter nos Conditions d'Utilisation et nos directives communautaires. Tout abus ou violation de ces règles peut entraîner la suspension ou la résiliation de votre compte.</p>

                <h2>Modification des Conditions</h2>
                <p>AdsCity se réserve le droit de modifier les conditions associées aux Comptes Basic à tout moment, sans préavis. Les utilisateurs seront informés de tout changement majeur apporté aux conditions via des notifications ou des annonces sur la plateforme.</p>

                <sub>Merci d'avoir choisi notre plateforme de petites annonces pour promouvoir vos annonces et interagir avec notre communauté d'utilisateurs.</sub>
            </section>
        </div>
    );
};
