import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchDataByUserID, setUserOnlineStatus } from '../routes/userRoutes';
import { auth } from '../firebaseConfig';
import Loading from '../customs/Loading';


// Création du contexte d'authentification
export const AuthContext = createContext();

// Utilisation du contexte pour l'accéder facilement dans les composants
export const useAuth = () => {
    return useContext(AuthContext);
};

// Fournisseur de contexte d'authentification
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribe;

        const initializeAuth = async () => {
            unsubscribe = auth.onAuthStateChanged(async (user) => {
                setLoading(true); // Commencez le chargement à chaque changement d'état
                if (user) {
                    try {
                        // Utilisateur connecté
                        setCurrentUser(user);
                        const userData = await fetchDataByUserID(user.uid);
                        setUserData(userData?.data);
                        setUserRole(userData?.data.role);
                        await setUserOnlineStatus(user.uid, true); // Met à jour le statut en ligne
                    } catch (error) {
                        console.error("Erreur lors de la récupération des données utilisateur :", error);
                    }
                } else {
                    // Utilisateur déconnecté
                    if (currentUser) {
                        await setUserOnlineStatus(currentUser.uid, false);
                    }
                    setCurrentUser(null);
                    setUserData(null);
                    setUserRole(null);
                }
                setLoading(false); // Arrêtez le chargement une fois terminé
            });
        };

        initializeAuth();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [currentUser]);

    useEffect(() => {
        return () => {
            if (currentUser) {
                setUserOnlineStatus(currentUser.uid, false).catch((error) => {
                    console.error("Erreur lors de la mise à jour du statut hors ligne :", error);
                });
            }
        };
    }, [currentUser]);


    if (loading) {
        return <Loading />
    }


    // Fournir les valeurs et les fonctions dans le contexte
    const value = {
        currentUser,
        userData,
        userRole,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
