import React from 'react';
import BusinessPost from '../../utils/business-posts/BusinessPost';
import CardItem from '../../utils/card/CardItem';

export default function RegularBusinessPosts({ post }) {
    if (post.type === 'business') return <BusinessPost post={post} />;
    if (post.type === 'regular') return <CardItem post={post} />;
    return null; // 🔹 Évite d'afficher du vide en cas de type inconnu
}