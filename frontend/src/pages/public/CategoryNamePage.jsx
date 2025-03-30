import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ButtonAdd from '../../customs/ButtonAdd';
import Hero from '../../components/hero/Hero';
import { fetchPostsByCategory } from '../../routes/postRoutes';
import CardList from '../../utils/card/CardList';
import CardItem from '../../utils/card/CardItem';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebaseConfig';
import data from '../../json/data.json';
import '../../styles/CategoryNamePage.scss';

export default function CategoryNamePage() {
    const { categoryName } = useParams();
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
        const HeaderOne = data.categories.find((item) => item.categoryName === categoryName)?.categoryTitles.fr;
        return { HeaderOne };
    }

    const { HeaderOne } = getItems();

    return (
        <div className='category-page'>
            <Hero
                headerOne={HeaderOne}
                paragraph={"Découvrez les annonces relatives à cette catégorie."}
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
                        Aucunes annonces trouvées dans cette catégorie.
                    </p>
                )}
            </div>
            <ButtonAdd />
        </div>
    );
};
