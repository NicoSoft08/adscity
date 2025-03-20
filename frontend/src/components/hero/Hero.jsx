import React from 'react';
import './Hero.scss';

export default function Hero({ headerOne, paragraph, postsLength }) {
    
    return (
        <section className="hero">
            <h1>{headerOne}</h1>
            <p>{paragraph}</p>
            <small> {postsLength < 1 ? null : `${postsLength} annonce(s)`} </small>
        </section>
    );
};
