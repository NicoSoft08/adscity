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
            fr: "Electronique",
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
                id: 1,
                sousCategoryId: 300,
                sousCategoryTitles: {
                    fr: "Vêtements Homme",
                    en: "Men's Clothing",
                },
                sousCategoryName: 'vetements-homme',
                sousContainer: [],
            },
            {
                id: 2,
                sousCategoryId: 301,
                sousCategoryTitles: {
                    fr: "Vêtements Femme",
                    en: "Women's Clothing",
                },
                sousCategoryName: 'vetements-femme',
                sousContainer: [],
            },
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
            {
                id: 2,
                sousCategoryId: 1102,
                sousCategoryTitles: {
                    fr: "Épices et Condiments",
                    en: "Spices and Seasonings",
                },
                sousCategoryName: 'epices-condiments',
                sousContainer: [],
            },
            {
                id: 3,
                sousCategoryId: 1103,
                sousCategoryTitles: {
                    fr: "Céréales et Tubercules",
                    en: "Grains and Tubers",
                },
                sousCategoryName: 'cereales-tubercules',
                sousContainer: [],
            },
        ],
    }
];

export const countryDB = [
    {
        id: 1,
        name: "",
        code: "",
        flag: "",
        states: [
            {
                id: 1,
                name: "",
                country_id: 1,
                cities: [
                    {
                        id: 1,
                        name: "",
                    },
                ],
            },
            {
                id: 2,
                name: "",
                country_id: 2,
                cities: [
                    {
                        id: 1,
                        name: "",
                    },
                ],
            },
        ],
    },
    {
        id: 2,
        name: "",
        code: "",
        flag: "",
        states: [
            {
                id: 1,
                name: "",
                country_id: 1,
                cities: [
                    {
                        id: 1,
                        name: "",
                    },
                ],
            },
            {
                id: 2,
                name: "",
                country_id: 2,
                cities: [
                    {
                        id: 1,
                        name: "",
                    },
                ],
            },
        ],
    },
]


