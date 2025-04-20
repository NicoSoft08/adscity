import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import './ChronoWatch.scss';

const ChronoWatch = ({ initialMinutes = 15, onTimeUp = () => { } }) => {
    const [timeLeft, setTimeLeft] = useState(initialMinutes * 60); // Convert to seconds
    const [isWarning, setIsWarning] = useState(false);
    const [isExpired, setIsExpired] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        // Start the countdown
        intervalRef.current = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(intervalRef.current);
                    setIsExpired(true);
                    onTimeUp();
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        // Clean up on unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [onTimeUp]);

    // Set warning state when less than 5 minutes remain
    useEffect(() => {
        if (timeLeft <= 300 && timeLeft > 0) {
            setIsWarning(true);
        }
    }, [timeLeft]);

    // Format time as MM:SS
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Calculate progress percentage
    const progressPercentage = (timeLeft / (initialMinutes * 60)) * 100;

    return (
        <div className={`chrono-watch ${isWarning ? 'warning' : ''} ${isExpired ? 'expired' : ''}`}>
            <div className="chrono-icon">
                <FontAwesomeIcon icon={isExpired ? faExclamationTriangle : faClock} />
            </div>

            <div className="chrono-display">
                <div className="time-display">{formatTime(timeLeft)}</div>
                <div className="progress-container">
                    <div
                        className="progress-bar"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
                <div className="status-text">
                    {isExpired
                        ? "Temps expiré! Veuillez recommencer le processus de paiement."
                        : isWarning
                            ? "Attention: Temps limité!"
                            : "Temps restant pour effectuer votre paiement"}
                </div>
            </div>
        </div>
    );
};

export default ChronoWatch;
