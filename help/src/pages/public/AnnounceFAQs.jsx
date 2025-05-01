import React, { useState } from 'react';
import '../../styles/help.scss';

export default function AnnounceFAQs() {
    const [activeIndex, setActiveIndex] = useState(null);

    const handleToggle = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="faq-page">
            <div className="faq-intro">
                <h1>Annonces</h1>
                <p>Créer, modifier, marquer comme vendu ou supprimer vos annonces.</p>
            </div>
            <div className="faq-category">
                <div className={`faq-item ${activeIndex === 0 ? 'active' : ''}`} onClick={() => handleToggle(0)}>
                    <h3>Comment publier une annonce ?</h3>
                    <p>Pour publier une annonce, connectez-vous à votre compte, puis, dépendamment de l'affichage de l'interface sur votre appareil (Smartphone ou Ordinateur), cliquez sur le bouton <strong>Créer une annonce</strong> en haut à droite de la page d'accueil ou sur le bouton <strong>Plus</strong> vers le bas à droite de la page d'accueil et suivez les instructions.</p>
                </div>
                <div className={`faq-item ${activeIndex === 1 ? 'active' : ''}`} onClick={() => handleToggle(1)}>
                    <h3>Comment modifier ou supprimer une annonce ?</h3>
                    <p>Pour modifier ou supprimer une annonce, allez dans votre espace personnel, trouvez l'annonce concernée et sélectionnez l'option souhaitée.</p>
                </div>
                <div className={`faq-item ${activeIndex === 2 ? 'active' : ''}`} onClick={() => handleToggle(2)}>
                    <h3>Comment signaler une annonce inappropriée ?</h3>
                    <p>Pour signaler une annonce inappropriée, cliquez sur le bouton "Signaler" présent sur l'annonce et remplissez le formulaire de signalement.</p>
                </div>
                <div className={`faq-item ${activeIndex === 3 ? 'active' : ''}`} onClick={() => handleToggle(3)}>
                    <h3>Combien de temps prend la vérification d'annonce ?</h3>
                    <p>Habituellement, la vérification prend entre 2 et 30 minutes, mais parfois cela peut prendre jusqu'à 2 jours.</p>
                </div>
                <div className={`faq-item ${activeIndex === 4 ? 'active' : ''}`} onClick={() => handleToggle(4)}>
                    <h3>Pourquoi la vérification d'annonce est-elle si longue ?</h3>
                    <p>Parce qu'il est important de tout vérifier — de la description aux photos. Cela ne signifie pas que quelque chose ne va pas avec votre annonce. Si la vérification est en cours depuis 2 jours, il est probable que cela est dû à un grand nombre d'annonces.</p>
                </div>
                <div className={`faq-item ${activeIndex === 5 ? 'active' : ''}`} onClick={() => handleToggle(5)}>
                    <h3>Si l'annonce est payante, vérifiez-vous plus rapidement ?</h3>
                    <p>Non, cela n'affecte pas la vitesse. Nous vérifions les annonces payantes et les annonces avec des services de promotion autant que les annonces gratuites — le plus souvent de 2 à 30 minutes (dans de rares cas — jusqu'à 2 jours).</p>
                </div>
                <div className={`faq-item ${activeIndex === 6 ? 'active' : ''}`} onClick={() => handleToggle(6)}>
                    <h3>Pourquoi une vérification supplémentaire ?</h3>
                    <p>Pour garantir la sécurité et la qualité des annonces, les annonces sensibles requièrent une vérification par documents et reconnaissance faciale. Cela permet de prévenir les fraudes et les contenus inappropriés.</p>
                </div>
            </div>
        </div>
    );
};
