import React from 'react';
import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import { Product } from '../components';

const BestSellers = () => {
    const { data, isLoading, error } = useGetTopProductsQuery();
    console.log(data);  
    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return <h1>ERROR</h1>;
    }

    return (
        <div className="best-sellers">
            {data.map((product) => (
                <div key={product._id}>
                    <Product product={product} />
                </div>
            ))}
        </div>
    );
};

export default BestSellers;
