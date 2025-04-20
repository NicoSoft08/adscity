import React, { useEffect, useState } from 'react';
import { fetchRelatedListings } from '../../routes/postRoutes';
import CardList from '../../utils/card/CardList';
import CardItem from '../../utils/card/CardItem';
import './RelatedListing.scss';

export default function RelatedListing({ post_id, category }) {
    const [relatedAds, setRelatedAds] = useState([]);

    useEffect(() => {
        const fetchRelatedAds = async () => {
            try {
                const result = await fetchRelatedListings(post_id, category);
                if (result.success) {
                    setRelatedAds(result?.relatedPosts || []);
                }
            } catch (error) {
                console.error('Error fetching related ads:', error);
            }
        };

        if (post_id && category) {
            fetchRelatedAds();
        }
    }, [post_id, category]);

    return (
        <div className='ads-connexes'>
            <h2>Annonces Connexes</h2>
            {/* <CardList>
                {relatedAds.length > 0 ? (
                    relatedAds.map((item, index) => (
                        <CardItem key={index} post={item} />
                    ))
                ) : (
                    <p className='no-ads'>Aucunes annonces connexes pour cette catégorie.</p>
                )}
            </CardList> */}
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
