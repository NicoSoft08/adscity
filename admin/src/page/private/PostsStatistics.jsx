import React, { useContext, useEffect, useState } from 'react';
import {
    faListAlt,
    faClock,
    faCheckCircle,
    faTimesCircle,
    faPlusSquare,
    faEye,
    faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    fetchAllPosts,
    fetchApprovedPosts,
    fetchPendingPosts,
    fetchRefusedPosts
} from '../../routes/postRoutes';
import Modal from '../../customs/Modal';
import Toast from '../../customs/Toast';
import Spinner from '../../customs/Spinner';
import { addNewAdmin } from '../../routes/authRoutes';
import { countries } from '../../data/countries';
import { AuthContext } from '../../contexts/AuthContext';
import '../../styles/PostsStatistics.scss';
import '../../styles/PhoneInput.scss';


const Stats = ({ allPosts, pendingPosts, approvedPosts, refusedPosts }) => {
    return (
        <div className="ads-statistics">
            {/* Bloc pour toutes les annonces */}
            <div className="stat-block all">
                <FontAwesomeIcon icon={faListAlt} className="icon" />
                <div className="stat-info">
                    <h3>Toutes</h3>
                    <p>{allPosts} annonce(s)</p>
                </div>
            </div>

            {/* Bloc pour les annonces en attente */}
            <div className="stat-block pending">
                <FontAwesomeIcon icon={faClock} className="icon" />
                <div className="stat-info">
                    <h3>En attente</h3>
                    <p>{pendingPosts} annonce(s)</p>
                </div>
            </div>

            {/* Bloc pour les annonces approuvées */}
            <div className="stat-block approved">
                <FontAwesomeIcon icon={faCheckCircle} className="icon" />
                <div className="stat-info">
                    <h3>Approuvées</h3>
                    <p>{approvedPosts} annonce(s)</p>
                </div>
            </div>

            {/* Bloc pour les annonces refusées */}
            <div className="stat-block refused">
                <FontAwesomeIcon icon={faTimesCircle} className="icon" />
                <div className="stat-info">
                    <h3>Refusées</h3>
                    <p>{refusedPosts} annonce(s)</p>
                </div>
            </div>
        </div>
    );
};


