import { fetchPubs } from "../routes/apiRoutes";
import { fetchApprovedPosts } from "../routes/postRoutes";

// 🔹 Fonction pour récupérer les annonces normales
const fetchRegPosts = async () => {
    try {
        const result = await fetchApprovedPosts();
        return result.success ? result.approvedPosts : [];
    } catch (error) {
        console.error('❌ Erreur lors du chargement des annonces normales:', error);
        return [];
    }
};

// 🔹 Fonction pour récupérer les annonces Business
const fetchBusPosts = async () => {
    try {
        const result = await fetchPubs();
        return result.success ? result.pubs : [];
    } catch (error) {
        console.error('❌ Erreur lors du chargement des annonces Business:', error);
        return [];
    }
};

// 🔹 Fonction pour mélanger un tableau (Fisher-Yates Shuffle)
const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
};

// 🔹 Fonction pour insérer les annonces Business à un intervalle régulier
const insertBusPosts = (busPosts, regPosts) => {
    if (regPosts.length === 0) return busPosts;
    if (busPosts.length === 0) return regPosts;

    const shuffledBusPosts = shuffleArray([...busPosts]);
    const shuffledRegPosts = shuffleArray([...regPosts]);

    const combinedPosts = [];
    let busIndex = 0;
    
    // Déterminer le ratio optimal : 1 annonce Business après 3 ou 4 annonces normales
    const insertionInterval = Math.floor(Math.random() * 2) + 3; // Aléatoire entre 3 et 4

    for (let i = 0; i < shuffledRegPosts.length; i++) {
        combinedPosts.push(shuffledRegPosts[i]);

        if ((i + 1) % insertionInterval === 0 && busIndex < shuffledBusPosts.length) {
            combinedPosts.push(shuffledBusPosts[busIndex]);
            busIndex++;
        }
    }

    // Ajouter les annonces Business restantes
    while (busIndex < shuffledBusPosts.length) {
        combinedPosts.push(shuffledBusPosts[busIndex]);
        busIndex++;
    }

    return combinedPosts;
};

// 🔹 Fonction principale pour récupérer et mélanger les annonces
export const fetchCombinedPosts = async () => {
    const [regularAdsResult, businessAdsResult] = await Promise.allSettled([
        fetchRegPosts(),
        fetchBusPosts()
    ]);

    const regularPosts = regularAdsResult.status === "fulfilled" ? regularAdsResult.value : [];
    const businessPosts = businessAdsResult.status === "fulfilled" ? businessAdsResult.value : [];

    return insertBusPosts(businessPosts, regularPosts);
};
