import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../customs/Spinner';
import Toast from '../../customs/Toast';
import { signinUser } from '../../services/authServices';
import '../../styles/LoginPage.scss';

export default function LoginPage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ email: '', password: '', agree: false });
    const [formData, setFormData] = useState({ email: '', password: '', agree: false });
    const [toast, setToast] = useState({
        show: false,
        message: '',
        type: '',
    });

    const hideToast = () => {
        setToast({
            ...toast,
            show: false,
        });
    };

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

        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const { email, password } = formData;
            const result = await signinUser(email, password, navigate);

            if (result.role !== 'admin') {
                setTimeout(() => {
                    setToast({
                        type: 'error',
                        message: 'Vous n\'avez pas les droits d\'accès à cette page',
                        show: true,
                    });
                    setIsLoading(false);
                    navigate('/access-denied');
                })
                return;
            }

            setTimeout(() => {
                setToast({
                    type: 'success',
                    message: 'User signed in and verified successfully',
                    show: true,
                });
                setIsLoading(false);
                navigate('/admin');
            });

            console.log('User signed in and verified successfully');
        } catch (error) {
            console.error('Connexion échouée: ', error);
            setToast({
                type: 'error',
                message: 'Une erreur est survenue. Veuillez réessayer.',
                show: true,
            });
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
                    disabled={isLoading}
                >
                    {isLoading ? <Spinner /> : "Se connecter"}
                </button>
                <Toast
                    type={toast.type}
                    message={toast.message}
                    show={toast.show}
                    onClose={hideToast}
                />
            </form>
        </div>
    );
};
