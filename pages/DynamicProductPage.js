import React, { useState, useEffect } from 'react';
import SizeSelector from '../components/SizeSelector';
import ProductInfo from '../components/ProductInfo';
import PinCodeCheck from '@/components/PinCodeCheck';
import { toast } from "react-toastify";
import Link from 'next/link';
import { useSelector } from "react-redux";
import Loader from "../components/Loader";
import { useRouter } from 'next/router';
import { useAddToCartMutation } from '../redux/api/cartApiSlice';
import { CiShoppingCart } from "react-icons/ci";
import { useGetCProductDetailsQuery } from '../redux/api/cProductApiSlice';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination'

const DynamicProductPage = () => {

  const router = useRouter();
  const { id: productId } = router.query;
  console.log(productId);
  const { data: product, isLoading, refetch, error, } = useGetCProductDetailsQuery(productId);
  console.log(product);
  const { userInfo } = useSelector((state) => state.auth);
  const [index, setIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [addToCart] = useAddToCartMutation();
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.frontImage);
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!userInfo) {
      // Display a toast message if the user is not logged in
      toast.error('Please login to continue.');
      return;
    }

    if (!selectedSize) {
      toast.error('Please select a size before adding to cart.');
      return; // Ensure size is selected before proceeding
    }

    try {
      const cartData = { productId: product._id, quantity: qty, productType: 'cProduct', size: selectedSize };
      console.log('Sending to API:', cartData);
      await addToCart(cartData).unwrap();
      toast.success(`${qty} ${product.name} added to the cart.`);
      console.log("Product added to cart");
    } catch (error) {
      console.log("Error adding product to cart: ", error);
      toast.error(error?.data || error.message);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1>Error</h1>;
  }

  if (!product) {
    return <h1>No product found</h1>;
  }

  return (

    <div>
      <div className="product-detail-container">
        <div className='image-container-desktop'>
          <div className='big-image-container'>
            <img src={selectedImage} className="product-detail-image" />
          </div>
          <div className="small-images-container">
            <img
              src={product.frontImage}
              className={selectedImage === product.frontImage ? 'small-image selected-image' : 'small-image'}
              onClick={() => setSelectedImage(product.frontImage)}
            />
            <img
              src={product.backImage}
              className={selectedImage === product.backImage ? 'small-image selected-image' : 'small-image'}
              onClick={() => setSelectedImage(product.backImage)}
            />
          </div>
        </div>
        <div className="image-container-mobile">
          <Swiper spaceBetween={10} slidesPerView={1} pagination={{ clickable: true }} modules={[Pagination]} >
            <SwiperSlide>
              <img src={product.frontImage} className="product-detail-image-mobile" alt="Front view" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={product.backImage} className="product-detail-image-mobile" alt="Back view" />
            </SwiperSlide>
            {product.images?.map((image, i) => (
              <SwiperSlide key={i}>
                <img src={image} className="product-detail-image-mobile" alt={`Image ${i}`} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="product-detail-desc">
          <h1>{product.name}</h1>
          <p id="category">{product.category}</p>
          <p className="price">₹{product.price}</p>
          <p className="tax">Inclusive of all taxes</p>
          <div className="size-chart">
            <SizeSelector onSizeSelect={setSelectedSize} category={product.category} />
          </div>
          <div className="quantity">
            {product.countInStock > 0 && (
              <div>
                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="select-quantity"
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="product-detail-desc-buttons-desktop">
            <button
              type="button"
              disabled={product.countInStock === 0}
              className="add-to-cart"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <Link href="/CartPage">
              <button type="button" className="add-to-wishlist" >
                <CiShoppingCart style={{ marginRight: '10px' }} />
                Go to Cart
              </button>
            </Link>
          </div>
          <div className="product-detail-desc-buttons-mobile">
            <Link href="/CartPage">
              <button type="button" className="add-to-wishlist" >
                <CiShoppingCart style={{ marginRight: '10px' }} />
                Go to Cart
              </button>
            </Link>
            <button
              type="button"
              disabled={product.countInStock === 0}
              className="add-to-cart"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
          <PinCodeCheck />
          <div className="product-details">
            <ProductInfo title="Product Description" content={product.description} />
            <ProductInfo title="Offers" content={product.offers} />
            <ProductInfo title="Returns & Exchange" content={product.returnpolicy} />
          </div>
        </div>
      </div>

      {/* <div className="maylike-products-wrapper">
    <h2>You may also like</h2>
    <div className="marquee">
      <div className="maylike-products-container track">
        {product.relatedProducts.map((item) => (
          <Product key={item._id} product={item} />
        ))}
      </div>
    </div>
  </div> */}
    </div>
  );
};



export default DynamicProductPage;