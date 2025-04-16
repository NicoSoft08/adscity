import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { signinUser } from '../../routes/authRoutes';
import { AuthContext } from '../../contexts/AuthContext';
import Spinner from '../../customs/Spinner';
import Toast from '../../customs/Toast';
import ReCAPTCHA from 'react-google-recaptcha';
import '../../styles/LoginPage.scss';

export default function LoginPage() {
    const navigate = useNavigate();
    const { currentUser, userRole } = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ email: '', password: '', agree: false, captcha: '' });
    const [formData, setFormData] = useState({ email: '', password: '', agree: false });
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [captchaValue, setCaptchaValue] = useState(null);

    // Replace with your actual reCAPTCHA site key
    const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

    useEffect(() => {
        if (currentUser && (userRole === 'admin')) {
            setToast({ show: true, message: 'Vous êtes déjà connecté', type: 'success' });
            navigate('/admin/dashboard/panel');
        }
    }, [currentUser, userRole, navigate]);

    const validateForm = () => {
        const formErrors = {}
        if (!formData.agree) {
            formErrors.agree = "Vous devez accepter les termes et conditions";
        } else {
            if (!formData.email) {
                formErrors.email = "Email réquis";
            }
            if (!formData.password) {
                formErrors.password = "Mot de Passe réquis";
            }
        }

        if (!captchaValue) {
            formErrors.captcha = "Veuillez confirmer que vous n'êtes pas un robot";
        }

        return formErrors;
    };


    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };


    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;

        // Autoriser uniquement les lettres latines et les espaces
        const latinOnlyRegex = /^[A-Za-z\s]*$/;

        // Vérification pour firstName et lastName
        if ((name === 'firstName' || name === 'lastName') && !latinOnlyRegex.test(value)) {
            setToast({ show: true, type: 'error', message: 'Ne sont autorisés que des caractères latins' });
            return; // Ignore l'entrée si elle contient des caractères cyrilliques
        }

        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({}); // Réinitialise les erreurs

        // 🔹 Validation des champs avant d'envoyer la requête
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            setLoading(false);
            return;
        }

        try {
            const { email, password } = formData;

            // 🔹 Tentative de connexion
            const result = await signinUser(email, password, captchaValue);

            if (!result.success) {
                setToast({
                    show: true,
                    type: 'error',
                    message: result.message || "Une erreur est survenue. Veuillez réessayer.",
                });
                // Reset captcha if login fails
                if (window.grecaptcha) {
                    window.grecaptcha.reset();
                }
                setCaptchaValue(null);
                setLoading(false);
                return;
            }

            setToast({
                show: true,
                type: 'success',
                message: result.message || "Connexion réussie.",
            });

            // 🔹 Redirection selon le rôle
            if (result.role === 'admin') {
                navigate('/admin/dashboard/panel');
            } else {
                navigate('/access-denied');
            }
        } catch (error) {
            setToast({
                show: true,
                type: 'error',
                message: "Erreur de connexion. Veuillez réessayer."
            });

            // Reset captcha on error
            if (window.grecaptcha) {
                window.grecaptcha.reset();
            }
            setCaptchaValue(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='login-page'>
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Admin Panel</h2>
                <div className='password-toggle'>
                    <label htmlFor="email">Identifiant</label>
                    <input
                        className={`input-field`}
                        type="email"
                        name='email'
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <span><FontAwesomeIcon icon={faEnvelope} title={"Cacher"} /></span>
                </div>

                {errors.email && <div className="error-text">{errors.email}</div>}

                <div className='password-toggle'>
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        className={`input-field`}
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

                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        name="agree"
                        checked={formData.agree}
                        onChange={handleChange}
                    />
                    J'accepte les termes et conditions
                </label>

                {errors.agree && <div className="error-text">{errors.agree}</div>}

                {/* reCAPTCHA component */}
                <div className="captcha-container">
                    <ReCAPTCHA
                        sitekey={RECAPTCHA_SITE_KEY}
                        onChange={handleCaptchaChange}
                    />
                </div>
                {errors.captcha && <div className="error-text">{errors.captcha}</div>}

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? <Spinner /> : "Se connecter"}
                </button>
                <Toast type={toast.type} message={toast.message} show={toast.show} onClose={() => setToast({ ...toast, show: false })} />
            </form>
        </div>
    );
};
