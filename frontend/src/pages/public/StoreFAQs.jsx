import React, { useState } from 'react';
import '../../styles/FAQsPage.scss';

const faqs = [
    {
        question: "Comment créer une boutique ?",
        answer: (
            <>
                <p>Pour créer une boutique :</p>
                <ol>
                    <li>Accédez à <a href="/stores">l'annuaire des boutiques</a>.</li>
                    <li>Cliquez sur <strong>"Créer une boutique"</strong>.</li>
                    <li>Remplissez les informations demandées (nom, description, catégorie, image de couverture...)</li>
                    <li>Acceptez les conditions générales et validez.</li>
                </ol>
            </>
        )
    },
    {
        question: "Combien coûte la création d'une boutique ?",
        answer: (
            <>
                <p>La création d'une boutique sur AdsCity est <strong>gratuite</strong> pour les fonctionnalités de base.</p>
                <p>Nous proposons également des options premium pour améliorer votre visibilité et accéder à des fonctionnalités avancées. En savoir plus sur <a href="/forfait">les forfaits</a></p>
            </>
        )
    },
    {
        question: "Quels sont les prérequis pour ouvrir une boutique ?",
        answer: (
            <ul>
                <li>Avoir un compte vérifié.</li>
                <li>Avoir complété votre profil utilisateur.</li>
                <li>Respecter nos conditions générales d'utilisation.</li>
            </ul>
        )
    },
    {
        question: "Puis-je créer plusieurs boutiques ?",
        answer: <p>Oui, vous pouvez créer plusieurs boutiques à condition que chaque boutique propose des produits ou services distincts.</p>
    },
    {
        question: "Comment modifier les informations de ma boutique ?",
        answer: <p>Depuis votre espace boutique, sélectionnez la boutique concernée puis cliquez sur <strong>"Modifier"</strong> pour mettre à jour vos informations.</p>
    }
];

export default function StoreFAQs() {
    const [activeIndex, setActiveIndex] = useState(null);

    const handleToggle = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="faq-page">
            <div className="faq-intro">
                <h1>Boutiques</h1>
                <p>Créer et gérer vos boutiques pour présenter vos produits et services.</p>
            </div>

            <div className="faq-category">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                        onClick={() => handleToggle(index)}
                    >
                        <h3>{faq.question}</h3>
                        {activeIndex === index && <div className="faq-answer">{faq.answer}</div>}
                    </div>
                ))}
            </div>
        </div>
    );
};
