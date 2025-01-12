import React, { useEffect, useState } from 'react';
import {
    faListAlt,
    faClock,
    faCheckCircle,
    faTimesCircle,
    faPlusSquare,
    faEye,
    faEyeSlash,
    faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    fetchAllAds,
    fetchApprovedAds,
    fetchPendingAds,
    fetchRefusedAds
} from '../../services/adServices';
import Modal from '../../customs/Modal';
import Toast from '../../customs/Toast';
import Spinner from '../../customs/Spinner';
import '../../styles/AdsStatistics.scss';
import { addNewAdmin } from '../../services/authServices';


const Stats = ({ allAds, pendingAds, approvedAds, refusedAds }) => {
    return (
        <div className="ads-statistics">
            {/* Bloc pour toutes les annonces */}
            <div className="stat-block all">
                <FontAwesomeIcon icon={faListAlt} className="icon" />
                <div className="stat-info">
                    <h3>Toutes</h3>
                    <p>{allAds} annonce(s)</p>
                </div>
            </div>

            {/* Bloc pour les annonces en attente */}
            <div className="stat-block pending">
                <FontAwesomeIcon icon={faClock} className="icon" />
                <div className="stat-info">
                    <h3>En attente</h3>
                    <p>{pendingAds} annonce(s)</p>
                </div>
            </div>

            {/* Bloc pour les annonces approuvées */}
            <div className="stat-block approved">
                <FontAwesomeIcon icon={faCheckCircle} className="icon" />
                <div className="stat-info">
                    <h3>Approuvées</h3>
                    <p>{approvedAds} annonce(s)</p>
                </div>
            </div>

            {/* Bloc pour les annonces refusées */}
            <div className="stat-block refused">
                <FontAwesomeIcon icon={faTimesCircle} className="icon" />
                <div className="stat-info">
                    <h3>Refusées</h3>
                    <p>{refusedAds} annonce(s)</p>
                </div>
            </div>
        </div>
    )
}


export default function AdsStatistics() {
    const [isOpen, setIsOpen] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        permissions: []
    });
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [ads, setAds] = useState([]);
    const [adsPending, setAdsPending] = useState([]);
    const [adsApproved, setAdsApproved] = useState([]);
    const [adsRefused, setAdsRefused] = useState([]);

    const adminLevels = [
        { value: 'MANAGE_ADS', label: 'Gestion des Annonces' },
        { value: 'MANAGE_USERS', label: 'Gestion des Utilisateurs' },
        { value: 'MANAGE_PAYMENTS', label: 'Gestion des Paiements' },
        { value: 'SUPER_ADMIN', label: 'Super Admin' }
    ];

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Fetch all the ads data in parallel
                const [allAds, pendingAds, approvedAds, refusedAds] = await Promise.all([
                    fetchAllAds(),
                    fetchPendingAds(),
                    fetchApprovedAds(),
                    fetchRefusedAds(),
                ]);

                // Set the ads data
                setAds(allAds?.allAds);
                setAdsPending(pendingAds?.pendingAds);
                setAdsApproved(approvedAds?.approvedAds);
                setAdsRefused(refusedAds?.refusedAds);
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
            formErrors.firstName = 'Veuillez entrer un prénom';
        }
        if (!formData.lastName) {
            formErrors.lastName = 'Veuillez entrer un nom de famille';
        }
        if (!formData.email) {
            formErrors.email = 'Veuillez entrer un email';
        }
        if (!emailRegex.test(formData.email)) {
            formErrors.email = 'Veuillez entrer un email valide';
        }
        if (!formData.password) {
            formErrors.password = 'Veuillez entrer un mot de passe';
        }
        if (!formData.permissions.length) {
            formErrors.permissions = 'Veuillez sélectionner au moins une permission';
        }

        return formErrors;
    };


    const handleColse = () => setIsOpen(false);

    const handleCloseConfirm = () => {
        setConfirm(false);
        setIsOpen(false);
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            permissions: []
        });
    };


    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
    
        // Gestion des cases à cocher
        if (type === 'checkbox') {
            const updatedPermissions = checked
                ? [...formData.permissions, value]
                : formData.permissions.filter(permission => permission !== value);
    
            setFormData({ ...formData, permissions: updatedPermissions });
        } else {
            // Gestion des champs classiques
            setFormData({ ...formData, [name]: value });
        }
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

        const result = await addNewAdmin({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            permissions: formData.permissions,
        })

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
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    permissions: []
                });
            }, 3000);

        }
    }


    return (
        <div className='ads-stats'>
            <div className='head'>
                <h3>Aperçus</h3>
                <button className='add-new-ad' onClick={() => setIsOpen(true)}>
                    <FontAwesomeIcon icon={faPlusSquare} className='icon' />
                    <span>Ajouter Admin</span>
                </button>
            </div>

            <Stats
                allAds={ads.length}
                pendingAds={adsPending.length}
                approvedAds={adsApproved.length}
                refusedAds={adsRefused.length}
            />

            {isOpen && (
                <Modal
                    title={"Ajouter Admin"}
                    onShow={isOpen}
                    onHide={handleColse}
                    isNext={true}
                    isHide={false}
                    onNext={handleConfirm}
                    nextText={"Créer"}
                    hideText={"Annuler"}
                >
                    <label htmlFor="identity">Nom & Prénoms</label>
                    <div className='password-toggle'>
                        <input
                            className={`input-field ${errors.firstName ? 'error' : ''}`}
                            type="text"
                            name='firstName'
                            placeholder='Prénom'
                            id="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                        {errors.firstName && <div className="error-text">{errors.firstName}</div>}
                    </div>

                    <div className='password-toggle'>
                        <input
                            className={`input-field ${errors.lastName ? 'error' : ''}`}
                            type="text"
                            name='lastName'
                            placeholder='Nom'
                            id="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                        {errors.lastName && <div className="error-text">{errors.lastName}</div>}
                    </div>

                    <div className='password-toggle'>
                        <label htmlFor="email">Identifiant</label>
                        <input
                            className={`input-field ${errors.email ? 'error' : ''}`}
                            type="email"
                            name='email'
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <span><FontAwesomeIcon icon={faEnvelope} /></span>
                    </div>

                    {errors.email && <div className="error-text">{errors.email}</div>}

                    <div className='password-toggle'>
                        <label htmlFor="password">Mot de passe</label>
                        <input
                            className={`input-field ${errors.password ? 'error' : ''}`}
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <span onClick={toggleShowPassword}>
                            {
                                showPassword
                                    ? <FontAwesomeIcon icon={faEyeSlash} title={"Cacher"} />
                                    : <FontAwesomeIcon icon={faEye} title={"Afficher"} />
                            }
                        </span>
                    </div>

                    {errors.password && <div className="error-text">{errors.password}</div>}

                    <label htmlFor="permissions">Permissions</label>
                    <div className="permissions-group">
                        {adminLevels.map(permission => (
                            <div key={permission.value} className="checkbox-container">
                                <label htmlFor={permission.value}>
                                    <input
                                        type="checkbox"
                                        id={permission.value}
                                        name="permissions"
                                        value={permission.value}
                                        checked={formData.permissions.includes(permission.value)}
                                        onChange={handleChange}
                                    />
                                    {permission.label}
                                </label>
                            </div>
                        ))}
                    </div>
                    {errors.permissions && <div className="error-text">{errors.permissions}</div>}
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
