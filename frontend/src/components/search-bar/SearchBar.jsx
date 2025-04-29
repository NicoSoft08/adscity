import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebaseConfig';
import { updateSearchHistory } from '../../routes/userRoutes';
import { extractSuggestions } from '../../func';
import data from '../../json/data.json';
import { LanguageContext } from '../../contexts/LanguageContext';
import './SearchBar.scss';

export default function SearchBar({ currentUser }) {
    const { language } = useContext(LanguageContext);
    const [keywords, setKeywords] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
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
        // Set the keywords first, then perform the search
        setKeywords(suggestion.name);
        setSuggestions([]);
        // Use the suggestion name directly instead of relying on state update
        handleSearch(suggestion.name);
    };

    // ✅ Fonction pour exécuter une recherche
    const handleSearch = async (searchQuery = null) => {
        const trimmedQuery = (searchQuery || keywords).trim();
        if (!trimmedQuery) return;

        setIsSearching(true);

        try {
            // ✅ Mettre à jour l'historique de recherche
            if (currentUser && currentUser.uid) {
                await updateSearchHistory(currentUser.uid, trimmedQuery);
            }

            // ✅ Fermer les suggestions et naviguer vers les résultats
            setKeywords('');
            setSuggestions([]);
            navigate(`/search-results?query=${encodeURIComponent(trimmedQuery)}`);
            logEvent(analytics, 'search', { search_term: trimmedQuery });
        } catch (error) {
            console.error('Error updating search history:', error);
            // Still navigate even if the history update fails
            navigate(`/search-results?query=${encodeURIComponent(trimmedQuery)}`);
        } finally {
            setIsSearching(false);
        }
    };

    // ✅ Fonction pour détecter "Enter" et déclencher la recherche
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();  // 🔥 Recherche avec le mot tapé
        }
    };

    // Improved blur handling
    const handleBlur = () => {
        // Only hide suggestions if we're not in the middle of selecting one
        setTimeout(() => {
            setSuggestions([]);
        }, 200);
    };

    return (
        <div className='search-bar'>
            <input
                type="text"
                placeholder={language === 'FR'
                    ? "Recherchez une catégorie ou un produit..."
                    : "Search for a category or product..."
                }
                value={keywords}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                aria-label="Recherche"
            />
            <FontAwesomeIcon
                icon={isSearching ? faSpinner : faSearch}
                className='fa-search'
                onClick={() => handleSearch()}
            />
            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((sugg, index) => (
                        <li key={index} onClick={() => handleSelectSuggestion(sugg)} onMouseDown={(e) => e.preventDefault()}>
                            <span className="sugg-name">{sugg.name}</span>
                            {sugg.category && <span className="sugg-category"> ➝ {sugg.category}</span>}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
