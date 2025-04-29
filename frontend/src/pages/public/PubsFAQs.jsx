import React, { useState } from 'react';
import '../../styles/FAQsPage.scss';

export default function PubsFAQs() {
    const [activeIndex, setActiveIndex] = useState(null);

    const handleToggle = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };
    return (
        <div className="faq-page">
            <div className="faq-intro">
                <h1>Publicités</h1>
                <p>Découvrez comment promouvoir votre entreprise sur AdsCity grâce à diverses options publicitaires.</p>
            </div>

            <div className="faq-category">
                <div className={`faq-item ${activeIndex === 0 ? 'active' : ''}`} onClick={() => handleToggle(0)}>
                    <h3>Qu'est-ce qu'AdsCity ?</h3>
                    <p>AdsCity est une plateforme en ligne qui permet aux entreprises et aux particuliers de publier, vendre et échanger des produits et services, ainsi que de promouvoir leurs offres grâce à diverses options publicitaires.</p>
                </div>
                <div className={`faq-item ${activeIndex === 1 ? 'active' : ''}`} onClick={() => handleToggle(1)}>
                    <h3>Comment puis-je faire de la publicité pour mon entreprise sur AdsCity ?</h3>
                    <p>Vous pouvez promouvoir votre entreprise sur AdsCity en remplissant notre formulaire publicitaire, qui recueille des informations sur votre société, le type de promotion souhaitée, la durée, l'emplacement et le budget.</p>
                </div>
                <div className={`faq-item ${activeIndex === 2 ? 'active' : ''}`} onClick={() => handleToggle(2)}>
                    <h3>Quels types de publicité AdsCity propose-t-il ?</h3>
                    <p>AdsCity propose plusieurs formats publicitaires :</p>
                    <ul>
                        <li>Bannières publicitaires</li>
                        <li>Vidéos promotionnelles</li>
                        <li>Annonces intégrées</li>
                    </ul>
                </div>
                <div className={`faq-item ${activeIndex === 3 ? 'active' : ''}`} onClick={() => handleToggle(3)}>
                    <h3>Où mes publicités peuvent-elles être affichées sur AdsCity ?</h3>
                    <p>Vos publicités peuvent être affichées à plusieurs endroits :</p>
                    <ul>
                        <li>Page principale</li>
                        <li>Pages des catégories</li>
                        <li>Pages de détails d'un produit</li>
                    </ul>
                </div>
                <div className={`faq-item ${activeIndex === 4 ? 'active' : ''}`} onClick={() => handleToggle(4)}>
                    <h3>Quelle peut être la durée de ma publicité ?</h3>
                    <p>La durée est flexible et déterminée par vous, le client. Vous pouvez choisir n'importe quelle période, aussi courte qu'un jour ou aussi longue qu'un an.</p>
                </div>
                <div className={`faq-item ${activeIndex === 5 ? 'active' : ''}`} onClick={() => handleToggle(5)}>
                    <h3>Comment le budget publicitaire est-il déterminé ?</h3>
                    <p>Votre budget est calculé en fonction de trois facteurs principaux :</p>
                    <ol>
                        <li>Le type de promotion que vous sélectionnez (bannière, vidéo ou annonce intégrée)</li>
                        <li>La durée de votre campagne</li>
                        <li>Les emplacements que vous choisissez</li>
                    </ol>
                </div>
                <div className={`faq-item ${activeIndex === 6 ? 'active' : ''}`} onClick={() => handleToggle(6)}>
                    <h3>Proposez-vous des forfaits publicitaires ?</h3>
                    <p>Oui, nous proposons divers forfaits publicitaires adaptés aux différents besoins et budgets des entreprises. Contactez notre équipe commerciale pour plus d'informations sur les forfaits actuels et les offres spéciales.</p>
                </div>
                <div className={`faq-item ${activeIndex === 7 ? 'active' : ''}`} onClick={() => handleToggle(7)}>
                    <h3>Quelles informations dois-je fournir pour faire de la publicité sur AdsCity ?</h3>
                    <p>Pour faire de la publicité sur AdsCity, vous devrez fournir :</p>
                    <ul>
                        <li>Informations sur l'entreprise (nom, secteur d'activité)</li>
                        <li>Lien de redirection pour votre publicité</li>
                        <li>Adresse de l'entreprise ou personnelle</li>
                        <li>Numéro de téléphone et/ou contact WhatsApp</li>
                        <li>Adresse email</li>
                        <li>Détails sur la promotion</li>
                        <li>Description du produit ou service</li>
                        <li>Durée souhaitée</li>
                        <li>Emplacement préféré</li>
                        <li>Considérations budgétaires</li>
                        <li>Toutes demandes ou exigences spécifiques</li>
                    </ul>
                </div>
                <div className={`faq-item ${activeIndex === 8 ? 'active' : ''}`} onClick={() => handleToggle(8)}>
                    <h3>Puis-je spécifier des exigences particulières pour ma publicité ?</h3>
                    <p>Absolument ! Notre formulaire comprend une section pour les messages ou demandes spécifiques où vous pouvez détailler toutes exigences particulières ou recommandations pour votre campagne publicitaire.</p>
                </div>
                <div className={`faq-item ${activeIndex === 9 ? 'active' : ''}`} onClick={() => handleToggle(9)}>
                    <h3>Dans quel format ma bannière publicitaire doit-elle être ?</h3>
                    <p>Les bannières publicitaires doivent être soumises en formats d'image haute résolution (JPEG, PNG) avec des dimensions appropriées pour l'emplacement choisi. Notre équipe vous fournira les exigences de format spécifiques après votre soumission initiale.</p>
                </div>
                <div className={`faq-item ${activeIndex === 10 ? 'active' : ''}`} onClick={() => handleToggle(10)}>
                    <h3>Quels formats vidéo acceptez-vous pour les vidéos promotionnelles ?</h3>
                    <p>Nous acceptons la plupart des formats vidéo standard (MP4, MOV, AVI) avec une résolution recommandée d'au moins 1080p. Les vidéos devraient généralement durer entre 15 et 60 secondes, selon l'emplacement.</p>
                </div>
                <div className={`faq-item ${activeIndex === 11 ? 'active' : ''}`} onClick={() => handleToggle(11)}>
                    <h3>Combien de temps faut-il pour examiner ma demande publicitaire ?</h3>
                    <p>Nous examinons généralement les demandes publicitaires dans un délai de 2 à 3 jours ouvrables. Les campagnes complexes peuvent nécessiter un temps d'évaluation supplémentaire.</p>
                </div>
                <div className={`faq-item ${activeIndex === 12 ? 'active' : ''}`} onClick={() => handleToggle(12)}>
                    <h3>Puis-je apporter des modifications à ma publicité après son approbation ?</h3>
                    <p>Oui, vous pouvez demander des modifications à votre publicité. Cependant, des modifications importantes peuvent nécessiter un nouveau processus d'examen et pourraient affecter le calendrier de votre campagne.</p>
                </div>
                <div className={`faq-item ${activeIndex === 13 ? 'active' : ''}`} onClick={() => handleToggle(13)}>
                    <h3>Comment puis-je suivre les performances de ma publicité ?</h3>
                    <p>AdsCity fournit aux annonceurs un accès à un tableau de bord où vous pouvez surveiller des métriques clés telles que les impressions, les clics et les taux de conversion pour vos campagnes publicitaires.</p>
                </div>
                <div className={`faq-item ${activeIndex === 14 ? 'active' : ''}`} onClick={() => handleToggle(14)}>
                    <h3>Comment puis-je obtenir de l'aide pour créer ma publicité ?</h3>
                    <p>Si vous avez besoin d'aide pour créer votre publicité, notre équipe peut vous fournir des conseils ou vous mettre en relation avec des professionnels du design qui peuvent vous aider à élaborer un contenu publicitaire efficace.</p>
                </div>
                <div className={`faq-item ${activeIndex === 15 ? 'active' : ''}`} onClick={() => handleToggle(15)}>
                    <h3>Qui dois-je contacter si j'ai des questions sur ma campagne publicitaire ?</h3>
                    <p>Pour toute question concernant votre campagne publicitaire, vous pouvez contacter notre équipe de support publicitaire à <a href="mailto:business@adscity.net">business@adscity.net</a> ou via le formulaire de contact sur notre site web</p>
                </div>
                <div className={`faq-item ${activeIndex === 16 ? 'active' : ''}`} onClick={() => handleToggle(16)}>
                    <h3>Comment puis-je commencer à faire de la publicité sur AdsCity ?</h3>
                    <p>Pour commencer à faire de la publicité sur AdsCity, il vous suffit de remplir notre formulaire publicitaire avec les informations de votre entreprise et vos préférences publicitaires. Notre équipe examinera votre soumission et vous contactera pour finaliser les détails de votre campagne.</p>
                </div>
                <div className={`faq-item ${activeIndex === 17 ? 'active' : ''}`} onClick={() => handleToggle(17)}>
                    <h3>Y a-t-il une exigence de budget minimum pour la publicité sur AdsCity ?</h3>
                    <p>Bien que nous nous adaptions à différentes tailles de budget, il existe des exigences minimales basées sur le type de publicité et l'emplacement. Contactez notre équipe commerciale pour connaître les tarifs actuels.</p>
                </div>
                <div className={`faq-item ${activeIndex === 18 ? 'active' : ''}`} onClick={() => handleToggle(18)}>
                    <h3>Puis-je tester une campagne publicitaire avant de m'engager pour une durée plus longue ?</h3>
                    <p>Oui, nous proposons des options publicitaires à court terme qui vous permettent de tester l'efficacité de votre campagne avant de vous engager pour une durée plus longue.</p>
                </div>
            </div>
        </div>
    );
};
