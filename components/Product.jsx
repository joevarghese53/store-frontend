import React from 'react';
import Link from 'next/link';
import { AiFillStar } from 'react-icons/ai';

const Product = ({ product }) => {
  // Assume product.image already contains the full URL
  const imageUrl = product.frontImage;

  console.log("product", product);


  return (
    <div className='product-card-main-container'>
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
              <AiFillStar className='product-card-reviews-star'/>
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
