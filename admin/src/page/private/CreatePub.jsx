import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPub } from '../../routes/apiRoutes';
import Toast from '../../customs/Toast';
import Spinner from '../../customs/Spinner';
import { uploadMedia } from '../../routes/storageRoutes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../../styles/CreatePub.scss';

export default function CreatePub() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);

    // 🔹 Aperçu de tous les fichiers (images/vidéos)
    const [previewURLs, setPreviewURLs] = useState([]);

    // 🔹 Infos générales
    const [infoData, setInfoData] = useState({
        advertiserName: "",
        contact: '',
        pubType: 'masthead', // masthead / video-in-feed / native-display / geo-located
        startDate: "",
        endDate: "",
        budget: "",
    });

    // 🔹 Contenu de la publicité (fichiers + textes)
    const [contentData, setContentData] = useState({
        mediaFiles: [], // Plusieurs fichiers
        title: '',
        description: '',
        callToAction: '',
        targetURL: '',
        domainName: '',
        location: '',
    });

    // 🔹 Valider le fichier selon pubType (images ou vidéo)
    const validateFile = (file) => {
        const allowedImageTypes = ["image/jpeg", "image/png"];
        const allowedVideoTypes = ["video/mp4"];
        const maxSize = 10 * 1024 * 1024; // 10MB

        // Selon pubType, autoriser image ou vidéo
        if (infoData.pubType === "masthead" || infoData.pubType === "native-display") {
            if (!allowedImageTypes.includes(file.type)) {
                setToast({
                    show: true,
                    type: "error",
                    message: "Format non supporté. Seulement JPEG, PNG pour ce type de publicité.",
                });
                return false;
            }
        } else if (infoData.pubType === "video-in-feed") {
            if (!allowedVideoTypes.includes(file.type)) {
                setToast({
                    show: true,
                    type: "error",
                    message: "Format non supporté. Seulement MP4 pour les vidéos in-feed.",
                });
                return false;
            }
        }

        if (file.size > maxSize) {
            setToast({
                show: true,
                type: "error",
                message: "Le fichier est trop volumineux (max 10MB).",
            });
            return false;
        }

        return true;
    };

    // 🔹 Gérer le changement de champs de texte
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (Object.keys(infoData).includes(name)) {
            setInfoData({ ...infoData, [name]: value });
        } else {
            setContentData({ ...contentData, [name]: value });
        }
    };

    // 🔹 Gérer l'upload de fichiers
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const newFiles = [];
        const newPreviewURLs = [...previewURLs];

        // Contrôle du nombre de fichiers selon pubType
        if (infoData.pubType === "masthead") {
            // max 3 images
            const maxImages = 3;
            if (contentData.mediaFiles.length + files.length > maxImages) {
                setToast({
                    show: true,
                    type: "error",
                    message: `Maximum ${maxImages} images autorisées.`,
                });
                return;
            }
        } else if (infoData.pubType === "video-in-feed" || infoData.pubType === "native-display") {
            // max 1 vidéo && max 1 image
            if (contentData.mediaFiles.length + files.length > 1) {
                setToast({
                    show: true,
                    type: "error",
                    message: `${infoData.pubType === "video-in-feed" ? "1 vidéo" : "1 image"} autorisée.`,
                });
                return;
            }
        }

        // Validation et preview
        files.forEach((file) => {
            if (validateFile(file)) {
                newFiles.push(file);
                const fileURL = URL.createObjectURL(file);
                newPreviewURLs.push({ fileURL, type: file.type });
            }
        });

        setContentData({
            ...contentData,
            mediaFiles: [...contentData.mediaFiles, ...newFiles],
        });
        setPreviewURLs(newPreviewURLs);
    };

    // 🔹 Retirer un fichier du tableau
    const handleRemoveFile = (index) => {
        const updatedFiles = [...contentData.mediaFiles];
        const updatedPreviews = [...previewURLs];
        updatedFiles.splice(index, 1);
        updatedPreviews.splice(index, 1);
        setContentData({ ...contentData, mediaFiles: updatedFiles });
        setPreviewURLs(updatedPreviews);
    };

    const handleBack = () => {
        navigate('/admin/dashboard/pubs');
    }

    // 🔹 Soumettre le formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // 🔹 Vérification des champs obligatoires si pubType === 'native-display'
        if (infoData.pubType === 'native-display') {
            if (!contentData.title.trim() || !contentData.description.trim() || !contentData.callToAction.trim()) {
                setToast({
                    show: true,
                    type: 'error',
                    message: "Veuillez renseigner le Titre, la Description et le Call-to-Action pour la publicité native.",
                });
                setIsLoading(false);
                return;
            }
        }

        try {
            const uploadedURLs = [];

            // 1. Upload de chaque fichier
            for (const file of contentData.mediaFiles) {
                const uploadResult = await uploadMedia(file);
                if (!uploadResult.success) {
                    setToast({
                        show: true,
                        type: 'error',
                        message: 'Erreur lors du téléchargement d\'un fichier.',
                    });
                    return;
                }
                uploadedURLs.push(uploadResult.imageUrl);
            }

            // 2. Créer l'objet pub
            const pubData = {
                ...infoData,
                ...contentData,
                mediaFiles: uploadedURLs, // liste d'URLs
            };

            // 3. Appel API
            const result = await createPub(pubData);
            if (result.success) {
                setToast({
                    show: true,
                    type: 'success',
                    message: 'Publicité créée avec succès !',
                });
                setStep(1);

                // Réinitialiser le formulaire
                setInfoData({
                    advertiserName: "",
                    contact: '',
                    pubType: 'masthead',
                    startDate: "",
                    endDate: "",
                    budget: "",
                });
                setContentData({
                    mediaFiles: [],
                    title: '',
                    description: '',
                    callToAction: '',
                    targetURL: '',
                    location: '',
                });
                setPreviewURLs([]);

                setTimeout(() => {
                    navigate('/admin/dashboard/pubs');
                }, 2000);

            } else {
                setToast({
                    show: true,
                    type: 'error',
                    message: result.message || 'Erreur lors de la création de la publicité.',
                });
            }
        } catch (error) {
            console.error('Erreur lors de la création de la publicité :', error);
            setToast({
                show: true,
                type: 'error',
                message: 'Erreur lors de la création de la publicité. Veuillez réessayer.',
            })
        } finally {
            setIsLoading(false);
        }
    };

    // 🔹 Gérer le type d'accept selon pubType
    const getAcceptType = () => {
        if (infoData.pubType === "masthead" || infoData.pubType === "native-display") {
            return "image/*";
        } else if (infoData.pubType === "video-in-feed") {
            return "video/mp4";
        }
        // pour d'autres cas éventuels
        return "image/*,video/mp4";
    };

    return (
        <div className='create-pub'>
            <div className="head">
                <FontAwesomeIcon icon={faChevronLeft} title='Go Back' onClick={handleBack} />
                <h2>Créer une publicité</h2>
            </div>

            <div className="creation-form">
                <form className="ad-form" onSubmit={handleSubmit}>
                    {step === 1 && (
                        <div>
                            <h3>📌 Informations Générales</h3>
                            <div className="form-group">
                                <label>Nom de l'Annonceur</label>
                                <input
                                    type="text"
                                    name="advertiserName"
                                    value={infoData.advertiserName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Contact (email ou téléphone)</label>
                                <input
                                    type="text"
                                    name="contact"
                                    value={infoData.contact}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Type de Publicité</label>
                                <select name="pubType" value={infoData.pubType} onChange={handleChange}>
                                    <option value="masthead">Masthead AdsCity (Max 3 images)</option>
                                    <option value="video-in-feed">Vidéo In-Feed (1 vidéo)</option>
                                    <option value="native-display">Annonces Native Display (1 image)</option>
                                    <option value="geo-located">Publicité Géolocalisée</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Date de Début</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={infoData.startDate}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Date de Fin</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={infoData.endDate}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Budget (₽)</label>
                                <input
                                    type="number"
                                    name="budget"
                                    value={infoData.budget}
                                    onChange={handleChange}
                                />
                            </div>

                            <button type="button" className="next-btn" onClick={() => setStep(2)}>
                                Suivant
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h3>📢 Contenu de la Publicité</h3>
                            <div className="form-group">
                                <label>Fichier(s) Média</label>
                                <input
                                    type="file"
                                    accept={getAcceptType()}
                                    onChange={handleFileChange}
                                    multiple // Autorise plusieurs fichiers
                                />
                                <div className="preview-list">
                                    {previewURLs.map((preview, index) => (
                                        <div key={index} className="preview-container">
                                            {preview.type.startsWith("image") ? (
                                                <img src={preview.fileURL} alt="Aperçu" className="preview-media" />
                                            ) : (
                                                <video controls className="preview-media">
                                                    <source src={preview.fileURL} type={preview.type} />
                                                </video>
                                            )}
                                            <button
                                                title='Supprimer'
                                                type="button"
                                                className="remove-button"
                                                onClick={() => handleRemoveFile(index)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {infoData && infoData.pubType !== "masthead" && (
                                <>
                                    <div className="form-group">
                                        <label>Titre de la Publicité</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={contentData.title}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea
                                            name="description"
                                            value={contentData.description}
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label>Call-to-Action (CTA)</label>
                                        <input
                                            type="text"
                                            name="callToAction"
                                            value={contentData.callToAction}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </>
                            )}
                            <div className="form-group">
                                <label>Un nom de domaine (si vous avez un site web)</label>
                                <input
                                    type="text"
                                    name="domainName"
                                    value={contentData.domainName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>URL de Redirection</label>
                                <input
                                    type="url"
                                    name="targetURL"
                                    value={contentData.targetURL}
                                    onChange={handleChange}
                                />
                            </div>
                            {infoData.pubType === "geo-located" && (
                                <div className="form-group">
                                    <label>Ciblage Géographique (Ville)</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={contentData.location}
                                        onChange={handleChange}
                                        placeholder="Ex: Moscou"
                                    />
                                </div>
                            )}

                            <div className="btns">
                                <button
                                    type="button"
                                    className="prev-btn"
                                    onClick={() => setStep(1)}
                                >
                                    Retour
                                </button>
                                <button type="submit" className="submit-btn">
                                    {isLoading ? <Spinner /> : "Publier"}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>

            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast({ ...toast, show: false })}
            />
        </div>
    );
}
