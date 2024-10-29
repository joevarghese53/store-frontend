import React from 'react';
import Link from 'next/link';
import moment from 'moment';
import { useAllProductsQuery } from '../redux/api/productApiSlice';

const ProductList = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading products</div>;
  }

  if (!products || products.length === 0) {
    return <div className='no-products-found'>No products found</div>;
  }

  return (
    <div className="admin-products-container">
      <div className="admin-products-header">
        <h1>All Products ({products.length})</h1>
      </div>
      <div className="admin-products-grid">
        {products.map((product) => {
          return (
            <Link key={product._id} href={`/admin/product/update/${product._id}`}>
              <div className="admin-product-card">
                <img
                  src={product.frontImage}
                  alt={product.name}
                  className="admin-product-image"
                />
                <div className="admin-product-info">
                  <div className="admin-product-header">
                    <h5>{product.name}</h5>
                    <p className="admin-product-date">
                      {moment(product.createdAt).format('MMMM Do YYYY')}
                    </p>
                  </div>
                  <p className="admin-product-description">
                    {product.description.substring(0, 160)}...
                  </p>
                  <div className="admin-product-footer">
                    <Link href={`/admin/product/update/${product._id}`}>
                      <button className="admin-update-button">
                        Update Product
                        <svg
                          className="admin-button-icon"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 10"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M1 5h12m0 0L9 1m4 4L9 9"
                          />
                        </svg>
                      </button>
                    </Link>
                    <p className="admin-product-price">₹{product.price}</p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;
