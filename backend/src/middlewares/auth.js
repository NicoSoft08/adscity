const { auth, firestore } = require('../config/firebase-admin');
const jwt = require('jsonwebtoken');

// Check Auth
const checkAuth = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Token non fourni.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Stocker les informations décodées pour les utiliser dans les routes
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token invalide.' });
    }
};


// Check Admin Role
const checkAdminRole = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const decodedToken = await auth.verifyIdToken(token);

        const userDoc = await firestore.collection('USERS').doc(decodedToken.uid).get();
        const userData = userDoc.data();

        if (userData.role === 'admin') {
            next(); // L'utilisateur est admin, continuer
        } else {
            res.status(403).json({
                success: false,
                message: 'Accès refusé : Vous n\'êtes pas administrateur.'
            });
        }
    } catch (error) {
        console.error('Erreur lors de la vérification du rôle admin:', error);
        res.status(401).json({
            success: false,
            message: 'Utilisateur non authentifié ou rôle non autorisé.'
        });
    }
};

// Check User Role
const checkUserRole = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const decodedToken = await auth.verifyIdToken(token);

        const userDoc = await firestore.collection('USERS').doc(decodedToken.uid).get();
        const userData = userDoc.data();

        if (userData.role === 'user') {
            next(); // L'utilisateur est user, continuer
        } else {
            res.status(403).json({
                success: false,
                message: 'Accès refusé : Vous n\'êtes pas utilisateur.'
            });
        }
    } catch (error) {
        console.error('Erreur lors de la vérification du rôle user:', error);
        res.status(401).json({
            success: false,
            message: 'Utilisateur non authentifié ou rôle non autorisé.'
        });
    }
};


module.exports = { 
    checkAuth, 
    checkAdminRole, 
    checkUserRole,
};