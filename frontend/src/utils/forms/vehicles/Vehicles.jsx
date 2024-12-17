import React, { useCallback, useEffect, useState } from 'react';
import { checkTrialValidity } from '../../../services/userService';
import { maxMediaSelectionPerPostInTrial } from '../../../constants';
import { createAd } from '../../../services/adService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faChevronDown, faChevronLeft, faChevronRight, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { carsBodyType, carsFeatures, carsSafetyOptions, carsState, carsTransmission, typeOfFuel } from '../../../data/database';
import { FaRegCheckCircle } from 'react-icons/fa';
import ProgressBar from '../../progress-bar/ProgressBar';
import './Vehicles.scss';

export default function Vehicles({ currentUser, userData }) {
    const totalSteps = 4;
    const [currentStep, setCurrentStep] = useState(1);
    const [showContactInfo, setShowContactInfo] = useState(false);
    const [showAdInfo, setShowAdInfo] = useState(false);
    const [showUploadImages, setShowUploadImages] = useState(false);
    const [showAdSubmit, setShowAdSubmit] = useState(false);
    const [isAdInfoComplete, setIsAdInfoComplete] = useState(false);
    const [isContactInfoComplete, setIsContactInfoComplete] = useState(false);
    const [isImageUploadComplete, setIsImageUploadComplete] = useState(false);
    const [isFormInfoComplete, setIsFormInfoComplete] = useState(false);
    const [errors, setErrors] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageUrls, setImageUrls] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        make: '',
        model: '',
        year: '',
        mileage: '',
        bodyType: '',
        color: '',
        transmission: '',
        fuelType: '',
        enginePower: '',
        doors: '',
        seats: '',
        condition: '',
        features: [],
        safetyOptions: [],
        price: '',
        negotiable: false,
        contactName: userData?.displayName || '',
        contactEmail: userData?.email || '',
        contactPhone: userData?.phoneNumber || '',
        country: userData?.country || '',
        city: userData?.city || '',
        address: userData?.address || '',
        images: [],
        availabilityDate: '',
    });


    const toggleContactInfo = () => setShowContactInfo(!showContactInfo);
    const toggleAdInfo = () => setShowAdInfo(!showAdInfo);
    const toggleUploadImage = () => setShowUploadImages(!showUploadImages);
    const toggleAdSubmit = () => setShowAdSubmit(!showAdSubmit);


    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === "checkbox") {
            const updatedArray = [...formData[name]];
            if (checked) {
                updatedArray.push(value);
            } else {
                const index = updatedArray.indexOf(value);
                if (index > -1) {
                    updatedArray.splice(index, 1);
                }
            }
            setFormData({
                ...formData,
                [name]: updatedArray
            });
        } else if (type === "file") {
            setFormData({
                ...formData,
                [name]: files
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };


    const handleImageChange = async (e) => {
        const userID = currentUser?.uid;
        const files = Array.from(e.target.files);
        await checkTrialValidity(userID).then(isValid => {
            if (isValid) {
                if (files.length + formData.images.length > maxMediaSelectionPerPostInTrial) {
                    setErrors(`Vous pouvez sélectionner jusqu'à ${maxMediaSelectionPerPostInTrial} images pendant votre période d'essai.`);
                    return;
                }
                
                setFormData({
                    ...formData,
                    images: [...formData.images, ...files]
                });
                const previews = files.map((file) => URL.createObjectURL(file));
                setImageUrls([...imageUrls, ...previews]);

                console.log('L\'utilisateur bénéficie encore de la promotion.');
            } else {
                console.log('La promotion de l\'utilisateur a expiré.');
            }
        });
    };


    const handleNext = (value) => {
        if (value === 'one') {
            setCurrentStep((prevStep) => prevStep + 1);
        } else if (value === 'two') {
            setCurrentStep((prevStep) => prevStep + 1);
        } else if (value === 'three') {
            setCurrentStep((prevStep) => prevStep + 1);
        }
    };


    const handlePrev = (value) => {
        if (value === 2) {
            setCurrentStep((prevStep) => prevStep - 1);
        } else if (value === 3) {
            setCurrentStep((prevStep) => prevStep - 1);
        } else if (value === 4) {
            setCurrentStep((prevStep) => prevStep - 1);
        }
    };


    // Function to check if Ad Info is complete
    const checkAdInfoComplete = useCallback(() => {
        const {
            title, description, make, model, year, mileage, bodyType,
            color, transmission, fuelType, enginePower, doors, seats,
            condition, features, safetyOptions, price, country,
            city, address
        } = formData;

        if (
            title.trim() !== '' && description.trim() !== '' &&
            make.trim() !== '' && model.trim() !== '' && year.trim() !== '' &&
            mileage.trim() !== '' && bodyType.trim() !== '' && color.trim() !== '' &&
            transmission.trim() !== '' && fuelType.trim() !== '' &&
            enginePower.trim() !== '' && doors.trim() !== '' && seats.trim() !== '' &&
            condition.trim() !== '' && features.length > 0 && safetyOptions.length > 0 &&
            price.trim() !== '' && country.trim() !== '' && city.trim() !== '' &&
            address.trim() !== ''
        ) {
            setIsAdInfoComplete(true);
        } else {
            setIsAdInfoComplete(false);
        }
    }, [formData]);


    // Function to check if Contact Info is complete
    const checkContactInfoComplete = useCallback(() => {
        const { contactEmail, contactName, contactPhone } = formData;

        if (
            contactEmail.trim() !== '' && contactName.trim() !== '' && contactPhone.trim() !== ''
        ) {
            setIsContactInfoComplete(true);
        } else {
            setIsContactInfoComplete(false);
        }
    }, [formData]);


    // Function to check if Image Upload is complete
    const checkImageUploadComplete = useCallback(() => {
        const { images, availabilityDate } = formData;

        if (
            images.length > 0 && availabilityDate.trim() !== ''
        ) {
            setIsImageUploadComplete(true);
        } else {
            setIsImageUploadComplete(false);
        }
    }, [formData]);


    // Check completeness of each section when form data changes
    useEffect(() => {
        checkAdInfoComplete();
        checkContactInfoComplete();
        checkImageUploadComplete();
    }, [checkAdInfoComplete, checkContactInfoComplete, checkImageUploadComplete]);


    // Check overall form completeness
    useEffect(() => {
        setIsFormInfoComplete(isAdInfoComplete && isContactInfoComplete && isImageUploadComplete);
    }, [isAdInfoComplete, isContactInfoComplete, isImageUploadComplete]);


    const handleSubmitForm = async (e) => { 
        const userID = currentUser?.uid;
        await createAd(userID, formData).then(() => {
            console.log('Ad Posted: ', formData);
        }).catch((err) => {
            console.error(err);
        })
        
    };



    return (
        <div className='form'>
            <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

            {
                currentStep === 1 && (
                    <>
                        <h4>Informations De Contact</h4>
                        <div className="form-details">
                            <div className="detail-container">
                                <div className="section-header" onClick={toggleContactInfo}>
                                    <div className='d-flex-row'>
                                        <p>
                                            {showContactInfo
                                                ? <FontAwesomeIcon icon={faChevronDown} />
                                                : <FontAwesomeIcon icon={faChevronRight} />
                                            }
                                        </p>
                                        <h5>Annonceur</h5>
                                    </div>
                                    <div className='done-icon'>
                                        <p>
                                            {isContactInfoComplete
                                                ? <FontAwesomeIcon icon={faCheckCircle} className='complete' />
                                                : <FaRegCheckCircle className='not-complete' />
                                            }
                                        </p>
                                    </div>
                                </div>
                                {
                                    showContactInfo && (
                                        <>
                                            <label htmlFor="contactName">
                                                Nom Complet
                                                <input
                                                    id="contactName"
                                                    name='contactName'
                                                    type="text"
                                                    value={formData.contactName}
                                                    onChange={handleChange}
                                                />
                                            </label>
                                            <label htmlFor="contactEmail">
                                                Email
                                                <input
                                                    id="contactEmail"
                                                    type="email"
                                                    name='contactEmail'
                                                    value={formData.contactEmail}
                                                    onChange={handleChange}
                                                />
                                            </label>
                                            <label htmlFor="contactPhone">
                                                Téléphone
                                                <input
                                                    id="contactPhone"
                                                    type="tel"
                                                    name='contactPhone'
                                                    value={formData.contactPhone}
                                                    onChange={handleChange}
                                                />
                                            </label>
                                            <div className="button-group">
                                                <button id='continue' onClick={() => handleNext('one')}>
                                                    Continuer <FontAwesomeIcon icon={faChevronRight} />
                                                </button>
                                            </div>
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    </>
                )
            }

            {
                currentStep === 2 && (
                    <>
                        <h4>Détails de l'Annonce</h4>
                        <div className="form-details">
                            <div className="detail-container">
                                <div className="section-header" onClick={toggleAdInfo}>
                                    <div className='d-flex-row'>
                                        <p>
                                            {showAdInfo
                                                ? <FontAwesomeIcon icon={faChevronDown} />
                                                : <FontAwesomeIcon icon={faChevronRight} />
                                            }
                                        </p>
                                        <h5>Informations Sur l'Annonce</h5>
                                    </div>
                                    <div className='done-icon'>
                                        <p>
                                            {isAdInfoComplete
                                                ? <FontAwesomeIcon icon={faCheckCircle} className='complete' />
                                                : <FaRegCheckCircle className='not-complete' />
                                            }
                                        </p>
                                    </div>
                                </div>
                                {
                                    showAdInfo && (
                                        <>
                                            <label>
                                                Titre de l'annonce
                                                <input
                                                    type="text"
                                                    placeholder="Ex: Vente BMW Série 3, 2018, Excellent État"
                                                    name='title'
                                                    value={formData.title}
                                                    onChange={handleChange}
                                                />
                                            </label>
                                            <label>
                                                Description
                                                <textarea
                                                    name="description"
                                                    value={formData.description}
                                                    placeholder="Ex: BMW Série 3 en excellent état, bien entretenue, sans accidents."
                                                    onChange={handleChange}
                                                >
                                                </textarea>
                                            </label>
                                            <label>
                                                Marque
                                                <input
                                                    type="text"
                                                    name='make'
                                                    placeholder='Ex: BMW'
                                                    value={formData.make}
                                                    onChange={handleChange}
                                                />
                                            </label>
                                            <label>
                                                Modèle
                                                <input
                                                    type="text"
                                                    name='model'
                                                    placeholder="Ex: Série 3"
                                                    value={formData.model}
                                                    onChange={handleChange}
                                                />
                                            </label>
                                            <label>
                                                Année de Fabrication
                                                <input
                                                    type="number"
                                                    name="year"
                                                    placeholder="Ex: 2018"
                                                    value={formData.year}
                                                    onChange={handleChange}
                                                />
                                            </label>
                                            <label>
                                                Kilométrage
                                                <input
                                                    type="number"
                                                    name="mileage"
                                                    placeholder="Ex: 45000 km"
                                                    value={formData.mileage}
                                                    onChange={handleChange}
                                                />
                                            </label>
                                            <label>
                                                Type de Carrosserie
                                                <select
                                                    value={formData.bodyType}
                                                    name="bodyType"
                                                    placeholder="Ex: Berline"
                                                    onChange={handleChange}
                                                >
                                                    <option value="">-- Choisissez --</option>
                                                    {carsBodyType.fr.map((index) => (
                                                        <option key={index} value={index}>{index}</option>
                                                    ))}
                                                </select>
                                            </label>
                                            <label>
                                                Couleur
                                                <input
                                                    type="text"
                                                    name="color"
                                                    placeholder="Ex: Noir"
                                                    value={formData.color}
                                                    onChange={handleChange}
                                                />
                                            </label>
                                            <label>
                                                Type de Transmission
                                                <select
                                                    value={formData.transmission}
                                                    name="transmission"
                                                    onChange={handleChange}
                                                >
                                                    <option value="">-- Choisissez --</option>
                                                    {carsTransmission.fr.map((index) => (
                                                        <option key={index} value={index}>{index}</option>
                                                    ))}
                                                </select>
                                            </label>
                                            <label>
                                                Type de carburant
                                                <select
                                                    name="fuelType"
                                                    value={formData.fuelType}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">-- Choisissez --</option>
                                                    {typeOfFuel.fr.map((index) => (
                                                        <option key={index} value={index}>{index}</option>
                                                    ))}
                                                </select>
                                            </label>
                                            <label>
                                                Puissance du Moteur
                                                <input
                                                    type="text"
                                                    name="enginePower"
                                                    placeholder="Ex: 150 ch"
                                                    value={formData.enginePower}
                                                    onChange={handleChange}
                                                />
                                            </label>
                                            <label>
                                                Nombre de Portes
                                                <input
                                                    type="text"
                                                    name="doors"
                                                    placeholder="Ex: 4 portes"
                                                    value={formData.doors}
                                                    onChange={handleChange}
                                                />
                                            </label>
                                            <label>
                                                Nombre de Sièges
                                                <input
                                                    type="text"
                                                    name="seats"
                                                    placeholder="Ex: 5 sièges"
                                                    value={formData.seats}
                                                    onChange={handleChange}
                                                />
                                            </label>
                                            <label>
                                                État Général
                                                <select
                                                    value={formData.condition}
                                                    name="condition"
                                                    onChange={handleChange}
                                                >
                                                    <option value="">-- Choisissez --</option>
                                                    {carsState.fr.map((index) => (
                                                        <option key={index} value={index}>{index}</option>
                                                    ))}
                                                </select>
                                            </label>
                                            <label>
                                                Caractéristiques
                                                {carsFeatures.fr.map((feature, index) => (
                                                    <div key={index}>
                                                        <input
                                                            type='checkbox'
                                                            name="features"
                                                            value={feature}
                                                            checked={formData.features.includes(feature)}
                                                            onChange={handleChange}
                                                        />
                                                        {feature}
                                                    </div>
                                                ))}
                                            </label>
                                            <label>
                                                Options de Sécurité
                                                {carsSafetyOptions.fr.map((option, index) => (
                                                    <div key={index}>
                                                        <input
                                                            type='checkbox'
                                                            name="safetyOptions"
                                                            value={option}
                                                            checked={formData.safetyOptions.includes(option)}
                                                            onChange={handleChange}
                                                        />
                                                        {option}
                                                    </div>
                                                ))}
                                            </label>
                                            <label>
                                                Prix de Vente (RUB)
                                                <input
                                                    type="number"
                                                    name='price'
                                                    value={formData.price}
                                                    onChange={handleChange}
                                                />
                                            </label>
                                            <label id='checkbox'>
                                                Prix négociable ? (Non: par défaut)
                                                <input
                                                    type="checkbox"
                                                    name='negotiable'
                                                    // checked={formData.negotiable}
                                                    value={formData.negotiable}
                                                    onChange={handleChange}
                                                />
                                            </label>
                                            <label htmlFor='userCountry'>
                                                Pays
                                                <input
                                                    type='text'
                                                    name='country'
                                                    value={formData.country}
                                                    onChange={handleChange}
                                                />
                                            </label>
                                            <label htmlFor="userCity">
                                                Ville
                                                <input
                                                    type='text'
                                                    name='city'
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                />
                                            </label>
                                            <label htmlFor="userAddress">
                                                Adresse
                                                <input
                                                    type="text"
                                                    name='address'
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                />
                                            </label>
                                            <div className="button-group">
                                                <button id='previous' onClick={() => handlePrev(2)}>
                                                    <FontAwesomeIcon icon={faChevronLeft} /> Revenir
                                                </button>
                                                <button id='continue' onClick={() => handleNext('two')}>
                                                    Continuer <FontAwesomeIcon icon={faChevronRight} />
                                                </button>
                                            </div>
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    </>
                )
            }

            {
                currentStep === 3 && (
                    <>
                        <h4>Chargement des Images</h4>
                        <div className="form-details">
                            <div className="detail-container">
                                <div className="section-header" onClick={toggleUploadImage}>
                                    <div className='d-flex-row'>
                                        <p>
                                            {showUploadImages
                                                ? <FontAwesomeIcon icon={faChevronDown} />
                                                : <FontAwesomeIcon icon={faChevronRight} />
                                            }
                                        </p>
                                        <h5>Sélection des images</h5>
                                    </div>
                                    <div className='done-icon'>
                                        <p>
                                            {isImageUploadComplete
                                                ? <FontAwesomeIcon icon={faCheckCircle} className='complete' />
                                                : <FaRegCheckCircle className='not-complete' />
                                            }
                                        </p>
                                    </div>
                                </div>
                                {
                                    showUploadImages && (
                                        <>
                                            <label>
                                                Téléchargez des images
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={handleImageChange}
                                                // required 
                                                />
                                            </label>
                                            <div className="image-preview">
                                                {
                                                    imageUrls.map((preview, index) => (
                                                        <img
                                                            key={index}
                                                            src={preview}
                                                            alt={`Preview ${index}`}
                                                        style={{ width: '100px', height: '100px', marginRight: '10px' }}
                                                        />
                                                    ))
                                                }
                                            </div>
                                            <label>
                                                Date de Disponibilité
                                                <input
                                                    type="text"
                                                    name='availabilityDate'
                                                    placeholder='Ex: Immédiatement'
                                                    value={formData.availabilityDate}
                                                    onChange={handleChange}
                                                />
                                            </label>
                                            <div className="button-group">
                                                <button id='previous' onClick={() => handlePrev(3)}>
                                                    <FontAwesomeIcon icon={faChevronLeft} /> Revenir
                                                </button>
                                                <button id='continue' onClick={() => handleNext('three')}>
                                                    Continuer <FontAwesomeIcon icon={faChevronRight} />
                                                </button>
                                            </div>
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    </>
                )
            }

            {
                currentStep === 4 && (
                    <>
                        <h4>Soumission de l'annonce</h4>
                        <div className="form-details">
                            <div className="detail-container">
                                <div className="section-header" onClick={toggleAdSubmit}>
                                    <div className='d-flex-row'>
                                        <p>
                                            {showAdSubmit
                                                ? <FontAwesomeIcon icon={faChevronDown} />
                                                : <FontAwesomeIcon icon={faChevronRight} />
                                            }
                                        </p>
                                        <h5>Publication</h5>
                                    </div>
                                    <div className='done-icon'>
                                        <p>
                                            {isImageUploadComplete
                                                ? <FontAwesomeIcon icon={faCheckCircle} className='complete' />
                                                : <FaRegCheckCircle className='not-complete' />
                                            }
                                        </p>
                                    </div>
                                </div>

                                <label htmlFor="contactName">
                                    Nom Complet
                                    <input
                                        id="contactName"
                                        name='contactName'
                                        type="text"
                                        value={formData.contactName}
                                        readOnly
                                    />
                                </label>
                                <label htmlFor="contactEmail">
                                    Email
                                    <input
                                        id="contactEmail"
                                        type="email"
                                        name='contactEmail'
                                        value={formData.contactEmail}
                                        readOnly
                                    />
                                </label>
                                <label htmlFor="contactPhone">
                                    Téléphone
                                    <input
                                        id="contactPhone"
                                        type="tel"
                                        name='contactPhone'
                                        value={formData.contactPhone}
                                        readOnly
                                    />
                                </label>
                                <label>
                                    Titre de l'annonce
                                    <input
                                        type="text"
                                        placeholder="Ex: Vente BMW Série 3, 2018, Excellent État"
                                        name='title'
                                        value={formData.title}
                                        readOnly
                                    />
                                </label>
                                <label>
                                    Description
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        placeholder="Ex: BMW Série 3 en excellent état, bien entretenue, sans accidents."
                                        readOnly
                                    >
                                    </textarea>
                                </label>
                                <label>
                                    Marque
                                    <input
                                        type="text"
                                        name='make'
                                        placeholder='Ex: BMW'
                                        value={formData.make}
                                        readOnly
                                    />
                                </label>
                                <label>
                                    Modèle
                                    <input
                                        type="text"
                                        name='model'
                                        placeholder="Ex: Série 3"
                                        value={formData.model}
                                        readOnly
                                    />
                                </label>
                                <label>
                                    Année de Fabrication
                                    <input
                                        type="number"
                                        name="year"
                                        placeholder="Ex: 2018"
                                        value={formData.year}
                                        readOnly
                                    />
                                </label>
                                <label>
                                    Kilométrage
                                    <input
                                        type="number"
                                        name="mileage"
                                        placeholder="Ex: 45000 km"
                                        value={formData.mileage}
                                        readOnly
                                    />
                                </label>
                                <label>
                                    Type de Carrosserie
                                    <select
                                        value={formData.bodyType}
                                        name="bodyType"
                                        placeholder="Ex: Berline"
                                        readOnly
                                    >
                                        <option value="">-- Choisissez --</option>
                                        {carsBodyType.fr.map((index) => (
                                            <option key={index} value={index}>{index}</option>
                                        ))}
                                    </select>
                                </label>
                                <label>
                                    Couleur
                                    <input
                                        type="text"
                                        name="color"
                                        placeholder="Ex: Noir"
                                        value={formData.color}
                                        readOnly
                                    />
                                </label>
                                <label>
                                    Type de Transmission
                                    <select
                                        value={formData.transmission}
                                        name="transmission"
                                        readOnly
                                    >
                                        <option value="">-- Choisissez --</option>
                                        {carsTransmission.fr.map((index) => (
                                            <option key={index} value={index}>{index}</option>
                                        ))}
                                    </select>
                                </label>
                                <label>
                                    Type de carburant
                                    <select
                                        name="fuelType"
                                        value={formData.fuelType}
                                        readOnly
                                    >
                                        <option value="">-- Choisissez --</option>
                                        {typeOfFuel.fr.map((index) => (
                                            <option key={index} value={index}>{index}</option>
                                        ))}
                                    </select>
                                </label>
                                <label>
                                    Puissance du Moteur
                                    <input
                                        type="text"
                                        name="enginePower"
                                        placeholder="Ex: 150 ch"
                                        value={formData.enginePower}
                                        readOnly
                                    />
                                </label>
                                <label>
                                    Nombre de Portes
                                    <input
                                        type="text"
                                        name="doors"
                                        placeholder="Ex: 4 portes"
                                        value={formData.doors}
                                        readOnly
                                    />
                                </label>
                                <label>
                                    Nombre de Sièges
                                    <input
                                        type="text"
                                        name="seats"
                                        placeholder="Ex: 5 sièges"
                                        value={formData.seats}
                                        readOnly
                                    />
                                </label>
                                <label>
                                    État Général
                                    <select
                                        value={formData.condition}
                                        name="condition"
                                        readOnly
                                    >
                                        <option value="">-- Choisissez --</option>
                                        {carsState.fr.map((index) => (
                                            <option key={index} value={index}>{index}</option>
                                        ))}
                                    </select>
                                </label>
                                <label>
                                    Caractéristiques
                                    {carsFeatures.fr.map((feature, index) => (
                                        <div key={index}>
                                            <input
                                                type='checkbox'
                                                name="features"
                                                value={feature}
                                                checked={formData.features.includes(feature)}
                                                readOnly
                                            />
                                            {feature}
                                        </div>
                                    ))}
                                </label>
                                <label>
                                    Options de Sécurité
                                    {carsSafetyOptions.fr.map((option, index) => (
                                        <div key={index}>
                                            <input
                                                type='checkbox'
                                                name="safetyOptions"
                                                value={option}
                                                checked={formData.safetyOptions.includes(option)}
                                                readOnly
                                            />
                                            {option}
                                        </div>
                                    ))}
                                </label>
                                <label>
                                    Prix de Vente (RUB)
                                    <input
                                        type="number"
                                        name='price'
                                        value={formData.price}
                                        readOnly
                                    />
                                </label>
                                <label id='checkbox'>
                                    Prix négociable ? (Non: par défaut)
                                    <input
                                        type="checkbox"
                                        name='negotiable'
                                        checked={formData.negotiable}
                                        readOnly
                                    />
                                </label>
                                <label htmlFor='userCountry'>
                                    Pays
                                    <input
                                        type='text'
                                        name='country'
                                        value={formData.country}
                                        readOnly
                                    />
                                </label>
                                <label htmlFor="userCity">
                                    Ville
                                    <input
                                        type='text'
                                        name='city'
                                        value={formData.city}
                                        readOnly
                                    />
                                </label>
                                <label htmlFor="userAddress">
                                    Adresse
                                    <input
                                        type="text"
                                        name='address'
                                        value={formData.address}
                                        readOnly
                                    />
                                </label>
                                <label>
                                    Photos du Véhicule
                                    <div className="image-preview">
                                        {
                                            imageUrls.map((preview, index) => (
                                                <img
                                                    key={index}
                                                    src={preview}
                                                    alt={`Preview ${index}`}
                                                // style={{ width: '100px', height: '100px', marginRight: '10px' }}
                                                />
                                            ))
                                        }
                                    </div>
                                </label>
                                <label>
                                    Date de Disponibilité
                                    <input
                                        type="text"
                                        name='availabilityDate'
                                        placeholder='Ex: Immédiatement'
                                        value={formData.availabilityDate}
                                        readOnly
                                    />
                                </label>

                                <div className="button-group">
                                    <button id='previous' onClick={() => handlePrev(4)}>
                                        <FontAwesomeIcon icon={faChevronLeft} /> Revenir
                                    </button>
                                    <button
                                        id='post'
                                        type='submit'
                                        disabled={loading}
                                        onClick={handleSubmitForm}
                                    >
                                        <FontAwesomeIcon icon={faPaperPlane} className='svg' />
                                        {loading
                                            ? "Publication"
                                            : "Publier"
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }

        </div>
    );
};
