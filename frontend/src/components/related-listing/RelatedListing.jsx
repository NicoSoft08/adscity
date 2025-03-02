import React, { useEffect, useState } from 'react';
import { fetchRelatedListings } from '../../routes/postRoutes';
import CardList from '../../utils/card/CardList';
import CardItem from '../../utils/card/CardItem';
import './RelatedListing.scss';

export default function RelatedListing({ postID, category }) {
    const [relatedAds, setRelatedAds] = useState([]);

    useEffect(() => {
        const fetchRelatedAds = async () => {
            try {
                const result = await fetchRelatedListings(postID, category);
                if (result.success) {
                    // const relatedAds = Array.isArray(result?.relatedAds) ? result?.relatedAds : [];
                    setRelatedAds(result?.relatedPosts || []);
                }
                // setRelatedAds(relatedAds);
            } catch (error) {
                console.error('Error fetching related ads:', error);
            }
        };

        if (postID) {
            fetchRelatedAds();
        }
    }, [postID, category]);

    return (
        <div className='ads-connexes'>
            <h2>Annonces Connexes</h2>
            {relatedAds.length > 0 ?
                <CardList>
                    {relatedAds.map((item) => (
                        <CardItem post={item} />
                    ))}
                </CardList>
                : (
                    <p>Aucunes annonces connexes pour cette catégorie.</p>
                )
            }
        </div>
    );
};
