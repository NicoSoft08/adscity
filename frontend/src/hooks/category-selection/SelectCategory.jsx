import React from 'react';
import { Link } from 'react-router-dom';
import data from '../../json/data.json';
import './SelectCategory.scss';

export default function SelectCategory({ onNext, formData, setFormData, subcategories }) {
    return (
        <div className='select-cat'>
            <div>
                <select className="input-field" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                    <option value="">-- Sélectionner une catégorie --</option>
                    {data.categories.map(({ key, categoryName, categoryTitles }) => (
                        <option key={key} value={categoryName}>
                            {categoryTitles.fr}
                        </option>
                    ))}
                </select>
            </div>

            {formData.category && (
                <div>
                    <select className="input-field" value={formData.subcategory} onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}>
                        <option value="">-- Sélectionner une sous-catégorie --</option>
                        {subcategories.map(({ sousCategoryName, sousCategoryTitles }) => (
                            <option key={sousCategoryName} value={sousCategoryName}>
                                {sousCategoryTitles.fr}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="contact-support">
                <p>Vous ne trouvez pas la catégorie ? <Link to='/contact-us'>Contactez le support</Link></p>
            </div>

            {formData.subcategory && (
                <button onClick={onNext}>Suivant</button>
            )}
        </div>
    );
};
