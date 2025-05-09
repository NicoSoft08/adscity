import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ButtonAdd from '../../customs/ButtonAdd';
import Hero from '../../components/hero/Hero';
import { fetchPostsByCategory } from '../../routes/postRoutes';
import CardList from '../../utils/card/CardList';
import CardItem from '../../utils/card/CardItem';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebaseConfig';
import data from '../../json/data.json';
import { LanguageContext } from '../../contexts/LanguageContext';
import Loading from '../../customs/Loading';
import '../../styles/CategoryNamePage.scss';

export default function CategoryNamePage() {
    const { categoryName } = useParams();
    const { language } = useContext(LanguageContext);
    const [adsCategory, setAdsCategory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        logEvent(analytics, 'view_category_page', {
            page_path: `/category/${categoryName}`,
            category_name: categoryName,
        });
        setIsLoading(true);
        const getAdsByCategory = async () => {
            try {
                const result = await fetchPostsByCategory(categoryName);
                if (result.success) {
                    setAdsCategory(result?.postsByCategoryName);
                    setIsLoading(false);
                } else {
                    // Gérer l'erreur
                    console.error("Erreur lors de la récupération des annonces:", result?.message);
                    setAdsCategory([]);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Exception lors de la récupération des annonces:", error);
                setAdsCategory([]);
                setIsLoading(false);
            } finally {
                setIsLoading(false);
            }
        }

        getAdsByCategory();
    }, [categoryName]);

    const getItems = () => {
        const category = data.categories.find(
            (item) => item.categoryName === categoryName
        );

        const HeaderOne = category?.categoryTitles[language.toLowerCase()] ||
            category?.categoryTitles.fr; // Fallback to French if translation not found

        return { HeaderOne };
    }

    const { HeaderOne } = getItems();

    return (
        <div className='category-page'>
            <Hero
                headerOne={HeaderOne}
                paragraph={language === 'FR'
                    ? "Découvrez les annonces relatives à cette catégorie."
                    : "Discover the ads related to this category."
                }
                backgroundImage={getItems().BackgroundImage}
                postsLength={adsCategory.length}
            />

            {isLoading && <Loading />}

            <div className="display">
                {adsCategory.length > 0 ? (
                    <CardList>
                        {adsCategory.map((item) => (
                            <CardItem post={item} />
                        ))}
                    </CardList>
                ) : (
                    <p
                        style={{
                            textAlign: 'center',
                            fontSize: '14px',
                            fontWeight: 'lighter'
                        }}
                    >
                        {language === 'FR'
                            ? "Aucune annonce n'a été trouvée pour cette catégorie."
                            : "No ads found for this category."
                        }
                    </p>
                )}
            </div>
            <ButtonAdd />
        </div>
    );
};
