import React from 'react';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/SearchSection.scss';

export default function SearchSection({ formData, handleChange, handleCountryChange, allCategories, selectedCountry, locations, availableCities }) {

    const handleSearch = () => {
        // Préparez une requête en fonction des filtres sélectionnés
        const queryParams = new URLSearchParams(formData).toString();
        console.log("Filtres appliqués :", queryParams);
        // Effectuez l'appel à l'API ou redirigez l'utilisateur avec les filtres
        window.location.href = `/search-result?${queryParams}`;
    };

    return (
        <section className="search-section">
            <div className="search-header">
                <span>Rechercher à partir d'ici</span>
            </div>

            <div className="search-form">
                {/* Sélection de la catégorie */}
                <select className="select" name="category" value={formData.category} onChange={handleChange}>
                    <option value="" disabled>Catégorie</option>
                    {allCategories.map((cat) => (
                        <option key={cat.key} value={cat.categoryName}>
                            {cat.categoryTitles.fr}
                        </option>
                    ))}
                </select>

                {/* Recherche par mot-clé */}
                <input
                    className="input"
                    type="text"
                    name="item"
                    placeholder="Quoi ?"
                    value={formData.item}
                    onChange={handleChange}
                />

                {/* Localisation */}
                <select
                    className="select"
                    name="country"
                    value={selectedCountry}
                    onChange={handleCountryChange}
                >
                    <option value="" disabled>
                        Pays
                    </option>
                    {locations.map((country) => (
                        <option key={country.id} value={country.id}>
                            {country.id}
                        </option>
                    ))}
                </select>

                {/* Sélection de la ville */}
                <select
                    className="select"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    disabled={!selectedCountry}
                >
                    <option value="" disabled>
                        Ville
                    </option>
                    {availableCities.map((city, index) => (
                        <option key={index} value={city}>
                            {city}
                        </option>
                    ))}
                </select>

                {/* Filtre par prix */}
                <div className="price-filter">
                    <input
                        className="input"
                        type="number"
                        name="minPrice"
                        placeholder="Prix min"
                        value={formData.minPrice}
                        onChange={handleChange}
                    />
                    <input
                        className="input"
                        type="number"
                        name="maxPrice"
                        placeholder="Prix max"
                        value={formData.maxPrice}
                        onChange={handleChange}
                    />
                </div>

                {/* Bouton de recherche */}
                <button className="button" onClick={handleSearch}>
                    <span>Chercher maintenant</span>
                    <FontAwesomeIcon icon={faArrowRight} />
                </button>
            </div>
        </section>
    );
};
