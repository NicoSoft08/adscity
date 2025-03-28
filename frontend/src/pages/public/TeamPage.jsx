import React, { useEffect } from 'react';
import { IconAvatar } from '../../config/images';
import '../../styles/TeamPage.scss';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebaseConfig';

export default function TeamPage() {
    useEffect(() => {
        logEvent(analytics, 'page_view', { page_path: '/team' });
    }, []);
    
    const teamMembers = [
        {
            name: "Nicolas N'DAH",
            role: 'Chief Executive & Tech Officer',
            photo: IconAvatar,
            description: 'Visionnaire et leader de l’équipe, Nicolas supervise toutes les opérations stratégiques.',
        },
        {
            name: 'Aristide GALLOH',
            role: 'Human & Financial Resources Officer',
            photo: IconAvatar,
            description: 'Responsable des ressources financières & humaines et de la gestion des talents.',
        },
        {
            name: 'Larissa DOUKOUM',
            role: 'Chief Financial Vice Officer',
            photo: IconAvatar,
            description: 'Vice Responsable de la comptabilité, des finances et de la gestion budgétaire.',
        },
        {
            name: "Paul N'GUESSAN",
            role: 'Chief Product Officer',
            photo: IconAvatar,
            description: 'Responsable de l\'expérience utilisateur (UX/UI) et du design graphique.',
        },
        {
            name: 'Ismaël SANI',
            role: 'Chief Revenue Officer',
            photo: IconAvatar,
            description: 'Responsable du développement commercial et de la croissance des revenus.',
        },
        {
            name: 'Madame DOSSO',
            role: 'Chief Revenue Vice Officer',
            photo: IconAvatar,
            description: 'Vice Responsable du développement commercial et de la croissance des revenus.',
        },
        {
            name: 'Charlotte NANGA',
            role: 'Head Marketing Officer',
            photo: IconAvatar,
            description: 'Responsable des stratégies marketing et de la communication.',
        },
        {
            name: "Guy I. SORO",
            role: 'Chief Marketing Vice Officer',
            photo: IconAvatar,
            description: 'Adjoint au Responsable des stratégies marketing et de la communication.',
        },
        {
            name: "Josias YEBOUA",
            role: 'Chief Community Manager',
            photo: IconAvatar,
            description: 'Responsable de la gestion des communautés et des réseaux sociaux.',
        },
    ];
    return (
        <div className="team-page">
            {/* Section Notre Équipe */}
            <section className="section-team">
                <h1 className="team-page-title">Notre Équipe</h1>
                <div className="team-grid">
                    {teamMembers.map((member, index) => (
                        <div className="team-member" key={index}>
                            <img src={member.photo} alt={member.name} className="team-member-photo" />
                            <h3 className="team-member-name">{member.name}</h3>
                            <p className="team-member-role">{member.role}</p>
                            <p className="team-member-description">{member.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Section Notre Mission */}
            <section className="section-mission">
                <h2>Notre Mission</h2>
                <p>
                    Chez Adscity, notre mission est de faciliter les échanges locaux à travers une plateforme où les utilisateurs peuvent publier des annonces, trouver des produits et services de qualité, et contribuer à un environnement numérique sûr et dynamique.
                </p>
            </section>

            {/* Section Nos Valeurs */}
            <section className="section-values">
                <h2>Nos Valeurs</h2>
                <ul>
                    <li><strong>Innovation :</strong> Nous cherchons toujours à améliorer nos services en restant à la pointe de la technologie.</li>
                    <li><strong>Confiance :</strong> La sécurité et la transparence sont au cœur de notre plateforme.</li>
                    <li><strong>Respect :</strong> Nous croyons en un environnement où chacun peut échanger librement et respectueusement.</li>
                    <li><strong>Responsabilité :</strong> Nous assumons la responsabilité de la qualité de nos services et de la satisfaction des utilisateurs.</li>
                </ul>
            </section>

            {/* Section L'histoire d'Adscity */}
            <section className="section-history">
                <h2>L'histoire derrière AdsCity</h2>
                <p>
                    AdsCity a été fondée en 2025 avec une vision claire : offrir une plateforme de commerce local qui simplifie l'achat et la vente de produits et services tout en garantissant sécurité, transparence et convivialité. 
                </p>
                <p>
                    L'idée d'AdsCity est née d'un besoin croissant d'une solution qui connecte les individus au niveau local, avec un processus de transaction simple, rapide et sûr. Notre équipe, passionnée par l'innovation et l'entrepreneuriat, a réuni ses compétences pour créer une plateforme qui facilite ces échanges tout en répondant aux exigences modernes de sécurité et de convivialité.
                </p>
                <p>
                    Dès ses débuts, AdsCity a mis un accent particulier sur l'expérience utilisateur, en offrant une interface intuitive et un système de vérification fiable pour garantir la confiance entre acheteurs et vendeurs. Grâce à un investissement constant dans la technologie et l'écoute de nos utilisateurs, nous avons créé une communauté forte et engagée qui participe activement au succès de notre plateforme.
                </p>
            </section>
        </div>
    );
};
