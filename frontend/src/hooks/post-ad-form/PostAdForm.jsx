import PhonesTablets from '../subcat-forms/PhonesTablets';
import Computers from '../subcat-forms/Computers';
import MenClothing from '../subcat-forms/MenClothing';
import WomenClothing from '../subcat-forms/WomenClothing';
import WatcheAndJewelry from '../subcat-forms/WatcheAndJewelry';
import CosmeticsPerfumes from '../subcat-forms/CosmeticsPerfumes';
import MenShoes from '../subcat-forms/MenShoes';
import WomenShoes from '../subcat-forms/WomenShoes';
import LocalProducts from '../subcat-forms/LocalProducts';
import '../../styles/main.scss';

const SUBCATEGORY_COMPONENTS = {
    'telephones-et-tablettes': PhonesTablets,
    'ordinateurs': Computers,
    'vetements-homme': MenClothing,
    'vetements-femme': WomenClothing,
    'montres-et-bijoux': WatcheAndJewelry,
    'cosmetiques-et-parfums': CosmeticsPerfumes,
    'chaussures-homme': MenShoes,
    'chaussures-femme': WomenShoes,
    'produits-locaux': LocalProducts,
    // Add more subcategories here
};

const renderSubcategoryForm = ({ selectedSubcategory, onBack, onNext, formData, onChange }) => {
    const SubcategoryComponent = SUBCATEGORY_COMPONENTS[selectedSubcategory];

    const handleDetailChange = (e) => {
        const { name, value, type, checked } = e.target;
        let updatedValue;

        if (type === 'checkbox') {
            const currentValues = formData.adDetails?.[name] || [];
            updatedValue = checked
                ? [...currentValues, value]
                : currentValues.filter(v => v !== value);
        } else if (type === 'number') {
            updatedValue = value === '' ? '' : Number(value);
        } else {
            updatedValue = value;
        }

        onChange({
            ...formData,
            adDetails: {
                ...formData.adDetails,
                [name]: updatedValue,
            }
        });
    };
    
    if (!SubcategoryComponent) {
        return (
            <div className="no-form-message" style={{ marginTop: '20px', textAlign: 'center', fontWeight: '300' }}>
                <p>Sous-catégorie non reconnue ou pas de formulaire spécifique disponible.</p>
            </div>
        );
    }

    return (
        <SubcategoryComponent
            onBack={onBack}
            onNext={onNext}
            formData={formData}
            onChange={handleDetailChange}
        />
    );
};

export default renderSubcategoryForm;