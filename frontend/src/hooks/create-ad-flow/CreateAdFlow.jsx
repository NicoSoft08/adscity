import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { createAnnonce } from '../../services/adServices';
import CategorySelection from '../category-selection/CategorySelection';
import PostAdForm from '../post-ad-form/PostAdForm';
import LocationForm from '../location-form/LocationForm';
import ImageUpload from '../image-upload/ImageUpload';
// import ChoosePlan from '../choose-plan/ChoosePlan';
import AdReview from '../ad-review/AdReview';
import ProgressBar from '../../utils/progress-bar/ProgressBar';
import StepIndicator from '../../utils/step-indicator/StepIndicator';
import Toast from '../../customs/Toast';
import LimitReachedModal from '../../customs/LimitReachedModal';
import Loading from '../../customs/Loading';
import AdCreatedSuccess from '../../components/ad-created-success/AdCreatedSuccess';

const createSearchableItem = (item) => {
    if (!item) return [];
    return item.toLowerCase().split(' ').filter(term => term.length > 2);
};

export default function CreateAdFlow() {
    const { currentUser, userData } = useContext(AuthContext);
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [toast, setToast] = useState({ show: false, type: '', message: '' })
    const [hasSucceed, setHasSucceed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showLimitModal, setShowLimitModal] = useState(false);
    const [formData, setFormData] = useState({
        category: '',
        subcategory: '',
        adDetails: {},
        location: {},
        images: [],
        plan: {},
    });


    useEffect(() => {
        if (!currentUser) {
            navigate('/access-denied');
            return;
        }
    }, [navigate, currentUser]);


    const handleNext = () => {
        if (step === 4) {
            setStep(5);
        } else {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleFormDataChange = (updatedData) => {
        setFormData(prevData => ({
            ...prevData,
            ...updatedData, // Fusionner les modifications reçues
        }));
    };

    const { adDetails, images, location, category, subcategory } = formData;
    const searchableTerms = [
        ...createSearchableItem(adDetails.title),
        ...createSearchableItem(adDetails.make),
        ...createSearchableItem(adDetails.model),
        ...createSearchableItem(adDetails.color),
    ];
    const adData = { 
        adDetails, 
        images, 
        location, 
        category, 
        subcategory,
        searchableTerms: [...new Set(searchableTerms)].filter(Boolean),
    };


    const handleSubmit = async () => {
        const userID = currentUser?.uid;
        try {
            setIsLoading(true);
            
            const result = await createAnnonce(adData, userID);

            if (result.success) {
                setToast({
                    type: 'success',
                    message: 'Annonce créée avec succès'
                });
                setHasSucceed(true);
            } else {
                if (result.error === 'Limite d\'annonces atteinte') {
                    setShowLimitModal(true);
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
        // {
        //     id: 1,
        //     title: 'Forfait',
        //     component: ChoosePlan,
        //     progress: 16
        // },
        {
            id: 1,
            title: 'Choisir une catégorie',
            component: CategorySelection,
            progress: 20
        },
        {
            id: 2,
            title: 'Détails de l\'annonce',
            component: PostAdForm,
            progress: 40
        },
        {
            id: 3,
            title: 'Localisation',
            component: LocationForm,
            progress: 60
        },
        {
            id: 4,
            title: 'Photos',
            component: ImageUpload,
            progress: 80
        },
        {
            id: 5,
            title: 'Vérification',
            component: AdReview,
            progress: 100
        }
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
                step === id && (
                    <Component
                        key={id}
                        onSubmit={handleSubmit}
                        onNext={handleNext}
                        onBack={handleBack}
                        onChange={handleFormDataChange}
                        formData={formData}
                        currentUser={currentUser}
                        userData={userData}
                        selectedSubcategory={formData.subcategory}
                    />
                )
            ))}

            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast({ ...toast, show: false })}
            />
            {showLimitModal && (
                <LimitReachedModal
                    isOpen={showLimitModal}
                    onClose={() => setShowLimitModal(false)}
                    onUpgrade={() => navigate('/pricing')}
                />
            )}
            {isLoading && <Loading />}
        </div>
    );
};
