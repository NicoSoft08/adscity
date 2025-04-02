import React, { useEffect, useState } from 'react';
import { faChevronLeft, faCirclePlus, faCircleXmark, faCloudUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchPostById, updatePost } from '../../routes/postRoutes';
import Loading from '../../customs/Loading';
import InputField from '../../hooks/input-field/InputField';
import formFields from '../../json/formFields.json';
import Toast from '../../customs/Toast';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebaseConfig';
import '../../styles/EditPostID.scss';

export default function EditPostID({ currentUser, userData }) {
    const { post_id } = useParams();
    const navigate = useNavigate();
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({});
    const [fields, setFields] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const result = await fetchPostById(post_id);
            if (result.success) {
                const postDetails = result.data;
                const { subcategory } = postDetails || {};

                setSelectedImages(postDetails.images || []);

                const categoryFields = formFields.fields[subcategory] || [];
                setFields(categoryFields);

                const initialFormData = { ...postDetails };
                categoryFields.forEach(field => {
                    if (!(field.name in initialFormData.details)) {
                        initialFormData.details[field.name] =
                            field.type === "checkbox" ? [] :
                                field.type === "file" ? [] : "";
                    }
                });

                setFormData(initialFormData);
            }
            setLoading(false);
        };

        if (post_id) fetchData();
    }, [post_id]);

    const handleImageChange = (e, index) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setSelectedImages(prevImages => {
                const newImages = [...prevImages];
                newImages[index] = reader.result; // Remplace l'image à l'index donné
                return newImages;
            });
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = (index) => {
        setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        setFormData(prev => {
            let newValue = value;
            if (type === "checkbox") {
                newValue = checked ? [...(prev.details?.[name] || []), value] :
                    prev.details?.[name]?.filter(v => v !== value) || [];
            }
            if (type === "file") {
                newValue = files ? [...files] : [];
            }

            return {
                ...prev,
                details: { ...prev.details, [name]: newValue }
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await updatePost(post_id, formData, currentUser?.uid);
            if (result.success) {
                setToast({ show: true, message: result.message, type: 'success' });
                logEvent(analytics, 'update_post');
                setTimeout(() => {
                    setToast({ show: false, message: '', type: '' });
                    navigate('/user/dashboard/posts');
                }, 2000);
            } else {
                setToast({ show: true, message: result.error, type: 'error' });
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'annonce:', error);
            setToast({ show: true, message: 'Erreur lors de la mise à jour de l\'annonce', type: 'error' });
        }
        setLoading(false);
    };

    const validateImages = () => {
        if (!selectedImages.some(img => img !== null)) {
            setToast({ type: 'error', message: 'Veuillez télécharger au moins une image.', show: true });
            return false;
        }
        return true;
    };

    const getUserPlanMaxPhotos = () => {
        if (!userData?.plans) return 3;
        const userPlan = Object.values(userData.plans).find(plan => plan.max_photos !== undefined);
        return userPlan ? userPlan.max_photos : 3;
    };

    if (loading) return <Loading />;

    return (
        <div className='edit-post-id'>
            <div className="head">
                <FontAwesomeIcon icon={faChevronLeft} title='Go Back' onClick={() => navigate('/user/dashboard/posts')} />
                <h2>Modifier: {post_id.toUpperCase()}</h2>
            </div>

            <form onSubmit={handleSubmit} className="edit-form">
                <div className="image-upload-form">
                    <div className="image-uploader">
                        <div className="upload-area">
                            <FontAwesomeIcon icon={faCloudUpload} className="upload-icon" />
                            <label htmlFor="upload-input" className="upload-button">Télécharger des Images</label>
                        </div>

                        <div className="image-upload-grid">
                            {[...Array(getUserPlanMaxPhotos())].map((_, index) => (
                                <div className="image-upload-box" key={index}>
                                    {selectedImages[index] ? (
                                        <div className="image-container">
                                            <img src={selectedImages[index]} alt={`upload-${index}`} className="uploaded-image" />
                                            <FontAwesomeIcon
                                                icon={faCircleXmark}
                                                className="remove-icon"
                                                onClick={() => handleRemoveImage(index)}
                                            />
                                        </div>
                                    ) : (
                                        <label htmlFor={`image-input-${index}`} className="image-placeholder">
                                            <FontAwesomeIcon icon={faCirclePlus} className="plus-icon" size="2x" />
                                        </label>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id={`image-input-${index}`}
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleImageChange(e, index)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {fields.map(({ name, label, type, multiple, placeholder, options, required }) => (
                    <InputField
                        key={name}
                        label={label}
                        name={name}
                        placeholder={placeholder}
                        type={type}
                        required={required}
                        multiple={multiple}
                        options={options}
                        value={formData.details?.[name] || (type === "checkbox" ? [] : "")}
                        onChange={handleChange}
                    />
                ))}
                <button type="submit">Enregistrer</button>
            </form>

            <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ show: false, ...toast })} />
        </div>
    );
};
