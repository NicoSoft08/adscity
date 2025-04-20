import React from 'react';
import { formateDateTimestamp } from '../../func';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDesktop, faGlobe, faLock, faMobileAlt, faTrashAlt, faWifi } from '@fortawesome/free-solid-svg-icons';
import './DeviceItem.scss';

export default function DeviceItem({ device, index }) {
    return (
        <div key={index} className="device-item">
            <div className="device-details">
                <p>
                    <FontAwesomeIcon icon={faMobileAlt} />{" "}
                    <strong>Appareil :</strong> {device.device}
                </p>
                <p>
                    <FontAwesomeIcon icon={faDesktop} />{" "}
                    <strong>OS :</strong> {device.os.name} {device.os.version}
                </p>
                <p>
                    <FontAwesomeIcon icon={faGlobe} />{" "}
                    <strong>Navigateur :</strong> {device.browser.name}{" "}
                    {device.browser.version}
                </p>
                <p>
                    <FontAwesomeIcon icon={faWifi} /> <strong>IP :</strong>{" "}
                    {device.ipAddress}
                </p>
                <p>
                    <FontAwesomeIcon icon={faLock} />{" "}
                    <strong>Dernière utilisation :</strong> {formateDateTimestamp(device.lastUsed?._seconds)}
                </p>
                <p>
                    <FontAwesomeIcon icon={faGlobe} />{" "}
                    <strong>Appareil de confiance :</strong>{" "}
                    {device.isTrusted ? "Oui" : "Non"}
                </p>
            </div>
            <button
                className="disconnect-btn"
                onClick={() => alert("Déconnecter l'appareil : " + device.device)}
            >
                <FontAwesomeIcon icon={faTrashAlt} /> Déconnecter
            </button>
        </div>
    );
};
