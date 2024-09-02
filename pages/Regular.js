import React from 'react'
import { useAllProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import { Product } from '../components';

const Regular = () => {
    const { data, isLoading, error } = useAllProductsQuery();
    console.log(data);
    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return <h1>ERROR</h1>;
    }

  return (
    <div className="over-sized">
            {data.map((product) => (
                <div key={product._id}>
                    <Product product={product} />
                </div>
            ))}
        </div>
  )
}

export default Regular