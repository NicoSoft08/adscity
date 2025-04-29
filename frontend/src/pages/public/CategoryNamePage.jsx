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
import '../../styles/CategoryNamePage.scss';

export default function CategoryNamePage() {
    const { categoryName } = useParams();
    const { language } = useContext(LanguageContext);
    const [adsCategory, setAdsCategory] = useState([]);

    useEffect(() => {
        const getAdsByCategory = async () => {
            const result = await fetchPostsByCategory(categoryName);
            logEvent(analytics, 'view_category_page', {
                page_path: `/category/${categoryName}`,
                category_name: categoryName,
            });
            if (result.success) {
                setAdsCategory(result?.postsByCategoryName);
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
