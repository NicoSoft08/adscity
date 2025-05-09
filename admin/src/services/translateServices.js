const backendUrl = process.env.REACT_APP_BACKEND_URL;
    

const translateText = async (text, sourceLang, targetLang) => {
    try {
        const response = await fetch(`${backendUrl}/api/translations/translate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text,
                source: sourceLang.toLowerCase(),
                target: targetLang.toLowerCase()
            })
        });

        if (!response.ok) {
            throw new Error('Translation error');
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('API request error:', error);
        return text; // Return original text if request fails
    }
};

export { translateText };