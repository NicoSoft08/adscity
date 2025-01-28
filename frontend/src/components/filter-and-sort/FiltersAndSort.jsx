import React, { useState } from 'react';
import './FiltersAndSort.scss';

function FiltersAndSort({ onFilterChange, onSortChange }) {
    const [filters, setFilters] = useState({
        minPrice: '',
        maxPrice: '',
        startDate: '',
        endDate: '',
    });

    const [sortOption, setSortOption] = useState('relevance'); // Par défaut: pertinence

    // Gère les changements des filtres
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    };

    // Applique les filtres
    const applyFilters = () => {
        onFilterChange(filters);
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
                <div className="filter-item">
                    <label htmlFor="startDate">Date Début :</label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className="filter-item">
                    <label htmlFor="endDate">Date Fin :</label>
                    <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                    />
                </div>
                <button className="apply-filters-button" onClick={applyFilters}>
                    Appliquer les Filtres
                </button>
            </div>

            {/* Tri */}
            <div className="sort">
                <h4>Tri</h4>
                <select value={sortOption} onChange={handleSortChange}>
                    <option value="relevance">Pertinence</option>
                    <option value="price_asc">Prix : Croissant</option>
                    <option value="price_desc">Prix : Décroissant</option>
                    <option value="date_newest">Date : Plus Récent</option>
                    <option value="date_oldest">Date : Plus Ancien</option>
                </select>
            </div>
        </div>
    );
};

export default FiltersAndSort;