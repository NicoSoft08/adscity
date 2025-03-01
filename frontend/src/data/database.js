import { 
    alimentation, 
    electronique, 
    mode_et_beaute, 
    services 
} from "../config/images";

export const monthNames = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
];


export const allCategories = [
    {
        key: 2,
        categoryId: 2,
        categoryTitles: {
            fr: "Électronique",
            en: "Electronics"
        },
        categoryName: 'electronique',
        categoryImage: electronique,
        container: [
            {
                id: 1,
                sousCategoryId: 200,
                sousCategoryTitles: {
                    fr: "Téléphones & Tablettes",
                    en: "Phones & Tablets",
                },
                sousCategoryName: 'telephones-et-tablettes',
                sousContainer: [],
            },
            {
                id: 2,
                sousCategoryId: 201,
                sousCategoryTitles: {
                    fr: "Ordinateurs",
                    en: "Computers",
                },
                sousCategoryName: 'ordinateurs',
                sousContainer: [],
            },
            // {
            //     id: 203,
            //     sousCategoryId: 203,
            //     sousCategoryName: "accessoires-electroniques",
            //     sousCategoryTitles: {
            //         fr: "Accessoires Électroniques",
            //         en: "Electronic Accessories",
            //     },
            //     sousContainer: [],
            // },
        ],
    },
    {
        key: 3,
        categoryId: 3,
        categoryTitles: {
            fr: "Mode & Beauté",
            en: "Fashion & Beauty"
        },
        categoryName: 'mode-et-beaute',
        categoryImage: mode_et_beaute,
        container: [
            {
                id: 3,
                sousCategoryId: 302,
                sousCategoryTitles: {
                    fr: "Montres & Bijoux",
                    en: "Watches & Jewelry",
                },
                sousCategoryName: 'montres-et-bijoux',
                sousContainer: [],
            },
            {
                id: 4,
                sousCategoryId: 303,
                sousCategoryTitles: {
                    fr: "Cosmétique & Parfums",
                    en: "Cosmetics & Perfumes",
                },
                sousCategoryName: 'cosmetiques-et-parfums',
                sousContainer: [],
            },
            {
                id: 5,
                sousCategoryId: 304,
                sousCategoryTitles: {
                    fr: "Chaussures Homme",
                    en: "Men's Shoes",
                },
                sousCategoryName: 'chaussures-homme',
                sousContainer: [],
            },
            {
                id: 6,
                sousCategoryId: 305,
                sousCategoryTitles: {
                    fr: "Chaussures Femme",
                    en: "Women's Shoes",
                },
                sousCategoryName: 'chaussures-femme',
                sousContainer: [],
            },
            {
                id: 7,
                sousCategoryId: 306,
                sousCategoryTitles: {
                    fr: "Vêtements pour adultes",
                    en: "Clothing for adults",
                },
                sousCategoryName: 'clothing-for-adults',
                sousContainer: [],
            },
            {
                id: 8,
                sousCategoryId: 307,
                sousCategoryTitles: {
                    fr: "Vêtements pour enfants",
                    en: "Clothing for children",
                },
                sousCategoryName: 'clothing-for-children',
                sousContainer: [],
            },
        ],
    },
    {
        key: 8,
        categoryId: 8,
        categoryTitles: {
            fr: "Services",
            en: "Services"
        },
        categoryName: 'services',
        categoryImage: services,
        container: [
            {
                id: 5,
                sousCategoryId: 804,
                sousCategoryTitles: {
                    fr: "Courses & Livraisons",
                    en: "Shopping & Deliveries",
                },
                sousCategoryName: 'courses-livraisons',
                sousContainer: [],
            },
            {
                id: 8,
                sousCategoryId: 807,
                sousCategoryTitles: {
                    fr: "Services Mode, Beauté & Bien-être",
                    en: "Fashion, Beauty & Wellness Services",
                },
                sousCategoryName: 'services-mode-beaute-et-bien-etre',
                sousContainer: [],
            },
        ],
    },
    {
        key: 11,
        categoryId: 11,
        categoryTitles: {
            fr: "Nutrition",
            en: "Nutrition",
        },
        categoryName: 'nutrition',
        categoryImage: alimentation,
        container: [
            {
                id: 1,
                sousCategoryId: 1101,
                sousCategoryTitles: {
                    fr: "Produits Vivriers Locaux",
                    en: "Local Food Products",
                },
                sousCategoryName: 'produits-locaux',
                sousContainer: [],
            },
        ],
    }
];

