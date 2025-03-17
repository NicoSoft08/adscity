import React from 'react';
import { useParams } from 'react-router-dom';

export default function ActivityUserID() {
    const { post_id } = useParams();

    return (
        <div>
            <h2> Activité de {post_id}</h2>
        </div>
    );
};
