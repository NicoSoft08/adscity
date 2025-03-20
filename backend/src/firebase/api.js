const { firestore, admin, auth } = require('../config/firebase-admin');
const { sendSupportEmail, sendUserEmailWithTicket } = require('../controllers/emailController');
const { generateTicketID } = require('../func');
const data = require('../json/data.json');

const searchQuery = async (query) => {
    if (!query || query.trim().length === 0) return [];

    const searchItem = query.toLowerCase().split(' ').slice(0, 10); // 🔹 Limite Firestore
    let matchedCategory = null; // 🔍 Stocke la catégorie ou sous-catégorie trouvée

    try {
        const searchResults = new Map(); // Evite les doublons

        // 🔹 Vérifier si `query` correspond à une catégorie ou sous-catégorie
        data.categories.forEach(cat => {
            if (
                cat.categoryTitles.fr.includes(query) ||
                Object.values(cat.categoryTitles.fr).some(title => title.includes(query))
            ) {
                matchedCategory = cat; // 🎯 Match trouvé avec une catégorie
            } else {
                cat.container.forEach(subCat => {
                    if (
                        subCat.sousCategoryTitles.fr.includes(query) ||
                        Object.values(subCat.sousCategoryTitles.fr).some(title => title.includes(query))
                    ) {
                        matchedCategory = subCat; // 🎯 Match trouvé avec une sous-catégorie
                    }
                });
            }
        });

        // 1️⃣ Requête sur les titres
        const titleResults = await firestore
            .collection('POSTS')
            .where('title', '>=', query.toLowerCase())
            .where('title', '<=', query.toLowerCase() + '\uf8ff')
            .limit(20)
            .get();

        titleResults.forEach(doc => {
            const data = doc.data();
            searchResults.set(doc.id, { id: doc.id, matchCount: 10, ...data });
        });

        // 2️⃣ Requête sur searchableTerms
        const termResults = await firestore
            .collection('POSTS')
            .where('searchableTerms', 'array-contains-any', searchItem)
            .limit(50)
            .get();

        termResults.forEach(doc => {
            if (!searchResults.has(doc.id)) {
                const data = doc.data();
                const matchCount = data.searchableTerms.filter(term => searchItem.includes(term)).length;
                searchResults.set(doc.id, { id: doc.id, matchCount, ...data });
            }
        });

        // 3️⃣ Si une catégorie est trouvée, récupérer ses annonces
        if (matchedCategory) {
            const categoryField = matchedCategory.sousCategoryId ? "subcategory" : "category";
            const categoryValue = matchedCategory.sousCategoryId ? matchedCategory.sousCategoryName : matchedCategory.categoryName;

            const categoryResults = await firestore
                .collection('POSTS')
                .where(categoryField, '==', categoryValue)
                .limit(20)
                .get();

            categoryResults.forEach(doc => {
                if (!searchResults.has(doc.id)) {
                    const data = doc.data();
                    searchResults.set(doc.id, { id: doc.id, matchCount: 5, ...data }); // 🔥 Moins de priorité que les titres directs
                }
            });
        }

        // 4️⃣ Trier et renvoyer les résultats
        const results = Array.from(searchResults.values()).sort((a, b) => b.matchCount - a.matchCount).slice(0, 20);

        return {
            results,
            suggestedCategory: matchedCategory ? {
                name: matchedCategory.categoryTitles?.fr || matchedCategory.sousCategoryTitles?.fr,
                link: `/category/${matchedCategory.categoryName || matchedCategory.sousCategoryName}`
            } : null
        };

    } catch (error) {
        console.error('❌ Erreur lors de la recherche:', error);
        return { results: [], suggestedCategory: null };
    }
};

const updateInteraction = async (postID, userID, category) => {
    try {
        const userRef = firestore.collection('USERS').doc(userID);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            console.log('L\'utilisateur n\'existe pas');
            return false;
        }
        const userData = userDoc.data();

        const uniqueViewedIDs = new Set([
            ...(userData.adsViewed || []),
            postID
        ]);

        await userRef.update({
            totalAdsViewed: admin.firestore.FieldValue.increment(1),
            adsViewed: Array.from(uniqueViewedIDs),
            categoriesViewed: admin.firestore.FieldValue.arrayUnion(category)
        });

        return true;
    } catch (error) {
        console.error('Erreur lors de la mise à jour des interactions:', error);
        return false;
    };
};

