import React, { useEffect, useState } from 'react';
import './BannerCarousel.scss';

export default function BannerCarousel({ banners }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 5000); // 🔄 Change de bannière toutes les 5 secondes

        return () => clearInterval(interval);
    }, [banners]);

    if (banners.length === 0) return null;

    const pubType =  banners[currentIndex].pubType;
    if (pubType !== 'masthead') return null;


    return (
        <div className="banner-carousel">
            {banners.map((banner, index) => (
                <div
                    key={index}
                    className={`banner-slide ${index === currentIndex ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${banner.imageUrl})` }}
                    onClick={() => window.open(banner.targetUrl, '_blank')}
                />
            ))}
        </div>
    );
};
