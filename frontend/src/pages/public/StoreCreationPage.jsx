import React, { useContext, useState } from 'react';
import { Store, Upload } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { businessCategory } from '../../data/database';
import ReCAPTCHA from 'react-google-recaptcha';
import '../../styles/StoreCreationPage.scss';

const MAX_FILE_SIZE_MB = 10; // 10MB maximum file size

// Replace with your actual reCAPTCHA site key
const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

export default function StoreCreationPage() {
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [errors, setErrors] = useState({});
    const [coverPreview, setCoverPreview] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [captchaValue, setCaptchaValue] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: businessCategory[0],
        address: '',
        phone: '',
        email: '',
        website: '',
        coverImage: null,
        logo: null,
        openingHours: {
            lundi: { open: '09:00', close: '18:00', closed: false },
            mardi: { open: '09:00', close: '18:00', closed: false },
            mercredi: { open: '09:00', close: '18:00', closed: false },
            jeudi: { open: '09:00', close: '18:00', closed: false },
            vendredi: { open: '09:00', close: '18:00', closed: false },
            samedi: { open: '09:00', close: '18:00', closed: false },
            dimanche: { open: '09:00', close: '18:00', closed: true }
        },
        termsAccepted: false
    });

    // Function to validate file size
    const validateFileSize = (file) => {
        const fileSizeMB = file.size / (1024 * 1024);
        return fileSizeMB <= MAX_FILE_SIZE_MB;
    };

    // Function to validate file types
    const validateFile = (file) => {
        // Define allowed extensions
        const allowedExtensions = ['jpg', 'jpeg', 'png'];
        const allowedMimeTypes = ['image/jpeg', 'image/png'];

        // Get file extension
        const fileExtension = file.name.split('.').pop().toLowerCase();

        // Check extension and MIME type
        const isValidType = allowedExtensions.includes(fileExtension) && allowedMimeTypes.includes(file.type);

        // Check file size
        const isValidSize = validateFileSize(file);

        return {
            isValid: isValidType && isValidSize,
            reason: !isValidType ? 'type' : !isValidSize ? 'size' : null
        };
    };

    const sanitizeFileName = (fileName) => {
        // Remove special characters and spaces
        return fileName
            .replace(/[^\w\s.-]/g, '')
            .replace(/\s+/g, '-')
            .toLowerCase();
    };

    const handleCaptchaChange = (value) => {
        setCaptchaValue(value);
        // Clear captcha error if it exists
        if (errors.captcha) {
            setErrors({
                ...errors,
                captcha: ''
            });
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === 'file' && files[0]) {
            const file = files[0];
            const validation = validateFile(file);

            if (!validation.isValid) {
                // Gérer l'erreur de validation
                if (validation.reason === 'type') {
                    setErrors(prev => ({
                        ...prev,
                        [name]: "Format de fichier non supporté. Utilisez JPG ou PNG."
                    }));
                } else if (validation.reason === 'size') {
                    setErrors(prev => ({
                        ...prev,
                        [name]: `La taille du fichier dépasse la limite de ${MAX_FILE_SIZE_MB}MB.`
                    }));
                }
                return; // Ne pas continuer si le fichier n'est pas valide
            }

            // Nettoyer le nom du fichier
            const sanitizedFileName = sanitizeFileName(file.name);

            // Créer un nouvel objet File avec le nom nettoyé
            const sanitizedFile = new File([file], sanitizedFileName, { type: file.type });

            // Mettre à jour le state selon le type de fichier
            if (name === 'coverImage') {
                setCoverPreview(URL.createObjectURL(file));
                setFormData({
                    ...formData,
                    coverImage: sanitizedFile
                });
                // Effacer l'erreur si elle existait
                setErrors(prev => ({ ...prev, coverImage: null }));
            } else if (name === 'logo') {
                setLogoPreview(URL.createObjectURL(file));
                setFormData({
                    ...formData,
                    logo: sanitizedFile
                });
                // Effacer l'erreur si elle existait
                setErrors(prev => ({ ...prev, logo: null }));
            }
        } else if (type === 'checkbox') {
            // Gérer les cases à cocher
            setFormData({
                ...formData,
                [name]: checked
            });
        } else {
            // Gérer les champs texte et select
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };


    const handleHoursChange = (day, field, value) => {
        setFormData({
            ...formData,
            openingHours: {
                ...formData.openingHours,
                [day]: {
                    ...formData.openingHours[day],
                    [field]: value
                }
            }
        });
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = "Le nom de la boutique est requis";
        }

        if (!formData.description.trim()) {
            errors.description = "La description est requise";
        } else if (formData.description.length < 50) {
            errors.description = "La description doit contenir au moins 50 caractères";
        }

        if (!formData.category) {
            errors.category = "Veuillez sélectionner une catégorie";
        }

        if (!formData.coverImage) {
            errors.coverImage = "Une image de couverture est requise";
        }

        if (!formData.logo) {
            errors.logo = "Un logo est requis";
        }

        if (!formData.termsAccepted) {
            errors.termsAccepted = "Vous devez accepter les conditions d'utilisation";
        }

        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Ajoutez ici la logique pour soumettre le formulaire de création de boutique
    };

    return (
        <div className="store-creation-container">
            <section className="section-hero">
                <Store size={52} />
                <div>
                    <h1>Créer une boutique</h1>
                    <p>Présentez vos produits et services de manière professionnelle</p>
                </div>
            </section>
            <section className="section-body">
                <form onSubmit={handleSubmit}>
                    <div className="section-form">
                        <h2>Informations générales</h2>
                        <div className="form-group">
                            <label htmlFor="name">Nom de la boutique *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={errors.name ? 'error' : ''}
                            />
                            {errors.name && <div className="error-text">{errors.name}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description *</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="5"
                                className={errors.description ? 'error' : ''}
                            ></textarea>
                            {errors.description && <div className="error-text">{errors.description}</div>}
                            <div className="form-hint">Décrivez votre boutique, vos produits et services (minimum 50 caractères)</div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="category">Catégorie principale *</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className={errors.category ? 'error' : ''}
                            >
                                <option value="">Sélectionnez une catégorie</option>
                                {businessCategory.map((category, index) => (
                                    <option key={index} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="section-form">
                        <h2>Images</h2>
                        <div className="form-group">
                            <label>Image de couverture *</label>
                            <div className={`file-upload ${errors.coverImage ? 'error' : ''}`}>
                                {coverPreview ? (
                                    <div className="image-preview">
                                        <img src={coverPreview} alt="Aperçu de la couverture" />
                                        <button
                                            type="button"
                                            className="remove-image"
                                            onClick={() => {
                                                setCoverPreview(null);
                                                setFormData({ ...formData, coverImage: null });
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ) : (
                                    <div className="upload-placeholder">
                                        <Upload size={24} />
                                        <span>Cliquez ou déposez une image</span>
                                        <span className="file-hint">Format recommandé: 1200×300px, JPG ou PNG</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    id="coverImage"
                                    name="coverImage"
                                    accept="image/jpeg, image/png"
                                    onChange={handleChange}
                                />
                            </div>
                            {errors.coverImage && <div className="error-text">{errors.coverImage}</div>}
                        </div>

                        <div className="form-group">
                            <label>Logo *</label>
                            <div className="file-upload">
                                {logoPreview ? (
                                    <div className="image-preview logo-preview">
                                        <img src={logoPreview} alt="Aperçu du logo" />
                                        <button
                                            type="button"
                                            className="remove-image"
                                            onClick={() => {
                                                setLogoPreview(null);
                                                setFormData({ ...formData, logo: null });
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ) : (
                                    <div className="upload-placeholder">
                                        <Upload size={24} />
                                        <span>Cliquez ou déposez une image</span>
                                        <span className="file-hint">Format recommandé: 500×500px, JPG ou PNG</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    id="logo"
                                    name="logo"
                                    accept="image/jpeg, image/png"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="section-form">
                        <h2>Coordonnées</h2>
                        <div className="form-group">
                            <label htmlFor="address">Adresse</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="phone">Téléphone</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="website">Site web (optionnel)</label>
                            <input
                                type="url"
                                id="website"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                placeholder="https://"
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>Horaires d'ouverture</h2>

                        {Object.entries(formData.openingHours).map(([day, hours]) => (
                            <div key={day} className="opening-hours-row">
                                <div className="day-name">
                                    {day.charAt(0).toUpperCase() + day.slice(1)}
                                </div>

                                <div className="hours-inputs">
                                    <label className="closed-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={hours.closed}
                                            onChange={(e) => handleHoursChange(day, 'closed', e.target.checked)}
                                        />
                                        Fermé
                                    </label>

                                    {!hours.closed && (
                                        <>
                                            <div className="time-input-group">
                                                <label>Ouverture</label>
                                                <input
                                                    type="time"
                                                    value={hours.open}
                                                    onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                                                    disabled={hours.closed}
                                                />
                                            </div>

                                            <div className="time-input-group">
                                                <label>Fermeture</label>
                                                <input
                                                    type="time"
                                                    value={hours.close}
                                                    onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                                                    disabled={hours.closed}
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="form-section">
                        <label className="closed-checkbox">
                            <input
                                type="checkbox"
                                checked={formData.termsAccepted}
                                onChange={(e) => handleChange(e, 'termsAccepted')}
                            />
                            J'accepte les conditions d'utilisation
                        </label>

                        {/* reCAPTCHA component */}
                        <div className="captcha-container">
                            <ReCAPTCHA
                                sitekey={RECAPTCHA_SITE_KEY}
                                onChange={handleCaptchaChange}
                            />
                        </div>
                        {errors.captcha && <div className="error-text">{errors.captcha}</div>}

                        {/* Bouton de soumission */}
                        <div className="button-group">
                            <button type="submit" className="submit-button">
                                Créer la boutique
                            </button>

                            <Link to="/">
                                Annuler
                            </Link>
                        </div>
                    </div>
                </form>
            </section>
        </div >
    );
};