const updateContactClick = async (userID, city) => {
    try {
        const userRef = firestore.collection('USERS').doc(userID);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            console.error("Utilisateur non trouvé");
            return false;
        }

        const userData = userDoc.data();
        const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

        // Incrément du total des visites
        const newTotalVisits = (userData.profileVisits || 0) + 1;

        // Mise à jour des visites du jour
        let newVisitsToday = userData.profileVisitsToday || {};
        newVisitsToday[today] = (newVisitsToday[today] || 0) + 1;

        // Mise à jour des visites par ville
        let newVisitsByCity = userData.profileVisitsByCity || {};
        newVisitsByCity[city] = (newVisitsByCity[city] || 0) + 1;

        // Récupérer le timestamp actuel
        const timestamp = new Date();

        // Ajout à l'historique des visites
        const visitEntry = {
            timestamp: timestamp, // On met un Date() au lieu de serverTimestamp()
            city: city,
        };

        await userRef.update({
            profileVisits: newTotalVisits,
            [`profileVisitsToday.${today}`]: newVisitsToday[today],
            [`profileVisitsByCity.${city}`]: newVisitsByCity[city],
            profileVisitsHistory: admin.firestore.FieldValue.arrayUnion(visitEntry),
        });

        console.log(`Visite enregistrée pour ${userID} depuis ${city}`);
        return true;
    } catch (error) {
        console.error('Erreur lors de la mise à jour des visites:', error);
        return false;
    }
};

const contactUs = async (formData) => {
    const { email, object, message } = formData;

    try {
        const userRecord = auth.getUserByEmail(email);
        if (!userRecord) {
            console.error('L\'utilisateur n\'existe pas');
            return false;
        };

        const userRef = firestore.collection('USERS').doc(userRecord.uid);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            console.error('L\'utilisateur n\'existe pas');
            return false;
        };

        const ticketID = generateTicketID();

        const userData = userDoc.data();
        const { displayName } = userData;

        await sendSupportEmail(email, displayName, message, object, ticketID);
        await sendUserEmailWithTicket(displayName, email, object, message, ticketID);

        return true;
    } catch (error) {
        console.error('Erreur lors de la transmission du formulaire:', error);
        return false;
    };
};

const collectLocations = async () => {
    try {
        const querySnapshot = await firestore.collection('LOCATIONS').get();
        const locations = [];
        for (const doc of querySnapshot.docs) {
            const data = doc.data();
            locations.push({
                id: doc.id,
                ...data
            });
        };
        return locations;
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        return [];
    };
};

const advancedItemSearch = async (category, item, location, minPrice, maxPrice) => {
    try {
        const querySnapshot = await firestore.collection('POSTS')
            .where('category', '==', category)
            .where('title', '>=', item)
            .where('title', '<=', item + '\uf8ff')
            .where('location.city', '==', location)
            .where('price', '>=', minPrice)
            .where('price', '<=', maxPrice)
            .get();

        const results = [];
        for (const doc of querySnapshot.docs) {
            const data = doc.data();
            results.push({
                id: doc.id,
                ...data
            });
        };
        return results;
    } catch (error) {
        console.error('Erreur lors de la recherche avancée:', error);
        return [];
    };
};

