import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import Loading from '../../customs/Loading';
import { useNavigate } from 'react-router-dom';
import CreatePostFlow from '../../hooks/create-ad-flow/CreatePostFlow';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebaseConfig';
import { LanguageContext } from '../../contexts/LanguageContext';
import '../../styles/CreatePostPage.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faTag } from '@fortawesome/free-solid-svg-icons';

export default function CreatePostPage() {
    const { userData } = useContext(AuthContext);
    const { language } = useContext(LanguageContext);
    const [hasPlan, setHasPlan] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const getUserPlan = (userData) => {
        if (!userData || !userData?.plans) {
            return null; // Retourne null si les données utilisateur ou les plans sont absents
        }

        // Recherche d'un plan contenant la propriété 'max_photos'
        const userPlan = Object.keys(userData?.plans).find(plan =>
            userData?.plans[plan] !== undefined
        );

        // Si un plan valide est trouvé, retourne le nombre maximal de photos
        return userPlan ? userData?.plans[userPlan] : {};
    };

    useEffect(() => {
        logEvent(analytics, 'view_create_post_page', {
            page_path: '/create-post',
            user_id: userData?.userID,
        });
        if (userData) {
            const plan = getUserPlan(userData);
            if (plan) {
                setHasPlan(true);
                setIsLoading(false);
            }
        }
    }, [userData]);

    const redirectToPlans = () => {
        navigate('/forfait'); // Redirige vers la page des plans
    };

    return (
        <div className='create-ad-page'>
            {isLoading ? (
                <Loading />
            ) : (
                <div className="container">
                    {hasPlan ? (
                        <CreatePostFlow />
                    ) : (
                        <div className="no-plan-message">
                            <div className="alert-message">
                                <FontAwesomeIcon icon={faExclamationTriangle} className="alert-icon" />
                                <h2>
                                    {language === 'FR'
                                        ? 'Vous n\'avez pas de plan actif'
                                        : 'You don\'t have an active plan'
                                    }
                                </h2>
                                <p>
                                    {language === 'FR'
                                        ? 'Pour créer une annonce, vous devez avoir un plan actif.'
                                        : 'To create an ad, you must have an active plan.'
                                    }
                                </p>
                            </div>
                            <button className="subscribe-button" onClick={redirectToPlans}>
                                <FontAwesomeIcon icon={faTag} className="button-icon" />
                                {language === 'FR'
                                    ? "Voir les forfaits"
                                    : "See plans"
                                }
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
