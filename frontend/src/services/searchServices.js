const backendUrl = process.env.REACT_APP_BACKEND_URL;

const searchItems = async (query) => {
    try {
        const response = await fetch(`${backendUrl}/api/search-results?query=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const results = await response.json();
        return results;
    } catch (error) {
        throw error;
    }
};

export { searchItems };