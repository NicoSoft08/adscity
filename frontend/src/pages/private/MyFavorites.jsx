import React, { useEffect, useState } from 'react';
import { getUserFavorites } from '../../routes/userRoutes';
import CardList from '../../utils/card/CardList';
import CardItem from '../../utils/card/CardItem';
import { useNavigate } from 'react-router-dom';

export default function MyFavorites({ currentUser }) {
    const navigate = useNavigate();
    const [favoris, setFavoris] = useState([]);

    useEffect(() => {
        if (!currentUser) {
            console.error("❌ Utilisateur non connecté.");
            navigate('/auth/signin');
        }
        const fetchFavoris = async () => {
            const userID = currentUser?.uid;
            const result = await getUserFavorites(userID);
            if (result.success) {
                setFavoris(result?.favorisData);
            }
        }

        fetchFavoris();
    }, [currentUser, navigate]);

    const handleRemoveFromFavorites = (adID) => {
        // Mettre à jour l'état pour retirer l'annonce supprimée
        setFavoris((prevFavoris) => prevFavoris.filter((ad) => ad.id !== adID));
    };

    return (
        <div className='my-favoris'>
            <h2>Mes Favoris</h2>
            {favoris.length > 0 ?
                <CardList>
                    {favoris.map((item, index) => (
                        <CardItem
                            key={index}
                            post={item}
                            onToggleFavorite={handleRemoveFromFavorites}
                        />
                    ))}
                </CardList>
                :
                <p>Aucunes annonces dans vos favoris</p>
            }
        </div>
    );
};
