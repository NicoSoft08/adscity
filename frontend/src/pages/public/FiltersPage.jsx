import React from 'react';
import FiltersAndSort from '../../components/filter-and-sort/FiltersAndSort';

export default function FiltersPage() {
    
    const handleFilterChange = (filter) => {
        // Gérer le changement de filtre
    };

    const handleSortChange = (sort) => {
        // Gérer le changement de tri
    };
    return (
        <div>
            <h2>Filters Page</h2>
            <FiltersAndSort onFilterChange={handleFilterChange} onSortChange={handleSortChange} />
        </div>
    );
};
