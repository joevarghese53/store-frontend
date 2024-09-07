import React from 'react';
import Link from 'next/link';
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import Loader from "./Loader";

const Categories = ({ gender }) => {
    const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useFetchCategoriesQuery();

    // Placeholder images for each category
    const categoryImages = {
        male: {
            'Regular T-Shirts': '/img/male-regular.jpg',
            'Oversized T-shirts': '/img/male-oversized.jpg',
            'Hoodies': '/img/male-hoodie.jpg'
        },
        female: {
            'Regular T-Shirts': '/img/female-regular.jpg',
            'Oversized T-shirts': '/img/female-oversized.jpg',
            'Hoodies': '/img/female-hoodie.jpg'
        }
    };

    const imagesForGender = gender && categoryImages[gender] ? categoryImages[gender] : {};
    const pathname = gender === 'male' ? '/FilteredProductsMale' : '/FilteredProductsFemale';

    if (categoriesLoading) return (
        <div className='categories'>
            <Loader />
        </div>
    );
    if (categoriesError) return (
        <div className='categories'>
            <h1 style={{ height: '200px', paddingTop: '100px' }}>ERROR</h1>

        </div>
    );
    return (
        <div className='categories'>
            {categoriesData?.map((category) => (
                <Link
                    key={category._id}
                    href={{ pathname, query: { category: category._id } }}
                >
                    <div className="category-card">
                        <img
                            src={imagesForGender[category.name] || '/img/default.jpg'} // Use default image if not found
                            className="category-image"
                            alt={category.name}
                        />
                        <h1 className="category-title">{category.name.toUpperCase()}</h1>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default Categories;
