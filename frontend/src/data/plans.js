export const plans = [
    {
        id: 1,
        name: "Atchèbê",
        price: 0,
        validity_days: 10,
        max_ads: 3,
        max_photos: 3,
        visibility: "Basique",
        support: "Basique",
        content: {
            ads_num: 'Limité',
            cost_plan: 'Gratuit',
            ads_visible: 'Standard',
            support_client: 'Basique',
            stat_performance: 'Non',
            tool_manage_ads: 'Oui',
            personalize: 'Partielle',
            credibility: 'Moyenne',
            ads_status: 'Non inclus',
        }
    },
    {
        id: 2,
        name: "Chap-Chap",
        price: 399,
        validity_days: 30,
        max_ads: 10,
        max_photos: 5,
        visibility: "Améliorée",
        support: "Prioritaire",
        content: {
            ads_num: 'Moyen',
            cost_plan: 'Moyen à élevé',
            ads_visible: 'Boostée',
            support_client: 'Prioritaire',
            stat_performance: 'Basique',
            tool_manage_ads: 'Oui',
            personalize: 'Moyenne',
            credibility: 'Bonne',
            ads_status: 'Non inclus',
        }
    },
    {
        id: 3,
        name: "Djassaman",
        price: 599,
        validity_days: 45,
        max_ads: 20,
        max_photos: 10,
        visibility: "Premium",
        support: "VIP",
        content: {
            ads_num: 'illimité',
            cost_plan: 'Élevé',
            ads_visible: 'Maximum',
            support_client: 'VIP',
            stat_performance: 'Avancé',
            tool_manage_ads: 'Oui',
            personalize: 'Complète',
            credibility: 'Excellente',
            ads_status: 'Inclus : 5x, 24h/durée',
        }
    },
    {
        id: 4,
        name: "Businessman",
        price: 999,
        validity_days: 60,
        max_ads: 30,
        max_photos: 15,
        visibility: "Premium",
        support: "VIP",
        content: {
            ads_num: 'illimité',
            cost_plan: 'Élevé',
            ads_visible: 'Maximum',
            support_client: 'VIP',
            stat_performance: 'Avancé',
            tool_manage_ads: 'Oui',
            personalize: 'Complète',
            credibility: 'Excellente',
            ads_status: 'Inclus : 10x, 24h/durée',
        }
    }
]; 

export const forfaits = [
    {
        id: "free",
        name: "Atchèbê",
        displayName: "Atchèbê",
        tagline: "Démarrez gratuitement",
        price: 0,
        currency: "RUB",
        billing: "one-time",
        validity: {
            days: 10,
            label: "10 jours"
        },
        popular: false,
        limits: {
            ads: 3,
            photos: 3,
            boosts: 0,
            duration: "10 jours"
        },
        features: [
            { id: "ads_num", label: "Nombre d'annonces", value: "3 maximum", included: true },
            { id: "ads_visible", label: "Visibilité des annonces", value: "Standard", included: true },
            { id: "support_client", label: "Support client", value: "Basique", included: true },
            { id: "tool_manage_ads", label: "Outils de gestion", value: "Basique", included: true },
            { id: "personalize", label: "Personnalisation", value: "Partielle", included: true },
            { id: "credibility", label: "Crédibilité", value: "Moyenne", included: true },
            { id: "stat_performance", label: "Statistiques de performance", value: "Non disponible", included: false },
            { id: "ads_status", label: "Boost d'annonces", value: "Non inclus", included: false }
        ],
        cta: "Commencer gratuitement",
        color: "#6c757d",
        description: "Idéal pour les particuliers qui souhaitent vendre quelques articles occasionnellement."
    },
    {
        id: "basic",
        name: "Chap-Chap",
        displayName: "Chap-Chap",
        tagline: "Pour les vendeurs réguliers",
        price: 399,
        currency: "RUB",
        billing: "one-time",
        validity: {
            days: 30,
            label: "30 jours"
        },
        popular: true,
        limits: {
            ads: 10,
            photos: 5,
            boosts: 2,
            duration: "30 jours"
        },
        features: [
            { id: "ads_num", label: "Nombre d'annonces", value: "10 maximum", included: true },
            { id: "ads_visible", label: "Visibilité des annonces", value: "Améliorée", included: true },
            { id: "support_client", label: "Support client", value: "Prioritaire", included: true },
            { id: "tool_manage_ads", label: "Outils de gestion", value: "Avancés", included: true },
            { id: "personalize", label: "Personnalisation", value: "Moyenne", included: true },
            { id: "credibility", label: "Crédibilité", value: "Bonne", included: true },
            { id: "stat_performance", label: "Statistiques de performance", value: "Basique", included: true },
            { id: "ads_status", label: "Boost d'annonces", value: "2 boosts de 24h", included: true }
        ],
        cta: "Choisir ce forfait",
        color: "#007bff",
        description: "Parfait pour les vendeurs réguliers qui souhaitent une meilleure visibilité."
    },
    {
        id: "premium",
        name: "Djassaman",
        displayName: "Djassaman",
        tagline: "Pour les professionnels",
        price: 599,
        currency: "RUB",
        billing: "one-time",
        validity: {
            days: 45,
            label: "45 jours"
        },
        popular: false,
        limits: {
            ads: 20,
            photos: 10,
            boosts: 5,
            duration: "45 jours"
        },
        features: [
            { id: "ads_num", label: "Nombre d'annonces", value: "20 maximum", included: true },
            { id: "ads_visible", label: "Visibilité des annonces", value: "Premium", included: true },
            { id: "support_client", label: "Support client", value: "VIP", included: true },
            { id: "tool_manage_ads", label: "Outils de gestion", value: "Complets", included: true },
            { id: "personalize", label: "Personnalisation", value: "Complète", included: true },
            { id: "credibility", label: "Crédibilité", value: "Excellente", included: true },
            { id: "stat_performance", label: "Statistiques de performance", value: "Avancées", included: true },
            { id: "ads_status", label: "Boost d'annonces", value: "5 boosts de 24h", included: true }
        ],
        cta: "Choisir ce forfait",
        color: "#28a745",
        description: "Idéal pour les professionnels qui veulent maximiser leur présence sur la plateforme."
    },
    {
        id: "business",
        name: "Businessman",
        displayName: "Businessman",
        tagline: "Solution entreprise",
        price: 999,
        currency: "RUB",
        billing: "one-time",
        validity: {
            days: 60,
            label: "60 jours"
        },
        popular: false,
        limits: {
            ads: 30,
            photos: 15,
            boosts: 10,
            duration: "60 jours"
        },
        features: [
            { id: "ads_num", label: "Nombre d'annonces", value: "30 maximum", included: true },
            { id: "ads_visible", label: "Visibilité des annonces", value: "Premium+", included: true },
            { id: "support_client", label: "Support client", value: "VIP Dédié", included: true },
            { id: "tool_manage_ads", label: "Outils de gestion", value: "Professionnels", included: true },
            { id: "personalize", label: "Personnalisation", value: "Complète", included: true },
            { id: "credibility", label: "Crédibilité", value: "Excellente", included: true },
            { id: "stat_performance", label: "Statistiques de performance", value: "Professionnelles", included: true },
            { id: "ads_status", label: "Boost d'annonces", value: "10 boosts de 24h", included: true }
        ],
        cta: "Contacter les ventes",
        color: "#6f42c1",
        description: "Solution complète pour les entreprises avec un volume important d'annonces."
    }
];
