import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import '../../styles/ForgotPasswordPage.scss';
import Spinner from '../../customs/Spinner';

export default function ForgotPasswordPage() {
    const { email } = useParams();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: email || '',
        password: '',
        agree: false,
    });

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const validateForm = () => {
        const errors = {};

        if (formData.agree === false) {
            errors.agree = "Vous devez accepter les termes et conditions.";
        } else {
            if (!formData.email) {
                errors.email = "Email réquis";
            }
            if (!formData.password) {
                errors.password = "Mot de passe réquis";
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

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            setLoading(false);
            setTimeout(() => {
                setErrors({});
            }, 2000);
            return;
        }

        try {
            setTimeout(() => {
                navigate('/auth/signin');
                setLoading(false);
            }, 5000);
        } catch (error) {
            console.error('Connexion échouée: ', error);
            setMessage('Une erreur est survenue. Veuillez réessayer.');
            setTimeout(() => {
                setMessage('');
            }, 2000);
        }
    }

    return (
        <div className='reset-password-page'>
            <form className="reset-form" onSubmit={handleSubmit}>
                <h2>Réinitialisation</h2>
                <div>
                    <label htmlFor="email">Identifiant</label>
                    <input
                        className={`input-field ${errors.email ? 'error' : ''}`}
                        type="email"
                        name='email'
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <div className="error-text">{errors.email}</div>}
                </div>

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
                    {errors.password && <div className="error-text">{errors.password}</div>}
                </div>
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        name="agree"
                        checked={formData.agree}
                        onChange={handleChange}
                    />
                    J'accepte les termes et conditions
                </label>
                {errors.agree && (<div className='error-text'>{errors.agree}</div>)}
                {message && (<div className='error-text'>{message}</div>)}
                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? <Spinner /> : "Soumettre"}
                </button>
            </form>
        </div>
    );
};
