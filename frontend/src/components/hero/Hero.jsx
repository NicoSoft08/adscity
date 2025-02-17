import React from 'react';
import './Hero.scss';

export default function Hero({ backgroundImage, headerOne, paragraph, postsLength }) {
    const heroStyle = {
        backgroundImage: `url(${backgroundImage})`,
        boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.5)', // Adds overlay shadow
    };

    return (
        <section className="hero" style={heroStyle}>
            <h1>{headerOne}</h1>
            <p>{paragraph}</p>
            <small> {postsLength < 1 ? null : `${postsLength} annonce(s)`} </small>
        </section>
    );
};