export const citiesRU = [
    {
        id: 1,
        federal_obj: "District autonome des Khantys-Mansis",
        states: [
            { id: 1, name: "Sourgout" }, { id: 2, name: "Nijnevartovsk" },
            { id: 3, name: "Nefteïougansk" },
        ]
    },
    {
        id: 2,
        federal_obj: "Khabarovsky Krai",
        states: [
            { id: 1, name: "Khabarovsk" }, { id: 2, name: "Komsomolsk-sur-l'Amour" },
        ]
    },
    {
        id: 3,
        federal_obj: "Kraï de Krasnodar",
        states: [
            { id: 1, name: "Krasnodar" }, { id: 2, name: "Sotchi" },
            { id: 3, name: "Novorossiisk" }, { id: 4, name: "Armavir" },
        ]
    },
    {
        id: 4,
        federal_obj: "Kraï de Krasnoïarsk",
        states: [
            { id: 1, name: "Krasnoïarsk" }, { id: 2, name: "Norilsk" },
            { id: 3, name: "Atchinsk" }, { id: 4, name: "Kansk" },
        ]
    },
    {
        id: 5,
        federal_obj: "Kraï de l'Altaï",
        states: [
            { id: 1, name: "Barnaoul" }, { id: 2, name: "Biïsk" },
            { id: 3, name: "Roubtsovsk" },
        ]
    },
    {
        id: 6,
        federal_obj: "Kraï de Perm",
        states: [
            { id: 1, name: "Perm" }, { id: 2, name: "Berezniki" },
            { id: 3, name: "Solikamsk" },
        ]
    },
    {
        id: 7,
        federal_obj: "Kraï de Stavropol",
        states: [
            { id: 1, name: "Stavropol" }, { id: 2, name: "Piatigorsk" },
            { id: 3, name: "Nevinnomyssk" }, { id: 4, name: "Kislovodsk" },
        ]
    },
    {
        id: 8,
        federal_obj: "Kraï de Transbaïkalie",
        states: [{ id: 1, name: "Tchita" },]
    },
    {
        id: 9,
        federal_obj: "Kraï du Kamtchatka",
        states: [{ id: 1, name: "Petropavlovsk-Kamtchatski" },]
    },
    {
        id: 10,
        federal_obj: "Kraï du Primorie",
        states: [
            { id: 1, name: "Vladivostok" }, { id: 2, name: "Oussouriisk" },
            { id: 3, name: "Nakhodka" },
        ]
    },
    {
        id: 11,
        federal_obj: "Oblast d'Amour",
        states: [{ id: 1, name: "Blagovechtchensk" },]
    },
    {
        id: 12,
        federal_obj: "Oblast d'Arkhangelsk",
        states: [
            { id: 1, name: "Arkhangelsk" }, { id: 2, name: "Severodvinsk" },
        ]
    },

    {
        id: 13,
        federal_obj: "Oblast d'Astrakhan",
        states: [{ id: 1, name: "Blagovechtchensk" },]
    },
    {
        id: 14,
        federal_obj: "Oblast de Belgorod",
        states: [
            { id: 1, name: "Belgorod" }, { id: 2, name: "Stary Oskol" },
        ]
    },
    {
        id: 15,
        federal_obj: "Oblast de Briansk",
        states: [{ id: 1, name: "Blagovechtchensk" },]
    },
    {
        id: 16,
        federal_obj: "Oblast de Iaroslavl",
        states: [
            { id: 1, name: "Iaroslavl" }, { id: 2, name: "Rybinsk" },
        ]
    },
    {
        id: 17,
        federal_obj: "Oblast de Kaliningrad",
        states: [{ id: 1, name: "Kaliningrad" },]
    },
    {
        id: 18,
        federal_obj: "Oblast de Kalouga",
        states: [
            { id: 1, name: "Kalouga" }, { id: 2, name: "Obninsk" },
        ]
    },
    {
        id: 19,
        federal_obj: "Oblast de Kemerovo",
        states: [
            { id: 1, name: "Kemerovo" }, { id: 2, name: "Prokopievsk" },
            { id: 3, name: "Novokouznetsk" }, { id: 4, name: "Leninsk-Kouznetski" },
            { id: 5, name: "Kisseliovsk" }, { id: 6, name: "Mejdouretchensk" },
        ]
    },
    {
        id: 20,
        federal_obj: "Oblast de Kirov",
        states: [{ id: 1, name: "Kirov" },]
    },
    {
        id: 21,
        federal_obj: "Oblast de Kostroma",
        states: [{ id: 1, name: "Kostroma" },]
    },
    {
        id: 22,
        federal_obj: "Oblast de Kourgan",
        states: [{ id: 1, name: "Kourgan" },]
    },
    {
        id: 24,
        federal_obj: "Oblast de Koursk",
        states: [{ id: 1, name: "Koursk" },]
    },

    {
        id: 25,
        federal_obj: "Oblast de Lipetsk",
        states: [
            { id: 1, name: "Lipetsk" },
            { id: 2, name: "Ielets" },
        ]
    },
    {
        id: 26,
        federal_obj: "Oblast de Moscou",
        states: [
            { id: 1, name: "Mytichtchi" }, { id: 2, name: "Lioubertsy" },
            { id: 3, name: "Kolomna" }, { id: 4, name: "Balachikha" },
            { id: 5, name: "Elektrostal" }, { id: 6, name: "Korolev" },
            { id: 7, name: "Khimki" }, { id: 8, name: "Odintsovo" },
            { id: 9, name: "Serpoukhov" }, { id: 10, name: "Orekhovo-Zouïevo" },
            { id: 11, name: "Noguinsk" }, { id: 12, name: "Serguiev Possad" },
            { id: 13, name: "Chtchiolkovo" }, { id: 14, name: "Jeleznodorojny" },
            { id: 15, name: "Joukovski" },

        ]
    },
    {
        id: 27,
        federal_obj: "Oblast de Mourmansk",
        states: [{ id: 1, name: "Mourmansk" },]
    },
    {
        id: 28,
        federal_obj: "Oblast de Nijni Novgorod",
        states: [
            { id: 1, name: "Nijni Novgorod" }, { id: 2, name: "Dzerjinsk" },
            { id: 3, name: "Arzamas" },
        ]
    },
    {
        id: 29,
        federal_obj: "Oblast de Novgorod",
        states: [{ id: 1, name: "Novgorod" },]
    },
    {
        id: 30,
        federal_obj: "Oblast de Novossibirsk",
        states: [{ id: 1, name: "Novossibirsk" },]
    },
    {
        id: 31,
        federal_obj: "Oblast de Penza",
        states: [{ id: 1, name: "Penza" },]
    },
    {
        id: 32,
        federal_obj: "Oblast de Pskov",
        states: [
            { id: 1, name: "Pskov" }, { id: 2, name: "Velikié Louki" },
        ]
    },
    {
        id: 33,
        federal_obj: "Oblast de Riazan",
        states: [{ id: 1, name: "Riazan" },]
    },
    {
        id: 34,
        federal_obj: "Oblast de Rostov",
        states: [
            { id: 1, name: "Rostov-on-Don" }, { id: 2, name: "Taganrog" },
            { id: 3, name: "Chakhty" }, { id: 4, name: "Novotcherkassk" },
            { id: 5, name: "Volgodonsk" }, { id: 6, name: "Bataïsk" },
            { id: 7, name: "Novochakhtinsk" },
        ]
    },
    {
        id: 35,
        federal_obj: "Oblast de Sakhaline",
        states: [{ id: 1, name: "Ioujno-Sakhalinsk" },]
    },
    {
        id: 36,
        federal_obj: "Oblast de Samara",
        states: [
            { id: 1, name: "Samara" }, { id: 2, name: "Togliatti" },
            { id: 3, name: "Syzran" }, { id: 4, name: "Novokouïbychevsk" },
        ]
    },

    {
        id: 37,
        federal_obj: "Oblast de Saratov",
        states: [
            { id: 1, name: "Saratov" }, { id: 2, name: "Balakovo" },
            { id: 3, name: "Engels" },
        ]
    },
    {
        id: 38,
        federal_obj: "Oblast de Smolensk",
        states: [{ id: 1, name: "Smolensk" },]
    },
    {
        id: 39,
        federal_obj: "Oblast de Sverdlovsk",
        states: [
            { id: 1, name: "Iekaterinbourg" }, { id: 2, name: "Nijni Taguil" },
            { id: 3, name: "Kamensk-Ouralski" }, { id: 4, name: "Pervoouralsk" },
        ]
    },
    {
        id: 40,
        federal_obj: "Oblast de Tambov",
        states: [{ id: 1, name: "Tambov" },]
    },
    {
        id: 41,
        federal_obj: "Oblast de Tcheliabinsk",
        states: [
            { id: 1, name: "Tcheliabinsk" }, { id: 2, name: "Magnitogorsk" },
            { id: 3, name: "Zlatooust" }, { id: 4, name: "Miass" },
        ]
    },
    {
        id: 42,
        federal_obj: "Oblast de Tioumen",
        states: [{ id: 1, name: "Tioumen" },]
    },
    {
        id: 43,
        federal_obj: "Oblast de Tomsk",
        states: [
            { id: 1, name: "Tomsk" }, { id: 2, name: "Seversk" },
        ]
    },
    {
        id: 44,
        federal_obj: "Oblast de Toula",
        states: [
            { id: 1, name: "Toula" }, { id: 2, name: "Novomoskovsk" },
        ]
    },
    {
        id: 45,
        federal_obj: "Oblast de Tver",
        states: [{ id: 1, name: "Tver" },]
    },
    {
        id: 46,
        federal_obj: "Oblast de Vladimir",
        states: [
            { id: 1, name: "Vladimir" }, { id: 2, name: "Kovrov" },
            { id: 3, name: "Mourom" },
        ]
    },
    {
        id: 47,
        federal_obj: "Oblast de Volgograd",
        states: [
            { id: 1, name: "Volgograd" }, { id: 2, name: "Voljski" },
            { id: 3, name: "Kamychine" },
        ]
    },
    {
        id: 48,
        federal_obj: "Oblast de Vologda",
        states: [
            { id: 1, name: "Tcherepovets" }, { id: 2, name: "Vologda" },
        ]
    },

    {
        id: 49,
        federal_obj: "Oblast de Voronej",
        states: [{ id: 1, name: "Voronej" },]
    },
    {
        id: 50,
        federal_obj: "Oblast d'Irkoutsk",
        states: [
            { id: 1, name: "Irkoutsk" }, { id: 2, name: "Bratsk" },
            { id: 3, name: "Angarsk" }, { id: 4, name: "Oust-Ilimsk" },
        ]
    },
    {
        id: 51,
        federal_obj: "Oblast d'Ivanovo",
        states: [{ id: 1, name: "Ivanovo" },]
    },
    {
        id: 52,
        federal_obj: "Oblast d'Omsk",
        states: [{ id: 1, name: "Omsk" },]
    },
    {
        id: 53,
        federal_obj: "Oblast d'Orel",
        states: [{ id: 1, name: "Orel" },]
    },
    {
        id: 54,
        federal_obj: "Oblast d'Orenbourg",
        states: [
            { id: 1, name: "Orenbourg" },
            { id: 2, name: "Orsk" },
            { id: 3, name: "Novotroïtsk" },
        ]
    },
    {
        id: 55,
        federal_obj: "Oblast d'Oulianovsk",
        states: [
            { id: 1, name: "Oulianovsk" },
            { id: 2, name: "Dimitrovgrad" },
        ]
    },
    {
        id: 56,
        federal_obj: "République d'Adyguée",
        states: [{ id: 1, name: "Maïkop" },]
    },
    {
        id: 57,
        federal_obj: "République de Bachkirie",
        states: [
            { id: 1, name: "Oufa" }, { id: 2, name: "Sterlitamak" },
            { id: 3, name: "Salavat" }, { id: 4, name: "Neftekamsk" },
            { id: 5, name: "Oktiabrski" },
        ]
    },
    {
        id: 58,
        federal_obj: "République de Bouriatie",
        states: [{ id: 1, name: "Oulan-Oude" },]
    },
    {
        id: 59,
        federal_obj: "République de Carélie",
        states: [{ id: 1, name: "Petrozavodsk" },]
    },
    {
        id: 60,
        federal_obj: "République de Kabardino-Balkarie",
        states: [{ id: 1, name: "Naltchik" },]
    },

    {
        id: 61,
        federal_obj: "République de Kalmoukie",
        states: [{ id: 1, name: "Elista" },]
    },
    {
        id: 62,
        federal_obj: "République de Khakassie",
        states: [{ id: 1, name: "Abakan" },]
    },
    {
        id: 63,
        federal_obj: "République de Mordovie",
        states: [{ id: 1, name: "Saransk" },]
    },
    {
        id: 64,
        federal_obj: "République de Sakha",
        states: [{ id: 1, name: "Iakoutsk" },]
    },
    {
        id: 65,
        federal_obj: "République de Tchétchénie",
        states: [{ id: 1, name: "Grozny" },]
    },
    {
        id: 66,
        federal_obj: "République de Tchouvachie",
        states: [
            { id: 1, name: "Tcheboksary" },
            { id: 2, name: "Novotcheboksarsk" }
        ]
    },
    {
        id: 67,
        federal_obj: "République des Karatchaï-Tcherkesses",
        states: [{ id: 1, name: "Tcherkessk" },]
    },
    {
        id: 68,
        federal_obj: "République des Komis",
        states: [{ id: 1, name: "Syktyvkar" }, { id: 2, name: "Oukhta" }]
    },
    {
        id: 69,
        federal_obj: "République des Maris",
        states: [{ id: 1, name: "Iochkar-Ola" },]
    },
    {
        id: 70,
        federal_obj: "République des Touvas",
        states: [{ id: 1, name: "Kyzyl" },]
    },
    {
        id: 71,
        federal_obj: "République d'Ingouchie",
        states: [{ id: 1, name: "Nazran" },]
    },
    {
        id: 72,
        federal_obj: "République d'Ossétie-du-Nord",
        states: [{ id: 1, name: "Vladikavkaz" },]
    },

    {
        id: 73,
        federal_obj: "République d'Oudmourtie",
        states: [
            { id: 1, name: "Ijevsk" },
            { id: 2, name: "Sarapoul" },
            { id: 3, name: "Glazov" }
        ]
    },
    {
        id: 74,
        federal_obj: "République du Daguestan",
        states: [
            { id: 1, name: "Makhatchkala" },
            { id: 2, name: "Khassaviourt" },
            { id: 3, name: "Derbent" }
        ]
    },
    {
        id: 75,
        federal_obj: "République du Tatarstan",
        states: [
            { id: 1, name: "Kazan" }, { id: 2, name: "Naberejnye Tchelny" },
            { id: 3, name: "Nijnekamsk" }, { id: 4, name: "Almetievsk" },
            { id: 5, name: "Zelenodolsk" }
        ]
    },
    {
        id: 76,
        federal_obj: "Ville fédérale de Moscou",
        states: [{ id: 1, name: "Moscou" },]
    },
    {
        id: 77,
        federal_obj: "Ville fédérale de Saint-Pétersbourg",
        states: [{ id: 1, name: "Saint-Pétersbourg" },]
    },
];


