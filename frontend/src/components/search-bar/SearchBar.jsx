import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebaseConfig';
import { updateSearchHistory } from '../../routes/userRoutes';
import './SearchBar.scss';

export default function SearchBar({ currentUser }) {
    const [keywords, setKeywords] = useState('');
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (keywords.trim()) {
            // Si l'utilisateur est connecté, mettre à jour l'historique de recherche
            if (currentUser) {
                const userID = currentUser?.uid;
                await updateSearchHistory(userID, keywords.trim());
            }

            // Redirige vers la page des résultats de recherche
            navigate(`/search-results?query=${encodeURIComponent(keywords.trim())}`);
            logEvent(analytics, 'search', {
                search_term: keywords,
            });
            setKeywords('')
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch(); // Lancer la recherche lorsque l'utilisateur appuie sur "Entrée"
        }
    };

    return (
        <div className='search-bar'>
            <input
                type="text"
                placeholder='Cherchez une produit, un service...' 
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <FontAwesomeIcon icon={faSearch} className='fa-search' onClick={handleSearch} />
        </div>
    );
};
