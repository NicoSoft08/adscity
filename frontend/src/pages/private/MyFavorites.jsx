import React, { useEffect, useState } from 'react';
import { getUserFavorites } from '../../routes/userRoutes';
import CardList from '../../utils/card/CardList';
import CardItem from '../../utils/card/CardItem';
import { useNavigate } from 'react-router-dom';
import '../../styles/MyFavorites.scss';

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
                setFavoris(result?.postsSaved);
            }
        }

        fetchFavoris();
    }, [currentUser, navigate]);

    const handleRemoveFromFavorites = (postID) => {
        // Mettre à jour l'état pour retirer l'annonce supprimée
        setFavoris((prevFavoris) => prevFavoris.filter((post) => post.postID !== postID));
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
                            onToggleFavorite={() => handleRemoveFromFavorites(item.postID)}
                        />
                    ))}
                </CardList>
                :
                <p>Aucunes annonces dans vos favoris</p>
            }
        </div>
    );
};
