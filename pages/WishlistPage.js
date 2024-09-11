import React from 'react'
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '../redux/api/wishlistApiSlice'
import { useAddToCartMutation } from '../redux/api/cartApiSlice'
import { Product } from '../components';
import Loader from '../components/Loader';
import Link from 'next/link';
import { AiOutlineShopping } from 'react-icons/ai';
import { toast } from 'react-toastify';

const WishlistPage = () => {

    const { data, isLoading, error } = useGetWishlistQuery();
    const [removeFromWishlist] = useRemoveFromWishlistMutation();
    const [addToCart] = useAddToCartMutation();

    const handleAddToCart = async (product_id) => {
        try {
          console.log(`Adding product to cart: productId=${product_id}, quantity= 1`);
          await addToCart({ productId: product_id, quantity: 1 }).unwrap();
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
                <AiOutlineShopping size={150} />
                <h3>Your shopping bag is empty</h3>
                <Link href="/">
                  <button type="button" className="btn">
                    Continue Shopping
                  </button>
                </Link>
              </div>
            )}
            {data.items.map((product) => (
                <div key={product.productId._id} className='wishlist-item'>
                    <Product product={product.productId}/>
                    <button className="wishlist-movetocart-button" onClick={() => handleAddToCart(product.productId._id)}>Move to Cart</button>
                    <button className="wishlist-remove-button" onClick={() => handleRemoveFromWishlist(product.productId._id)}>Remove</button>
                </div>
            ))}
            </div>
        </div>
    );
}

export default WishlistPage