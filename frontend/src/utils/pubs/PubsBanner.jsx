import React, { useEffect } from 'react';
import { PUBS_CONFIG } from '../../constants';
import './PubsBanner.scss';
import { fetchPubs } from '../../routes/apiRoutes';

const MastHead = ({ pub }) => {
    return (
        <div className="masthead" onClick={() => window.open(pub.targetURL, '_blank')}>

        </div>
    );
};

export default function PubsBanner({ pubType, pubData }) {
    const [pubs, setPubs] = React.useState([]);
    const pubConfig = PUBS_CONFIG[pubType] || PUBS_CONFIG.IN_FEED; // Par défaut In-Feed si type inconnu

    useEffect(() => { 
        const fetchData = async () => {
            const result = await fetchPubs();

            if (result.success) {
                setPubs(result.pubs);
            }
        };

        fetchData();
    }, []);

    return (
        <div className={`pubs-banner ${pubConfig.position}`} style={{ width: pubConfig.width, height: pubConfig.height }}>
            {pubData.type === "video" ? (
                <video src={pubData.mediaUrl} controls autoPlay muted loop />
            ) : (
                <img src={pubData.mediaUrl} alt={pubData.altText || "Publicité"} />
            )}
            <div className="ad-content">
                <h3>{pubData.title}</h3>
                <p>{pubData.description}</p>
                {pubData.cta && <a href={pubData.link} className="ad-cta">{pubData.cta}</a>}
            </div>
        </div>
    );
};
