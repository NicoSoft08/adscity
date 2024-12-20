import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import ButtonAdd from '../../customs/ButtonAdd';
import CardList from '../../utils/card/CardList';
import CardItem from '../../utils/card/CardItem';
import { fetchApprovedAds } from '../../services/adServices';
import { toggleFavorites } from '../../services/favorisServices';
import Toast from '../../customs/Toast';
import '../../styles/HomePage.scss';

export default function HomePage() {
    const { currentUser } = useContext(AuthContext);
    const [adsApproved, setAdsApproved] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    useEffect(() => {
        const getApprovedAds = async () => {
            const response = await fetchApprovedAds();
            const approvedAds = Array.isArray(response) ? response : [];
            setAdsApproved(approvedAds);

        }

        getApprovedAds();
    }, []);


    const handleHide = () => {
        setToast({
            ...toast,
            show: false,
        });
    };


    const handleFavoriteToggle = async (adID) => {
        const userID = currentUser?.uid;

        if (!userID) {
            setToast({
                show: true,
                type: 'error',
                message: "Oups ! Il semble que vous n'êtes pas connecté"
            });
            return;
        }

        const result = await toggleFavorites(adID, userID);

        if (result.success) {
            setIsLiked(prev => !prev);
        } else {
            setToast({
                show: true,
                type: 'error',
                message: result.message
            });
        }
    };




    return (
        <div className='home-page'>
            <ButtonAdd />
            {adsApproved.length === 0 && <p>Aucune annonce trouvée</p>}
            <CardList>
                {adsApproved.map((item, index) => (
                    <CardItem
                        key={index}
                        ad={item}
                        isLiked={isLiked}
                        onToggleFavorites={() => handleFavoriteToggle(item.id)}
                    />
                ))}
            </CardList>

            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={handleHide}
            />
        </div>
    );
};
