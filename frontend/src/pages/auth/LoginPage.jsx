import React, { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../../customs/Spinner';
import Loading from '../../customs/Loading';
import { signinUser } from '../../routes/authRoutes';
import Toast from '../../customs/Toast';
import '../../styles/LoginPage.scss';


export default function LoginPage() {
    const { email } = useParams();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: email || '', password: '', agree: false });

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const validateForm = () => {
        const errors = {};
        const { agree, email, password } = formData;

        if (agree === false) {
            errors.agree = "Vous devez accepter les termes et conditions.";
        } else {
            if (!email) {
                errors.email = "Email réquis";
            }
            if (!password) {
                errors.password = "Mot de passe réquis";
            } else if (password.length < 6) {
                errors.password = "Le mot de passe doit contenir au moins 6 caractères.";
            }
        }

        return errors;
    }

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
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
            const result = await signinUser(email, password);
    
            if (!result.success) {
                setToast({
                    show: true,
                    type: 'error',
                    message: result.message || "Une erreur est survenue. Veuillez réessayer.",
                });
                setLoading(false);
                return;
            }
    
            setToast({
                show: true,
                type: 'success',
                message: result.message || "Connexion réussie.",
            });
    
            // 🔹 Redirection selon le rôle
            if (result.role === 'user') {
                navigate('/');
            } else {
                navigate('/access-denied');
            }
        } catch (error) {
            console.error("❌ Erreur lors de la connexion :", error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading />
    }



    return (
        <div className='login-page'>
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Connexion</h2>
                <div>
                    <label htmlFor="email">Identifiant</label>
                    <input
                        className={`input-field ${errors.email ? 'error' : ''}`}
                        type="email"
                        name='email'
                        id="email"
                        placeholder='Email'
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <div className="error-text">{errors.email}</div>}
                </div>

                <div className='password-toggle'>
                    <label htmlFor="password">Sécurité</label>
                    <input
                        className={`input-field ${errors.password ? 'error' : ''}`}
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name='password'
                        placeholder='Mot de passe'
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
                    {errors.password && <div className="error-text">{errors.password}</div>}
                </div>
                <Link to={`/auth/reset-password/${formData.email}`} className="passwrod-forgot">
                    <span>Mot de passe oublié ?</span>
                </Link>
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        name="agree"
                        checked={formData.agree}
                        onChange={handleChange}
                    />
                    En continuant, vous acceptez les Conditions d'utilisation
                </label>
                {errors.agree && (<div className='error-text'>{errors.agree}</div>)}

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? <Spinner /> : "Se connecter"}
                </button>
                <p>Aucun compte utilisateur ? <Link to={'/auth/create-user'}>S'inscrire</Link></p>

                <div className="terms-container">
                    <p>
                        <Link to="/legal/privacy-policy" target="_blank">Confidentialité</Link>{" - "}
                        <Link to="/legal/terms" target="_blank">Conditions d'utilisation</Link>
                        {/* <Link to="/data-processing" target="_blank">Politique de traitement des données</Link>. */}
                    </p>
                </div>
            </form>
            <Toast message={toast.message} type={toast.type} show={toast.show} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    );
};
