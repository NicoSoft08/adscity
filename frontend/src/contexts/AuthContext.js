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
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            setLoading(true);
            if (user) {
                try {
                    setCurrentUser(user);
                    const userDataResponse = await fetchDataByUserID(user.uid);
                    setUserData(userDataResponse?.data);
                    setUserRole(userDataResponse?.data.role);
                    await setUserOnlineStatus(user.uid, true);
                } catch (error) {
                    console.error("Erreur lors de la récupération des données utilisateur :", error);
                }
            } else {
                if (currentUser) {
                    await setUserOnlineStatus(currentUser.uid, false);
                }
                setCurrentUser(null);
                setUserData(null);
                setUserRole(null);
            }
            setLoading(false);
        });
    
        return () => {
            if (currentUser) {
                setUserOnlineStatus(currentUser.uid, false).catch((error) => {
                    console.error("Erreur lors de la mise à jour du statut hors ligne :", error);
                });
            }
            unsubscribe();
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
