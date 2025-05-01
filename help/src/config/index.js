import { CreditCard, FileText, Megaphone, ShieldCheck, Store, User } from 'lucide-react';

export const textBlueWithoutBg = require('../assets/icons/blue-no-bg.png');
export const letterWhiteBgBlue = require('../assets/icons/logo-letter-bg.png');
export const letterBlueBgWhite = require('../assets/icons/logo-letter-light.png');
export const textWhiteBgBlue = require('../assets/icons/logo-text-bg.png');
export const textBlueBgWhite = require('../assets/icons/logo-text-light.png');
export const textWhiteWithoutBg = require('../assets/icons/white-no-bg.png');


export const helpCategories = [
    {
        title: 'Compte',
        description: 'Gérer votre profil, vos informations et préférences.',
        icon: <User size={32} />,
        link: 'account'
    },
    {
        title: 'Annonces',
        description: 'Créer, modifier, marquer comme vendu ou supprimer vos annonces.',
        icon: <FileText size={32} />,
        link: 'posts'
    },
    {
        title: 'Boutiques',
        description: 'Créer et gérer vos boutiques pour présenter vos produits et services.',
        icon: <Store size={32} />,
        link: 'stores'
    },
    {
        title: 'Paiements',
        description: 'Comprendre les méthodes de paiement et facturation.',
        icon: <CreditCard size={32} />,
        link: 'payments'
    },
    {
        title: 'Publicités',
        description: 'Découvrez comment promouvoir votre entreprise sur AdsCity.',
        icon: <Megaphone size={32} /> ,
        link: 'pubs'
    },
    {
        title: 'Sécurité',
        description: 'Protégez votre compte et signalez les activités suspectes.',
        icon: <ShieldCheck size={32} />,
        link: 'safety'
    },
];

export const securityAdvice = {
    title: "Conseils de Sécurité",
    sections: [
        {
            title: "Transactions Sécurisées",
            tips: [
                "Privilégiez les paiements sécurisés",
                "Méfiez-vous des prix anormalement bas",
                "Ne communiquez jamais vos informations bancaires",
                "Évitez les virements bancaires directs"
            ]
        },
        {
            title: "Rencontres en Personne",
            tips: [
                "Choisissez un lieu public et fréquenté",
                "Venez accompagné si possible",
                "Effectuez les échanges en journée",
                "Vérifiez le produit avant la transaction"
            ]
        },
        {
            title: "Protection des Données",
            tips: [
                "Utilisez un mot de passe unique et complexe",
                "Ne partagez jamais vos identifiants",
                "Vérifiez régulièrement vos transactions",
                "Activez l'authentification à deux facteurs"
            ]
        },
        {
            title: "Signaux d'Alerte",
            tips: [
                "Vendeur pressant pour finaliser rapidement",
                "Demande de paiement par des cannaux non sécurisés",
                "Communication irrégulière ou agressive",
                "Refus de rencontre en personne sans raison valable"
            ]
        }
    ],
    emergency: {
        title: "En cas de problème",
        contacts: [
            "Service client: support@adscity.net",
            "Signalement: Bouton 'Signaler' sur l'annonce"
        ]
    }
};