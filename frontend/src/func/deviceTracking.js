import { UAParser } from "ua-parser-js";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const collectDeviceInfo = async () => {
    const parser = new UAParser();
    const result = parser.getResult();
    const ipData = await fetchIPAddress();

    return {
        browser: `${result.browser.name} ${result.browser.version}`,
        os: `${result.os.name} ${result.os.version}`,
        device: result.device.type || 'desktop',
        ipAddress: ipData.ip,
        timestamp: Date.now(),
    };
};

const verifyDeviceRequest = async (deviceId, token) => {
    const response = await fetch(`${backendUrl}/auth/verify-device/${deviceId}/${token}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deviceId, token }),
    });

    return response.json();
};


const fetchIPAddress = async () => {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data;  // Direct IP return
};


export { fetchIPAddress, verifyDeviceRequest, collectDeviceInfo };
