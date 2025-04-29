import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faBuilding, faCheck, faClock, faComment, faEnvelope, faIndustry, faLink, faMapMarkerAlt, faMapPin, faMoneyBillWave, faPhone, faQuestion, faSpinner } from '@fortawesome/free-solid-svg-icons';
import './PubCreationForm.scss';

export default function PubCreationForm({ currentUser, userData }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Informations sur l'entreprise
    companyName: '',
    industrySector: '',
    redirectLink: '',
    address: '',
    phoneNumber: '',
    email: '',

    // Détails de la promotion
    promotionType: '',
    productDescription: '',
    duration: '',

    // Emplacements
    placements: {
      mainPage: false,
      categoryPages: false,
      productDetailPages: false
    },

    // Budget et autres
    budget: '',
    specificRequest: '',
    discoverySource: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    // Si l'utilisateur est connecté, pré-remplir certains champs
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        email: userData.email || '',
        phoneNumber: userData.phoneNumber || ''
      }));
    }
  }, [currentUser, userData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox' && name.startsWith('placements.')) {
      const placementKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        placements: {
          ...prev.placements,
          [placementKey]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Effacer l'erreur pour ce champ s'il y en a une
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.companyName) newErrors.companyName = 'Le nom de l\'entreprise est requis.';
      if (!formData.industrySector) newErrors.industrySector = 'Le secteur d\'activité est requis.';
      if (!formData.redirectLink) newErrors.redirectLink = 'Le lien de redirection est requis.';
      if (!formData.address) newErrors.address = 'L\'adresse est requise.';
      if (!formData.phoneNumber) newErrors.phoneNumber = 'Le numéro de téléphone est requis.';
      if (!formData.email) newErrors.email = 'L\'adresse e-mail est requise.';
    } else if (step === 2) {
      if (!formData.promotionType) newErrors.promotionType = 'Le type de promotion est requis.';
      if (!formData.productDescription) newErrors.productDescription = 'La description du produit est requise.';
      if (!formData.duration) newErrors.duration = 'La durée de la promotion est requise.';
    } else if (step === 3) {
      if (!formData.budget) newErrors.budget = 'Le budget est requis.';
      if (!formData.specificRequest) newErrors.specificRequest = 'La demande spécifique est requise.';
      if (!formData.discoverySource) newErrors.discoverySource = 'La source de découverte est requise.';
    } else if (step === 4) {
      if (!formData.placements.mainPage && !formData.placements.categoryPages && !formData.placements.productDetailPages) {
        newErrors.placements = 'Veuillez sélectionner au moins un emplacement.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
  };

  // Rendu des étapes du formulaire
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderCompanyInfoStep();
      case 2:
        return renderPromotionDetailsStep();
      case 3:
        return renderBudgetAndOthersStep();
      default:
        return null;
    }
  };

  const renderCompanyInfoStep = () => (
    <div className="form-step">
      <h3>Informations sur l'entreprise</h3>

      <div className="form-group">
        <label htmlFor="companyName">
          <FontAwesomeIcon icon={faBuilding} />
          Nom de l'entreprise
        </label>
        <input
          type="text"
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          className={errors.companyName ? 'error' : ''}
          placeholder='Entrez le nom de votre entreprise'
        />
        {errors.companyName && <span className="error-message">{errors.companyName}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="industrySector">
          <FontAwesomeIcon icon={faIndustry} />
          Secteur d'activité
        </label>
        <input
          type="text"
          id="industrySector"
          name="industrySector"
          value={formData.industrySector}
          onChange={handleChange}
          className={errors.industrySector ? 'error' : ''}
          placeholder='Ex: Commerce, Technologie, Santé...'
        />
        {errors.industrySector && <span className="error-message">{errors.industrySector}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="redirectLink">
          <FontAwesomeIcon icon={faLink} />
          Lien de redirection
        </label>
        <input
          type="url"
          id="redirectLink"
          name="redirectLink"
          value={formData.redirectLink}
          onChange={handleChange}
          className={errors.redirectLink ? 'error' : ''}
          placeholder="https://..."
        />
        <br />
        <small className="form-hint">
          Lien vers lequel les utilisateurs seront redirigés en cliquant sur votre publicité
        </small>
        <br />
        {errors.redirectLink && <span className="error-message">{errors.redirectLink}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="address">
          <FontAwesomeIcon icon={faMapMarkerAlt} />
          Adresse de l'entreprise
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className={errors.address ? 'error' : ''}
          placeholder='Adresse complète'
        />
        {errors.address && <span className="error-message">{errors.address}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="phoneNumber">
          <FontAwesomeIcon icon={faPhone} />
          Numéro de téléphone
        </label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          className={errors.phoneNumber ? 'error' : ''}
          placeholder='Ex: +7 XXX XXX XXX'
        />
        {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">
          <FontAwesomeIcon icon={faEnvelope} />
          Adresse Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'error' : ''}
          placeholder='votre@email.com'
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div className="form-actions">
        <button type="button" className="next-btn" onClick={nextStep}>
          Suivant
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </div>
  );

  const renderPromotionDetailsStep = () => (
    <div className="form-step">
      <h3>Détails de la promotion</h3>

      <div className="form-group">
        <label htmlFor="promotionType">
          Type de promotion souhaité
        </label>
        <div className="radio-group">
          <div className="radio-option">
            <input
              type="radio"
              id="banner"
              name="promotionType"
              value="banner"
              checked={formData.promotionType === 'banner'}
              onChange={handleChange}
            />
            <label htmlFor="banner">Bannière publicitaire</label>
          </div>
        </div>
        <div className="radio-group">
          <div className="radio-option">
            <input
              type="radio"
              id="video"
              name="promotionType"
              value="video"
              checked={formData.promotionType === 'video'}
              onChange={handleChange}
            />
            <label htmlFor="video">Vidéo promotionnelle</label>
          </div>
        </div>
        <div className="radio-group">
          <div className="radio-option">
            <input
              type="radio"
              id="integrated"
              name="promotionType"
              value="integrated"
              checked={formData.promotionType === 'integrated'}
              onChange={handleChange}
            />
            <label htmlFor="integrated">Annonce intégrée</label>
          </div>
        </div>
        {errors.promotionType && <span className="error-message">{errors.promotionType}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="productDescription">
          <FontAwesomeIcon icon={faComment} />
          Description du produit ou service à promouvoir
        </label>
        <textarea
          id="productDescription"
          name="productDescription"
          value={formData.productDescription}
          onChange={handleChange}
          className={errors.productDescription ? 'error' : ''}
          rows="4"
          placeholder={'Décrivez brièvement votre produit ou service...'}
        ></textarea>
        {errors.productDescription && <span className="error-message">{errors.productDescription}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="duration">
          <FontAwesomeIcon icon={faClock} />
          Durée souhaitée de la campagne
        </label>
        <select
          id="duration"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          className={errors.duration ? 'error' : ''}
        >
          <option value="">Sélectionnez une durée</option>
          <option value="1-week">1 semaine</option>
          <option value="2-weeks">2 semaines</option>
          <option value="1-month">1 mois</option>
          <option value="3-months">3 mois</option>
          <option value="6-months">6 mois</option>
          <option value="1-year">1 an</option>
        </select>
        {errors.duration && <span className="error-message">{errors.duration}</span>}
      </div>
      <div className="form-group">
        <label>
          <FontAwesomeIcon icon={faMapPin} />
          Emplacements souhaités
        </label>
        <p className="form-hint">
          Sélectionnez les emplacements où vous souhaitez que votre publicité apparaisse
        </p>

        <div className="placement-options">
          <div className={`placement-option ${formData.placements.mainPage ? 'selected' : ''}`}>
            <div className="placement-header">
              <input
                type="checkbox"
                id="mainPage"
                name="placements.mainPage"
                checked={formData.placements.mainPage}
                onChange={handleChange}
              />
              <h4>Page d'accueil</h4>
            </div>
            <p>
              Visibilité maximale sur la page la plus visitée du site
            </p>
            <div className="placement-price">
              À partir de 50,000 FCFA
            </div>
          </div>

          <div className={`placement-option ${formData.placements.categoryPages ? 'selected' : ''}`}>
            <div className="placement-header">
              <input
                type="checkbox"
                id="categoryPages"
                name="placements.categoryPages"
                checked={formData.placements.categoryPages}
                onChange={handleChange}
              />
              <h4>Pages de catégories</h4>
            </div>
            <p>
              Ciblage par catégorie pour atteindre un public spécifique
            </p>
            <div className="placement-price">
              À partir de 30,000 FCFA
            </div>
          </div>

          <div className={`placement-option ${formData.placements.productDetailPages ? 'selected' : ''}`}>
            <div className="placement-header">
              <input
                type="checkbox"
                id="productDetailPages"
                name="placements.productDetailPages"
                checked={formData.placements.productDetailPages}
                onChange={handleChange}
              />
              <h4>Pages de détails</h4>
            </div>
            <p>
              Apparaît sur les pages de détails des annonces similaires
            </p>
            <div className="placement-price">
              À partir de 25,000 FCFA
            </div>
          </div>
        </div>

        {errors.placements && <span className="error-message">{errors.placements}</span>}
      </div>

      <div className="form-actions">
        <button type="button" className="prev-btn" onClick={prevStep}>
          <FontAwesomeIcon icon={faArrowLeft} />
          Précédent
        </button>
        <button type="button" className="next-btn" onClick={nextStep}>
          Suivant
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </div >
  );

  const renderBudgetAndOthersStep = () => (
    <div className="form-step">
      <h3>Budget et informations complémentaires</h3>

      <div className="form-group">
        <label htmlFor="budget">
          <FontAwesomeIcon icon={faMoneyBillWave} />
          Budget mensuel estimé (en RUB)
        </label>
        <select
          id="budget"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          className={errors.budget ? 'error' : ''}
        >
          <option value="">Sélectionnez un budget</option>
          <option value="10000-50000">10,000 - 50,000 RUB</option>
          <option value="50000-100000">50,000 - 100,000 RUB</option>
          <option value="100000-250000">100,000 - 250,000 RUB</option>
          <option value="250000-500000">250,000 - 500,000 RUB</option>
          <option value="500000+">Plus de 500,000 RUB</option>
        </select>
        {errors.budget && <span className="error-message">{errors.budget}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="specificRequest">
          <FontAwesomeIcon icon={faComment} />
          Demandes spécifiques ou commentaires
        </label>
        <textarea
          id="specificRequest"
          name="specificRequest"
          value={formData.specificRequest}
          onChange={handleChange}
          rows="4"
        ></textarea>
      </div>

      <div className="form-group">
        <label htmlFor="discoverySource">
          <FontAwesomeIcon icon={faQuestion} />
          Comment avez-vous découvert AdsCity ?
        </label>
        <select
          id="discoverySource"
          name="discoverySource"
          value={formData.discoverySource}
          onChange={handleChange}
          className={errors.discoverySource ? 'error' : ''}
        >
          <option value="">Sélectionnez une option</option>
          <option value="search">Moteur de recherche</option>
          <option value="social">Réseaux sociaux</option>
          <option value="friend">Recommandation d'un ami</option>
          <option value="ad">Publicité en ligne</option>
          <option value="other">Autre</option>
        </select>
        {errors.discoverySource && <span className="error-message">{errors.discoverySource}</span>}
      </div>
      {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}

      <div className="form-actions">
        <button type="button" className="prev-btn" onClick={prevStep}>
          <FontAwesomeIcon icon={faArrowLeft} />
          Précédent
        </button>
        <button
          type="submit"
          className="submit-btn"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin />
              Envoi en cours...
            </>
          ) : (
            <>
              Soumettre la demande
              <FontAwesomeIcon icon={faCheck} />
            </>
          )}
        </button>
      </div>
      {submitSuccess && (
        <div className="success-message">
          <FontAwesomeIcon icon={faCheck} />
          Votre demande a été soumise avec succès ! Nous vous contacterons bientôt.
        </div>
      )}
    </div>
  );
  return (
    <div>
      {renderStep()}
    </div>
  );
};
