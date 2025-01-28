import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { logEvent } from 'firebase/analytics';
import PublicProfil from '../../common/public-profil/PublicProfil';
import { analytics } from '../../firebaseConfig';
import {
    fetchUserActivePosts,
    fetchDataByUserID,
    rateUser
} from '../../routes/userRoutes';
import CardList from '../../utils/card/CardList';
import CardItem from '../../utils/card/CardItem';
import StarRating from '../../components/star-rating/StarRating';
import '../../styles/ShowUserPage.scss';
import { AuthContext } from '../../contexts/AuthContext';
import Toast from '../../customs/Toast';
import Spinner from '../../customs/Spinner';


export default function ShowUserPage() {
    const { userID } = useParams();
    const { currentUser } = useContext(AuthContext);
    const [profileData, setProfileData] = useState([]);
    const [profilePostsData, setProfilePostsData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    useEffect(() => {
        const fetchData = async () => {
            const [userData, userPostsData] = await Promise.all([
                fetchDataByUserID(userID),
                fetchUserActivePosts(userID)
            ]);
            if (userData.success) {
                setProfileData(userData?.data);
            }
            if (userPostsData.success) {
                setProfilePostsData(userPostsData?.activePosts);
            }
        }

        fetchData();
        logEvent(analytics, 'view_store');

    }, [userID]);

    const validateRating = () => {
        if (rating === 0) {
            setToast({ show: true, message: 'Veuillez attribuer une note à l\'utilisateur.', type: 'error' });
            return;
        };
        if (comment.trim() === '') {
            setToast({ show: true, message: 'Veuillez ajouter un commentaire.', type: 'error' });
            return;
        };
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            setToast({ show: true, message: 'Vous devez être connecté pour noter un utilisateur.', type: 'error' });
            return;
        };

        validateRating();

        setIsLoading(true);
        const result = await rateUser(userID, rating, comment);
        if (result.success) {
            setRating(0);
            setComment('');
            setIsLoading(false);
            setToast({ show: true, message: result.message, type: 'success' });
        } else {
            setIsLoading(false);
            setToast({ show: true, message: result.message, type: 'error' });
        }
    };

    return (
        <div className='store-page'>
            <div style={{}} />
            <PublicProfil profile={profileData} />
            <div className="listing">
                <h3>Publications</h3>
                <span>{profileData.adsCount > 1 ? `${profileData.adsCount + " Annonces"}` : `${profileData.adsCount + " Annonce"}`}</span>
            </div>
            <CardList>
                {profilePostsData.map((item, index) => (
                    <CardItem
                        key={index}
                        post={item}
                    />
                ))}
            </CardList>

            <form onSubmit={handleSubmit}>
                <h3>Laissez un avis :</h3>
                <StarRating
                    onRatingChange={(value) => setRating(value)}
                />
                <br />
                <textarea
                    placeholder="Votre commentaire..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                // required
                />
                <br />
                <button type="submit">
                    {isLoading
                        ? <Spinner />
                        : "Soumettre l'avis"
                    }
                </button>
            </form>

            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ show: false, ...toast })} />
        </div>
    );
};
