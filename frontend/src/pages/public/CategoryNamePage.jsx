import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ButtonAdd from '../../customs/ButtonAdd';
import Hero from '../../components/hero/Hero';
import { allCategories } from '../../data/database';
import { fetchAdsByCategory } from '../../services/adServices';
import CardList from '../../utils/card/CardList';
import CardItem from '../../utils/card/CardItem';

export default function CategoryNamePage() {
    const { categoryName } = useParams();
    const [adsCategory, setAdsCategory] = useState([]);

    useEffect(() => {
        const getAdsByCategory = async () => {
            const ads = await fetchAdsByCategory(categoryName);
            setAdsCategory(ads);
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
            <h2>Category By Name Page</h2>
            <CardList>
                {adsCategory.length > 0 ?
                    adsCategory.map((item) => (
                        <CardItem ad={item} />
                    ))
                    : (
                        <p>Aucunes annonces trouvées dans cette catégorie.</p>
                    )}
            </CardList>
            <ButtonAdd />
        </div>
    );
};