export const presetColors = [
    "#fff", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5",
    "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50",
    "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800",
    "#ff5722", "#795548", "#607d8b"
];


export const businessCategory = [
    "Service Automobile", "Mode et Vêtements", "Arts et Spectacles",
    "Beauté, Cosmétique et Soins Personnels", "Éducation",
    "Planificateur d'Événements", "Finances", "Épicerie", "Hôtel",
    "Médical & Santé", "Restauration", "Achats et Vente au Détail",
    "Immobilier",
];

export const ventiloType = {
    fr: ["climatiseur fixe (split)", "climatiseur mobile", "climatiseur réversible", "ventilateur sur pied", "ventilateur de table", "ventilateur de plafond"],
    en: ["fixed air conditioner (split)", "mobile air conditioner", "reversible air conditioner", "floor fan", "table fan", "ceiling fan"]
}

export const formeDeTravail = {
    fr: ["en ligne", "en présentiel", "hybride"],
    en: ["online", "in person", "hybrid"]
}

export const typeDeContrat = {
    fr: ["CDI", "CDD", "Freelance", "Stage", "Intérim"],
    en: ["Permanent Contract", "Fixed-term Contract", "Stage", "Intérim"]
}

export const dishesStuff = {
    fr: ["en porcelaine", "en faïence", "en verre", " de grès", "en terre cuite", "de mélamine"],
    en: ["porcelain", "earthenware", "glass", "stoneware", "terracotta", "melamine"]
}

