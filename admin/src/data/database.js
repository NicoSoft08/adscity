import { 
    alimentation, 
    electronique, 
    mode_et_beaute, 
    services 
} from "../config/images";

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