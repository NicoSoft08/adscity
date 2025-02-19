import React, { useEffect, useState } from 'react';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchPostById } from '../../routes/postRoutes';
import Loading from '../../customs/Loading';
import '../../styles/ManagePostID.scss';

export default function ManagePostID() {
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState(null);
    const { post_id } = useParams();
    const navigate = useNavigate();

    console.log("Post ID envoyé vers le serveur",post_id);

    const handleBack = () => {
        navigate('/admin/dashboard/posts');
    };

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchPostById(post_id);
            if (result.success) {
                setPost(result.data);
                setLoading(false);
            }
        };

        if (post_id) {
            fetchData();
        }
    }, [post_id]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className='manage-post'>
            <div className="head">
                <FontAwesomeIcon icon={faChevronLeft} title='Go Back' onClick={handleBack} />
                <h2>Annonce: {post_id.toLocaleUpperCase()}</h2>
            </div>
            {JSON.stringify(post)}
        </div>
    );
};