const evaluateUser = async (userID, rating, comment) => {
    try {
        const userRef = firestore.collection('USERS').doc(userID);
        const userDoc = await userRef.get();

        // Vérifier si l'utilisateur existe
        if (!userDoc.exists) {
            console.error('L\'utilisateur n\'existe pas');
            return false;
        }

        const userData = userDoc.data();

        // Initialiser ou récupérer les données d'évaluation existantes
        const currentRatings = userData.ratings || {
            average: 0,
            count: 0,
            total: 0,
            distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        };

        // Ajouter la note à la distribution
        currentRatings.distribution[rating] = (currentRatings.distribution[rating] || 0) + 1;

        // Mettre à jour le total des notes
        currentRatings.total += rating;

        // Mettre à jour le nombre total de notes
        currentRatings.count += 1;

        // Recalculer la moyenne
        currentRatings.average = currentRatings.total / currentRatings.count;

        // Ajouter le commentaire à la liste des avis reçus
        const newReview = {
            rating,
            comment,
            date: new Date().toISOString(),
        };

        const reviews = userData.reviews || { received: [], totalReviews: 0 };
        reviews.received.push(newReview);
        reviews.totalReviews += 1;

        // Mettre à jour les données dans Firestore
        await userRef.update({
            ratings: currentRatings,
            reviews: reviews,
        });

        console.log('L\'évaluation a été ajoutée avec succès');
        return true;

    } catch (error) {
        console.error('Erreur lors de l\'évaluation de l\'utilisateur:', error);
        return false;
    }
};

const socialLinksUpdate = async (userID, socialLinks) => {
    try {
        const userRef = firestore.collection('USERS').doc(userID);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return {
                success: false,
                message: 'Utilisateur non trouvé',
            };
        };

        const userData = userDoc.data();
        const { profileType } = userData;

        // Vérifier que seul un compte Professional ou Business peut mettre à jour
        if (profileType !== "Professionnel" && profileType !== "Entreprise") {
            return {
                success: false,
                message: "Votre type de compte ne permet pas de modifier les réseaux sociaux.",
            };
        }

        // Mise à jour des socialLinks
        await userRef.update({ socialLinks });

        return {
            success: true,
            message: "Mise à jour réussie !",
        };
    } catch (error) {
        console.error('Erreur de la mise à jour', error);
        return false;
    }
};

const incrementView = async (postID, userID) => {
    try {
        if (!userID) {
            console.error("userID est invalide :", userID);
            return false;
        }

        const userRef = firestore.collection('USERS').doc(userID);
        const postRef = firestore.collection('POSTS').doc(postID);
        const userViewRef = firestore.collection('VIEWS_TRACKING').doc(userID).collection("VIEWS").doc(postID);

        // 🔹 Récupération des documents Firestore en parallèle
        const [userDoc, postDoc, userViewDoc] = await Promise.all([
            userRef.get(),
            postRef.get(),
            userViewRef.get()
        ]);

        if (!userDoc.exists || !postDoc.exists) {
            console.error("L'utilisateur ou l'annonce n'existe pas");
            return false;
        }

        if (userViewDoc.exists) {
            return false; // L'utilisateur a déjà vu cette annonce
        }

        const userData = userDoc.data();
        const postData = postDoc.data();
        const { stats = {} } = postData;
        const { city } = userData;

        // 📌 Initialiser les champs si absents
        const viewsByCity = stats.views_per_city || {};
        const viewsHistory = stats.views_history || {};

        // 🔹 Incrémentation des vues globales et par ville
        viewsByCity[city] = (viewsByCity[city] || 0) + 1;

        // 🔹 Gestion des périodes d'historique des vues
        const now = new Date();
        const todayDate = now.toISOString().split('T')[0]; // Format YYYY-MM-DD

        // Fonction pour récupérer les dates passées
        const getPastDate = (days) => {
            const pastDate = new Date();
            pastDate.setDate(now.getDate() - days);
            return pastDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
        };

        // Initialisation des périodes si elles n'existent pas
        if (!viewsHistory["7"]) viewsHistory["7"] = {};
        if (!viewsHistory["15"]) viewsHistory["15"] = {};
        if (!viewsHistory["30"]) viewsHistory["30"] = {};

        // 🔹 Mise à jour des vues pour aujourd’hui
        viewsHistory["7"][todayDate] = (viewsHistory["7"][todayDate] || 0) + 1;
        viewsHistory["15"][todayDate] = (viewsHistory["15"][todayDate] || 0) + 1;
        viewsHistory["30"][todayDate] = (viewsHistory["30"][todayDate] || 0) + 1;

        // 🔹 Suppression des anciennes dates hors période
        Object.keys(viewsHistory["7"]).forEach(date => {
            if (date < getPastDate(7)) delete viewsHistory["7"][date];
        });
        Object.keys(viewsHistory["15"]).forEach(date => {
            if (date < getPastDate(15)) delete viewsHistory["15"][date];
        });
        Object.keys(viewsHistory["30"]).forEach(date => {
            if (date < getPastDate(30)) delete viewsHistory["30"][date];
        });

        // 📌 Mise à jour Firestore (POSTS + VIEWS_TRACKING)
        await Promise.all([
            postRef.update({
                'stats.views': admin.firestore.FieldValue.increment(1),
                'stats.views_per_city': viewsByCity,
                'stats.views_history': viewsHistory
            }),
            userViewRef.set({ viewed_at: admin.firestore.FieldValue.serverTimestamp() })
        ]);

        console.log("Vue incrémentée avec succès");
        return true;
    } catch (error) {
        console.error("Erreur lors de l'incrémentation des vues:", error);
        return false;
    }
};


