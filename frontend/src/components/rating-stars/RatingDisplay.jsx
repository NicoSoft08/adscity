import React from 'react';
import './RatingDisplay.scss';

export default function RatingDisplay({ ratings }) {
    return (
        <div className="rating-container">
            <div className="rating-summary">
                <h2>{ratings?.average}</h2>
                <div className='total-stars'>
                    <span className="star">⭐⭐⭐⭐⭐</span>
                    <span className="total">sur {ratings?.total} note(s)</span>
                </div>
            </div>

            <div className="rating-distribution">
                {[5, 4, 3, 2, 1].map((stars) => (
                    <div key={stars} className="rating-row">
                        <span className="stars">
                            {[...Array(stars)].map((_, i) => (
                                <span key={i}>⭐</span>
                            ))}
                        </span>
                        <span className="count">{ratings?.distribution[stars]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
