import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import Modal from '../../customs/Modal';
import Toast from '../../customs/Toast';
import '../../styles/Settings.scss';

export default function Settings({ onItemClick }) {
    const { currentUser, userData } = useContext(AuthContext);
    const [selectedField, setSelectedField] = useState(null);
    const [fieldValue, setFieldValue] = useState('');
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [userPersoData, setUserPersoData] = useState({
        email: userData?.email,
        phoneNumber: userData?.phoneNumber,
        address: userData?.address || "Adresse Non Renseignée",
        city: userData?.city || "Ville Non Renseignée",
        country: userData?.country || "Pays Non Renseigné",
        lastName: userData?.lastName,
        firstName: userData?.firstName,
    });
    const [showModal, setShowModal] = useState(false);


    const handleOnClose = () => setShowModal(false);


    const handleNavigateToFAQs = () => {
        onItemClick('support');
    };


    const handleEditClick = (field) => {
        setSelectedField(field);
        setFieldValue(userPersoData[field]);
        setShowModal(true);
    };


    const handleChange = (e) => {
        const { value } = e.target;
        setFieldValue(value);

    }

    const handleSave = async () => {

        const userID = currentUser?.uid;

        handleOnClose();

        try {
            const response = await fetch(`http://localhost:3001/api/update/user/${userID}/${selectedField}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ value: fieldValue }),
            });


            if (response.ok) {
                const result = await response.json();
                console.log('Mise à jour réussie', result);
                setToast({
                    type: 'success',
                    message: 'Mise à jour réussie',
                    show: true,
                });

                setUserPersoData(prevState => ({
                    ...prevState,
                    [selectedField]: fieldValue,
                }))
            } else {
                console.error('Erreur lors de la mise à jour');
                setToast({
                    type: 'error',
                    message: 'Erreur lors de la mise à jour',
                    show: true,
                });
            }
        } catch (error) {
            console.error('Erreur survenue lors de la mise à jour:', error);
            setToast({
                type: 'error',
                message: 'Erreur survenue lors de la mise à jour',
                show: true,
            });
        }
    };

    const hideToast = () => {
        setToast({
            ...toast,
            show: false,
        });
    };

    const renderContent = () => {
        switch (selectedField) {
            case 'address':
                return (
                    <>
                        <label htmlFor="address">
                            <input
                                className='input-field'
                                type="text"
                                name='address'
                                value={fieldValue || userPersoData.address}
                                onChange={handleChange} // Mettre à jour la valeur du champ
                            />
                            <div className="save-btn" onClick={handleSave}>
                                <FontAwesomeIcon title='Enregistrer' icon={faCheck} />
                            </div>
                        </label>
                    </>
                );
            case 'firstName':
                return (
                    <>
                        <label htmlFor="firstName">
                            <input
                                className='input-field'
                                type="text"
                                name='firstName'
                                value={fieldValue || userPersoData.firstName}
                                onChange={handleChange} // Mettre à jour la valeur du champ
                            />
                            <div className="save-btn" onClick={handleSave}>
                                <FontAwesomeIcon title='Enregistrer' icon={faCheck} />
                            </div>
                        </label>
                    </>
                );
            case 'lastName':
                return (
                    <>
                        <label htmlFor="lastName">
                            <input
                                className='input-field'
                                type="text"
                                name='lastName'
                                value={fieldValue || userPersoData.lastName}
                                onChange={handleChange} // Mettre à jour la valeur du champ
                            />
                            <div className="save-btn" onClick={handleSave}>
                                <FontAwesomeIcon title='Enregistrer' icon={faCheck} />
                            </div>
                        </label>
                    </>
                );
            case 'email':
                return (
                    <>
                        <label htmlFor="email">
                            <input
                                className='input-field'
                                type="email"
                                name='email'
                                placeholder={userPersoData?.email}
                                value={fieldValue || userPersoData?.email}
                                onChange={handleChange} // Mettre à jour la valeur du champ
                            />
                            <div className="save-btn" onClick={handleSave}>
                                <FontAwesomeIcon title='Enregistrer' icon={faCheck} />
                            </div>
                        </label>
                    </>
                );
            case 'city':
                return (
                    <>
                        <label htmlFor="city">
                            <input
                                className='input-field'
                                type="text"
                                name='city'
                                value={fieldValue || userPersoData?.city}
                                onChange={handleChange} // Mettre à jour la valeur du champ
                            />
                            <div className="save-btn" onClick={handleSave}>
                                <FontAwesomeIcon title='Enregistrer' icon={faCheck} />
                            </div>
                        </label>
                    </>
                );
            case 'country':
                return (
                    <>
                        <label htmlFor="country">
                            <input
                                className='input-field'
                                type="text"
                                name='country'
                                value={fieldValue || userPersoData?.country}
                                onChange={handleChange} // Mettre à jour la valeur du champ
                            />
                            <div className="save-btn" onClick={handleSave}>
                                <FontAwesomeIcon title='Enregistrer' icon={faCheck} />
                            </div>
                        </label>
                    </>
                );
            case 'phoneNumber':
                return (
                    <>
                        <label htmlFor="phoneNumber">
                            <input
                                className='input-field'
                                type="tel"
                                value={fieldValue || userPersoData?.phoneNumber}
                                onChange={handleChange} // Mettre à jour la valeur du champ
                            />
                            <div className="save-btn" onClick={handleSave}>
                                <FontAwesomeIcon title='Enregistrer' icon={faCheck} />
                            </div>
                        </label>
                    </>
                );
            default:
                return null;
        }
    };



    return (
        <div className='settings'>
            <h2>Paramètres</h2>
            <div className="settings-section">
                <h3>Gestion du Compte</h3>
                <button onClick={() => handleEditClick('firstName')}>Modifier le Prénom</button>
                <button onClick={() => handleEditClick('lastName')}>Modifier le Nom de Famille</button>
                <button onClick={() => handleEditClick('phoneNumber')}>Modifier le Numéro de Téléphone</button>
                <button onClick={() => handleEditClick('country')}>Modifier le Pays</button>
                <button onClick={() => handleEditClick('city')}>Modifier la Ville</button>
                <button onClick={() => handleEditClick('address')}>Modifier l'Adresse</button>

                <button onClick={() => handleEditClick('email')}>Modifier l'Email</button>
                <button onClick={() => handleEditClick('password')}>Changer le Mot de Passe</button>
                <button onClick={() => setShowModal({ deleteUser: true })}>Supprimer le Compte</button>
            </div>
            <div className="settings-section">
                <h3>Préférences</h3>
                <button>Langue</button>
                <button>Thème</button>
                <button>Notifications</button>
            </div>
            <div className="settings-section">
                <h3>Confidentialité et Sécurité</h3>
                <button>Gérer les Autorisations</button>
                <button>Vérification en Deux Étapes</button>
                <button>Sessions Actives</button>
            </div>
            <div className="settings-section">
                <h3>Connectivité</h3>
                <button>Connexions Tierces</button>
                <button>Appareils Connectés</button>
            </div>
            <div className="settings-section">
                <h3>Préférences de Paiement</h3>
                <button>Méthodes de Paiement</button>
                <button>Historique de Paiement</button>
            </div>
            <div className="settings-section">
                <h3>Assistance</h3>
                <button>Support Client</button>
                <button onClick={handleNavigateToFAQs}>FAQs</button>
            </div>
            <Modal
                onShow={showModal}
                onHide={() => setShowModal(false)}
                title={`Modifier le champs`}
                hideText={"Annuler"}
            >
                {renderContent()}
            </Modal>

            <Toast
                type={toast.type}
                message={toast.message}
                show={toast.show}
                onClose={hideToast}
            />

            {showModal
                .resetPassword && (
                    <Modal
                        show={showModal}
                        hide={() => setShowModal({ resetPassword: false })}
                        title={"Modifier votre Mot de Passe"}
                    >
                        <input
                            type="password"
                            name="" id=""
                            value={userPersoData.email}
                        />
                    </Modal>
                )
            }
            {showModal
                .deleteUser && (
                    <Modal
                        show={showModal}
                        hide={() => setShowModal({ deleteUser: false })}
                        title={"Suppression de Compte"}
                    >
                        <span>Veuillez adresser un courrier à l'administrateur de la plateforme à travers l'adresse suivante: <a href="mailto:privacy@adscity.net">privacy@adscity.net</a></span>
                    </Modal>
                )
            }
        </div>
    );
};