const incrementClick = async (postID, userID) => {
    try {
        if (!userID) {
            console.error("userID est invalide :", userID);
            return false;
        }

        const userRef = firestore.collection('USERS').doc(userID);
        const postRef = firestore.collection('POSTS').doc(postID);

        // 🔹 Récupération des documents Firestore en parallèle
        const [userDoc, postDoc] = await Promise.all([userRef.get(), postRef.get()]);

        if (!userDoc.exists || !postDoc.exists) {
            console.error("L'utilisateur ou l'annonce n'existe pas");
            return false;
        }

        const userData = userDoc.data();
        const postData = postDoc.data();
        const { stats = {} } = postData;
        const { city } = userData;

        // 📌 Initialiser les champs si absents
        const clicksByCity = stats.clicks_per_city || {};
        const clicksHistory = stats.clicks_history || {};

        // 🔹 Incrémentation des clics globaux et par ville
        clicksByCity[city] = (clicksByCity[city] || 0) + 1;

        // 🔹 Gestion des périodes d'historique des clics
        const now = new Date();
        const todayDate = now.toISOString().split('T')[0]; // Format YYYY-MM-DD

        // Fonction pour récupérer les dates passées
        const getPastDate = (days) => {
            const pastDate = new Date();
            pastDate.setDate(now.getDate() - days);
            return pastDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
        };

        // Initialisation des périodes si elles n'existent pas
        if (!clicksHistory["7"]) clicksHistory["7"] = {};
        if (!clicksHistory["15"]) clicksHistory["15"] = {};
        if (!clicksHistory["30"]) clicksHistory["30"] = {};

        // 🔹 Mise à jour des clics pour aujourd’hui
        clicksHistory["7"][todayDate] = (clicksHistory["7"][todayDate] || 0) + 1;
        clicksHistory["15"][todayDate] = (clicksHistory["15"][todayDate] || 0) + 1;
        clicksHistory["30"][todayDate] = (clicksHistory["30"][todayDate] || 0) + 1;

        // 🔹 Suppression des anciennes dates hors période
        Object.keys(clicksHistory["7"]).forEach(date => {
            if (date < getPastDate(7)) delete clicksHistory["7"][date];
        });
        Object.keys(clicksHistory["15"]).forEach(date => {
            if (date < getPastDate(15)) delete clicksHistory["15"][date];
        });
        Object.keys(clicksHistory["30"]).forEach(date => {
            if (date < getPastDate(30)) delete clicksHistory["30"][date];
        });

        // 🔹 Calcul du taux de conversion (Clics / Vues)
        const updatedViews = stats.views || 1; // éviter division par zéro
        const updatedClicks = (stats.clicks || 0) + 1;
        const conversionRate = (updatedClicks / updatedViews) * 100;

        // 📌 Mise à jour Firestore (POSTS)
        await postRef.update({
            'stats.clicks': admin.firestore.FieldValue.increment(1),
            'stats.clicks_per_city': clicksByCity,
            'stats.clicks_history': clicksHistory,
            'stats.conversion_rate': conversionRate
        });

        console.log("Nombre de clics mis à jour avec succès");
        return true;
    } catch (error) {
        console.error("Erreur lors de la mise à jour du nombre de clics:", error);
        return false;
    }
};

