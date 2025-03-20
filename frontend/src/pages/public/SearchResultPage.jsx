import React, { useEffect, useState } from 'react';
// import { allCategories } from '../../data/database';
import { useLocation } from 'react-router-dom';
import Loading from '../../customs/Loading';
import CardList from '../../utils/card/CardList';
import CardItem from '../../utils/card/CardItem';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebaseConfig';
import {
    // collectLocations, 
    searchItems
} from '../../routes/apiRoutes';
// import SearchSection from '../../customs/SearchSection';
import '../../styles/SearchResultPage.scss';

export default function SearchResultPage() {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const [locations, setLocations] = useState([]); // Ex : { Russie: ["Moscou", "Saint-Pétersbourg"] }
    // const [selectedCountry, setSelectedCountry] = useState('');
    // const [availableCities, setAvailableCities] = useState([]);
    // const [formData, setFormData] = useState({
    //     category: '',
    //     item: '',
    //     location: '',
    //     minPrice: '',
    //     maxPrice: '',
    // });

    const location = useLocation(); // Pour accéder à l'URL actuelle
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('query'); // Récupère le mot-clé de recherche

    // useEffect(() => {
    //     const fetchLocations = async () => {
    //         const result = await collectLocations();
    //         if (result.success) {
    //             setLocations(result?.postsLocations);
    //         } else {
    //             setError('Erreur lors de la récupération des localisations');
    //         }
    //     };

    //     fetchLocations();
    // }, []);

    // Mettre à jour les villes disponibles lorsque le pays change
    // useEffect(() => {
    //     if (selectedCountry) {
    //         const selectedLocation = locations.find(
    //             (location) => location.id === selectedCountry
    //         );
    //         setAvailableCities(selectedLocation ? selectedLocation.cities : []);
    //     } else {
    //         setAvailableCities([]);
    //     }
    // }, [selectedCountry, locations]);


    useEffect(() => {
        logEvent(analytics, 'page_view', { page_path: '/search-result' });
        const fetchSearchResults = async () => {
            try {
                const result = await searchItems(searchQuery);
                if (result.success) {
                    setSearchResults(result?.searchResults.results);
                } else {
                    setSearchResults([]);
                }
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

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData({
    //         ...formData,
    //         [name]: value,
    //     });
    // };

    // Gérer le changement de pays
    // const handleCountryChange = (e) => {
    //     const selectedCountry = e.target.value;
    //     setSelectedCountry(selectedCountry);

    //     // Trouver les villes du pays sélectionné
    //     const selectedLocation = locations.find(
    //         (location) => location.id === selectedCountry
    //     );

    //     setAvailableCities(selectedLocation ? selectedLocation?.cities : []);
    //     setFormData((prevData) => ({
    //         ...prevData,
    //         location: '', // Réinitialise la ville
    //     }));
    // };

    // const profilePriority = {
    //     business: 1,
    //     professional: 2,
    //     individual: 3
    // };

    // if (searchResults.length > 0) {
    //     const sortedPosts = searchResults.sort((a, b) => {
    //         return profilePriority[a.profileType] - profilePriority[b.profileType];
    //     })
    // }

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className='search-result'>
            {/* <SearchSection
                formData={formData}
                handleChange={handleChange}
                searchQuery={searchQuery}
                allCategories={allCategories}
                handleCountryChange={handleCountryChange}
                selectedCountry={selectedCountry}
                locations={locations}
                availableCities={availableCities}
            /> */}

            <div className="display">
                <div>
                    <h2>Résultats de "{searchQuery}" {searchResults.length}</h2>
                </div>
                <CardList>
                    {searchResults.length > 0 ? (
                        searchResults.map((item, index) => (
                            <CardItem key={index} post={item} />
                        ))
                    ) : (
                        <p>Aucun résultat trouvé pour cette recherche pour "{searchQuery}".</p>
                    )}
                </CardList>
            </div>

        </div>
    )
}
