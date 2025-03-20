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
import ImageUpload from '../image-upload/ImageUpload';
import Review from '../ad-review/Review';
import Location from '../location-form/Location';
import Details from '../post-ad-form/Details';
import SelectCategory from '../category-selection/SelectCategory';
import data from '../../json/data.json';
import formFields from "../../json/formFields.json";
import { uploadImage } from '../../routes/storageRoutes';
import { ImageLoading } from '../../config/images';

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
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [subcategories, setSubcategories] = useState([]);
    const [toast, setToast] = useState({ show: false, type: '', message: '' })
    const [hasSucceed, setHasSucceed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showLimitModal, setShowLimitModal] = useState(false);
    const [formData, setFormData] = useState({ category: "", subcategory: "", details: {}, images: [], location: {} });
    const [useUserAddress, setUseUserAddress] = useState(false);
    const [selectedImages, setSelectedImages] = useState(() => formData.images ?? []);


    useEffect(() => {
        if (!currentUser) {
            navigate('/access-denied');
            return;
        }
    }, [navigate, currentUser]);

    // Met à jour les sous-catégories lorsqu'on change de catégorie
    useEffect(() => {
        if (formData.category) {
            const category = data.categories.find(cat => cat.categoryName === formData.category);
            setSubcategories(category ? category.container || [] : []);
        } else {
            setSubcategories([]);
        }
    }, [formData.category]);

    // Met à jour les champs dynamiques en fonction de la sous-catégorie
    useEffect(() => {
        if (formData.subcategory) {
            const fields = formFields.fields[formData.subcategory] || [];
            const initialData = fields.reduce((acc, field) => {
                acc[field.name] = field.type === "checkbox" ? [] : field.type === "file" ? [] : "";
                return acc;
            }, {});

            setFormData(prev => ({ ...prev, details: initialData }));
        }
    }, [formData.subcategory]);


    // Gère les étapes du formulaire
    const nextStep = () => setStep(prev => Math.min(prev + 1, steps.length));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    // Gestion des changements dans les champs du formulaire
    const handleChange = async (e, index = null) => {
        const { name, value, type, checked, files } = e.target;

        if (name === 'useUserAddress') {
            setUseUserAddress(checked);
            if (checked) {
                if (userData?.country && userData?.city && userData?.address) {
                    setFormData(prev => ({
                        ...prev,
                        location: {
                            country: userData.country,
                            city: userData.city,
                            address: userData.address,
                        },
                    }));
                    setToast({ type: 'info', message: 'Adresse importée depuis votre compte.', show: true });
                } else {
                    setToast({ type: 'error', message: 'Votre adresse est incomplète, veuillez la saisir manuellement.', show: true });
                    setUseUserAddress(false);
                }
            } else {
                setFormData(prev => ({ ...prev, location: {} }));
            }
        } else if (type === "checkbox") {
            setFormData(prev => ({
                ...prev,
                details: {
                    ...prev.details,
                    [name]: checked
                        ? [...(prev.details[name] || []), value]
                        : prev.details[name].filter(v => v !== value),
                },
            }));
        } else if (type === "file") {
            await handleImageChange(index, files[0]);
        } else {
            setFormData(prev => ({
                ...prev,
                details: {
                    ...prev.details,
                    [name]: value,
                },
            }));
        }
    };

    // Gestion des images
    const handleImageChange = async (index, file) => {
        if (!file) return;
        const userID = currentUser?.uid;
    
        // Préparer un placeholder "loading"
        const newImages = [...selectedImages];
        newImages[index] = ImageLoading;
        setSelectedImages([...newImages]);
    
        const result = await uploadImage(file, userID);
    
        if (result.success) {
            newImages[index] = result.imageUrl;
            setToast({ show: true, message: 'Image ajoutée au formulaire !', type: 'success' });
        } else {
            newImages[index] = null;
            setToast({ show: true, message: result.message, type: 'error' });
        }
    
        setSelectedImages([...newImages]);
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    // Suppression d’une image
    const handleRemoveImage = (index) => {
        const newImages = [...selectedImages];
        newImages.splice(index, 1); // Supprime l’image ciblée

        setSelectedImages([...newImages]);
        setFormData(prev => ({ ...prev, images: newImages }));
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


    const handleSubmit = async () => {
        const userID = currentUser?.uid;
        try {
            setIsLoading(true);

            const result = await createPost(postData, userID);

            if (result.success) {
                setToast({
                    type: 'success',
                    message: 'Annonce créée avec succès'
                });
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
        { id: 1, title: "Catégorisation", component: SelectCategory, progress: 20 },
        { id: 2, title: "Détails", component: Details, progress: 40 },
        { id: 3, title: "Images", component: ImageUpload, progress: 60 },
        { id: 4, title: "Emplacement", component: Location, progress: 80 },
        { id: 5, title: "Vérification", component: Review, progress: 100 },
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
                        key={id}
                        onSubmit={handleSubmit}
                        onNext={nextStep}
                        onBack={prevStep}
                        onChange={handleChange}
                        setFormData={setFormData}
                        setUseUserAddress={setUseUserAddress}
                        handleRemoveImage={handleRemoveImage}
                        subcategories={subcategories}
                        formData={formData}
                        currentUser={currentUser}
                        userData={userData}
                        isLoading={isLoading}
                        useUserAddress={useUserAddress}
                        selectedImages={selectedImages}
                    />
                ) : null
            ))}

            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
            {showLimitModal && (<LimitReachedModal isOpen={showLimitModal} onClose={() => setShowLimitModal(false)} onUpgrade={() => navigate('/pricing')} />)}
            {isLoading && <Loading />}
        </div>
    );
};
