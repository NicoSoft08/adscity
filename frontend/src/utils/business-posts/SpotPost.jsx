import React, { useState, useEffect } from 'react';
import './SpotPost.scss';

export default function SpotPost({ spots }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % spots.length);
        }, 8000); // 🔄 Change de publicité toutes les 8 secondes

        return () => clearInterval(interval);
    }, [spots]);

    if (spots.length === 0) return null;

    const currentSpot = spots[currentIndex];

    return (
        <div className="right-ad-spot">
            {currentSpot.mediaType === 'image' ? (
                <img
                    src={currentSpot.mediaFile}
                    alt="Publicité"
                    className="ad-image"
                    onClick={() => window.open(currentSpot.targetUrl, '_blank')}
                />
            ) : (
                <video
                    className="ad-video"
                    autoPlay
                    muted
                    loop
                    onClick={() => window.open(currentSpot.targetUrl, '_blank')}
                >
                    <source src={currentSpot.mediaFile} type="video/mp4" />
                </video>
            )}
        </div>
    );
}
