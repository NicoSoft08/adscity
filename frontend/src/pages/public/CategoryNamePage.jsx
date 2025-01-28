import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ButtonAdd from '../../customs/ButtonAdd';
import Hero from '../../components/hero/Hero';
import { allCategories } from '../../data/database';
import { fetchPostsByCategory } from '../../routes/postRoutes';
import CardList from '../../utils/card/CardList';
import CardItem from '../../utils/card/CardItem';

export default function CategoryNamePage() {
    const { categoryName } = useParams();
    const [adsCategory, setAdsCategory] = useState([]);

    useEffect(() => {
        const getAdsByCategory = async () => {
            const result = await fetchPostsByCategory(categoryName);
            if (result.success) {
                setAdsCategory(result?.postsByCategoryName);
            }
        }

        getAdsByCategory();
    }, [categoryName]);

    const getItems = () => {
        const BackgroundImage = allCategories.find((item) => item.categoryName === categoryName)?.categoryImage;
        const HeaderOne = allCategories.find((item) => item.categoryName === categoryName)?.categoryTitles.fr;
        return { BackgroundImage, HeaderOne };
    }

    return (
        <div>
            <Hero
                headerOne={getItems().HeaderOne}
                paragraph={"Découvrez les annonces relatives à cette catégorie."}
                backgroundImage={getItems().BackgroundImage}
            />
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
            <ButtonAdd />
        </div>
    );
};
