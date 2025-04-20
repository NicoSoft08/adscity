import React from 'react';
import { allCategories } from '../../data/database';
import '../../styles/CategoryAndSubcategorySelection.scss';

export default function CategoryAndSubcategorySelection({ category, subcategory, setCategory, setSubcategory, nextStep }) {

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        setSubcategory(''); // Reset subcategory
    };

    const handleSubcategoryChange = (e) => {
        setSubcategory(e.target.value);
        setTimeout(() => {
            nextStep();
        }, 2000);
    };

    return (
        <div className="category-subcategory-selection">
            <h2>Dans quelle catégorie et sous-catégorie souhaitez-vous publier ?</h2>
            <div className="content">
                <label htmlFor="category">Catégorie :
                    <select id="category" value={category} onChange={handleCategoryChange}>
                        <option value="">-- Sélectionner une catégorie --</option>
                        {allCategories.map((category) => (
                            <option key={category.key} value={category.categoryName}>
                                {category.categoryTitles.fr}
                            </option>
                        ))}
                    </select>
                </label>

                {category && (
                    <>
                        <label htmlFor="subcategory">Sous-catégorie :
                            <select id="subcategory" onChange={handleSubcategoryChange}>
                                <option value="">-- Sélectionner une sous-catégorie --</option>
                                {allCategories
                                    .find(cat => cat.categoryName === category)?.container.map(
                                        (subcat) => (
                                            <option key={subcat.id} value={subcat.sousCategoryName}>
                                                {subcat.sousCategoryTitles.fr}
                                            </option>
                                        )
                                    )
                                }
                            </select>
                        </label>
                    </>
                )}
            </div>
        </div>
    );
};
