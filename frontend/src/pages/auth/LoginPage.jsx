import React, { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import '../../styles/LoginPage.scss';

import Spinner from '../../customs/Spinner';
import Loading from '../../customs/Loading';
import { signinUser } from '../../services/authServices';
import Toast from '../../customs/Toast';

export default function LoginPage() {
    const { email } = useParams();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
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
            setTimeout(() => setErrors({}), 2000);
            return;
        }

        try {
            const { email, password } = formData;
            const verificationResult = await signinUser(email, password);

            if (verificationResult.success) {
                navigate('/');
            } else {
                setToast({
                    show: true,
                    type: 'success',
                    message: 'Nouveau périphérique détecté. Veuillez vérifier votre boîte mail.'
                });
                navigate('/access-denied');
            }
        } catch (error) {
            setMessage('Une erreur est survenue. Veuillez réessayer.');
            setTimeout(() => setMessage(''), 2000);
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
                <Link to={`/auth/reset-password`} className="passwrod-forgot">
                    <span>Mot de passe oublié ?</span>
                </Link>
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
                    {loading ? <Spinner /> : "Se connecter"}
                </button>
                <p>Aucun compte utilisateur ? <Link to={'/auth/create-user'}>S'inscrire</Link></p>
            </form>
            <Toast
                message={toast.message}
                type={toast.type}
                show={toast.show}
                onClose={
                    () => setToast({
                        ...toast,
                        show: false
                    })
                }
            />
        </div>
    );
};
