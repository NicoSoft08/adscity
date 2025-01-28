import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../../customs/Spinner';
import { updateUserPassword } from '../../routes/authRoutes';
import Toast from '../../customs/Toast';
import '../../styles/ForgotPasswordPage.scss';

export default function ForgotPasswordPage() {
    const { email } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: email || '', password: '', confirmPassword: '', agree: false });
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const toggleShowPassword = () => setShowPassword(!showPassword);
    const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const validateForm = () => {
        const errors = {};
        const { email, password, confirmPassword, agree } = formData;

        if (!agree) {
            errors.agree = 'Vous devez accepter les termes et conditions.';
        } else {
            if (!email) {
                errors.email = 'Adresse email requise.';
            }
            if (!password) {
                errors.password = 'Mot de passe requis.';
            } else if (password.length < 4) {
                errors.password = 'Mot de passe trop court.';
            }
            if (!confirmPassword) {
                errors.confirmPassword = 'Confirmation du mot de passe requise.';
            } else if (password !== confirmPassword) {
                errors.confirmPassword = 'Les mots de passe ne correspondent pas.';
            }
        }

        return errors;
    };

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setLoading(false);
            return;
        }

        try {
            const result = await updateUserPassword(formData.email, formData.password);
            if (result.success) {
                setToast({ show: true, type: 'success', message: result.message });
                setTimeout(() => {
                    navigate('/auth/signin');
                }, 2000);
            } else {
                setToast({ show: true, type: 'error', message: result.message });
            }
        } catch (error) {
            setToast({ show: true, type: 'error', message: 'Une erreur est survenue.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password-page">
            <form className="reset-form" onSubmit={handleSubmit}>
                <h2>Réinitialisation du mot de passe</h2>

                {/* Email Field */}
                <div>
                    <label htmlFor="email">Identifiant</label>
                    <input
                        className={`input-field ${errors.email ? 'error' : ''}`}
                        type="email"
                        name="email"
                        id="email"
                        placeholder='Adresse email'
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <div className="error-text">{errors.email}</div>}
                </div>

                {/* Password Field */}
                <div className="password-toggle">
                    <label htmlFor="password">Nouveau mot de passe</label>
                    <input
                        className={`input-field ${errors.password ? 'error' : ''}`}
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Entrez un mot de passe"
                    />
                    <span onClick={toggleShowPassword}>
                        <FontAwesomeIcon
                            icon={showPassword ? faEyeSlash : faEye}
                            title={showPassword ? 'Cacher' : 'Afficher'}
                        />
                    </span>
                    {errors.password && <div className="error-text">{errors.password}</div>}
                </div>

                {/* Confirm Password Field */}
                <div className="password-toggle">
                    <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                    <input
                        className={`input-field ${errors.confirmPassword ? 'error' : ''}`}
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirmez le mot de passe"
                    />
                    <span onClick={toggleShowConfirmPassword}>
                        <FontAwesomeIcon
                            icon={showConfirmPassword ? faEyeSlash : faEye}
                            title={showConfirmPassword ? 'Cacher' : 'Afficher'}
                        />
                    </span>
                    {errors.confirmPassword && <div className="error-text">{errors.confirmPassword}</div>}
                </div>

                {/* Agree Checkbox */}
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        name="agree"
                        checked={formData.agree}
                        onChange={handleChange}
                    />
                    J'accepte les termes et conditions.
                </label>
                {errors.agree && <div className="error-text">{errors.agree}</div>}

                {/* Submit Button */}
                <button type="submit" disabled={loading}>
                    {loading ? <Spinner /> : 'Réinitialiser'}
                </button>
            </form>

            {/* Toast Notification */}
            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast({ ...toast, show: false })}
            />
        </div>
    );
}
