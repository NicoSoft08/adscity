import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import data from '../../json/data.json';
import sensitive_cats from '../../json/sensitiveCategories.json';
import './SelectCategory.scss';

export default function SelectCategory({ onNext, formData, setFormData, subcategories }) {
    const [isCatSensitive, setIsCatSensitive] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    // Vérifie si la catégorie sélectionnée est sensible
    useEffect(() => {
        if (formData.category) {
            const isSensitive = sensitive_cats.sensitive_cats.some(cat => cat.categoryName === formData.category);
            setIsCatSensitive(isSensitive);

            if (isSensitive) {
                setFormData(prevState => ({ ...prevState, subcategory: '' })); // ✅ Évite la boucle infinie
                setIsVerified(false);
            }
        }
    }, [formData.category, setFormData]);

    const handleChangeCategory = (e) => {
        const { value } = e.target;
        setFormData({ ...formData, category: value, subcategory: '' });
    };

    return (
        <div className='select-cat'>
            <div>
                <select className="input-field" value={formData.category} onChange={handleChangeCategory}>
                    <option value="">-- Sélectionner une catégorie --</option>
                    {data.categories.map(({ key, categoryName, categoryTitles }) => (
                        <option key={key} value={categoryName}>
                            {categoryTitles.fr}
                        </option>
                    ))}
                </select>
            </div>

            {formData.category && (
                isCatSensitive ? (
                    <div className="sensitive-warning">
                        <p>🔒 <strong>Vérification requise pour cette catégorie</strong></p>
                        <p>
                            Pour garantir la sécurité et la qualité des annonces, cette catégorie nécessite une vérification supplémentaire.
                            Veuillez suivre les instructions et fournir les documents requis afin de poursuivre la publication de votre annonce.
                        </p>
                    </div>
                ) : (
                    <div>
                        <select
                            className="input-field"
                            value={formData.subcategory}
                            onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                        >
                            <option value="">-- Sélectionner une sous-catégorie --</option>
                            {subcategories.map(({ sousCategoryName, sousCategoryTitles }) => (
                                <option key={sousCategoryName} value={sousCategoryName}>
                                    {sousCategoryTitles.fr}
                                </option>
                            ))}
                        </select>
                    </div>
                )
            )}


            <div className="contact-support">
                <p>Vous ne trouvez pas la catégorie ? <Link to='/contact-us'>Contactez le support</Link></p>
            </div>

            {formData.subcategory && (
                <button onClick={onNext} disabled={isCatSensitive && !isVerified}>Suivant</button>
            )}
        </div>
    );
};
