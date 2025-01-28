const { 
    searchQuery, 
    updateInteraction, 
    updateContactClick, 
    contactUs, 
    collectLocations, 
    advancedItemSearch, 
    evaluateUser 
} = require("../firebase/api");

const searchItems = async (req, res) => {
    const { query } = req.query;
    
    try {
        const  searchResults = await searchQuery(query);
        if (!searchResults || searchResults.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Aucun résultat trouvé'
            });
        };
        res.status(200).json({
            success: true,
            message: 'Résultats de recherche',
            searchResults: searchResults
        });
    } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur technique, réessayez plustard'
        }); 
    };
};

const manageInteraction = async (req, res) => {
   const  { postID, userID, category } = req.body;

    try {
        const interactionResult = await updateInteraction(postID, userID, category);
        if (!interactionResult) {
            return res.status(404).json({
                success: false,
                message: 'Interaction non trouvée'
            });
        };
        res.status(200).json({
            success: true,
            message: 'Interaction gérée avec succès'
        });
    } catch (error) {
        consoleole.error('Erreur lors de la gestion de l\'interaction:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur technique, réessayez plustard'
        });
    };
};

const manageContactClick = async (req, res) => {
    const { userID } = req.body;

    try {
        const interactionResult = await updateContactClick(userID);
        if (!interactionResult) {
            return res.status(404).json({
                success: false,
                message: 'Interaction non trouvée'
            });
        };
        res.status(200).json({
            success: true,
            message: 'Interaction gérée avec succès'
        });
    } catch (error) {
        consoleole.error('Erreur lors de la gestion de l\'interaction:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur technique, réessayez plustard'
        });
    };
};

const contactSupportClient = async (req, res) => {
    const { formData } = req.body;

    try {
        const isSent = await contactUs(formData);
        if (!isSent) {
            return res.status(404).json({
                success: false,
                message: 'Erreur lors de la transmission du formulaire'
            });
        };
        res.status(200).json({
            success: true,
            message: 'Formulaire envoyé avec succès'
        });
    } catch (error) {
        console.error('Erreur lors de la transmission du formulaire:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur technique, réessayez plustard'
        });
    };
};

const getPostsLocations = async (req, res) => {
    try {
        const postsLocations = await collectLocations();
        if (!postsLocations || postsLocations.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Aucune localisation trouvée'
            });
        };
        res.status(200).json({
            success: true,
            message: 'Localisations récupérées avec succès',
            postsLocations: postsLocations
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des localisations:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur technique, réessayez plustard'
        });
    };
};

const advancedSearch = async (req, res) => {
    const { queryParams } = req.query;
    const { category, item, location, minPrice, maxPrice } = queryParams;
    try {
        const searchResults = await advancedItemSearch(category, item, location, minPrice, maxPrice);
        if (!searchResults || searchResults.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Aucun résultat trouvé'
            });
        };
        res.status(200).json({
            success: true,
            message: 'Résultats de recherche',
            searchResults: searchResults
        });
    } catch (error) {
        console.error('Erreur lors de la recherche avancée:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur technique, réessayez plustard'
        });
    };
};

const rateUser = async (req, res) => {
    const { userID } = req.params;
    const { rating, comment } = req.body;

    try {
        const isRated = await evaluateUser(userID, rating, comment);
        if (!isRated) {
            return res.status(404).json({
                success: false,
                message: 'Évaluation non trouvée'
            });
        };
        res.status(200).json({
            success: true,
            message: 'Évaluation enregistrée avec succès'
        });
    } catch (error) {
        console.error('Erreur lors de la notation de l\'utilisateur:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur technique, réessayez plustard'
        });
    };
};


module.exports = {
    advancedSearch,
    contactSupportClient,
    getPostsLocations,
    manageInteraction,
    manageContactClick,
    rateUser,
    searchItems,
};