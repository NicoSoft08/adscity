import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebaseConfig";

const getStatus = async () => {
    try {
        const now = new Date();
        const statusesRef = collection(firestore, 'STATUS');
        const query = query(
            statusesRef,
            where('status', '===', 'approved'),
            where('expireAt', '<', now)
        );
        const querySnapshot = await getDocs(query);
        const statusData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        return statusData;

    } catch (error) {
        console.error('Erreur pendant la collecte des données: ', error);
    }
};


export { getStatus };