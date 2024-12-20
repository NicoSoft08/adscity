import React, { useState } from 'react';
import RatingDisplay from '../rating-stars/RatingDisplay';
import './ReviewForm.scss';
import Toast from '../../customs/Toast';

export default function ReviewForm({ ratings, currentUser, navigate }) {
    const [review, setReview] = useState('');
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    const handleSubmit = async () => {
        if (!currentUser) {
            navigate('/auth/signin');
            return;
        }

        if (review.length < 0) {
            setToast({ show: true, type: 'error', message: 'Veuillez saisir un avis.' });
            return;
        }
        
        console.log('Review submitted:', review);
        setReview('');
    };

    return (
        <div className="review-form">
            <RatingDisplay ratings={ratings} />
            <textarea
                name='review'
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Partagez votre expérience..."
            />
            <button onClick={handleSubmit}>Soumettre l'avis</button>
            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    );
};
