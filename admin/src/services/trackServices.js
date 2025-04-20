import { UAParser } from 'ua-parser-js';

// Collect device information
const collectDeviceInfo = async () => {

    const parser = new UAParser();
    const result = parser.getResult();

    const deviceInfo = {
        browser: {
            name: result.browser.name,
            version: result.browser.version,
        },
        os: {
            name: result.os.name,
            version: result.os.version,
        },
        device: result.device.type || 'desktop',
        ipAddress: await fetchIPAddress(),
    }

    return deviceInfo;
};


const fetchIPAddress = async () => {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
};



export { collectDeviceInfo };