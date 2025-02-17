import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPub } from '../../routes/apiRoutes';
import Toast from '../../customs/Toast';
import Spinner from '../../customs/Spinner';
import { uploadMedia } from '../../routes/storageRoutes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import '../../styles/CreatePub.scss';

export default function CreatePub() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [previewURL, setPreviewURL] = useState(null);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [infoData, setInfoData] = useState({
        advertiserName: "",
        contact: '',
        pubType: 'masthead', // Masthead / Vidéo In-Feed / Native Display / Géolocalisée
        startDate: "",
        endDate: "",
        budget: "",

    });
    const [contentData, setContentData] = useState({
        mediaFile: null,
        title: '',
        description: '',
        callToAction: '',
        targetURL: '',
        location: '',
    });

    const validateFile = (file) => {
        const allowedTypes = ["image/jpeg", "image/png", "video/mp4"];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!allowedTypes.includes(file.type)) {
            setToast({
                show: true,
                type: "error",
                message: "Format non supporté (JPEG, PNG, MP4 uniquement).",
            });
            return false;
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInfoData({ ...infoData, [name]: value });
        setContentData({ ...contentData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && validateFile(file)) {
            setContentData({ ...contentData, mediaFile: file });

            // Créer un aperçu du fichier (URL temporaire)
            const fileURL = URL.createObjectURL(file);
            setPreviewURL(fileURL);
        } else {
            setContentData({ ...contentData, mediaFile: null });
            setPreviewURL(null);
        }
    };

    const handleRemoveFile = () => {
        setContentData({ ...contentData, mediaFile: null });
        setPreviewURL(null);
    };

    const handleBack = () => {
        navigate('/admin/dashboard/pubs');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let mediaURL = null;

            if (contentData.mediaFile) {
                const file = contentData.mediaFile;
                const uploadResult = await uploadMedia(file);

                if (uploadResult.success) {
                    mediaURL = uploadResult.imageUrl;

                    const pubData = {
                        ...infoData,
                        ...contentData,
                        mediaFile: mediaURL, // URL obtenue du serveur
                    };

                    const result = await createPub(pubData);
                    if (result.success) {
                        setToast({
                            show: true,
                            type: 'success',
                            message: 'Publicité créée avec succès !',
                        })
                        setStep(1);
                        setInfoData({
                            advertiserName: "",
                            contact: '',
                            pubType: 'masthead', // Masthead / Vidéo In-Feed / Native Display / Géolocalisée
                            startDate: "",
                            endDate: "",
                            budget: "",
                        });
                        setContentData({
                            mediaFile: null,
                            title: '',
                            description: '',
                            callToAction: '',
                            targetURL: '',
                            location: '',
                        });
                        navigate('/');
                    }
                } else {
                    setToast({
                        show: true,
                        type: 'error',
                        message: 'Erreur lors du téléchargement du fichier.',
                    });
                    return;
                }
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
                                <label>Contact</label>
                                <input
                                    type="email"
                                    name="contact"
                                    value={infoData.contact}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Type de Publicité</label>
                                <select name="pubType" value={infoData.pubType} onChange={handleChange}>
                                    <option value="masthead">Masthead AdsCity</option>
                                    <option value="infeed">Vidéo In-Feed</option>
                                    <option value="native">Annonces Native Display</option>
                                    <option value="geo">Publicité Géolocalisée</option>
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

                            <button type="button" className="next-btn" onClick={() => setStep(2)}>Suivant</button>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h3>📢 Contenu de la Publicité</h3>
                            <div cassName="file-upload">
                                <label>Fichier Média (Vidéo/Image)</label>
                                <input
                                    type="file"
                                    accept="image/*, video/*"
                                    name="mediaFile"
                                    onChange={handleFileChange}
                                // style={{ display: "none" }}
                                />
                                {previewURL && (
                                    <div className="preview-container">
                                        {contentData.mediaFile.type.startsWith("image") ? (
                                            <img src={previewURL} alt="Aperçu" className="preview-media" />
                                        ) : (
                                            <video controls className="preview-media">
                                                <source src={previewURL} type={contentData.mediaFile.type} />
                                                Votre navigateur ne supporte pas la lecture de vidéos.
                                            </video>
                                        )}
                                        <button className="remove-button" onClick={handleRemoveFile}>
                                            Supprimer
                                        </button>
                                    </div>
                                )}
                            </div>
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
                            <div className="form-group">
                                <label>URL de Redirection</label>
                                <input
                                    type="url"
                                    name="targetURL"
                                    value={contentData.targetURL}
                                    onChange={handleChange}
                                />
                            </div>
                            {infoData.pubType === "geo" && (
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
                                <button type="button" className="prev-btn" onClick={() => setStep(1)}>Retour</button>
                                <button type="submit" className="submit-btn">{isLoading ? <Spinner /> : "Publier"}</button>
                            </div>
                        </div>
                    )}
                </form>
            </div>

            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    );
};
