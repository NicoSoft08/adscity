import {
    FaTachometerAlt,
    FaUser,
    FaBullhorn,
    FaHeart,
    FaUserCircle,
    FaCogs,
    FaQuestionCircle,
    FaChartLine,
    FaUsers,
    FaBell,
} from 'react-icons/fa';
import { calculateEndDate } from '../func';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';

const userLeftBarContent = [
    { id: 1, name: 'Panel', selectId: 'panel', icon: FaTachometerAlt, activeIcon: FaTachometerAlt, onClick: () => { } },
    { id: 2, name: 'Compte', selectId: 'users', icon: FaUser, activeIcon: FaUser, onClick: () => { } },
    { id: 3, name: 'Annonces', selectId: 'ads', icon: FaBullhorn, activeIcon: FaBullhorn, onClick: () => { } },
    { id: 4, name: 'Favoris', selectId: 'favoris', icon: FaHeart, activeIcon: FaHeart, onClick: () => { } },
    { id: 5, name: 'Profil', selectId: 'profil', icon: FaUserCircle, activeIcon: FaUserCircle, onClick: () => { } },
    { id: 6, name: 'Paramètres', selectId: 'settings', icon: FaCogs, activeIcon: FaCogs, onClick: () => { } },
    { id: 7, name: 'Support', selectId: 'support', icon: FaQuestionCircle, activeIcon: FaQuestionCircle, onClick: () => { } },
];

const adminSidebarData = [
    { id: 1, name: "Panel", selectId: 'panel', icon: FaChartLine, activeIcon: FaChartLine, onClick: () => { } },
    { id: 2, name: "Annonces", selectId: 'ads', icon: FaBullhorn, activeIcon: FaBullhorn, onClick: () => { } },
    { id: 3, name: 'Utilisateurs', selectId: 'users', icon: FaUsers, activeIcon: FaUsers, onClick: () => { } },
    { id: 4, name: 'Profil', selectId: 'profil', icon: FaUserCircle, activeIcon: FaUserCircle, onClick: () => { } },
    { id: 5, name: "Notifications", selectId: 'notifications', icon: FaBell, activeIcon: FaBell, onClick: () => { } },
    { id: 6, name: 'Paramètres', selectId: 'settings', icon: FaCogs, activeIcon: FaCogs, onClick: () => { } },
];



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
    userLeftBarContent,
    adminSidebarData,
    plans,
    tabs,
    securityAdvice,
};
