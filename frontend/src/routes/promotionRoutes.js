const backendUrl = process.env.REACT_APP_BACKEND_URL;

    
const getPromotionLimits = async () => {
    const response = await fetch(`${backendUrl}/api/promotions/limits`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des promotions');
    }

    const result = await response.json();
    // console.log(result);
    return result;
};

const isPromotionActive = async () => {
    const response = await fetch(`${backendUrl}/api/promotions/active`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération de l\'état de la promotion');
    }

    const result = await response.json();
    // console.log(result);
    return result;
};

export { 
    getPromotionLimits, 
    isPromotionActive 
};