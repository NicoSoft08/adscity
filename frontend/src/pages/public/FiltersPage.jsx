import React, { useState } from 'react';
import FiltersAndSort from '../../components/filter-and-sort/FiltersAndSort';
import { fetchFilteredPosts } from '../../routes/apiRoutes';
import Toast from '../../customs/Toast';
import Loading from '../../customs/Loading';
import CardList from '../../utils/card/CardList';
import CardItem from '../../utils/card/CardItem';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebaseConfig';

export default function FiltersPage() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    const handleFilterChange = async (filters) => {
        try {
            setIsLoading(true);
            const result = await fetchFilteredPosts(filters);
            logEvent(analytics, 'filter_posts');
            if (result.success) {
                setPosts(result.filteredPosts);
                setIsLoading(false);
            } else {
                setToast({ show: true, type: 'error', message: 'Erreur lors du filtrage des annonces.' });
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Erreur lors du filtrage des annonces :', error);
            setToast({ show: true, type: 'error', message: 'Erreur lors du filtrage des annonces.' });
            setIsLoading(false);
        }
    };

    const handleSortChange = (sort) => {
        // Gérer le changement de tri
        switch (sort) {
            case 'expensive':
                return posts.sort((a, b) => a.price - b.adDetails?.price);
            case 'cheaper':
                return posts.sort((a, b) => b.price - a.adDetails?.price);
            case 'recent':
                return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'older':
                return posts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'much_views':
                return posts.sort((a, b) => b.views - a.views);
            case 'less_views':
                return posts.sort((a, b) => a.views - b.views);
            case 'best_rated':
                return posts.sort((a, b) => b.rating - a.rating);
            default:
                return posts;
        }

    };
    return (
        <div>
            <h2>Filters Page</h2>
            <FiltersAndSort
                onFilterChange={handleFilterChange}
                onSortChange={handleSortChange}
            />
            {isLoading && <Loading />}
            {posts.length > 0 ?
                <CardList>
                    {
                        posts.map((item, index) => (
                            <CardItem
                                key={index}
                                post={item}
                            />
                        ))
                    }
                </CardList>
                :
                <p>Aucunes annonces trouvées</p>
            }
            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    );
};
