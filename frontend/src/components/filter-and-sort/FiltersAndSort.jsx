import React, { useState } from 'react';
import { allCategories } from '../../data/database';
import './FiltersAndSort.scss';

function FiltersAndSort({ onFilterChange, onSortChange }) {
    const [filters, setFilters] = useState({
        item: '',
        category: '',
        minPrice: '',
        maxPrice: '',
    });

    const [sortOption, setSortOption] = useState('relevance'); // Par défaut: pertinence

    // Gère les changements des filtres
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    };

    // Gère les changements de tri
    const handleSortChange = (e) => {
        const value = e.target.value;
        setSortOption(value);
        onSortChange(value);
    };

    return (
        <div className="filters-and-sort">
            {/* Filtres */}
            <div className="filters">
                <h4>Filtres</h4>
                <div className="filter-item">
                    <label htmlFor="item">Quoi ?</label>
                    <input
                        type="text"
                        id="item"
                        name="item"
                        value={filters.item}
                        onChange={handleFilterChange}
                        placeholder="Ex : Smartphone"
                    />
                </div>
                <div className="filter-item">
                    <label htmlFor="category">Catégorie :</label>
                    <select name="category" id="category" onChange={handleFilterChange}>
                        <option value="">-- Sélectionner une catégorie --</option>
                        {allCategories.map((category) => (
                            <option key={category.key} value={category.categoryName}>
                                {category.categoryTitles.fr}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="filter-item">
                    <label htmlFor="minPrice">Prix Min :</label>
                    <input
                        type="number"
                        id="minPrice"
                        name="minPrice"
                        value={filters.minPrice}
                        onChange={handleFilterChange}
                        placeholder="Ex : 100"
                    />
                </div>
                <div className="filter-item">
                    <label htmlFor="maxPrice">Prix Max :</label>
                    <input
                        type="number"
                        id="maxPrice"
                        name="maxPrice"
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                        placeholder="Ex : 1000"
                    />
                </div>
                <button className="apply-filters-button" onClick={() => onFilterChange(filters)}>
                    Appliquer les Filtres
                </button>
            </div>

            {/* Tri */}
            <div className="sort">
                <h4>Trier par:</h4>
                <div className='sort-container'>
                    <div>
                        <select value={sortOption} onChange={handleSortChange}>
                            <option value="expensive">Plus Cher</option>
                            <option value="cheaper">Moins Cher</option>
                        </select>
                    </div>
                    <div>
                        <select value={sortOption} onChange={handleSortChange}>
                            <option value="recent">Récent</option>
                            <option value="older">Ancien</option>
                        </select>
                    </div>
                    <div>
                        <select value={sortOption} onChange={handleSortChange}>
                            <option value="much_views">Plus de vues</option>
                            <option value="best_rated">Meilleures notes</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FiltersAndSort;