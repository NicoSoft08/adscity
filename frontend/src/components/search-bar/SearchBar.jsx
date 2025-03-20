import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebaseConfig';
import { updateSearchHistory } from '../../routes/userRoutes';
import { extractSuggestions } from '../../func';
import data from '../../json/data.json';
import './SearchBar.scss';

export default function SearchBar({ currentUser }) {
    const [keywords, setKeywords] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [lang] = useState("fr");
    const navigate = useNavigate();

    // 🔹 Extraire toutes les suggestions possibles
    const allSuggestions = extractSuggestions(data.categories, lang);

    // ✅ Fonction pour gérer le changement d'input
    const handleInputChange = (e) => {
        const value = e.target.value.trimStart();
        setKeywords(value);

        if (value.length >= 2) {  // Minimum 2 caractères avant d'afficher des suggestions
            const filteredSuggestions = allSuggestions
                .filter(item => item.name.toLowerCase().includes(value.toLowerCase()))
                .slice(0, 5);

            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    // ✅ Fonction pour sélectionner une suggestion
    const handleSelectSuggestion = (suggestion) => {
        setKeywords(suggestion.name);
        setSuggestions([]);
        handleSearch(suggestion.name);
    };

    // ✅ Fonction pour exécuter une recherche
    const handleSearch = async (searchQuery = null) => {
        const trimmedQuery = (searchQuery || keywords).trim();
        if (!trimmedQuery) return;

        // ✅ Mettre à jour l'historique de recherche
        if (currentUser) {
            await updateSearchHistory(currentUser.uid, trimmedQuery);
        }

        // ✅ Fermer les suggestions et naviguer vers les résultats
        setKeywords('');
        setSuggestions([]);
        navigate(`/search-results?query=${encodeURIComponent(trimmedQuery)}`);
        logEvent(analytics, 'search', { search_term: trimmedQuery });
    };

    // ✅ Fonction pour détecter "Enter" et déclencher la recherche
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();  // 🔥 Recherche avec le mot tapé
        }
    };

    return (
        <div className='search-bar'>
            <input
                type="text"
                placeholder="Recherchez une catégorie ou un produit..."
                value={keywords}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onBlur={() => setTimeout(() => setSuggestions([]), 150)}
            />
            <FontAwesomeIcon
                icon={faSearch}
                className='fa-search'
                onClick={() => handleSearch()}
            />
            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((sugg, index) => (
                        <li key={index} onClick={() => handleSelectSuggestion(sugg)}>
                            <span className="sugg-name">{sugg.name}</span>
                            {sugg.category && <span className="sugg-category"> ➝ {sugg.category}</span>}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
