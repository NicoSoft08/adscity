import React, { useEffect, useState } from 'react';
import { fetchRelatedListings } from '../../services/adServices';
import CardList from '../../utils/card/CardList';
import CardItem from '../../utils/card/CardItem';
import './RelatedListing.scss';

export default function RelatedListing({ adID, currentCategory }) {
    const [relatedAds, setRelatedAds] = useState([]);

    useEffect(() => {
        const fetchRelatedAds = async () => {
            try {
                const relatedAds = await fetchRelatedListings(adID, currentCategory);
                setRelatedAds(relatedAds);
            } catch (error) {
                console.error('Error fetching related ads:', error);
            }
        };

        if (adID) {
            fetchRelatedAds();
        }
    }, [adID, currentCategory]);

    return (
        <div className='ads-connexes'>
            <h2>Annonces Connexes</h2>
            {relatedAds.length > 0 ?
                <CardList>
                    {relatedAds.map((item) => (
                        <CardItem ad={item} />
                    ))}
                </CardList>
                : (
                    <p>Aucunes annonces connexes pour cette catégorie.</p>
                )
            }
        </div>
    );
};