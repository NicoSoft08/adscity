const backendUrl = process.env.REACT_APP_BACKEND_URL;


const fetchNotifications = async () => {
    const response = await fetch(`${backendUrl}/api/notifications/all`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const result = await response.json();
    return result;
};


export { fetchNotifications };