export default function PostsStatistics() {
    const { currentUser, userData } = useContext(AuthContext);
    const [step, setStep] = useState(1);
    const [isOpen, setIsOpen] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [selectedCountry, setSelectedCountry] = useState(countries[0]);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        password: '',
        permissions: []
    });
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [posts, setPosts] = useState([]);
    const [postsPending, setPostsPending] = useState([]);
    const [postsApproved, setPostsApproved] = useState([]);
    const [postsRefused, setPostsRefused] = useState([]);

    const adminLevels = [
        { value: 'MANAGE_POSTS', label: 'Gestion des Annonces' },
        { value: 'MANAGE_USERS', label: 'Gestion des Utilisateurs' },
        { value: 'MANAGE_PAYMENTS', label: 'Gestion des Paiements' },
        { value: 'SUPER_ADMIN', label: 'Super Admin' }
    ];

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Fetch all the ads data in parallel
                const [allPosts, pendingPosts, approvedPosts, refusedPosts] = await Promise.all([
                    fetchAllPosts(),
                    fetchPendingPosts(),
                    fetchApprovedPosts(),
                    fetchRefusedPosts(),
                ]);

                // Vérification des données renvoyées
                setPosts(allPosts?.postsData || []); 
                setPostsPending(pendingPosts?.pendingPosts || []); 
                setPostsApproved(approvedPosts?.approvedPosts || []); 
                setPostsRefused(refusedPosts?.refusedPosts || []); 
            } catch (error) {
                console.error('Erreur lors de la récupération des annonces:', error);
            }
        };


        fetchAllData();
    }, []);

    const validateInputs = () => {
        const formErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.firstName) {
            errors.firstName = "Prénoms réquis";
        }
        if (!formData.lastName) {
            errors.lastName = "Nom de Famille réquis";
        }
        if (!formData.phoneNumber) {
            errors.phoneNumber = "Numéro de téléphone réquis";
        }
        if (!formData.email) {
            errors.email = "Email réquis";
        }
        if (!emailRegex.test(formData.email)) {
            formErrors.email = 'Veuillez entrer un email valide';
        }
        if (!formData.password) {
            errors.password = "Mot de passe réquis";
        }
        if (!formData.permissions.length) {
            errors.permissions = 'Veuillez sélectionner au moins une permission.';
        }

        return formErrors;
    };

    const handleClickAddAdmin = () => {
        if (currentUser && userData.permissions.includes('SUPER_ADMIN')) {
            setIsOpen(true);
            setStep(1);
        } else {
            setToast({
                show: true,
                type: 'error',
                message: 'Vous n\'avez pas les autorisations pour ajouter un administrateur.'
            });
        }
    };


    const handleColse = () => setIsOpen(false);

    const handleCloseConfirm = () => {
        setConfirm(false);
        setIsOpen(false);
        setFormData({
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            password: '',
            permissions: []
        });
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
    
        if (name === 'permissions') {
            // Gérer les autorisations (checkboxes multiples)
            setFormData((prev) => ({
                ...prev,
                permissions: checked
                    ? [...prev.permissions, value]
                    : prev.permissions.filter((perm) => perm !== value),
            }));
        } else if (name === 'phoneNumber') {
            // Nettoyer les caractères non numériques pour les numéros de téléphone
            const numericValue = value.replace(/\D/g, '');
            setFormData((prev) => ({
                ...prev,
                [name]: numericValue,
            }));
        } else {
            // Gérer les autres types de champs (y compris les checkbox simples)
            setFormData((prev) => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            }));
        }
    };

    const handleCountryChange = (e) => {
        const countryCode = e.target.value;
        const selectedCountry = countries.find(country => country.code === countryCode);
        setSelectedCountry(selectedCountry);
    };

    const getFullPhoneNumber = () => {
        return `${selectedCountry.dialCode}${formData.phoneNumber}`;
    };


    const handleConfirm = () => {
        const formErrors = validateInputs();

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            setIsLoading(false);
            return;
        };

        // handleColse();
        setConfirm(true);
    }

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const fullPhoneNumber = getFullPhoneNumber();
        const { firstName, lastName, email, password, permissions } = formData;

        const result = await addNewAdmin(firstName, lastName, email, fullPhoneNumber, password, permissions);

        if (result.success) {
            setTimeout(() => {
                setToast({
                    show: true,
                    type: 'success',
                    message: 'Admin ajouté avec succès !'
                });
                setIsLoading(false);
                handleColse();
                handleCloseConfirm();
                setStep(1);
                setFormData({
                    firstName: '',
                    lastName: '',
                    phoneNumber: '',
                    email: '',
                    password: '',
                    permissions: []
                });
            }, 3000);
        } else {
            setStep(1);
            setToast({
                show: true,
                type: 'error',
                message: result.message
            });
            setIsLoading(false);
        }
    };


    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="step-content">
                        <h2>Information Personnelle</h2>
                        <input
                            className={`input-field ${errors.firstName ? 'error' : ''}`}
                            type="text"
                            name='firstName'
                            placeholder='Entrez vos prénoms'
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                        {errors.firstName && <div className="error-text">{errors.firstName}</div>}
                        <input
                            className={`input-field ${errors.lastName ? 'error' : ''}`}
                            type="text"
                            name='lastName'
                            placeholder='Entrez votre nom de famille'
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                        {errors.lastName && <div className="error-text">{errors.lastName}</div>}
                    </div>
                )
            case 2:
                return (
                    <div className="step-content">
                        <h2>Informations de Contact</h2>
                        <input
                            className={`input-field ${errors.email ? 'error' : ''}`}
                            type='email'
                            name='email'
                            placeholder='Entrez votre email'
                            value={formData.email}
                            onChange={handleChange}
                        />

                        {errors.email && <div className="error-text">{errors.email}</div>}

                        <div className="phone-input-container">
                            <div className="select-wrapper">
                                <select
                                    className="country-select"
                                    value={selectedCountry.code}
                                    onChange={handleCountryChange}
                                >
                                    {countries.map((country) => (
                                        <option key={country.code} value={country.code}>
                                            {country.code} ({country.dialCode})
                                        </option>
                                    ))}
                                </select>
                                <img
                                    src={selectedCountry.flag}
                                    alt={`${selectedCountry.name} flag`}
                                    className="selected-flag"
                                />
                            </div>
                            <input
                                type='tel'
                                name='phoneNumber'
                                placeholder='Entrez votre numéro de téléphone'
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className={`input-field ${errors.phoneNumber ? 'error' : ''}`}
                            />
                        </div>
                        {errors.phoneNumber && <div className="error-text">{errors.phoneNumber}</div>}
                    </div>
                )
            case 3:
                return (
                    <div className="step-content">
                        <h2>Autorisations</h2>
                        <div className="permissions-group">
                            {adminLevels.map(permission => (
                                <div key={permission.value} className="checkbox-container">
                                    <input
                                        type="checkbox"
                                        id={permission.value}
                                        name="permissions"
                                        value={permission.value}
                                        checked={formData.permissions.includes(permission.value)}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor={permission.value}>
                                        {permission.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                        {errors.permissions && <div className="error-text">{errors.permissions}</div>}
                    </div>
                );
            case 4:
                return (
                    <div className="step-content">
                        <h2>Sécurité</h2>

                        {/* Champ pour le mot de passe */}
                        <div className="password-toggle">
                            <input
                                className={`input-field ${errors.password ? 'error' : ''}`}
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                placeholder="Entrez votre mot de passe"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <span onClick={toggleShowPassword} className="toggle-password-visibility">
                                {showPassword
                                    ? <FontAwesomeIcon icon={faEyeSlash} title="Cacher" />
                                    : <FontAwesomeIcon icon={faEye} title="Afficher" />
                                }
                            </span>
                            {errors.password && <div className="error-text">{errors.password}</div>}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }


    return (
        <div className='ads-stats'>
            <div className='head'>
                <h3>Aperçus</h3>
                <button className='add-new-ad' onClick={handleClickAddAdmin}>
                    <FontAwesomeIcon icon={faPlusSquare} className='icon' />
                    <span>Ajouter Admin</span>
                </button>
            </div>

            <Stats
                allPosts={posts?.length || 0} 
                pendingPosts={postsPending?.length || 0}
                approvedPosts={postsApproved?.length || 0}
                refusedPosts={postsRefused?.length || 0}
            />

            {isOpen && (
                <Modal
                    title={"Ajouter Admin"}
                    onShow={isOpen}
                    onHide={handleColse}
                    isNext={false}
                    isHide={false}
                >
                    <div className="form">
                        <div className="progress-bar">
                            {[1, 2, 3, 4].map((num) => (
                                <div
                                    key={num}
                                    className={`step-indicator ${step >= num ? 'active' : ''}`}
                                >
                                    {num}
                                </div>
                            ))}
                        </div>

                        {renderStep()}

                        <div className="navigation-buttons">
                            {step > 1 && (
                                <button className='prev' onClick={prevStep}>Retour</button>
                            )}
                            {step < 4 ? (
                                <button className='next' onClick={nextStep}>Suivant</button>
                            ) : (
                                <button onClick={handleConfirm} className='submit'>
                                    {isLoading ? <Spinner /> : "Confirmer"}
                                </button>
                            )}
                        </div>
                    </div>
                </Modal>

            )}

            {confirm && (
                <Modal
                    title={"Confirmation"}
                    onShow={confirm}
                    onHide={handleCloseConfirm}
                    isNext={true}
                    onNext={handleAddAdmin}
                    nextText={isLoading ? <Spinner /> : "Confirmer"}
                    hideText={"Annuler"}
                >
                    <p>
                        Confirmez-vous ajouter <strong>{formData.firstName} {formData.lastName}</strong> (<i>{formData.email}</i>)
                        en tant qu'administrateur au niveau <strong>{formData.permissions}</strong> ?
                    </p>
                </Modal>
            )}

            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast({ ...toast, show: false })}
            />
        </div>
    );
};