const fetchFilteredPostsQuery = async (item, category, minPrice, maxPrice) => {
    try {
        let postRef = firestore.collection('POSTS');

        if (category) postRef = postRef.where('category', '==', category);
        if (minPrice) postRef = postRef.where("details.price", ">=", parseInt(minPrice));
        if (maxPrice) postRef = postRef.where("details.price", "<=", parseInt(maxPrice));

        const querySnapshot = await postRef.get();
        if (querySnapshot.empty) return [];

        let posts = [];
        querySnapshot.forEach(doc => posts.push({ id: doc.id, ...doc.data() }));

        // 🔥 Si `item` est défini, filtrer les résultats en mémoire (Firestore limite les `where`)
        if (item) {
            const keywords = item.toLowerCase().split(/\s+/); // Découpe en mots-clés
            posts = posts.filter(post =>
                post.searchableTerms.some(term => keywords.includes(term.toLowerCase()))
            );
        }

        return posts;
    } catch (error) {
        console.error('Erreur lors de la recherche avancée:', error);
        return [];
    }
};

const publishAdvertising = async (pubData) => {
    try {
        const pubsRef = firestore.collection('ADVERTISING');

        // 📌 Récupérer la dernière publicité créée (triée par pubID)
        const lastPubSnap = await pubsRef.orderBy("pubID", "desc").limit(1).get();
        let lastPubID = "PUB000"; // Valeur par défaut si aucune pub existante
        if (!lastPubSnap.empty) {
            lastPubID = lastPubSnap.docs[0].data().pubID;
        }

        // 📌 Extraire le numéro et incrémenter
        const lastNumber = parseInt(lastPubID.replace("PUB", ""), 10);
        const newNumber = lastNumber + 1;
        const newPubID = `PUB${String(newNumber).padStart(3, "0")}`; // Format PUB001, PUB002
        const newPubRef = pubsRef.doc();

        await newPubRef.set({
            ...pubData,
            clicks: 0,
            views: 0,
            status: 'active',
            reportingCount: 0,
            id: newPubRef.id,
            pubID: newPubID,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            type: 'business',
        });
        return true;
    } catch (error) {
        console.error('Erreur lors de la publication de l\'annonce:', error);
        return null;
    };
};

const collectPubById = async (pub_id) => {
    try {
        const PubID = pub_id.toLocaleUpperCase();
        const pubsRef = firestore.collection('ADVERTISING');
        const querySnapshot = await pubsRef
            .where('pubID', '==', PubID)
            .limit(1)
            .get();

        if (querySnapshot.empty) {
            console.log('Aucune annonce trouvée avec cet ID.');
            return null;
        }

        const pubData = querySnapshot.docs[0].data();
        return pubData;
    } catch (error) {
        console.error('Erreur lors de la collecte par ID:', error);
        return null;
    }
};

const collectPubs = async () => {
    try {
        const pubsRef = firestore.collection('ADVERTISING');
        const querySnapshot = await pubsRef.get();
        if (querySnapshot.empty) return [];

        const pubs = [];
        querySnapshot.forEach(doc => {
            pubs.push({ id: doc.id, ...doc.data() });
        });
        return pubs;
    } catch (error) {
        console.error('Erreur lors de la recherche avancée:', error);
        return [];
    }
};

const collectViewCount = async (postID) => {
    try {
        const postRef = firestore.collection('POSTS').doc(postID);
        const postDoc = await postRef.get();
        if (!postDoc.exists) {
            console.log('Aucun post trouvé avec cet ID.');
            return null;
        }

        const { stats } = postDoc.data() || {};
        const { views } = stats || { views: 0 };

        return views;
    } catch (error) {
        console.error('Erreur lors de la collecte du nombre de vues:', error);
        return null;
    }
}

module.exports = {
    advancedItemSearch,
    collectLocations,
    collectPubs,
    collectViewCount,
    contactUs,
    evaluateUser,
    collectPubById,
    fetchFilteredPostsQuery,
    incrementClick,
    incrementView,
    publishAdvertising,
    searchQuery,
    updateInteraction,
    updateContactClick,
    socialLinksUpdate,
};