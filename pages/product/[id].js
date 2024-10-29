import React, { useState, useEffect } from 'react';
import ReviewTabs from '../../components/ReviewTabs';
import SizeSelector from '../../components/SizeSelector';
import ProductInfo from '../../components/ProductInfo';
import PinCodeCheck from '@/components/PinCodeCheck';
import { toast } from "react-toastify";
import Link from 'next/link';
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useRouter } from 'next/router';
import Ratings from '@/components/Ratings';
import { useAddToCartMutation } from '../../redux/api/cartApiSlice';
import { useGetCategoryByIdQuery } from '../../redux/api/categoryApiSlice';
import { useRemoveFromWishlistMutation, useCheckItemInWishlistQuery, useAddToWishlistMutation } from '../../redux/api/wishlistApiSlice';
import { GoHeart, GoHeartFill } from "react-icons/go";


const ProductDetails = () => {
  const router = useRouter();
  const { id: productId } = router.query;
  console.log(productId);
  const { data: product, isLoading, refetch, error, } = useGetProductDetailsQuery(productId);
  console.log(product);
  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const [addToCart] = useAddToCartMutation();
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const { data: wishlistData } = useCheckItemInWishlistQuery(productId);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.frontImage);
    }
    if (product?.category) {
      setCategoryId(product.category);
    }
  }, [product]);

  const {
    data: category,
    isLoading: categoryLoading,
    refetch: categoryRefetch,
    error: categoryError,
  } = useGetCategoryByIdQuery(categoryId, {
    skip: !categoryId,
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await addToWishlist({ productId }).unwrap();
      toast.success(`Item added to wishlist`);
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  }

  const handleRemoveFromWishlist = async () => {
    try {
      await removeFromWishlist(productId).unwrap();
      toast.success(`Item removed from wishlist`);
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  }

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
      const cartData = { productId: product._id, quantity: qty, productType: 'Product', size: selectedSize };
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
        <div className='image-container'>
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
            {product.images?.map((item, i) => (
              <img
                key={i}
                src={item}
                className={i === index ? 'small-image selected-image' : 'small-image'}
                onClick={() => setSelectedImage(item)}
              />
            ))}
          </div>
          {/* <div className="small-images-container">
            {product.image?.map((item, i) => (
              <img
                key={i}
                src={urlFor(item)}
                className={i === index ? 'small-image selected-image' : 'small-image'}
                onMouseEnter={() => setIndex(i)}
              />
            ))}
          </div> */}
        </div>

        <div className="product-detail-desc">
          <h1>{product.name}</h1>
          {isLoading ? (
            <p id="category">Loading...</p>
          ) : error ? (
            <p id="category">Error loading category</p>
          ) : (
            <p id="category">{category?.name}</p>
          )}
          <div className="product-detail-review">
            <Ratings value={product.rating} text={`${product.numReviews} reviews`} />
          </div>
          <p className="price">₹{product.price}</p>
          <p className="tax">Inclusive of all taxes</p>
          <div className="size-chart">
            <SizeSelector onSizeSelect={setSelectedSize} category = {category?.name}/>
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
          <div className="buttons">
            <button
              type="button"
              disabled={product.countInStock === 0}
              className="add-to-cart"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            {wishlistData && wishlistData.exists ? (
              <button type="button" className="buy-now" onClick={handleRemoveFromWishlist}>
                <GoHeartFill style={{ marginRight: '10px' }} />
                Added to Wishlist
              </button>
            ) : (
              <button type="button" className="buy-now" onClick={handleAddToWishlist}>
                <GoHeart style={{ marginRight: '10px' }} />
                Add to Wishlist
              </button>
            )}

          </div>
          <PinCodeCheck />
          <div className="product-details">
            <ProductInfo title="Offers" content={product.offers} />
            <ProductInfo title="Product Description" content={product.description} />
            <ProductInfo title="Returns & Exchange" content={product.returnpolicy} />
          </div>
        </div>
      </div>
      <div className="product-details-tabs">
        <ReviewTabs
          loadingProductReview={loadingProductReview}
          userInfo={userInfo}
          submitHandler={submitHandler}
          rating={rating}
          setRating={setRating}
          comment={comment}
          setComment={setComment}
          product={product}
        />
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

export default ProductDetails;
