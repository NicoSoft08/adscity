import React from 'react';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/SearchSection.scss';

export default function SearchSection({ formData, handleChange, allCategories }) {
    return (
        <section className="search-section">
            <div className="search-header">
                <span>Rechercher à partir d'ici</span>
            </div>

            <div className="search-form">
                <select className="select" name="category">
                    <option value="" disabled>Catégorie</option>
                    {allCategories.map((cat) => (
                        <option key={cat.key} value={cat.categoryName}>
                            {cat.categoryTitles.fr}
                        </option>
                    ))}
                </select>

                <input
                    className="input"
                    type="text"
                    name="item"
                    placeholder="Quoi ?"
                    value={formData.item}
                    onChange={handleChange}
                />

                <input
                    className="input"
                    type="text"
                    name="location"
                    placeholder="Où ?"
                    value={formData.location}
                    onChange={handleChange}
                />

                <button className="button">
                    <span>Chercher maintenant</span>
                    <FontAwesomeIcon icon={faArrowRight} />
                </button>
            </div>
        </section>
    );
};
