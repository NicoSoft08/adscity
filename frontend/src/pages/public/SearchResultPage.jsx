import React, { useEffect, useState } from 'react';
import { allCategories } from '../../data/database';
import { useLocation } from 'react-router-dom';
import Loading from '../../customs/Loading';
import CardList from '../../utils/card/CardList';
import CardItem from '../../utils/card/CardItem';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebaseConfig';
import { searchItems } from '../../services/searchServices';
import SearchSection from '../../customs/SearchSection';
import '../../styles/SearchResultPage.scss';

export default function SearchResultPage() {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        item: '',
        location: '',
    });

    const location = useLocation(); // Pour accéder à l'URL actuelle
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('query'); // Récupère le mot-clé de recherche


    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const data = await searchItems(searchQuery);
                setSearchResults(data);
                logEvent(analytics, 'view_search_results');
            } catch (error) {
                setError('Erreur lors de la recherche');
            } finally {
                setLoading(false);
            }
        };

        if (searchQuery) {
            fetchSearchResults();
        }
    }, [searchQuery]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className='search-result'>
            <SearchSection
                formData={formData}
                handleChange={handleChange}
                searchQuery={searchQuery}
                allCategories={allCategories}
            />

            <div>
                <h2>Résultats de "{searchQuery}" {searchResults.length}</h2>
            </div>
            {searchResults.length > 0 ? (
                searchResults.map((item) => (
                    <CardList>
                        <CardItem ad={item} />
                    </CardList>
                ))
            ) : (
                <p>Aucun résultat trouvé pour cette recherche pour "{searchQuery}".</p>
            )}
        </div>
    )
}
