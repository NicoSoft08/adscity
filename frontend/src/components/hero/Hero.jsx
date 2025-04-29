import React, { useContext } from 'react';
import { LanguageContext } from '../../contexts/LanguageContext';
import './Hero.scss';

export default function Hero({ headerOne, paragraph, postsLength }) {
    const { language } = useContext(LanguageContext);

    return (
        <section className="hero">
            <h1>{headerOne}</h1>
            <p>{paragraph}</p>

            <small> {language === 'FR' ?
                postsLength > 1 ? `${postsLength} annonces` : `${postsLength} annonce`
                : postsLength > 1 ? `${postsLength} ads` : `${postsLength} ad`} </small>
        </section>
    );
};
