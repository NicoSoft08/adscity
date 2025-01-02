import React, { useEffect, useState } from 'react';
import { getUserFavorites } from '../../services/favorisServices';
import CardList from '../../utils/card/CardList';
import CardItem from '../../utils/card/CardItem';

export default function MyFavorites({ currentUser }) {
    const [favoris, setFavoris] = useState([]);

    useEffect(() => {
        const fetchFavoris = async () => {
            const userID = currentUser?.uid;
            const result = await getUserFavorites(userID);
            if (result.success) {
                setFavoris(result?.favorisData);
            }
        }

        fetchFavoris();
    }, [currentUser]);

    return (
        <div className='my-favoris'>
            <h2>Mes Favoris</h2>
            {favoris.length > 0 ?
                <CardList>
                    {favoris.map((item, index) => (
                        <CardItem
                            key={index}
                            ad={item}
                        />
                    ))}
                </CardList>
                :
                <p>Aucunes annonces dans vos favoris</p>
            }
        </div>
    );
};