export const businessCategory = [
    "Service Automobile", "Mode et Vêtements", "Arts et Spectacles",
    "Beauté, Cosmétique et Soins Personnels", "Éducation",
    "Planificateur d'Événements", "Finances", "Épicerie", "Hôtel",
    "Médical & Santé", "Restauration", "Achats et Vente au Détail",
    "Immobilier",
];

export const businessCategoryId = [
    "service-automobile", "mode-et-vetements", "arts-et-spectacles",
    "beaute-cosmetique-et-soins-personnels", "education",
    "planificateur-devenements", "finances", "epicerie", "hotel",
    "medical-sante", "restauration", "achats-et-vente-au-detail",
    "immobilier",
];
export const dishesStuff = {
    fr: ["en porcelaine", "en faïence", "en verre", " de grès", "en terre cuite", "de mélamine"],
    en: ["porcelain", "earthenware", "glass", "stoneware", "terracotta", "melamine"]
}


export const computerOS = {
    fr: ["Windows", "macOS", "Linux"],
    en: ["Windows", "macOS", "Linux"],
}

export const smartphoneOS = {
    fr: ["Android", "iOS"],
    en: ["Android", "iOS"],
}

export const smartphoneState = {
    fr: ["Neuf", "Utilisé", "Reconditionné"],
    en: ["new", "Used", "Refurbished"],
}


export const jewelryCategories = {
    fr: ["Montre", "Bracelet", "Collier", "Bague", "Boucles d'oreilles", "Gourmettes"],
    en: ["Watch", "Bracelet", "Necklace", "Ring", "Earrings", "Bracelets"]
}

export const jewelsMaterials = {
    fr: ["Acier inoxydable", "Argent", "Or", "Cuir", "Platine"],
    en: ["Stainless steel", "Silver", "Gold", "Leather", "Platinum"]
}

export const stoneTypes = {
    fr: ["Diamant", "Rubis", "Saphir", "Émeraude"],
    en: ["Diamond", "Ruby", "Sapphire", "Emerald"]
}

export const jewelsGender = {
    fr: ["Homme", "Femme", "Unisexe"],
    en: ["Man", "Woman", "Unisex"],
}

export const elderGender = {
    fr: ["Homme", "Femme", "Unisexe"],
    en: ["Man", "Woman", "Unisex"],
}

export const childGender = {
    fr: ["Garçon", "Fille", "Unisexe"],
    en: ["Boy", "Girl", "Unisexe"],
}

export const childAge = {
    fr: ["0-2 ans", "3-5 ans", "6-8 ans", "9-12 ans", "13-18 ans"],
    en: ["0-2 years", "3-5 years", "6-8 years", "9-12 years", "13-18 years"],
}

export const childClothingCategory = {
    fr: ["T-Shirt", "Pantalon", "Veste", "Pull", "Jeans", "Short", "Blouson", "Pyjama", "Robe", "Jupe", "T-Shirt", "Blouse", "Pantalon", "Short", "Cardigan", "Pyjama", "T-Shirt", "Pantalon", "Pull", "Jeans", "Pyjama", "Salopette", "Body"],
    en: ["T-Shirt", "Pants", "Jacket", "Sweater", "Jeans", "Shorts", "Blazer", "Pajamas", "Dress", "Skirt", "T-Shirt", "Blouse", "Pants", "Shorts", "Cardigan", "Pajamas", "T-Shirt", "Pants", "Sweater", "Jeans", "Pajamas", "Overalls", "Onesie"]
}

export const elderClothingCategory = {
    fr: ["Chemise", "Pantalon", "Veste", "Costume", "T-Shirt", "T-Short", "Pull", "Jeans", "Robe", "Jupe", "Blouse", "Chemisier"],
    en: ["Shirt", "Pants", "Jacket", "Suit", "T-Shirt", "T-Short", "Sweater", "Jeans", "Dress", "Skirt", "Pants", "Blouse", "Blouse"]
}


export const clotheSize = {
    fr: ["S", "M", "L", "XL", "XXL", "3XL"],
    en: ["S", "M", "L", "XL", "XXL", "3XL"],
}

export const clotheStuff = {
    fr: ["Coton", "Polyester", "Laine", "Soie"],
    en: ["Cotton", "Polyester", "Wool", "Silk"],
}

export const currency = {
    fr: ["XOF", "RUB"],
    en: ["XOF", "RUB"]
}

