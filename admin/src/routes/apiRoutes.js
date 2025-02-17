const backendUrl = process.env.REACT_APP_BACKEND_URL;

const createPub = async (pubData) => {
    try {
        const response = await fetch(`${backendUrl}/api/do/host/advertising`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pubData),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de la création de la publicité :', error);
        throw error;
    }
};

const fetchPubs = async () => {
    try {
        const response = await fetch(`${backendUrl}/api/do/collect/advertising`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de la récupération des publicités :', error);
        throw error;
    }
};

export {
    createPub,
    fetchPubs,
};