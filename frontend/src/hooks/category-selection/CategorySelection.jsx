import React, { useEffect, useState } from 'react';
import { allCategories } from '../../data/database';
import Toast from '../../customs/Toast';
import './CategorySelection.scss';

export default function CategorySelection({ onNext, onChange, formData }) {
    const [selectedCategory, setSelectedCategory] = useState(formData.category || '');
    const [selectedSubcategory, setSelectedSubcategory] = useState(formData.subcategory || '');
    const [toast, setToast] = useState({
        show: false,
        message: '',
        type: '',
    });

    useEffect(() => {
        setToast({
            type: 'info',
            message: 'Veuillez sélectionner une catégorie et une sous-catégorie.',
            show: true,
        });
    }, []);


    const hideToast = () => {
        setToast({
            ...toast,
            show: false,
        });
    };


    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategory(category);
        setSelectedSubcategory(''); // Reset subcategory when category changes
        onChange({ category, subcategory: '' }); // Update form data with the selected category
    };

    const handleSubcategoryChange = (e) => {
        const subcategory = e.target.value;
        setSelectedSubcategory(subcategory);
        onChange({ subcategory }); // Update form data with the selected subcategory
    };

    const handleNext = () => {
        if (!selectedCategory) {
            setToast({
                type: 'error',
                message: 'Veuillez sélectionner une catégorie.',
                show: true,
            });
            return;
        } else if (!selectedSubcategory) {
            setToast({
                type: 'error',
                message: 'Veuillez sélectionner une sous-catégorie.',
                show: true,
            });
            return;
        }

        onNext();
    };

    return (
        <div className='select-cat'>
            <div>
                <select className="input-field" value={selectedCategory} onChange={handleCategoryChange}>
                    <option value="">-- Sélectionner une catégorie --</option>
                    {allCategories.map((category) => (
                        <option key={category.key} value={category.categoryName}>
                            {category.categoryTitles.fr}
                        </option>
                    ))}
                </select>
            </div>
            
            {selectedCategory && (
                <div>
                    <select className="input-field" value={selectedSubcategory} onChange={handleSubcategoryChange}>
                        <option value="">-- Sélectionner une sous-catégorie --</option>
                        {allCategories
                            .find(cat => cat.categoryName === selectedCategory)?.container.map(
                                (subcat) => (
                                    <option key={subcat.id} value={subcat.sousCategoryName}>
                                        {subcat.sousCategoryTitles.fr}
                                    </option>
                                )
                            )
                        }
                    </select>
                </div>
            )}
            
            <button onClick={handleNext}>Suivant</button>

            <Toast
                type={toast.type}
                message={toast.message}
                show={toast.show}
                onClose={hideToast}
            />
        </div>
    );
};
