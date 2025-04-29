import { calculateEndDate } from '../func';
import { faBell, faBullhorn, faChartLine, faCirclePlay, faFolder, faHeartCircleCheck, faUserCircle } from '@fortawesome/free-solid-svg-icons';

const userSidebarData = (language, userPlan, hasDocument) => {
    const items = [
        { id: 'panel', name: language === 'FR' ? 'Panel' : 'Panel', icon: faChartLine, path: '/user/dashboard/panel' },
        { id: 'posts', name: language === 'FR' ? 'Annonces' : 'Ads', icon: faBullhorn, path: '/user/dashboard/posts' },
        { id: 'favoris', name: language === 'FR' ? 'Favoris' : 'Favorites', icon: faHeartCircleCheck, path: "/user/dashboard/favoris" },
        { id: 'notifications', name: language === 'FR' ? 'Notifications' : 'Notifications', icon: faBell, path: "/user/dashboard/notifications", badge: 0 },
        { id: 'profile', name: language === 'FR' ? 'Profile' : 'Profile', icon: faUserCircle, path: "/user/dashboard/profile" },
    ];

    // Add status item only for paid plans
    if (userPlan && !userPlan === 'Particulier') { // userPlan shall be equal to 'Particulier'
        items.splice(3, 0, {
            id: 'status',
            name: language === 'FR' ? 'Statuts' : 'Status',
            icon: faCirclePlay,
            path: "/user/dashboard/status"
        });
    }

    // Add document item only if user has a document
    if (hasDocument) {
        items.splice(4, 0, {
            id: 'documents',
            name: language === 'FR' ? 'Document' : 'Document',
            icon: faFolder,
            path: "/user/dashboard/documents",
            badge: 0
        });
    }

    return items;
};



const plans = [
    {
        id: 'basic',
        name: "Basic Package",
        duration: '7 Jours',
        price: null,
        adsLimit: 1,
        photoLimit: 5,
        startDate: new Date().toISOString(),
        endDate: calculateEndDate('7 Jours'),
        adsPosted: 0,
        isPaid: true, // Free plan, no payment required
    },
    {
        id: 'standard',
        name: "Standard Package",
        duration: 'Mois',
        price: 15,
        adsLimit: 10,
        photoLimit: 10,
        startDate: new Date().toISOString(),
        endDate: calculateEndDate('Mois'),
        adsPosted: 0,
        isPaid: false, // Payment required
    },
    {
        id: 'premium',
        name: "Premium Package",
        duration: '3 Mois',
        price: 55,
        adsLimit: 20,
        photoLimit: 15,
        startDate: new Date().toISOString(),
        endDate: calculateEndDate('3 Mois'),
        adsPosted: 0,
        isPaid: false, // Payment required
    },
];


const tabs = [
    { id: 'active', label: 'Actives', icon: faChartLine, count: 0 },
    { id: 'outdated', label: 'Expirées', icon: faChartLine, count: 0 },
];


const securityAdvice = {
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

export {
    plans,
    tabs,
    securityAdvice,
    userSidebarData,
};
