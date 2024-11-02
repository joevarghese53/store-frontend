import React from 'react';
import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import { Product } from '../components';

const BestSellers = ({ gender }) => { // Accept gender as a prop
    // Pass gender as a parameter to the query hook
    const { data, isLoading, error } = useGetTopProductsQuery({ gender });
    console.log(data);
    if (isLoading) {
        return (
            <div className="best-sellers">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="best-sellers">
                <h1 style={{ height: '200px', paddingTop: '100px' }}>ERROR</h1>
            </div>
        );
    }

    return (
        <div className="best-sellers">
            {data.map((product) => (
                <div key={product._id} className='best-sellers-item'>
                    <Product product={product} />
                </div>
            ))}
        </div>
    );
};

export default BestSellers;
