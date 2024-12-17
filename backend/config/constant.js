const PLAN_CONFIGS = {
    bronze: {
        price: 2000,
        validity_days: 30,
        max_ads: 10,
        max_photos: 9,
        visibility: "Améliorée",
        support: "24/7"
    },
    silver: {
        price: 4000,
        validity_days: 30,
        max_ads: 20,
        max_photos: 12,
        visibility: "Premium",
        support: "24/7"
    },
    gold: {
        price: 6000,
        validity_days: 30,
        max_ads: 30,
        max_photos: 15,
        visibility: "Exclusive",
        support: "24/7"
    }
};

const LAUNCH_PROMO = {
    code: 'LAUNCH2025',
    duration: '1 Month',
    isActive: true,
    startDate: '2025-01-01',
    endDate: '2025-02-01'
};

module.exports = {
    PLAN_CONFIGS,
    LAUNCH_PROMO
};