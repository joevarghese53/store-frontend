import React from 'react';
import Link from 'next/link';
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";

const Categories = () => {
    const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useFetchCategoriesQuery();

    // Placeholder images for each category
    const categoryImages = {
        'Regular T-Shirts': '/img/regular.jpg',
        'Oversized T-shirts': '/img/oversized.jpg',
        'Hoodies': '/img/hoodie.jpg'
    };

    if (categoriesLoading) return <p>Loading...</p>;
    if (categoriesError) return <p>Error loading categories!</p>;

    return (
        <div className='categories'>
            {categoriesData?.map((category) => (
                <Link 
                    key={category._id} 
                    href={{ pathname: '/FilteredProducts', query: { category: category._id } }}
                >
                    <div className="category-card">
                        <img
                            src={categoryImages[category.name] || '/img/default.jpg'} // Use default image if not found
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
