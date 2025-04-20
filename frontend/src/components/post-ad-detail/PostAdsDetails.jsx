import React from 'react';
import Automobile from '../../utils/forms/automobile/Automobile';
import '../../styles/PostAdsDetails.scss';

export default function PostAdsDetails({
    category, subcategory, images, postType, nextStep, formData,
    currentUser, userData, isCreateSuccess, setIsCreateSuccess
}) {

    const handleSwitchForm = () => {
        switch (category) {
            case 'transport':
                switch (subcategory) {
                    case 'voitures':
                        return <Automobile
                            currentUser={currentUser}
                            userData={userData}
                            images={images}
                            postType={postType}
                            category={category}
                            subcategory={subcategory}
                            isCreateSuccess={isCreateSuccess}
                            setIsCreateSuccess={setIsCreateSuccess}
                            nextStep={nextStep}
                        />;
                    case 'motos-et-scooters':
                        return <div>Motos & Scooters</div>;
                    default:
                        return <div>Autres véhicules</div>;
                }
            case 'electronique':
                switch (subcategory) {
                    case 'telephones-et-tablettes':
                        return <div>Téléphones & Tablettes</div>;
                    case 'ordinateurs':
                        return <div>Ordinateurs</div>;
                    default:
                        return <div>Autres appareils électroniques</div>;
                }
            default:
                return <div>Formulaire non disponible pour cette catégorie</div>;
        }
    }



    return (
        <div className='post-ads-details'>
            <h2>Veuillez fournir les informations suivantes afin de publier !</h2>
            {handleSwitchForm()}
        </div>
    );
};
