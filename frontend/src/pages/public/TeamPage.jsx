import React from 'react';

export default function TeamPage({ teamMembers }) {
    return (
        <div className="team-page">
            <h1>Notre Équipe</h1>
            <section className="team-intro">
                <p>Découvrez les personnes qui rendent AdsCity possible.</p>
            </section>

            <section className="team-members">
                {/* Map à travers les membres de l'équipe */}
                {teamMembers.map(member => (
                    <div key={member.id} className="team-member">
                        <img src={member.photo} alt={member.name} className="member-photo" />
                        <h2>{member.displayName}</h2>
                        <h3>{member.title}</h3>
                        <p>{member.bio}</p>
                    </div>
                ))}
            </section>

            <section className="mission-values">
                <h2>Notre Mission</h2>
                <p>Rendre les annonces accessibles et innovantes pour tous, tout en maintenant une expérience utilisateur exceptionnelle.</p>

                <h2>Nos Valeurs</h2>
                <ul>
                    <li>Innovation</li>
                    <li>Intégrité</li>
                    <li>Service Client</li>
                </ul>
            </section>

            <section className="join-us">
                <h2>Rejoignez-Nous</h2>
                <p>Nous sommes toujours à la recherche de talents passionnés pour rejoindre notre équipe. Consultez nos offres d'emploi et postulez dès aujourd'hui !</p>
            </section>
        </div>
    );
};
