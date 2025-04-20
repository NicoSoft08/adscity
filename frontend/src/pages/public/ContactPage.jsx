import React, { useEffect, useRef, useState } from 'react';
import { faCheck, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../../customs/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';
import { contactSupportClient } from '../../routes/apiRoutes';
import Toast from '../../customs/Toast';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebaseConfig';
import '../../styles/ContactPage.scss';

export default function ContactPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        object: '',
        message: '',
        agree: false,
    });

    useEffect(() => {
        logEvent(analytics, 'page_view', { page_path: '/contact' });
    }, []);

    const validateForm = () => {
        const formErrors = {};
        if (formData.agree === false) {
            formErrors.agree = "Veuillez accepter les conditions"
        } else {
            if (!formData.firstName) {
                formErrors.firstName = 'Prénom réquis';
            }
            if (!formData.lastName) {
                formErrors.lastName = 'Nom de Famille réquis';
            }
            if (!formData.email) {
                formErrors.email = "Email réquis";
            }
            if (!formData.email.match(/^\S+@\S+\.\S+$/)) {
                formErrors.email = "Veuillez saisir une adresse email valide";
            }
            if (!formData.object) {
                formErrors.object = "Objet du message réquis";
            }
            if (!formData.message) {
                formErrors.message = "Corps du message réquis";
            }
        }

        return formErrors;
    }

    const formRef = useRef(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async () => {
        setLoading(true);

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            setLoading(false);
            setTimeout(() => {
                setErrors({});
            }, 3000);
            return;
        }

        
        try {
            const result = await contactSupportClient(formData);
            if (result.success) {
                setMessage(result.message);
                setSubmitted(true);
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    object: '',
                    message: '',
                    agree: false,
                });
            } else {
                setMessage(result.message);
            }
        } catch (error) {
            setMessage(error);
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    if (submitted) {
        return (
            <div className='success-message'>
                <div className='icons'>
                    <FontAwesomeIcon icon={faCheck} className='icon' />
                </div>
                <h2>Message Envoyé</h2>
                <p>Nous avons reçu votre message, merci de nous avoir contacté!</p>
                <button onClick={() => navigate('/')}>
                    Aller à l'accueil
                </button>
            </div>
        );
    }

    return (
        <div className="contactus-form">
            <form ref={formRef} onSubmit={handleSubmit}>
                <label htmlFor="Identité">
                    Identité
                    <input
                        className={`input-field ${errors.firstName && 'error'}`}
                        name="firstName"
                        type="text"
                        placeholder='Prénoms'
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                    {errors.firstName && (
                        <div className="error-message">{errors.firstName}</div>
                    )}
                    <input
                        className={`input-field ${errors.lastName && 'error'}`}
                        name="lastName"
                        type="text"
                        placeholder='Nom de famille'
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                    {errors.lastName && (
                        <div className="error-message">{errors.lastName}</div>
                    )}
                </label>
                <label htmlFor="email">
                    Email
                    <input
                        className={`input-field ${errors.email && 'error'}`}
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && (
                        <div className="error-message">{errors.email}</div>
                    )}
                </label>
                <label htmlFor="object">
                    Objet
                    <select
                        className={`input-field ${errors.object && 'error'}`}
                        id="object"
                        name="object"
                        value={formData.object}
                        onChange={handleChange}
                    >
                        <option value="" disabled selected>Choisissez un objet</option>
                        <option value="Support Technique">Support Technique</option>
                        <option value="Questions Relatives aux Annonces">Questions Relatives aux Annonces</option>
                        <option value="Problèmes De Paiement">Problèmes De Paiement</option>
                        {/* <option value="Demandes de Partenariat">Demandes de Partenariat</option> */}
                        <option value="Suggestions d'Amélioration">Suggestions d'Amélioration</option>
                        {/* <option value="Publicité et Sponsoring">Publicité et Sponsoring</option> */}
                        <option value="Questions Générales">Questions Générales</option>
                    </select>
                    {errors.object && (
                        <div className="error-message">{errors.object}</div>
                    )}
                </label>
                <label htmlFor="message">
                    Message
                    <textarea
                        className={`input-field ${errors.message && 'error'}`}
                        rows="5"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                    />
                    {errors.message && (
                        <div className="error-message">{errors.message}</div>
                    )}
                </label>
                <label htmlFor="agree" className='checkbox-label'>
                    {errors.agree && (
                        <div className="error-message">{errors.agree}</div>
                    )}
                    <input
                        type="checkbox"
                        name="agree"
                        checked={formData.agree}
                        onChange={handleChange}
                    />
                    J'accepte les termes et conditions

                </label>
                <button
                    className='submit'
                    type='submit'
                    // className={`submit-button ${error || !agree ? 'disabled' : ''} `}
                    disabled={loading}
                    onClick={handleSubmit}>
                    {loading ? <Spinner /> : (
                        <>
                            <FontAwesomeIcon className='icon' icon={faPaperPlane} />
                            <span>Envoyer</span>
                        </>
                    )}
                </button>
                {message && (
                    <div className="error-message">{message}</div>
                )}

                <div className="terms-container">
                    <p>
                        <Link to="/legal/privacy-policy" target="_blank">Confidentialité</Link>{" - "}
                        <Link to="/legal/terms" target="_blank">Conditions d'utilisation</Link>
                        {/* <Link to="/data-processing" target="_blank">Politique de traitement des données</Link>. */}
                    </p>
                </div>
            </form>

            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ show: false, ...toast })} />
        </div>
    );
};
