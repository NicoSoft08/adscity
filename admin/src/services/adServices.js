import { doc, updateDoc } from "firebase/firestore";
import { analytics, firestore, storage } from "../firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { logEvent } from "firebase/analytics";

const backendUrl = process.env.REACT_APP_BACKEND_URL

// Fetch all Ads
const fetchAllAds = async () => {
    try {
        const response = await fetch(`${backendUrl}/api/ads/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des annonces.');
        }
        const allAds = await response.json();
        return allAds;
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
}


// Fetch all Approved Ads
const fetchApprovedAds = async () => {
    try {
        const response = await fetch(`${backendUrl}/api/ads/approved`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des annonces approuvées.');
        }
        const approvedAds = await response.json();
        return approvedAds;
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
}


// Fetch all Pending Ads
const fetchPendingAds = async () => {
    try {
        const response = await fetch(`${backendUrl}/api/ads/pending`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des annonces en attente.');
        }
        const pendingAds = await response.json();
        return pendingAds;
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
}


// Fetch all Refused Ads 
const fetchRefusedAds = async () => {
    try {
        const response = await fetch(`${backendUrl}/api/ads/refused`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des annonces refusées.');
        }
        const refusedAds = await response.json();
        return refusedAds;
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
};


// Update Ads status
const updateAdStatus = async (adID, newStatus) => {
    try {
        const adDocRef = doc(firestore, 'REGULAR_ADS', adID);
        await updateDoc(adDocRef, {
            status: newStatus // 'approved' ou 'refused'
        });
        console.log(`Annonce ${adID} mise à jour avec le statut ${newStatus}.`);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut de l\'annonce:', error);
    }
};


// Upload file to Firebase Storage
const uploadFile = async (file, folderPath = 'uploads') => {
    try {
        const storageRef = ref(storage, `${folderPath}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    console.error('Erreur pendant l\'upload:', error);
                    reject(error);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                }
            );
        });
    } catch (error) {
        console.error('Erreur lors de l\'upload du fichier:', error);
    }
};


const onApproveAd = async (adID) => {
    try {
        const response = await fetch(`${backendUrl}/api/ads/approve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ adID }),
        });

        const result = await response.json();

        if (response.ok) {
            console.log('Annonce approuvée avec succès:', result.message);
            logEvent(analytics, 'advertisment_approved');
            fetchPendingAds(); // Rafraîchir la liste après approbation
        } else {
            console.error('Erreur lors de l\'approbation de l\'annonce:', result.error);
        }
    } catch (error) {
        console.error('Erreur lors de la requête d\'approbation:', error);
    }
};


const onRefuseAd = async (adID, reason) => {

    try {
        const response = await fetch(`${backendUrl}/api/ads/refuse`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ adID, reason }),
        });


        const result = await response.json();

        if (response.ok) {
            console.log('Annonce refusée avec succès', result.message);
            logEvent(analytics, 'advertisment_refused');
            fetchPendingAds(); // Rafraîchir la liste après approbation
        } else {
            console.error('Erreur lors du refus de l\'annonce:', result.error);
        }
    } catch (error) {
        console.error('Erreur lors du refus de l\'annonce:', error);
    }
};


export {
    fetchAllAds,
    fetchPendingAds,
    fetchRefusedAds,
    fetchApprovedAds,
    onApproveAd,
    onRefuseAd,


    updateAdStatus,
    uploadFile
};