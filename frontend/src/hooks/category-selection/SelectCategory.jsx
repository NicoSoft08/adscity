import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import data from '../../json/data.json';
import sensitive_cats from '../../json/sensitiveCategories.json';
import formFields from "../../json/formFields.json";
import './SelectCategory.scss';

export default function SelectCategory({ onNext, formData, setFormData }) {
    // Récupérer la liste des sous-catégories selon la catégorie sélectionnée
    const subcategories = useMemo(() => {
        const categoryData = data.categories.find(cat => cat.categoryName === formData.category);
        return categoryData ? categoryData.container || [] : [];
    }, [formData.category]);

    // Vérifie si la catégorie sélectionnée est sensible
    const isCatSensitive = useMemo(() => {
        return sensitive_cats.sensitive_cats.some(cat => cat.categoryName === formData.category);
    }, [formData.category]);

    // Met à jour les champs dynamiques en fonction de la sous-catégorie
    useEffect(() => {
        if (formData.subcategory) {
            const fields = formFields.fields[formData.subcategory] || [];
            const initialData = fields.reduce((acc, field) => {
                acc[field.name] = field.type === "checkbox" || field.type === "file" ? [] : "";
                return acc;
            }, {});

            setFormData(prev => ({ ...prev, details: initialData }));
        }
    }, [formData.subcategory, setFormData]);

    // Gestion des changements de catégorie
    const handleChangeCategory = (e) => {
        const newCategory = e.target.value;
        setFormData(prev => ({ ...prev, category: newCategory, subcategory: '' }));
    };

    // Gestion des changements de sous-catégorie
    const handleChangeSubcategory = (e) => {
        setFormData(prev => ({ ...prev, subcategory: e.target.value }));
    };

    return (
        <div className='select-cat'>
            {/* Sélection de la catégorie */}
            <select className="input-field" value={formData.category} onChange={handleChangeCategory}>
                <option value="">-- Sélectionner une catégorie --</option>
                {data.categories.map(({ key, categoryName, categoryTitles }) => (
                    <option key={key} value={categoryName}>
                        {categoryTitles.fr}
                    </option>
                ))}
            </select>

            {/* Si une catégorie est sélectionnée */}
            {formData.category && (
                isCatSensitive ? (
                    <div className="sensitive-warning">
                        <p>🔒 <strong>Vérification requise pour cette catégorie</strong></p>
                        <p>Pour garantir la sécurité et la qualité des annonces, une vérification supplémentaire est requise.</p>
                        <p>ℹ️ Ce système est en cours de mise en place. Merci de votre patience.</p>
                    </div>
                ) : (
                    <select
                        className="input-field"
                        value={formData.subcategory}
                        onChange={handleChangeSubcategory}
                    >
                        <option value="">-- Sélectionner une sous-catégorie --</option>
                        {subcategories.map(({ sousCategoryName, sousCategoryTitles }) => (
                            <option key={sousCategoryName} value={sousCategoryName}>
                                {sousCategoryTitles.fr}
                            </option>
                        ))}
                    </select>
                )
            )}

            {/* Contact support */}
            <div className="contact-support">
                <p>Vous ne trouvez pas la catégorie ? <Link to='/contact-us'>Contactez le support</Link></p>
            </div>

            {/* Bouton Suivant */}
            {formData.subcategory && (
                <button onClick={onNext} disabled={isCatSensitive}>Suivant</button>
            )}
        </div>
    );
};
