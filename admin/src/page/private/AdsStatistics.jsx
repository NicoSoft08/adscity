import React, { useEffect, useState } from 'react';
import {
    faListAlt,
    faClock,
    faCheckCircle,
    faTimesCircle,
    faPlusSquare,
    faEye,
    faEyeSlash,
    faEnvelope
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
        email: '',
        password: '',
        level: '',
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
        { value: 'super_admin', label: 'Super Admin' }
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

        if (!formData.email) {
            formErrors.email = 'Veuillez entrer un email';
        }
        if (!formData.password) {
            formErrors.password = 'Veuillez entrer un mot de passe';
        }
        if (!formData.level) {
            formErrors.level = 'Veuillez sélectionner un niveau';
        }

        return formErrors;
    };

    const handleColse = () => setIsOpen(false);

    const handleCloseConfirm = () => {
        setConfirm(false);
        setIsOpen(false);
        setFormData({
            email: '',
            password: '',
            level: '',
            permissions: []
        });
    };


    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const handleConfirm = () => {
        const formErrors = validateInputs();

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            setIsLoading(false);
            return;
        };

        setConfirm(true);
    }

    const handleAddAdmin = (e) => {



        setIsLoading(true);
        handleCloseConfirm();

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
                    onNext={handleConfirm}
                    nextText={"Créer"}
                    hideText={"Annuler"}
                >
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

                    <label htmlFor="level">Niveau</label>
                    <select
                        className={`select-field ${errors.level ? 'error' : ''}`}
                        value={formData.level}
                        onChange={handleChange}
                    >
                        <option value="">Sélectionner un niveau</option>
                        {adminLevels.map(level => (
                            <option key={level.value} value={level.value}>
                                {level.label}
                            </option>
                        ))}
                    </select>
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
                    <p>Confirmez-vous ajouter <strong>{formData.email}</strong> comme Admin ? </p>
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
