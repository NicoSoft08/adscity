import { logEvent } from 'firebase/analytics';
import React, { useState, useEffect } from 'react';
import { analytics } from '../../firebaseConfig';
import Toast from '../../customs/Toast';

const ChronoWatch = () => {
    const [minutes, setMinutes] = useState(15);
    const [seconds, setSeconds] = useState(0);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    useEffect(() => {
        const timer = setInterval(() => {
            // decrease secondes
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
            // derease minutes and reset secondes to 59
            else if (minutes > 0) {
                setMinutes(minutes - 1);
                setSeconds(59);
            }
            // stop timer when time is over
            else {
                clearInterval(timer);
                setToast({ show: true, type: 'info', message: "Le temps est écoulé !" });
                trackTimerFinish(timer);
            }
        }, 1000);
        // clear timer
        return () => clearInterval(timer);
    }, [minutes, seconds]);

    const minutesColor = `rgb(${255 - (minutes / 15) * 255}, ${(minutes / 15) * 255}, 0)`;
    const secondsColor = `rgb(${255 - (seconds / 60) * 255}, 0, ${(seconds / 60) * 255})`;

    const trackTimerFinish = (timer) => {
        if (timer === 0) {
            logEvent(analytics, 'timing_complete', { page_path: window.location.pathname });
        }
    }

    const handleHide = () => {
        setToast({
            ...toast,
            show: false,
        });
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                    style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: `conic-gradient(${minutesColor} ${(minutes / 15) * 360}deg, #ccc 0deg)`,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: '20px',
                    }}
                >
                    <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{minutes}</span>
                </div>
                <div
                    style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: `conic-gradient(${secondsColor} ${(seconds / 60) * 360}deg, #ccc 0deg)`,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{seconds}</span>
                </div>
            </div>
            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={handleHide}
            />
        </div>
    );
}

export default ChronoWatch;