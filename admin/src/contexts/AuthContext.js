import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchDataByUserID, setUserOnlineStatus } from '../services/userServices';
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            const userID = user ? user.uid : null;

            try {
                if (user) {
                    setCurrentUser(user);
                    const data = await fetchDataByUserID(userID);
                    setUserData(data);
                    updateUserStatus(true);
                } else {
                    setCurrentUser(null);
                    setUserData(null);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        });

        const updateUserStatus = async (isOnline) => {
            try {
                if (currentUser) {
                    await setUserOnlineStatus(currentUser.uid, isOnline);
                }
            } catch (error) {
                console.error("Error updating online status:", error);
            }
        };

        const fetchUserData = async () => {
            try {
                if (currentUser) {
                    const data = await fetchDataByUserID(currentUser.uid);
                    setUserData(data);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchUserData();
            updateUserStatus(true);

            return () => {
                updateUserStatus(false);
            };
        } else {
            setLoading(false);
        }

        return () => unsubscribe();
    }, [currentUser]);

    if (loading) {
        return <Loading />
    }

    // Fournir les valeurs et les fonctions dans le contexte
    const value = {
        currentUser,
        userData,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}