import React, { useState } from 'react';
import './StarRating.scss';

export default function StarRating({ onRatingChange }) {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);

    const handleClick = (star) => {
        setRating(star);
        onRatingChange(star); // Appelle une fonction parent pour sauvegarder la note
    };

    const handleMouseEnter = (star) => setHoveredRating(star);
    const handleMouseLeave = () => setHoveredRating(0);

    return (
        <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={`star ${star <= (hoveredRating || rating) ? 'filled' : ''}`}
                    onClick={() => handleClick(star)}
                    onMouseEnter={() => handleMouseEnter(star)}
                    onMouseLeave={handleMouseLeave}
                >
                    ★
                </span>
            ))}
        </div>
    );
};