export const typeOfPrice = {
    fr: [
        "Prix fixe", "Prix négociable", 
        // "Gratuit", 
        "Prix à partir de", 
        // "Appeler pour un prix"
    ],
    en: [
        "Fixed price", "Negotiable price", 
        // "Free of charge", 
        "Price from", 
        // "Call for a price"
    ],
}


export const unitOfMeasureOptions = {
    fr: ["Kilogrammes (kg)", "Pièces", "Litres (L)"],
    en: ["Kilogrammes (kg)", "Pieces", "Litres (L)"]
}

export const serviceTypeOptions = {
    fr: ["Livraison de colis", "Transport express", "Achats personnels"],
    en: ["Delivery", "Express", "Personal shopping"]
}

export const deliveryOptions  = {
    fr: ["À domicile", "Point relais", "Retrait en magasin"],
    en: ["Home delivery", "Relay point", "Store pickup"]
}

export const beautyServiceOptions = {
    fr: ["Coiffure", "Maquillage", "Soins du visage", "Massage", "Manucure et Pédicure"],
    en: ["Hair dressing", "Makeup", "Facial", "Massage", "Manicure and Pedicure"]
}

export const beautyAdditionalFeatures = {
    fr: ["Service à domicile", "Sur réservation uniquement", "Utilisation de produits naturels"],
    en: ["Home service", "Reservation only", "Natural products"]
}

export const typeOfFuel = {
    fr: ["Electrique", "Essence", "Diesel", "Hybride"],
    en: ["Electric", "Gasoline", "Diesel", "Hybrid"],
}

export const carsTransmission = {
    fr: ["Manuel", "Automatique", "Semi-automatique"],
    en: ["Manual", "Automatic", "Semi-automatic"]
}

export const carsBodyType = {
    fr: ["Berline", "SUV", "Pick-up", "Coupé", "Cabriolet", "Monospace", "Utilitaire"],
    en: ["Sedan", "SUV", "Pickup", "Coupe", "Convertible", "Minivan", "Utility"]
}

export const carsFeatures = {
    fr: ["Climatisation", "GPS", "Sièges chauffants", "Caméra de recul", "Démarrage sans clé"],
    en: ["Air conditioning", "GPS", "Heated seats", "Rear view camera", "Keyless start"]
}

export const carsSafetyOptions = {
    fr: ["Airbags", "Système de freinage anti-blocage (ABS)", "Contrôle de traction", "Système d'alarme"],
    en: ["Airbags", "Anti-lock Braking System (ABS)", "Traction Control", "Alarm system"]
};

export const carsState = {
    fr: ["Comme Neuf", "D'occasion", "Bon état", "Besoin de réparations"],
    en: ["Like New", "Used", "Good condition", "In need of repairs"],
}

export const bikeFeatures = {
    fr: ["Porte-bagages", "Éclairage LED", "Selle ergonomique", "Freins à disque", "Suspension avant", "Pédales antidérapantes", "Poignées chauffantes"],
    en: ["Luggage rack", "LED lighting", "Ergonomic saddle", "Disc brakes", "Front suspension", "Non-slip pedals", "Heated Grips"]
};


export const bikeAccessories = {
    fr: ["Top case", "Sacoches latérales", "Pare-brise", "Protège-mains"],
    en: ["Top case", "Side Bags", "Windshield", "Hand Guards"]
}

export const phoneTabletConnectivity = {
    fr: ["4G", "5G", "Wi-Fi", "Bluetooth", "NFC", "USB-C", "Infrarouge"],
    en: ["4G", "5G", "Wi-Fi", "Bluetooth", "NFC", "USB-C", "Infrared"]
};

export const phoneTabletSpecialFeatures = {
    fr: ["Reconnaissance faciale", "Capteur d'empreintes digitales", "Résistance à l'eau", "Charge sans fil", "Scanner d'iris"],
    en: ["Face Recognition", "Fingerprint Sensor", "Water Resistance", "Wireless Charging", "Iris Scanner"]
};

export const computerConnectivityOptions = {
    fr: ["Wi-Fi", "Bluetooth", "Ethernet", "HDMI", "USB Type-C", "VGA", "DisplayPort", "DVI", "Thunderbolt", "Mini DisplayPort", "SD Card Reader", "USB 3.0"],
    en: ["Wi-Fi", "Bluetooth", "Ethernet", "HDMI", "USB Type-C", "VGA", "DisplayPort", "DVI", "Thunderbolt", "Mini DisplayPort", "SD Card Reader", "USB 3.0"]
};

