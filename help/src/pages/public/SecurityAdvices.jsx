import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle, faLock, faPhone, faShieldAlt, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { securityAdvice } from '../../config';
import '../../styles/SecurityAdvices.scss';

export default function SecurityAdvices() {
    return (
        <div className="security-advice">
            <h2> {securityAdvice.title} </h2>

            <div className="advice-sections">
                {securityAdvice.sections.map((section, index) => (
                    <div key={index} className="advice-section">
                        <h3>
                            {section.title}
                            <FontAwesomeIcon
                                icon={
                                    section.title.includes('Transactions') ? faShieldAlt :
                                        section.title.includes('Rencontres') ? faUserShield :
                                            section.title.includes('Données') ? faLock :
                                                faExclamationTriangle
                                }
                            />
                        </h3>
                        <ul>
                            {section.tips.map((tip, tipIndex) => (
                                <li key={tipIndex}>
                                    <FontAwesomeIcon icon={faCheckCircle} />
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="emergency-section">
                <h3>{securityAdvice.emergency.title}</h3>
                <ul>
                    {securityAdvice.emergency.contacts.map((contact, index) => (
                        <li key={index}>
                            <FontAwesomeIcon icon={faPhone} />
                            {contact}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
