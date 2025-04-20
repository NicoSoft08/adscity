import React, { useEffect, useState } from 'react';
import data from '../../json/data.json';
import formFields from '../../json/formFields.json';
import InputField from '../../hooks/input-field/InputField';
import { fetchApprovedPosts } from '../../routes/postRoutes';
import CardList from '../../utils/card/CardList';
import CardItem from '../../utils/card/CardItem';
import '../../styles/FiltersPage.scss';

const FilterForm = ({ onFilterChange }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        priceRange: { min: 0, max: 1000 },
        category: 'All',
        subcategory: 'All',
        sortBy: 'newest',
    });

    return (
        <div className="filter-form">
            <label htmlFor="category">Catégorie</label>
            {data.categories.map((cat) => (
                <div key={cat.id}>
                    <input
                        type="checkbox"
                        id={cat.key}
                        name={cat.categoryName}
                        value={cat.categoryName}
                        checked={filters.category === cat.categoryName}
                        onChange={(e) => {
                            setFilters({
                                ...filters,
                                category: e.target.value,
                            });
                        }}
                    />
                    <label htmlFor={cat.key}>{cat.categoryTitles.fr}</label>
                </div>
            ))}

            {filters.category && (
                <div>
                    <label htmlFor="subcategory">Sous-catégorie</label>
                    {data.categories.find((cat) => cat.categoryName === filters.category).container.map((subCat) => (
                        <div key={subCat.id}>
                            <input
                                type="checkbox"
                                id={subCat.id}
                                name={subCat.sousCategoryName}
                                value={subCat.sousCategoryName}
                                checked={filters.subcategory === subCat.sousCategoryName}
                                onChange={(e) => {
                                    setFilters({
                                        ...filters,
                                        subcategory: e.target.value,
                                    });
                                }}
                            />
                            <label htmlFor={subCat.sousCategoryName}>{subCat.sousCategoryTitles.fr}</label>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default function FiltersPage() {
    const [posts, setPosts] = useState([]);
    const [filters, setFilters] = useState({
        category: '',
        subcategory: '',
    });

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const result = await fetchApprovedPosts();
    //         if (result.success) {
    //             setPosts(result.approvedPosts);
    //             setFilters(result.approvedPosts);
    //         }
    //     };

    //     fetchData();
    // }, [posts]);

    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        console.log('Selected Category:', selectedCategory);
        setFilters({
            category: selectedCategory,
            subcategory: '', // Réinitialiser la sous-catégorie si la catégorie change
        });
    };

    const handleSubcategoryChange = (e) => {
        const selectedSubcategory = e.target.value;
        console.log('Selected Subcategory:', selectedSubcategory);
        setFilters((prev) => ({
            ...prev,
            subcategory: selectedSubcategory,
        }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFilters((prevFilters) => {
            if (type === 'checkbox') {
                // S'assurer que filters[name] est bien un tableau avant d'utiliser .includes()
                const currentValues = Array.isArray(prevFilters[name]) ? prevFilters[name] : [];

                return {
                    ...prevFilters,
                    [name]: checked
                        ? [...currentValues, value] // Ajouter la valeur si cochée
                        : currentValues.filter((item) => item !== value), // Retirer la valeur si décochée
                };
            } else {
                return { ...prevFilters, [name]: value };
            }
        });
    };

    return (
        <div className='filters'>
            <h2>FiltersPage</h2>
            <div className="container">

                <div className="filter-display">
                    <CardList>
                        {posts.map((post, index) => (
                            <CardItem key={index} post={post} />
                        ))}
                    </CardList>
                </div>

                <div className='filters-container'>
                    <FilterForm />
                </div>
            </div>
        </div>
    );
};
