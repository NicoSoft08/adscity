import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebaseConfig';
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
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // L'utilisateur est connecté
                setCurrentUser(user);
                try {
                    const userDocRef = doc(firestore, 'USERS', user.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        setUserData(userDoc.data());

                        // Mise à jour de l'état en ligne dans Firestore
                        await updateDoc(userDocRef, { isOnline: true });
                    }
                } catch (error) {
                    console.error("Erreur lors de la récupération des données utilisateur :", error);
                }
            } else {
                // L'utilisateur est déconnecté
                if (currentUser) {
                    const userDocRef = doc(firestore, 'USERS', currentUser.uid);
                    await updateDoc(userDocRef, { isOnline: false });
                }
                setCurrentUser(null);
                setUserData(null);
            }
            setLoading(false);
        });

        return () => {
            unsubscribe();
            if (currentUser) {
                const userDocRef = doc(firestore, 'USERS', currentUser.uid);
                updateDoc(userDocRef, { isOnline: false }).catch((error) => {
                    console.error("Erreur lors de la mise à jour de l'état de connexion :", error);
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
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}