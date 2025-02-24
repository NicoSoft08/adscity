import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { signinUser } from '../../routes/authRoutes';
import { AuthContext } from '../../contexts/AuthContext';
import Spinner from '../../customs/Spinner';
import Toast from '../../customs/Toast';
import '../../styles/LoginPage.scss';

export default function LoginPage() {
    const navigate = useNavigate();
    const { currentUser, userRole } = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ email: '', password: '', agree: false });
    const [formData, setFormData] = useState({ email: '', password: '', agree: false });
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

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


        return formErrors;
    };


    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };


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

            const { success, message, role } = result;
    
            if (!success) {
                setToast({
                    show: true,
                    type: 'error',
                    message: message || "Une erreur est survenue. Veuillez réessayer.",
                });
                setLoading(false);
                return;
            }

            // 🔹 Vérification de la sécurité de la connexion

    
            setToast({
                show: true,
                type: 'success',
                message: result.message || "Connexion réussie.",
            });
    
            // 🔹 Redirection selon le rôle
            if (role === 'admin') {
                navigate('/admin/dashboard/panel');
            } else {
                navigate('/access-denied');
            }
        } catch (error) {
            console.error("❌ Erreur lors de la connexion :", error.message);

            setToast({
                show: true,
                type: 'error',
                message: error.message || "Une erreur est survenue. Veuillez réessayer.",
            });
    
            navigate('/access-denied');
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
