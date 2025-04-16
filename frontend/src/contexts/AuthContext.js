import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchDataByUserID, setUserOnlineStatus } from '../routes/userRoutes';
import { auth } from '../firebaseConfig';
import Loading from '../customs/Loading';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { logoutUser } from '../routes/authRoutes';


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
        // Check for stored user data on initial load
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUserRole(parsedUser.role);
            } catch (error) {
                console.error("Error parsing stored user data:", error);
                sessionStorage.removeItem('user'); // Remove invalid data
            }
        }

        // Listen for auth state changes from Firebase
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setLoading(true);

            try {
                if (user) {
                    setCurrentUser(user);

                    // Fetch user data from backend
                    const userDataResponse = await fetchDataByUserID(user.uid);
                    if (userDataResponse?.data) {
                        setUserData(userDataResponse.data);
                        setUserRole(userDataResponse.data.role);

                        // Store user data in localStorage
                        sessionStorage.setItem('user', JSON.stringify({
                            uid: user.uid,
                            // email: user.email,
                            // role: userDataResponse.data.role,
                            lastLogin: Date.now()
                        }));

                        // Update online status
                        await setUserOnlineStatus(user.uid, true);
                    }
                } else {
                    // If there was a user before and now there isn't, update online status
                    const previousUserID = currentUser?.uid;
                    if (previousUserID) {
                        await setUserOnlineStatus(previousUserID, false);
                    }

                    // Clear user state
                    setCurrentUser(null);
                    setUserData(null);
                    setUserRole(null);

                    // Clear localStorage
                    sessionStorage.removeItem('token');
                    sessionStorage.removeItem('user');
                }
            } catch (error) {
                console.error("Error in auth state change handler:", error);
            } finally {
                setLoading(false);
            }
        });

        // Cleanup function
        return () => {
            unsubscribe();
        };
    }, [currentUser]); // No dependencies to avoid re-running this effect

    // Handle user going offline when component unmounts or page closes
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (currentUser?.uid) {
                // Using a synchronous approach for beforeunload
                const xhr = new XMLHttpRequest();
                xhr.open('POST', `/api/users/${currentUser.uid}/offline`, false);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify({ isOnline: false }));
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);

            // Also try to set offline when component unmounts
            if (currentUser?.uid) {
                setUserOnlineStatus(currentUser.uid, false).catch(error => {
                    console.error("Error updating offline status on unmount:", error);
                });
            }
        };
    }, [currentUser]);

    // Function to handle logout
    const logout = async () => {
        try {
            const user = auth.currentUser;

            // 1. Update online status
            if (user?.uid) {
                try {
                    await setUserOnlineStatus(user.uid, false);
                } catch (statusError) {
                    console.warn("Failed to update online status:", statusError);
                    // Continue with logout even if this fails
                }
            }

            // 2. Server-side logout
            if (user) {
                try {
                    await logoutUser(user.uid);
                } catch (serverError) {
                    console.warn("Server logout failed:", serverError);
                    // Continue with local logout even if server logout fails
                }
            }

            // 3. Firebase signout
            await signOut(auth);

            // 4. Clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // 5. Return success for UI handling
            return { success: true, message: "Déconnexion réussie." };
        } catch (error) {
            console.error("Error during logout:", error);

            // Force signout in case of error
            try {
                await signOut(auth);
            } catch (signOutError) {
                console.error("Forced signout failed:", signOutError);
            }

            return {
                success: false,
                message: "Erreur lors de la déconnexion. Veuillez réessayer."
            };
        }
    };

    if (loading) {
        return <Loading />
    }


    // Provide values and functions in the context
    const value = {
        currentUser,
        userData,
        userRole,
        logout,
        setUserRole, // Include this if you need to update role elsewhere
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
