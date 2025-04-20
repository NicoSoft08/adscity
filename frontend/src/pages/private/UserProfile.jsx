import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Camera, Files, FolderOpen, Home, LinkIcon, Mail, MapPin, Package, Pencil, PhoneCall, Search, User } from 'lucide-react';
import { IconAvatar } from '../../config/images';
import { uploadCoverPhoto, uploadProfilePhoto } from '../../routes/storageRoutes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartSimple, faCheck, faCircleCheck, faCircleExclamation, faCircleXmark, faCog, faMoneyCheck, faSliders, faTimes } from '@fortawesome/free-solid-svg-icons';
import { getUserLoginActivity, updateUserField } from '../../routes/userRoutes';
import cities from '../../data/ru.json';
import Modal from '../../customs/Modal';
import Spinner from '../../customs/Spinner';
import Toast from '../../customs/Toast';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebaseConfig';
import Settings from './Settings';
import ManagePayments from '../../components/payment/ManagePayments';
import { differenceInDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Pagination from '../../components/pagination/Pagination';
import { logClientAction } from '../../routes/apiRoutes';
import '../../styles/UserProfile.scss';

export default function UserProfile() {
    const { currentUser, userData } = useContext(AuthContext);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [activeSection, setActiveSection] = useState('activity'); // Section active par défaut, 'activity
    const [loginActivity, setLoginActivity] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [imageType, setImageType] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        displayName: userData.displayName || "",
        bio: userData.bio || "Membre de la communauté AdsCity 🌍 | À la recherche de bonnes affaires et de nouvelles opportunités ! 🚀✨",
        city: userData.city || "",
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        country: userData.country || "",
        address: userData.address || "",
        profilURL: userData.profilURL || IconAvatar,
        coverURL: userData.coverURL || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1200',
    });
    const [showEdit, setShowEdit] = useState(false);
    const [field, setField] = useState(null);

    useEffect(() => {
        // Early return if no user ID
        if (!currentUser?.uid) return;

        // Log analytics event
        try {
            logEvent(analytics, 'profile_page_view', {
                page_path: '/user/dashboard/profile',
                // Avoid sending the actual UID to analytics
                user_type: currentUser.uid ? 'authenticated' : 'anonymous'
            });
        } catch (error) {
            console.error('Analytics error:', error);
        }

        // Fetch user activity with error handling
        const fetchUserActivity = async () => {
            try {
                // Validate user ID format (assuming Firebase UID format)
                const uidRegex = /^[a-zA-Z0-9]{28}$/;
                if (!uidRegex.test(currentUser.uid)) {
                    console.error('Invalid user ID format');
                    setLoginActivity([]);
                    return;
                }

                const result = await getUserLoginActivity(currentUser.uid);
                if (result.success && Array.isArray(result.activity)) {
                    setLoginActivity(result.activity);
                } else {
                    console.warn('No activity data or invalid response format');
                    setLoginActivity([]);
                }
            } catch (error) {
                console.error('Error fetching user activity:', error);
                setLoginActivity([]);
                // Optionally show an error message to the user
            }
        };

        fetchUserActivity();
    }, [currentUser]);


    const tabs = [
        { id: 'activity', icon: faChartSimple, label: 'Activité' },
        { id: 'payments', icon: faMoneyCheck, label: 'Paiements' },
        { id: 'settings', icon: faSliders, label: 'Réglages' },
    ];

    const userProfileLink = `${window.location.origin}/users/user/${userData?.UserID?.toLowerCase()}/profile/show`;

    const filteredCities = cities.filter(i => i.city.toLowerCase().includes(searchTerm.toLowerCase()));

    // Validation du fichier (type et taille)
    const validateFile = (file) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file?.type)) {
            setToast({ show: true, type: 'error', message: 'Le fichier doit être au format JPEG, PNG ou JPG.' });
            return false;
        }

        if (file?.size > maxSize) {
            setToast({ show: true, type: 'error', message: 'La taille du fichier ne doit pas dépasser 5MB.' });
            return false;
        }

        return true;
    };

    // Gestion du changement d'image (profil/couverture)
    const handleImageChange = (event, type) => {
        const file = event.target.files[0];
        if (file && validateFile(file)) {
            setPreviewImage(URL.createObjectURL(file));
            setSelectedFile(file);
            setImageType(type);
            setIsModalOpen(true);
        }
    };

    // Confirmation du changement d'image
    const handleConfirm = async () => {
        if (!selectedFile || !imageType) return;

        setIsLoading(true);
        let result = null;
        const userID = currentUser?.uid;

        try {
            if (imageType === "profile") {
                const count = userData?.profilChanges?.count ?? 0;
                if (count >= 3) {
                    setToast({ show: true, type: 'error', message: 'Vous avez dépassé le nombre maximum de changements de photo de profil.' });
                    return;
                }

                result = await uploadProfilePhoto(selectedFile, userID);
                if (result) setFormData(prevFormData => ({ ...prevFormData, profilURL: result.imageUrl }));

                await logClientAction(
                    currentUser.uid,
                    "Mise à jour du profile",
                    "Vous avez mis à jour sa photo de profile."
                );

            } else if (imageType === "cover") {
                const count = userData?.coverChanges?.count ?? 0;
                if (count >= 3) {
                    setToast({ show: true, type: 'error', message: 'Vous avez dépassé le nombre maximum de changements de photo de profil.' });
                    return;
                }

                result = await uploadCoverPhoto(selectedFile, userID);
                if (result) setFormData(prevFormData => ({ ...prevFormData, coverURL: result.imageUrl }));

                await logClientAction(
                    currentUser.uid,
                    "Mise à jour du profile",
                    "Vous avez mis à jour sa photo de couverture."
                );
            }
            setIsModalOpen(false); // Fermer la modale SEULEMENT si l'upload réussit
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'image :', error);
            setToast({ show: true, type: 'error', message: 'Une erreur est survenue, réessayez plus tard.' });
        } finally {
            setIsLoading(false);
        }
    };

    const toggleModal = (type, state) => {
        if (type === 'image') {
            setIsModalOpen(state);
            setPreviewImage(null);
        }
        if (type === 'edit') {
            setShowEdit(state);
            setField(null);
        }
    };

    const handleEdit = (fieldName) => {
        setField(fieldName);
        setShowEdit(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
    };

    const handleConfirmEdit = async () => {
        setIsLoading(true);

        try {
            const userID = currentUser?.uid;

            // Validate user is logged in
            if (!userID) {
                setToast({
                    show: true,
                    type: 'error',
                    message: 'Vous devez être connecté pour modifier votre profil.'
                });
                return;
            }

            // Validate field exists and has a value
            if (!field || !formData[field]) {
                setToast({
                    show: true,
                    type: 'error',
                    message: 'Champ invalide ou vide.'
                });
                return;
            }

            // Sanitize input (basic example - implement more thorough validation)
            const sanitizedValue = String(formData[field])
                .trim()
                .replace(/[<>]/g, ''); // Basic XSS protection

            if (sanitizedValue !== formData[field]) {
                setToast({
                    show: true,
                    type: 'error',
                    message: 'Le champ contient des caractères non autorisés.'
                });
                return;
            }

            const result = await updateUserField(userID, { [field]: sanitizedValue });

            if (result.success) {
                setToast({
                    show: true,
                    type: 'info',
                    message: 'Modification réussie.'
                });
                setShowEdit(false);
                setField(null);
            } else {
                setToast({
                    show: true,
                    type: 'error',
                    message: result.message || 'Échec de la modification.'
                });
            }
        } catch (error) {
            console.error('Erreur lors de la modification des données :', error);
            setToast({
                show: true,
                type: 'error',
                message: 'Une erreur est survenue, réessayez plus tard.'
            });
        } finally {
            setIsLoading(false);
        }
    };


    const renderEditForm = () => {
        switch (field) {
            case 'firstName':
                return (
                    <div className="displayName-field">
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="Prénom"
                            className='input-field'
                        />
                    </div>
                );
            case 'lastName':
                return (
                    <div className="displayName-field">
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Nom"
                            className='input-field'
                        />
                    </div>
                );
            case 'bio':
                return (
                    <div className="bio-field">
                        <textarea
                            rows={4}
                            className='input-field'
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Écrivez quelque chose à propos de vous..."
                        />
                    </div>
                );
            case 'address':
                return (
                    <div className="address-field">
                        <input
                            type="text"
                            name='address'
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Adresse"
                            className='input-field'
                        />
                    </div>
                );
            case 'city':
                return (
                    <>
                        <div className="search-field">
                            <input
                                type='text'
                                name='searchTerm'
                                className='input-field'
                                placeholder='Rechercher une ville'
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <span className='search-icon'>
                                <Search size={20} />
                            </span>
                        </div>

                        <div className="city-field">
                            <select
                                name="city"
                                value={formData.city}
                                className='input-field'
                                onChange={handleChange}
                            >
                                <option value="">Choisissez votre ville</option>
                                {filteredCities.map((city, index) => (
                                    <option key={index} value={city.city}>{city.city}</option>
                                ))}
                            </select>

                        </div>
                    </>
                );
            default:
                return null;
        }
    }

    const renderSection = () => {
        switch (activeSection) {
            case 'activity': return <Activity />;
            case 'payments': return <ManagePayments userID={currentUser.uid} />;
            case 'settings': return <Settings />;
            default: return null;
        }
    };

    const Activity = () => {
        const [itemsPerPage] = useState(10);
        const [currentPage, setCurrentPage] = useState(1);

        // Fonction pour paginer les activités
        const paginate = (pageNumber) => setCurrentPage(pageNumber);

        // Extraire les activités pour la page actuelle
        const currentActivity = loginActivity.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );

        const formatDateTimestamp = (adTimestamp) => {
            if (!adTimestamp) return "Date inconnue";

            const adDate = new Date(adTimestamp?._seconds * 1000);
            const now = new Date();
            const diffDays = differenceInDays(now, adDate);

            if (diffDays === 0) return `Auj. à ${format(adDate, 'HH:mm', { locale: fr })}`;
            if (diffDays === 1) return `Hier à ${format(adDate, 'HH:mm', { locale: fr })}`;
            if (diffDays === 2) return `Avant-hier à ${format(adDate, 'HH:mm', { locale: fr })}`;

            return `${format(adDate, 'dd/MM/yyyy à HH:mm', { locale: fr })}`;
        };

        return (
            <div className='activity'>
                <h2>Activité de Connexion</h2>
                <p>
                    {loginActivity.length === 0
                        ? "Aucune activité récente."
                        : `Voici votre journal ${loginActivity.length > 1
                            ? `${loginActivity.length} dernières activités`
                            : "dernière activité"
                        } de connexion.`}
                </p>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Navigateur</th>
                                <th>Système</th>
                                <th>Adresse IP</th>
                                <th>Période</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentActivity.map((activity, index) => (
                                <tr key={index}>
                                    <td>{activity.deviceInfo.browser}</td>
                                    <td>{activity.deviceInfo.os}</td>
                                    <td>{activity.deviceInfo.ip}</td>
                                    <td>{formatDateTimestamp(activity.time)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {loginActivity.length > itemsPerPage && (
                    <Pagination elements={loginActivity} elementsPerPage={itemsPerPage} currentPage={currentPage} paginate={paginate} />
                )}
            </div>
        );
    };

    return (
        <div className="profile-container">
            <div className="profile-card">
                {/* Photo de couverture */}
                <div className="profile-cover" style={{ backgroundImage: `url(${formData.coverURL})` }}>
                    <input type="file" name='coverURL' accept="image/*" id="coverUpload" onChange={(e) => handleImageChange(e, 'cover')} hidden />
                    <label htmlFor="coverUpload" className="edit-cover-btn"><Camera size={20} /></label>
                </div>
                {/* Informations du profil */}
                <div className="profile-content">
                    <div className="profile-header">
                        <div className="profile-info">
                            <div className="profile-avatar-container">
                                <img src={formData.profilURL} alt="Profile" className="profile-avatar" />
                                <input type="file" name='profilURL' accept="image/*" id="avatarUpload" onChange={(e) => handleImageChange(e, 'profile')} hidden />
                                <label htmlFor="avatarUpload" className="edit-avatar-btn"><Camera size={16} /></label>
                            </div>
                            <div className="profile-details">
                                <h1 className="profile-name">
                                    {userData.firstName} {userData.lastName}
                                </h1>
                                <button className="forfait">
                                    <Package size={18} />
                                    Changer de forfait
                                </button>
                                {/* <p className="profile-username">{dummyUser.short_name_link}</p> */}
                            </div>
                        </div>
                    </div>
                    <div className="profile-bio">
                        <p>
                            {formData.bio}
                            <span title="Modifier ma bio" onClick={() => handleEdit("bio")}>
                                <Pencil size={16} />
                            </span>
                        </p>

                        <div className="profile-links">
                            <div className="profile-location">
                                <User className="icon-sm" />
                                <span>{formData.firstName}</span>
                                <span className="edit-icon" title="Modifier ma localisation" onClick={() => handleEdit("firstName")}>
                                    <Pencil size={16} />
                                </span>
                            </div>
                            <div className="profile-location">
                                <User className="icon-sm" />
                                <span>{formData.lastName}</span>
                                <span className="edit-icon" title="Modifier ma localisation" onClick={() => handleEdit("lastName")}>
                                    <Pencil size={16} />
                                </span>
                            </div>
                            <div className="profile-location">
                                <FolderOpen className="icon-sm" />
                                <span>{userData?.adsCount > 1 ? `${userData?.adsCount} annonces` : `${userData?.adsCount} annonce`}</span>
                            </div>
                            <div className="profile-location">
                                <Mail className="icon-sm" />
                                <span>{userData.email}</span>
                                <span
                                    title={userData.emailVerified ? 'Vérifié' : 'Non vérifié'}
                                    className='edit-icon'
                                >
                                    <FontAwesomeIcon
                                        icon={userData.emailVerified ? faCircleCheck : faCircleExclamation}
                                        color={userData.emailVerified ? '#28a745' : '#00aaff'}
                                    />
                                </span>
                            </div>

                            {/* <div className="profile-location">
                                <Files className="icon-sm" />
                                <span>Vérification des documents</span>
                                {userData.verificationStatus === 'pending' ? (
                                    <FontAwesomeIcon
                                        icon={faCog}
                                        spin
                                        className='edit-icon'
                                    />
                                ) : userData.verificationStatus === 'approved' ? (
                                    <FontAwesomeIcon
                                        icon={faCircleCheck}
                                        color='#28a745'
                                        className='edit-icon'
                                    />
                                ) : (
                                    <FontAwesomeIcon
                                        icon={faCircleXmark}
                                        color='#dc3545'
                                        className='edit-icon'
                                    />
                                )}
                            </div> */}
                            <div className="profile-location">
                                <PhoneCall className="icon-sm" />
                                <span>{userData.phoneNumber}</span>
                            </div>
                            <div className="profile-location">
                                <MapPin className="icon-sm" />
                                <span>{formData.city}, {formData.country}</span>
                                <span className="edit-icon" title="Modifier ma localisation" onClick={() => handleEdit("city")}>
                                    <Pencil size={16} />
                                </span>
                            </div>
                            <div className="profile-location">
                                <Home className="icon-sm" />
                                <span>{formData.address}</span>
                                <span className="edit-icon" title="Modifier mon adresse" onClick={() => handleEdit("address")}>
                                    <Pencil size={16} />
                                </span>
                            </div>
                            <div className="profile-website">
                                <LinkIcon className="icon-sm" />
                                <a href={userProfileLink} className="profile-link">adscity.net</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <div className="switcher">
                <div className="switcher-tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`switcher-tab ${activeSection === tab.id ? 'active' : ''
                                }`}
                            onClick={() => setActiveSection(tab.id)}
                        >
                            <FontAwesomeIcon icon={tab.icon} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                <div className="switcher-content">
                    {renderSection()}
                </div>
            </div>

            {
                isModalOpen && (
                    <Modal
                        onShow={isModalOpen}
                        onHide={() => toggleModal('image', false)}
                        title={`Confirmer la ${imageType === "profile" ? "photo de profil" : "photo de couverture"}`}
                    >
                        <div>
                            <img src={previewImage} alt="Aperçu" className="modal-preview" />
                            <div className="modal-actions">
                                <button className="btn btn-confirm" onClick={handleConfirm}>
                                    {isLoading ? <Spinner /> : <><FontAwesomeIcon icon={faCheck} /> Valider</>}
                                </button>
                                <button className="btn btn-cancel" onClick={() => toggleModal('image', false)}>
                                    <FontAwesomeIcon icon={faTimes} /> Annuler
                                </button>
                            </div>
                        </div>
                    </Modal>
                )
            }

            {
                showEdit && field && (
                    <Modal
                        onShow={showEdit}
                        onHide={() => toggleModal('edit', false)}
                        title={`Modifier ${field === "bio" ? "ma bio" : field === "city" ? "ma localisation" : field === "address" ? "mon adresse" : field === "lastName" ? "mon nom" : field === "firstName" ? "mon prénom" : ""}`}
                    >
                        <div className="edit-form">
                            {renderEditForm()}
                        </div>
                        <div className="modal-actions">
                            <button className="btn btn-confirm" onClick={handleConfirmEdit}>
                                {isLoading ? <Spinner /> : <><FontAwesomeIcon icon={faCheck} /> Valider</>}
                            </button>
                            <button className="btn btn-cancel" onClick={() => toggleModal('edit', false)}>
                                <FontAwesomeIcon icon={faTimes} /> Annuler
                            </button>
                        </div>

                    </Modal>
                )
            }

            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
        </div >
    );
};
