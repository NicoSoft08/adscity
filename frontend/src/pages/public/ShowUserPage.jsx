import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { logEvent } from 'firebase/analytics';
import PublicProfil from '../../common/public-profil/PublicProfil';
import { analytics } from '../../firebaseConfig';
import { 
    fetchUserActiveAds, 
    fetchDataByUserID 
} from '../../services/userServices';
import CardList from '../../utils/card/CardList';
import CardItem from '../../utils/card/CardItem';
import ReviewForm from '../../components/review-form/ReviewForm';
import { AuthContext } from '../../contexts/AuthContext';
import '../../styles/ShowUserPage.scss';


export default function ShowUserPage() {
    const { currentUser } = useContext(AuthContext);
    const { userID } = useParams();
    const navigate = useNavigate();
    const [profilData, setProfilData] = useState([]);
    const [profilAds, setProfilAds] = useState([]);


    useEffect(() => {
        const fetchProfilData = async () => {
            const userData = await fetchDataByUserID(userID);
            setProfilData(userData);
        };

        const fetchProfilAds = async () => {
            const result = await fetchUserActiveAds(userID);
            setProfilAds(result?.activeApprovedAds);
        };

        logEvent(analytics, 'view_store');

        fetchProfilData();
        fetchProfilAds();
    }, [userID]);

    return (
        <div className='store-page'>
            <div style={{}} />
            <PublicProfil profile={profilData} />
            <div className="listing">
                <h3>Publications</h3>
                <span>{profilData.adsCount} Annonces</span>
            </div>
            <CardList>
                {profilAds.map((item, index) => (
                    <CardItem key={index} ad={item} />
                ))}
            </CardList>

            <ReviewForm
                ratings={profilData.ratings}
                navigate={navigate}
                currentUser={currentUser}
            />
        </div>
    );
};