export const computerSpecialFeaturesOptions = {
    fr: ["Écran tactile", "Clavier rétroéclairé", "Reconnaissance faciale", "Lecteur d'empreintes digitales"],
    en: ["Touchscreen", "Backlit keyboard", "Face recognition", "Fingerprint reader"]
};


export const villaConstructionTypes = {
    fr: ["Brique", "Béton", "Bois", "Pierre", "Acier"],
    en: ["Brick", "Concrete", "Wood", "Stone", "Steel"]
}

export const villaHeatingTypes = {
    fr: ["Chauffage central", "Chauffage individuel", "Chauffage au sol", "Chauffage électrique"],
    en: ["Central heating", "Individual heating", "Underfloor heating", "Electric heating"]
}

export const villaSecurityOptions = {
    fr: ["Système d'alarme", "Vidéo surveillance", "Gardien", "Portail électrique"],
    en: ["Alarm system", "Video surveillance", "Guard", "Electric gate"]
}

export const villaProximityServices = {
    fr: ["Écoles", "Commerces", "Transports en commun", "Parcs"],
    en: ["Schools", "Shops", "Public transport", "Parks"]
}

export const apartmentConstructionTypes = {
    fr: ["Brique", "Béton", "Bois", "Pierre", "Acier"],
    en: ["Brick", "Concrete", "Wood", "Stone", "Steel"]
}

export const apartmentHeatingTypes = {
    fr: ["Chauffage central", "Chauffage individuel", "Chauffage au sol", "Chauffage électrique"],
    en: ["Central heating", "Individual heating", "Underfloor heating", "Electric heating"]
}

export const apartmentSecurityOptions = {
    fr: ["Système d'alarme", "Vidéo surveillance", "Gardien", "Portail électrique"],
    en: ["Alarm system", "Video surveillance", "Guard", "Electric gate"]
}

export const apartmentProximityServices = {
    fr: ["Écoles", "Commerces", "Transports en commun", "Parcs"],
    en: ["Schools", "Shops", "Public transport", "Parks"]
}

export const jobContractTypes = {
    fr: ["CDI", "CDD", "Freelance", "Stage", "Intérim"],
    en: ["Permanent", "Fixed-term", "Freelance", "Internship", "Temporary"]
}

export const jobIndustries = {
    fr: ["Informatique", "Finance", "Santé", "Éducation", "Commerce", "Hôtellerie", "Transport", "Langue", "Management", "Autre"],
    en: ["IT", "Finance", "Healthcare", "Education", "Commerce", "Hospitality", "Transport", "Language", "Management", "Other"]
}

export const jobBenefits = {
    fr: ["Tickets restaurant", "Mutuelle", "Télétravail", "Formation continue", "Prime de performance"],
    en: ["Meal vouchers", "Health insurance", "Remote work", "Continuous training", "Performance bonus"]
}

export const jobExperienceLevels = {
    fr: ["Débutant", "Intermédiaire", "Expérimenté", "Senior"],
    en: ["Entry-level", "Intermediate", "Experienced", "Senior"]
}

export const cosmeticsCategories = {
    fr: ["Maquillage", "Soin de la peau", "Soin des cheveux", "Parfum", "Autre"],
    en: ["Makeup", "Skin care", "Hair care", "Perfume", "Other"]
}

export const menShoesCat = {
    fr: ["Mocassins", "Espadrilles", "Sneaker", "Basket de sport", "Sandales", "Tongs", "Chaussures habillées", "Bottes"],
    en: ["Loafers", "Espadrilles", "Sneakers", "Athletic Shoes", "Sandals", "Flip-Flops", "Dress Shoes", "Boots"]
}

export const womenShoesCat = {
    fr: ["Escarpins", "Sandales", "Sneakers", "Bottes", "Bottines", "Mocassins", "Tongs", "Ballerines", "Chaussures habillées", "Chaussures de sport"],
    en: ["Heels", "Sandals", "Sneakers", "Boots", "Ankle Boots", "Loafers", "Flip-Flops", "Ballet Flats", "Dress Shoes", "Athletic Shoes"]
}

export const menShoesSize = {
    fr: ["40", "41", "42", "43", "44", "45", "Autre"],
    en: ["40", "41", "42", "43", "44", "45", "Other"]
}

export const womenShoesSize = {
    fr: ["35", "36", "37", "38", "39", "40", "Autre"],
    en: ["35", "36", "37", "38", "39", "40", "Other"]
}



