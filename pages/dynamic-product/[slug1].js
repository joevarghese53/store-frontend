import React from 'react';
import { useRouter } from 'next/router';
import { AiOutlineMinus, AiOutlinePlus, AiFillStar, AiOutlineStar } from 'react-icons/ai';
import SizeSelector from '../../components/SizeSelector';
import Link from 'next/link';
import PinCodeCheck from '@/components/PinCodeCheck';
import ProductInfo from '../../components/ProductInfo';


const DynamicProductPage = () => {
  const router = useRouter();
  const { slug1, cname, cdetails, cprice, cimage } = router.query;

  if (!slug1 || !cname || !cdetails || !cprice || !cimage) {
    // Handle the case where product details are not available
    return <div>Loading...</div>;
  }


return (
  <div className='dynamic-product-main-container'>
    <div className="product-detail-container">
      <div>
        <div className="custom-image-container">
        <img src={cimage} alt={cname} />
      </div>
    </div>

      <div className="product-detail-desc">
        <h1>{cname}</h1>
        <div className="reviews">
            <div className='rating'>
              <AiFillStar />
            </div>
            <p>
              5.0
            </p>
          </div>
          <p className="price">₹599</p>
          <p className="tax">Inclusive of all taxes</p>
          <div className="size-chart">
            <SizeSelector />
          </div>
          <div className="quantity">
            <h3>Quantity:</h3>
            <p className="quantity-desc">
              <span className="minus" onClick={decQty}><AiOutlineMinus /></span>
              <span className="num">{qty}</span>
              <span className="plus" onClick={incQty}><AiOutlinePlus /></span>
            </p>
          </div>
          <div className="buttons">
            <button type="button" className="add-to-cart" onClick={() => onAdd(product, qty)}>Add to Cart</button>
            <Link href="/CartPage">
            <div className="buy-now">Go to cart</div>
            </Link>
          </div>
          <PinCodeCheck />
          <div className="product-details">
          <ProductInfo title="Offers" content= "No offers available" />
          <ProductInfo title="Product Description" content= "Material : Cotton" />
          <ProductInfo title="15 Days Returns & Exchange" content="Return is not available on this item" />
          </div>
      </div>
    </div>

    {/* <div className="maylike-products-wrapper">
        <h2>You may also like</h2>
        <div className="marquee">
          <div className="maylike-products-container track">
            {products.map((item) => (
              <Product key={item._id} product={item} />
            ))}
          </div>
        </div>
    </div> */}
  </div>
)
};


export default DynamicProductPage;