import React, { useState } from 'react'
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '../redux/api/wishlistApiSlice'
import { useAddToCartMutation } from '../redux/api/cartApiSlice'
import { Product } from '../components';
import Loader from '../components/Loader';
import Link from 'next/link';
import { FaRegFaceSadTear } from "react-icons/fa6";
import { toast } from 'react-toastify';
import SizeSelectorPopUp from '@/components/SizeSelectorPopUp';
import { RiDeleteBin6Line } from "react-icons/ri";


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
      toast.error(error?.data || error.message);
    }
  };

  const handleRemoveFromWishlist = async (product_id) => {
    try {
      await removeFromWishlist(product_id).unwrap();
      toast.success(`Item removed from wishlist`);
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  }

  const handleMoveToCartClick = (product) => {
    setSelectedProduct(product); // Set the selected product
    setShowSizeModal(true); // Show the size selection modal
  };
  console.log(data);
  if (isLoading) {
    return (
      <div className="wishlist-main-container">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="wishlist-main-container">
        <h1 style={{ height: '200px', paddingTop: '100px' }}>ERROR</h1>
      </div>
    );
  }

  return (
    <div className="wishlist-main-container">
      <div className="wishlist-items">
        {data.items.length < 1 && (
          <div className="empty-cart">
            <FaRegFaceSadTear size={150} />
            <h3>Your wishlist is empty</h3>
            <Link href="/">
              <button type="button" className="btn">
                Continue Shopping
              </button>
            </Link>
          </div>
        )}
        {data.items.map((product) => (
          <div key={product.productId._id} className='wishlist-item'>
            <Product product={product.productId} />
            <div className="wishlist-btns">
              <div className="wishlist-remove" onClick={() => handleRemoveFromWishlist(product.productId._id)}>
                <RiDeleteBin6Line />
              </div>
              <div className="wishlist-move-to-cart" onClick={() => handleMoveToCartClick(product.productId)}>
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