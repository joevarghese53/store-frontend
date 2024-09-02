import React from 'react';
import Link from 'next/link';
import { AiFillStar } from 'react-icons/ai';
import { useGetCategoryByIdQuery } from '../redux/api/categoryApiSlice';

const Product = ({ product }) => {
  // Assume product.image already contains the full URL
  const imageUrl = product.image;



  return (
    <div>
      <Link href={`/product/${product._id}`}>
        <div className="product-card">
          <img
            src={imageUrl}
            width={250}
            height={250}
            className="product-image"
            alt={product.name}
          />
          <div className="product-card-reviews">
            <div>
              <AiFillStar />
            </div>
            <p>{product.rating}</p>
          </div>
          <p className="product-name">{product.name}</p>

          <p className="product-cat">{product.category.name}</p>

          <p className="product-price">₹{product.price}</p>
        </div>
      </Link>
    </div>
  );
};

export default Product;
