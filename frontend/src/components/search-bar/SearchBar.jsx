import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebaseConfig';
import { updateSearchHistory } from '../../routes/userRoutes';
import { extractSuggestions } from '../../func';
import { allCategories } from '../../data/database';
import './SearchBar.scss';

export default function SearchBar({ currentUser }) {
    const [keywords, setKeywords] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [lang] = useState("fr");
    const navigate = useNavigate();

    // Extraire toutes les suggestions possibles
    const allSuggestions = extractSuggestions(allCategories, lang);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setKeywords(value);

        if (value.trim().length > 1) {
            const filteredSuggestions = allSuggestions
                .filter(item => item.name.toLowerCase().includes(value.toLowerCase()))
                .slice(0, 5);

            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    const handleSelectSuggestion = (suggestion) => {
        setKeywords(suggestion.name);
        setSuggestions([]);
        setTimeout(() => handleSearch(suggestion.name), 0);
    };

    const handleSearch = async (searchQuery = null) => {
        const trimmedQuery = (searchQuery || keywords).trim();
        if (!trimmedQuery) return;

        // 🔹 Vérifier si l'élément tapé correspond à une suggestion
        const matchingSuggestion = allSuggestions.find(sugg => sugg.name.toLowerCase() === trimmedQuery.toLowerCase());

        if (matchingSuggestion) {
            console.log(`🔍 Recherche par suggestion : ${matchingSuggestion.name}`);
        } else {
            console.log(`🔍 Recherche libre : ${trimmedQuery}`);
        }

        if (currentUser) {
            await updateSearchHistory(currentUser.uid, trimmedQuery);
        }

        navigate(`/search-results?query=${encodeURIComponent(trimmedQuery)}`);
        logEvent(analytics, 'search', { search_term: trimmedQuery });
        setKeywords('');
        setSuggestions([]);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();  // 🔥 Recherche même si ce n'est pas une suggestion
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
                onBlur={() => setTimeout(() => setSuggestions([]), 200)}
            />
            <FontAwesomeIcon icon={faSearch} className='fa-search' onClick={() => handleSearch()} />
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
