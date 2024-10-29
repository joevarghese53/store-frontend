import React from 'react';
import Link from 'next/link';
import { AiFillStar } from 'react-icons/ai';

const CProduct = ({ product }) => {

  return (
    <div>
      <Link href={{ pathname: '/DynamicProductPage', query: { id: product._id } }}>
        <div className="cproduct-card">
          <img
            src={product.frontImage}
            width={250}
            height={250}
            className="cproduct-image"
            alt={product.name}
          />
          <p className="cproduct-name">{product.name}</p>

          <p className="cproduct-cat">{product.category.name}</p>

          <p className="cproduct-price">₹{product.price}</p>
        </div>
      </Link>
    </div>
  );
};

export default CProduct;
