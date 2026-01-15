import React, { useState } from 'react'
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '../redux/api/wishlistApiSlice'
import { useAddToCartMutation } from '../redux/api/cartApiSlice'
import { Product } from '../components';
import Loader from '../components/Loader';
import Link from 'next/link';
import { FaHeartBroken } from "react-icons/fa";
import { toast } from 'react-toastify';
import SizeSelectorPopUp from '@/components/SizeSelectorPopUp';
import { RiDeleteBin6Line } from "react-icons/ri";
import ErrorCallBack from '@/components/ErrorCallBack';


const WishlistPage = () => {

  const { data, isLoading, error } = useGetWishlistQuery();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [addToCart] = useAddToCartMutation();
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleAddToCart = async (product_id, size) => {
    try {
      console.log(`Adding product to cart: productId=${product_id}, quantity= 1`);
      await addToCart({ productId: product_id, quantity: 1, productType: 'Product', size: size }).unwrap();
      toast.success(`Item Moved to cart successfully.`);
      await removeFromWishlist(product_id).unwrap();
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  const handleRemoveFromWishlist = async (product_id) => {
    try {
      await removeFromWishlist(product_id).unwrap();
      toast.success(`Item removed from wishlist`);
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  }

  const handleMoveToCartClick = (product) => {
    setSelectedProduct(product); // Set the selected product
    setShowSizeModal(true); // Show the size selection modal
  };

  console.log("Wishlist Data",data);
  
  if (isLoading) {
    return (
      <div className="wishlist-main-container">
        <Loader />
      </div>
    );
  }

  if (error && error?.data?.message === 'Wishlist not found') {
    return (
      <div className="empty-wishlist-main-container">
        <div className="empty-wishlist">
          <FaHeartBroken size={100} className="empty-wishlist-icon" />
          <h2>Your wishlist is empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <Link href="/" passHref>
            <button type="button" className="empty-wishlist-btn">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wishlist-main-container">
        <ErrorCallBack message={error?.data?.message || error.message} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="wishlist-main-container">
      <div className="wishlist-items">
        {data.items.length < 1 && (
          <div className="empty-wishlist-main-container">
            <div className="empty-wishlist">
              <FaHeartBroken size={100} className="empty-wishlist-icon" />
              <h2>Your wishlist is empty</h2>
              <p>Looks like you haven't added anything yet.</p>
              <Link href="/" passHref>
                <button type="button" className="empty-wishlist-btn">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        )}
        {data.items.map((product) => (
          <div key={product._id} className='wishlist-item'>
            <Product product={product} />
            <div className="wishlist-btns">
              <div className="wishlist-remove" onClick={() => handleRemoveFromWishlist(product._id)}>
                <RiDeleteBin6Line />
              </div>
              <div className="wishlist-move-to-cart" onClick={() => handleMoveToCartClick(product)}>
                MOVE TO CART
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedProduct && (
        <SizeSelectorPopUp
          show={showSizeModal}
          onClose={() => setShowSizeModal(false)}
          onConfirm={handleAddToCart}
          product={selectedProduct}
        />
      )}
    </div>
  );
}

export default WishlistPage