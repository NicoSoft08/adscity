import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { createPost } from '../../routes/postRoutes';
// import ChoosePlan from '../choose-plan/ChoosePlan';
import ProgressBar from '../../utils/progress-bar/ProgressBar';
import StepIndicator from '../../utils/step-indicator/StepIndicator';
import Toast from '../../customs/Toast';
import LimitReachedModal from '../../customs/LimitReachedModal';
import Loading from '../../customs/Loading';
import AdCreatedSuccess from '../../components/ad-created-success/AdCreatedSuccess';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebaseConfig';
import Review from '../ad-review/Review';
import Location from '../location-form/Location';
import Details from '../post-ad-form/Details';
import SelectCategory from '../category-selection/SelectCategory';
import ImageUpload from '../image-upload/ImageUpload';
import { logClientAction } from '../../routes/apiRoutes';
import { LanguageContext } from '../../contexts/LanguageContext';

const createSearchableItem = (text) => {
    if (!text) return [];
    text = text.toLowerCase().trim();
    const words = text.split(/\s+/);

    const variations = words.flatMap(word => {
        const cleanWord = word.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Supprimer accents
        const prefixes = [];

        // Générer des préfixes (ex: "ordinateur" => "o", "or", "ord", ...)
        for (let i = 1; i <= cleanWord.length; i++) {
            prefixes.push(cleanWord.slice(0, i));
        }

        return [cleanWord, ...prefixes];
    });

    return [...new Set(variations)];
};

export default function CreatePostFlow() {
    const { currentUser, userData } = useContext(AuthContext);
    const { language } = useContext(LanguageContext);
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [toast, setToast] = useState({ show: false, type: '', message: '' })
    const [hasSucceed, setHasSucceed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showLimitModal, setShowLimitModal] = useState(false);
    const [formData, setFormData] = useState({ category: "", subcategory: "", details: {}, images: [], location: {} });

    useEffect(() => {
        if (!currentUser) {
            navigate('/access-denied');
            return;
        }
    }, [navigate, currentUser]);


    // Gère les étapes du formulaire
    const nextStep = () => setStep(prev => Math.min(prev + 1, steps.length));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    // Gestion centralisée des changements de l'état du formulaire
    const handleChange = () => {
        setFormData(prevData => {
            let newData = { ...prevData };

            return newData;
        });
    };


    const { details, images, location, category, subcategory } = formData;
    const searchableTerms = [
        ...createSearchableItem(details.title),
        ...createSearchableItem(details.make),
        ...createSearchableItem(details.model),
        ...createSearchableItem(details.color),
        ...createSearchableItem(location.country),
        ...createSearchableItem(location.city),
        ...createSearchableItem(category),
        ...createSearchableItem(subcategory),
    ];

    const postData = {
        details,
        images,
        location,
        category,
        subcategory,
        searchableTerms: [...new Set(searchableTerms)].filter(Boolean),
    };


    const handleSubmit = async (captchaToken) => {
        const userID = currentUser?.uid;
        try {
            setIsLoading(true);

            const result = await createPost(postData, userID, captchaToken);

            if (result.success) {
                setToast({
                    type: 'success',
                    message: language === 'FR'
                        ? 'Annonce créée avec succès'
                        : 'Ad created successfully'
                });
                await logClientAction(
                    userID,
                    language === 'FR'
                        ? "Publication d'annonce"
                        : "Post creation",
                    language === 'FR'
                        ? "Vous avez publié une annonce sur le site."
                        : "You have posted an ad on the site.",
                )
                logEvent(analytics, 'post_created');
                setHasSucceed(true);
            } else {
                if (result.error === 'Limite d\'annonces atteinte') {
                    setShowLimitModal(true);
                    logEvent(analytics, 'limit_reached');
                } else {
                    setToast({
                        type: 'error',
                        message: result.error
                    });
                }
                setHasSucceed(false);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const steps = [
        { id: 1, title: language === 'FR' ? "Catégorisation" : 'Categorization', component: SelectCategory, progress: 20 },
        { id: 2, title: language === 'FR' ? "Détails" : 'Details', component: Details, progress: 40 },
        { id: 3, title: language === 'FR' ? "Images" : 'Images', component: ImageUpload, progress: 60 },
        { id: 4, title: language === 'FR' ? "Emplacement" : 'Location', component: Location, progress: 80 },
        { id: 5, title: language === 'FR' ? "Vérification" : 'Verification', component: Review, progress: 100 },
    ];

    if (hasSucceed) {
        return <AdCreatedSuccess />
    }

    return (
        <div className="create-ad-flow">
            <ProgressBar progress={steps[step - 1].progress} />
            <StepIndicator
                currentStep={step}
                totalSteps={steps.length}
                title={steps[step - 1].title}
            />

            {steps.map(({ id, component: Component }) => (
                step === id ? (
                    <Component
                        formData={formData}
                        isLoading={isLoading}
                        userData={userData}
                        currentUser={currentUser}
                        onBack={prevStep}
                        onNext={nextStep}
                        setFormData={setFormData}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                    />
                ) : null
            ))}

            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
            {showLimitModal && (<LimitReachedModal isOpen={showLimitModal} onClose={() => setShowLimitModal(false)} onUpgrade={() => navigate('/pricing')} />)}
            {isLoading && <Loading />}
        </div>
    );
};