export const deviceType = {
    fr: ["climatiseur mural", "ventilateur portable", "ventilateur de plafond", "ventilateur sur pied"],
    en: ["wall-mounted air conditioner", "portable fan", "ceiling fan", "floor-standing fan"]
}

export const controleType = {
    fr: ["manuellement", "par télécommande", "controle par une application"],
    en: ["manually", "by remote control", "control by an application"]
};

export const freezeType = {
    fr: ["réfrigérateur-congélateur combiné", "réfrigérateur américain", "réfrigérateur à une porte", "congélateur coffre", "congélateur armoire"],
    en: ["combined refrigerator-freezer", "American refrigerator", "single-door refrigerator", "chest freezer", "cabinet freezer"]
}

export const energieType = {
    fr: ["à gaz", "à l'électricité", "autre source d'énergie"],
    en: ["gas", "electricity", "other energy source"]
}

export const stateOfVilla = {
    fr: ["Neuf", "D'occasion", "En construction"],
    en: ["New", "Used", "Under construction"],
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

export const bedroomState = {
    fr: ["Non meublée", "Partiellement meublée", "Entièrement meublée"],
    en: ["Unfurnished", "Partially furnished", "Fully furnished"]
};

export const roomState = {
    fr: ["Non meublé", "Partiellement meublé", "Entièrement meublé", "Rénové récemment", "À rénover"],
    en: ["Unfurnished", "Partially furnished", "Fully furnished", "Recently renovated", "To renovate"]
};

export const homeAppliances = {
    fr: ['Climatisation', 'Réfrigérateur', 'Cuisinière', 'Micro-ondes', 'Lave-linge', 'Télévision', 'Fer à repasser'],
    en: ['Air conditioning', 'Refrigerator', 'Stove', 'Microwave', 'Washing machine', 'Television', 'Iron'],
}

export const roomsType = {
    fr: ["Chambre Individuelle", "Chambre Double", "Suite Parentale"],
    en: [],
};

export const includedFurniture = {
    fr: ["Lit", "Armoire", "Bureau", "Tables de chevet", "Chaise"],
    en: [],
};

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

export const menClotheCategory = {
    fr: ["Chemise", "Pantalon", "Veste", "Costume", "T-Shirt", "T-Short", "Pull", "Jeans"],
    en: ["Shirt", "Pants", "Jacket", "Suit", "T-Shirt", "T-Short", "Sweater", "Jeans"]
}

export const womenClotheCategory = {
    fr: ["Robe", "Jupe", "Pantalon", "Blouse", "T-Shirt", "T-Short", "Chemisier"],
    en: ["Dress", "Skirt", "Pants", "Blouse", "T-Shirt", "T-Shorts", "Blouse"]
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



