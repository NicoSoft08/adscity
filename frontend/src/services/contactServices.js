const backendUrl = process.env.REACT_APP_BACKEND_URL;


const contactUs = async (formData) => {
    const response = await fetch(`${backendUrl}/api/contact`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData }),
    });

    const result = await response.json();
    return result;
};


export { contactUs };