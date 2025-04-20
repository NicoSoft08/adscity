import React, { useState } from 'react';
import './ImageSlider.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

export default function ImageSlider({ images }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === images.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    return (
        <div className="slider-container">
            <div className="left-arrow" onClick={goToPrevious}>
                <FontAwesomeIcon icon={faChevronLeft} />
            </div>
            <div className="right-arrow" onClick={goToNext}>
                <FontAwesomeIcon icon={faChevronRight} />
            </div>

            {/* Affichage de l'image actuelle */}
            <div className="slide">
                <img src={images[currentIndex]} alt={`Slide ${currentIndex}`} className="slider-image" />
            </div>

            {/* Dots pour chaque image */}
            <div className="dots">
                {images.map((_, index) => (
                    <span
                        key={index}
                        className={index === currentIndex ? 'dot active' : 'dot'}
                        onClick={() => setCurrentIndex(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
};
