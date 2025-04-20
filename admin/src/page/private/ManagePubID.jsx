import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../../customs/Loading';
import { fetchPubById } from '../../routes/apiRoutes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import '../../styles/ManagePubID.scss';

export default function ManagePubID() {
    const [loading, setLoading] = useState(true);
    const [pub, setPub] = useState(null);
    const { pub_id } = useParams();
    const navigate = useNavigate();

    console.log(pub_id);

    const handleBack = () => {
        navigate('/admin/dashboard/pubs');
    };

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchPubById(pub_id);
            if (result.success) {
                setPub(result.data);
                setLoading(false);
            }
        };

        if (pub_id) {
            fetchData();
        }
    }, [pub_id]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className='manage-pub'>
            <div className="head">
                <FontAwesomeIcon icon={faChevronLeft} title='Go Back' onClick={handleBack} />
                <h2>Pub: {pub_id.toLocaleUpperCase()}</h2>
            </div>

            {JSON.stringify(pub)}
        </div>
    );
};
