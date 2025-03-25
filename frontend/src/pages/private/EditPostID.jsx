import React, { useEffect, useState } from 'react';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchPostById, updatePost } from '../../routes/postRoutes';
import Loading from '../../customs/Loading';
import InputField from '../../hooks/input-field/InputField';
import { typeOfPrice } from '../../data/database';
import Toast from '../../customs/Toast';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebaseConfig';
import '../../styles/EditPostID.scss';

export default function EditPostID({ currentUser }) {
    const { post_id } = useParams();
    const navigate = useNavigate();
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ condition: "", description: "", price: "", priceType: "" });

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchPostById(post_id);
            if (result.success) {
                setLoading(false);
                setFormData({
                    condition: result.data.details.condition || "",
                    description: result.data.details.description || "",
                    price: result.data.details.price || "",
                    price_type: result.data.details.price_type || "",
                })
            }
        };

        if (post_id) {
            fetchData();
        }
    }, [post_id]);


    // Mettre à jour les champs du formulaire
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Sauvegarder les modifications dans Firestore
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userID = currentUser?.uid;
            const result = await updatePost(post_id, formData, userID);
            if (result.success) {
                setToast({ show: true, message: result.message, type: 'success' });
                logEvent(analytics, 'update_post');
                setTimeout(() => {
                    setToast({ show: false, message: '', type: '' });
                    handleBack();
                }, 2000);
                setLoading(false);
            } else {
                setToast({ show: true, message: result.error, type: 'error' });
                setLoading(false);
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'annonce:', error);
            setToast({ show: true, message: 'Erreur lors de la mise à jour de l\'annonce', type: 'error' });
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/user/dashboard/posts');
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className='edit-post-id'>
            <div className="head">
                <FontAwesomeIcon icon={faChevronLeft} title='Go Back' onClick={handleBack} />
                <h2>Modifier: {post_id.toLocaleUpperCase()}</h2>

            </div>

            <form onSubmit={handleSubmit} className="edit-form">
                <InputField label={"Condition"} name={"condition"} value={formData.condition} onChange={handleChange} />
                <InputField label={"Description"} name={"description"} value={formData.description} onChange={handleChange} />
                <InputField label={"Prix"} type='number' name={"price"} value={formData.price} onChange={handleChange} />
                <InputField label={"Type de prix"} type='select' name={"priceType"} value={formData.priceType} onChange={handleChange} options={typeOfPrice.fr} />
                <button type="submit">Enregistrer</button>
            </form>

            <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ show: false, ...toast })} />
        </div>
    );
};
