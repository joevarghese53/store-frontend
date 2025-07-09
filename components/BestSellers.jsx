import React from 'react';
import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import { Product } from '../components';
import ErrorCallBack from './ErrorCallBack';

const BestSellers = ({ gender }) => { // Accept gender as a prop
    // Pass gender as a parameter to the query hook
    const { data, isLoading, error } = useGetTopProductsQuery({ gender });
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
                <ErrorCallBack message={error?.data?.message || error.message} onRetry={() => window.location.reload()} />
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
