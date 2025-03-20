import React, { useEffect } from 'react';
import '../../styles/PrivacyPage.scss';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebaseConfig';

export default function PrivacyPage() {
    useEffect(() => {
        logEvent(analytics, 'page_view', { page_path: '/privacy' });
    }, [])

    return (
        <div className='privacy'>
            <h1>Politique de Confidentialité</h1>
            <p>Dernière mise à jour: 12 Décembre 2024</p>

            <p>Cette Politique de confidentialité décrit Nos politiques et procédures sur la collecte, l'utilisation et la divulgation de Vos informations lorsque Vous utilisez le Service et Vous informe de Vos droits à la vie privée et de la manière dont la loi Vous protège.</p>
            <p>Nous utilisons vos données personnelles pour fournir et améliorer le Service. En utilisant le Service, Vous acceptez la collecte et l'utilisation des informations conformément à la présente Politique de confidentialité.</p>

            <h2>Interprétation et Définitions</h2>

            <h3>Interprétation</h3>
            <p>Les mots dont la lettre initiale est en majuscule ont des significations définies dans les conditions suivantes. Les définitions suivantes ont la même signification, qu'elles apparaissent au singulier ou au pluriel.</p>
            <h3>Définitions</h3>
            <p>Aux fins de la présente Politique de confidentialité:</p>
            <ul>
                <li>
                    <p><strong>Compte</strong> désigne un compte unique créé pour Vous permettre d'accéder à notre Service ou à des parties de notre Service.</p>
                </li>
                <li>
                    <p><strong>Affilié</strong> désigne une entité qui contrôle, est contrôlée par ou est sous contrôle commun avec une partie, où "contrôle" signifie la propriété de 50% ou plus des actions, des participations ou d'autres titres habilités à voter pour l'élection des administrateurs ou d'une autre autorité de gestion.</p>
                </li>
                <li>
                    <p><strong>Société</strong> (dénommée "la Société", "Nous", "Notre" ou "Nos" dans le présent Contrat) fait référence à AdsCity.</p>
                </li>
                <li>
                    <p><strong>Les cookies</strong> sont de petits fichiers qui sont placés sur Votre ordinateur, appareil mobile ou tout autre appareil par un site Web, contenant les détails de Votre historique de navigation sur ce site parmi ses nombreuses utilisations.</p>
                </li>
                <li>
                    <p><strong>Pays</strong> se réfère à: Russie</p>
                </li>
                <li>
                    <p><strong>Appareil</strong> désigne tout appareil pouvant accéder au Service, tel qu'un ordinateur, un téléphone portable ou une tablette numérique.</p>
                </li>
                <li>
                    <p><strong>Les données personnelles</strong> sont toutes les informations qui se rapportent à une personne identifiée ou identifiable.</p>
                </li>
                <li>
                    <p><strong>Service</strong> désigne le site Web.</p>
                </li>
                <li>
                    <p><strong>Fournisseur de services</strong> désigne toute personne physique ou morale qui traite les données pour le compte de la Société. Il s'agit de sociétés tierces ou de personnes employées par la Société pour faciliter le Service, fournir le Service au nom de la Société, fournir des services liés au Service ou aider la Société à analyser l'utilisation du Service.</p>
                </li>
                <li>
                    <p><strong>Les Données d'utilisation</strong> désignent les données collectées automatiquement, soit générées par l'utilisation du Service, soit à partir de l'infrastructure du Service elle-même (par exemple, la durée d'une visite de page).</p>
                </li>
                <li>
                    <p><strong>Site Web</strong> se réfère à AdsCity, accessible à partir de <a href="https://adscity.net/" target="_blank" rel="noopener noreferrer">https://adscity.net/</a></p>
                </li>
                <li>
                    <p><strong>Vous</strong> désigne la personne accédant ou utilisant le Service, ou la société, ou toute autre entité juridique au nom de laquelle cette personne accède ou utilise le Service, selon le cas.</p>
                </li>
            </ul>

            <h2>Collecte et Utilisation de Vos Données Personnelles</h2>

            <h3>Types de Données Collectées</h3>
            <h4>Données Personnelles</h4>
            <p>Lors de l'utilisation de Notre Service, Nous pouvons Vous demander de Nous fournir certaines informations personnellement identifiables qui peuvent être utilisées pour Vous contacter ou Vous identifier. Les informations personnellement identifiables peuvent inclure, mais ne sont pas limitées à:</p>
            <ul>
                <li>
                    <p>Adresse e-mail</p>
                </li>
                <li>
                    <p>Prénom et nom</p>
                </li>
                <li>
                    <p>Numéro de téléphone</p>
                </li>
                <li>
                    <p>État, Ville, Adresse</p>
                </li>
                <li>
                    <p>Données d'Utilisation</p>
                </li>
            </ul>
            <h4>Données d'Utilisation</h4>
            <p>Les données d'utilisation sont collectées automatiquement lors de l'utilisation du Service.</p>
            <p>Les Données d'utilisation peuvent inclure des informations telles que l'adresse de protocole Internet de votre Appareil (par exemple, l'adresse IP), le type de navigateur, la version du navigateur, les pages de notre Service que Vous visitez, l'heure et la date de Votre visite, le temps passé sur ces pages, identifiants uniques de l'appareil et autres données de diagnostic.</p>
            <p>Lorsque Vous accédez au Service par ou via un appareil mobile, Nous pouvons collecter automatiquement certaines informations, y compris, mais sans s'y limiter, le type d'appareil mobile que Vous utilisez, l'identifiant unique de Votre appareil mobile, l'adresse IP de Votre appareil mobile, Votre système d'exploitation mobile, le type de navigateur Internet mobile Que Vous utilisez, les identifiants uniques de l'appareil et d'autres données de diagnostic.</p>
            <p>Nous pouvons également collecter des informations que Votre navigateur envoie chaque fois que Vous visitez notre Service ou lorsque Vous accédez au Service par ou via un appareil mobile.</p>

            <h4>Technologies de suivi et Cookies</h4>
            <p>Nous utilisons des cookies et des technologies de suivi similaires pour suivre l'activité sur Notre Service et stocker certaines informations. Les technologies de suivi utilisées sont des balises, des balises et des scripts pour collecter et suivre des informations et pour améliorer et analyser Notre Service. Les technologies que nous utilisons peuvent inclure:</p>
            <ul>
                <li>
                    <p><strong>Cookies ou Cookies de navigateur.</strong> Un cookie est un petit fichier placé sur Votre Appareil. Vous pouvez demander à votre navigateur de refuser tous les Cookies ou d'indiquer quand un Cookie est envoyé. Cependant, si Vous n'acceptez pas les Cookies, Vous ne pourrez peut-être pas utiliser certaines parties de notre Service. À moins que vous n'ayez ajusté les paramètres de votre navigateur pour qu'il refuse les Cookies, notre Service peut utiliser des Cookies.</p>
                </li>
                <li>
                    <p><strong>Balises Web.</strong> Certaines sections de notre Service et de nos courriels peuvent contenir de petits fichiers électroniques appelés balises Web (également appelés GIF invisibles, balises pixel et GIF à pixel unique) qui permettent à la Société, par exemple, de compter les utilisateurs qui ont visité ces pages ou ouvert un courriel et pour d'autres statistiques connexes sur le site Web (par exemple, enregistrer la popularité d'une certaine section et vérifier l'intégrité du système et du serveur).</p>
                </li>
            </ul>
            <p>Les cookies peuvent être des Cookies "persistants" ou "de session". Les cookies persistants restent sur Votre ordinateur personnel ou Votre appareil mobile lorsque Vous Vous déconnectez, tandis que les Cookies de session sont supprimés dès que Vous fermez Votre navigateur Web.</p>
            <p>Nous utilisons à la fois des Cookies de session et des Cookies persistants aux fins énoncées ci-dessous:</p>
            <ul>
                <li>
                    <p><strong>Cookies Nécessaires / Essentiels</strong></p>
                    <p>Type: Cookies de session</p>
                    <p>Administré par: Nous</p>
                    <p>Finalité: Ces Cookies sont essentiels pour Vous fournir les services disponibles sur le Site Web et pour Vous permettre d'utiliser certaines de ses fonctionnalités. Ils aident à authentifier les utilisateurs et à empêcher l'utilisation frauduleuse des comptes d'utilisateurs. Sans ces Cookies, les services que Vous avez demandés ne peuvent pas être fournis, et Nous n'utilisons ces Cookies que pour Vous fournir ces services.</p>
                </li>
                <li>
                    <p><strong>Politique de Cookies / Avis d'Acceptation des Cookies</strong></p>
                    <p>Type: Cookies persistants</p>
                    <p>Administré par: Nous</p>
                    <p>Finalité: Ces Cookies identifient si les utilisateurs ont accepté l'utilisation de cookies sur le site Web.</p>
                </li>
                <li>
                    <p><strong>Cookies de Fonctionnalité</strong></p>
                    <p>Type: Cookies persistants</p>
                    <p>Administré par: Nous</p>
                    <p>Objectif: Ces Cookies nous permettent de mémoriser les choix que vous faites lorsque vous utilisez le site Web, tels que la mémorisation de vos informations de connexion ou de votre préférence linguistique. Le but de ces Cookies est de Vous offrir une expérience plus personnelle et de Vous éviter d'avoir à ressaisir vos préférences chaque fois que Vous utilisez le Site Web.</p>
                </li>
            </ul>
            <p>Pour plus d'informations sur les cookies que nous utilisons et vos choix concernant les cookies, veuillez consulter notre Politique de cookies ou la section Cookies de notre Politique de confidentialité.</p>

            <h3>Utilisation de Vos Données Personnelles</h3>
            <p>La Société peut utiliser les Données personnelles aux fins suivantes:</p>
            <ul>
                <li>
                    <p><strong>Pour fournir et maintenir notre Service</strong>, y compris pour surveiller l'utilisation de notre Service.</p>
                </li>
                <li>
                    <p><strong>Pour gérer Votre Compte</strong>: pour gérer Votre inscription en tant qu'utilisateur du Service. Les Données personnelles que Vous fournissez peuvent Vous donner accès à différentes fonctionnalités du Service qui sont à Votre disposition en tant qu'utilisateur enregistré.</p>
                </li>
                <li>
                    <p><strong>Pour l'exécution d'un contrat</strong>: le développement, le respect et l'exécution du contrat d'achat des produits, articles ou services que Vous avez achetés ou de tout autre contrat avec Nous par le biais du Service.</p>
                </li>
                <li>
                    <p><strong>Pour vous contacter</strong>: Pour Vous contacter par e-mail, appels téléphoniques, SMS ou autres formes équivalentes de communication électronique, telles que les notifications push d'une application mobile concernant les mises à jour ou les communications informatives relatives aux fonctionnalités, produits ou services souscrits, y compris les mises à jour de sécurité, lorsque cela est nécessaire ou raisonnable pour leur mise en œuvre.</p>
                </li>
                <li>
                    <p><strong>Pour vous fournir</strong> des actualités, des offres spéciales et des informations générales sur d'autres biens, services et événements que nous proposons et qui sont similaires à ceux que vous avez déjà achetés ou pour lesquels vous vous êtes déjà renseigné, sauf si vous avez choisi de ne pas recevoir ces informations.</p>
                </li>
                <li>
                    <p><strong>Pour gérer Vos demandes</strong>: Pour assister et gérer Vos demandes auprès de Nous.</p>
                </li>
                <li>
                    <p><strong>Pour les transferts d'entreprise</strong>: Nous pouvons utiliser Vos informations pour évaluer ou mener une fusion, une cession, une restructuration, une réorganisation, une dissolution ou toute autre vente ou transfert de tout ou partie de Nos actifs, que ce soit en exploitation ou dans le cadre d'une faillite, d'une liquidation ou d'une procédure similaire, dans laquelle les Données personnelles que Nous détenons sur nos utilisateurs de Services font partie des actifs transférés.</p>
                </li>
                <li>
                    <p><strong>À d'autres fins</strong>: Nous pouvons utiliser vos informations à d'autres fins, telles que l'analyse des données, l'identification des tendances d'utilisation, la détermination de l'efficacité de nos campagnes promotionnelles et pour évaluer et améliorer notre Service, nos produits, nos services, notre marketing et votre expérience.</p>
                </li>
            </ul>
            <p>Nous pouvons partager vos informations personnelles dans les situations suivantes:</p>
            <ul>
                <li>
                    <p><strong>Avec des Prestataires de services</strong>: Nous pouvons partager Vos informations personnelles avec des Prestataires de Services pour surveiller et analyser l'utilisation de notre Service, pour vous contacter.</p>
                </li>
                <li>
                    <p><strong>Pour les transferts d'entreprise</strong>: Nous pouvons partager ou transférer Vos informations personnelles dans le cadre de, ou pendant les négociations de, toute fusion, vente d'actifs de la Société, financement ou acquisition de tout ou partie de Nos activités à une autre société.</p>
                </li>
                <li>
                    <p><strong>Avec les affiliés</strong>: Nous pouvons partager Vos informations avec Nos affiliés, auquel cas nous exigerons que ces affiliés respectent cette Politique de confidentialité. Les sociétés affiliées comprennent Notre société mère et toutes les autres filiales, partenaires de coentreprise ou autres sociétés que Nous contrôlons ou qui sont sous contrôle commun avec Nous.</p>
                </li>
                <li>
                    <p><strong>Avec des partenaires commerciaux</strong>: Nous pouvons partager Vos informations avec Nos partenaires commerciaux pour Vous proposer certains produits, services ou promotions.</p>
                </li>
                <li>
                    <p><strong>Avec d'autres utilisateurs</strong>: lorsque Vous partagez des informations personnelles ou interagissez autrement dans les espaces publics avec d'autres utilisateurs, ces informations peuvent être consultées par tous les utilisateurs et peuvent être diffusées publiquement à l'extérieur.</p>
                </li>
                <li>
                    <p><strong>Avec votre consentement</strong>: Nous pouvons divulguer Vos informations personnelles à toute autre fin avec Votre consentement.</p>
                </li>
            </ul>

            <h3>Conservation de Vos Données Personnelles</h3>
            <p>La Société ne conservera Vos Données Personnelles que le temps nécessaire aux fins énoncées dans la présente Politique de confidentialité. Nous conserverons et utiliserons Vos Données personnelles dans la mesure nécessaire pour nous conformer à nos obligations légales (par exemple, si nous sommes tenus de conserver vos données pour nous conformer aux lois applicables), résoudre les litiges et appliquer nos accords et politiques juridiques.</p>
            <p>La Société conservera également les Données d'utilisation à des fins d'analyse interne. Les données d'utilisation sont généralement conservées pendant une période plus courte, sauf lorsque ces données sont utilisées pour renforcer la sécurité ou pour améliorer la fonctionnalité de Notre Service, ou que Nous sommes légalement tenus de conserver ces données pendant des périodes plus longues.</p>

            <h3>Transfert de Vos Données Personnelles</h3>
            <p>Vos informations, y compris les Données personnelles, sont traitées dans les bureaux d'exploitation de la Société et dans tout autre lieu où se trouvent les parties impliquées dans le traitement. Cela signifie que ces informations peuvent être transférées et conservées sur des ordinateurs situés en dehors de Votre état, province, pays ou autre juridiction gouvernementale où les lois sur la protection des données peuvent différer de celles de Votre juridiction.</p>
            <p>Votre consentement à la présente Politique de confidentialité suivi de Votre soumission de ces informations représente Votre accord à ce transfert.</p>
            <p>La Société prendra toutes les mesures raisonnablement nécessaires pour faire en sorte que Vos données soient traitées de manière sécurisée et conformément à la présente Politique de Confidentialité et Vos Données à Caractère Personnel ne seront transférées vers aucune organisation ni aucun pays à moins que des contrôles adéquats ne soient en place, notamment en ce qui concerne la sécurité de Vos données et d'autres données personnelles.</p>

            <h3>Supprimer Vos Données Personnelles</h3>
            <p>Vous avez le droit de supprimer ou de demander que Nous Vous aidions à supprimer les Données personnelles que Nous avons collectées à Votre sujet.</p>
            <p>Notre Service peut Vous donner la possibilité de supprimer certaines informations Vous concernant au sein du Service.</p>
            <p>Vous pouvez mettre à jour, modifier ou supprimer Vos informations à tout moment en vous connectant à Votre Compte, si vous en avez un, et en visitant la section des paramètres du compte qui vous permet de gérer Vos informations personnelles. Vous pouvez également Nous contacter pour demander l'accès à, corriger ou supprimer toute information personnelle que Vous Nous avez fournie.</p>
            <p>Veuillez noter, cependant, que Nous pouvons avoir besoin de conserver certaines informations lorsque nous avons une obligation légale ou une base légale de le faire.</p>

            <h3>Divulgation de Vos Données Personnelles</h3>

            <h4>Transactions Commerciales</h4>
            <p>Si la Société est impliquée dans une fusion, une acquisition ou une vente d'actifs, Vos Données personnelles peuvent être transférées. Nous vous informerons avant que Vos Données personnelles ne soient transférées et ne soient soumises à une Politique de confidentialité différente.</p>

            <h4>Application de la loi</h4>
            <p>Dans certaines circonstances, la Société peut être tenue de divulguer Vos Données personnelles si la loi l'exige ou en réponse à des demandes valides des autorités publiques (par exemple, un tribunal ou un organisme gouvernemental).</p>

            <h4>Autres exigences légales</h4>
            <p>La Société peut divulguer Vos Données Personnelles en croyant de bonne foi qu'une telle action est nécessaire pour:</p>
            <ul>
                <li>
                    <p>Se conformer à une obligation légale</p>
                </li>
                <li>
                    <p>Protéger et défendre les droits ou les biens de la Société</p>
                </li>
                <li>
                    <p>Prévenir ou enquêter sur d'éventuels actes répréhensibles en relation avec le Service</p>
                </li>
                <li>
                    <p>Protéger la sécurité personnelle des Utilisateurs du Service ou du public</p>
                </li>
                <li>
                    <p>Protection contre la responsabilité légale</p>
                </li>
            </ul>

            <h3>Sécurité de Vos Données Personnelles</h3>
            <p>La sécurité de Vos Données personnelles est importante pour Nous, mais rappelez-vous qu'aucune méthode de transmission sur Internet ou méthode de stockage électronique n'est sécurisée à 100%. Bien que Nous nous efforcions d'utiliser des moyens commercialement acceptables pour protéger Vos Données personnelles, Nous ne pouvons garantir leur sécurité absolue.</p>

            <h3>Vie privée des enfants</h3>
            <p>Notre Service ne s'adresse à personne de moins de 13 ans. Nous ne recueillons pas sciemment d'informations personnellement identifiables auprès de personnes de moins de 13 ans. Si Vous êtes un parent ou un tuteur et que Vous savez que Votre enfant Nous a fourni des Données personnelles, veuillez nous contacter. Si Nous apprenons que Nous avons collecté des Données personnelles auprès d'une personne de moins de 13 ans sans vérification du consentement parental, Nous prenons des mesures pour supprimer ces informations de Nos serveurs.</p>
            <p>Si Nous devons Nous fier au consentement comme base légale pour traiter Vos informations et que Votre pays exige le consentement d'un parent, Nous pouvons exiger le consentement de Votre parent avant de collecter et d'utiliser ces informations.</p>

            <h3>Liens vers d'autres sites Web</h3>
            <p>Notre Service peut contenir des liens vers d'autres sites Web que Nous n'exploitons pas. Si vous cliquez sur un lien tiers, Vous serez dirigé vers le site de ce tiers. Nous vous conseillons vivement de consulter la Politique de confidentialité de chaque site que Vous visitez.</p>
            <p>Nous n'avons aucun contrôle et n'assumons aucune responsabilité pour le contenu, les politiques de confidentialité ou les pratiques des sites ou services tiers.</p>

            <h3>Modifications de cette Politique de confidentialité</h3>
            <p>Nous pouvons mettre à jour Notre Politique de confidentialité de temps à autre. Nous vous informerons de tout changement en publiant la nouvelle Politique de confidentialité sur cette page.</p>
            <p>Nous Vous en informerons par e-mail et/ou par un avis bien visible sur Notre Service, avant que la modification ne prenne effet et mettrons à jour la date de "Dernière mise à jour" en haut de la présente Politique de confidentialité.</p>
            <p>Il vous est conseillé de consulter périodiquement cette Politique de confidentialité pour tout changement. Les modifications apportées à cette Politique de confidentialité entrent en vigueur lorsqu'elles sont publiées sur cette page.</p>

            <h3>Contactez-nous</h3>
            <p>Si vous avez des questions sur cette Politique de confidentialité, Vous pouvez nous contacter:</p>
            <ul>
                <li>
                    <p>Par courriel: contact@adscity.net</p>
                    <p>En visitant cette page sur notre site Web: <a href="https://adscity.net/contact-us" target="_blank" rel="noopener noreferrer">https://adscity.net/contact-us</a></p>
                </li>
            </ul>
        </div>
    );
};
