const { firestore, admin, auth } = require('../config/firebase-admin');
const { sendSupportEmail, sendUserEmailWithTicket } = require('../controllers/emailController');
const { generateTicketID } = require('../func');

const searchQuery = async (query) => {
    const searchItem = query.toLowerCase().split(' ');

    try {
        const searchResults = await firestore
            .collection('POSTS')
            .where('searchableTerms', 'array-contains-any', searchItem)
            .limit(20)
            .get();

        const results = [];
        for (const doc of searchResults.docs) {
            const data = doc.data();
            results.push({
                id: doc.id,
                ...data
            });
        }
        return results;
    } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        return [];
    };
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

const updateContactClick = async (userID) => {
    try {
        const userRef = firestore.collection('USERS').doc(userID);

        await userRef.update({
            profileViewed: admin.firestore.FieldValue.increment(1),
        });
        return true;
    } catch (error) {
        console.error('Erreur lors de la mise à jour des interactions:', error);
        return false;
    };
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

const incrementView = async (postID) => {
    try {
        const postRef = firestore.collection('POSTS').doc(postID);
        const postDoc = await postRef.get();
        if (!postDoc.exists) {
            console.log('Le post n\'existe pas');
            return false;
        }

        const postData = postDoc.data();
        const views = postData.views || 0;
        await postRef.update({ views: views + 1 });
        console.log('Nombre de vues mis à jour avec succès');
        return true;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du nombre de vues:', error);
        return false;
    }
};

const incrementClick = async (postID) => {
    try {
        const postRef = firestore.collection('POSTS').doc(postID);
        const postDoc = await postRef.get();
        if (!postDoc.exists) {
            console.log('Le post n\'existe pas');
            return false;
        }

        const postData = postDoc.data();
        const clicks = postData.clicks || 0;
        await postRef.update({ clicks: clicks + 1 });
        console.log('Nombre de clicks mis à jour avec succès');
        return true;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du nombre de clicks:', error);
        return false;
    }
};

const fetchFilteredPostsQuery = async (item, category, minPrice, maxPrice) => {
    try {
        let postRef = firestore.collection('POSTS');
        if (item) postRef = postRef.where('searchableTerms', 'array-contains-any', item)
        if (category) postRef = postRef.where('category', '==', category);
        if (minPrice) postRef = postRef.where("adDetails.price", ">=", parseInt(minPrice));
        if (maxPrice) postRef = postRef.where("adDetails.price", "<=", parseInt(maxPrice));

        const querySnapshot = await postRef.get();
        if (querySnapshot.empty) {
            console.log('Aucun post trouvé');
            return [];
        }
        const posts = [];
        querySnapshot.forEach(doc => {
            posts.push({ id: doc.id, ...doc.data() });
        })

        return  posts;
    } catch (error) {
        console.error('Erreur lors de la recherche avancée:', error);
        return [];
    }
};

module.exports = {
    advancedItemSearch,
    collectLocations,
    contactUs,
    evaluateUser,
    fetchFilteredPostsQuery,
    incrementClick,
    incrementView,
    searchQuery,
    updateInteraction,
    updateContactClick,
    socialLinksUpdate,
};