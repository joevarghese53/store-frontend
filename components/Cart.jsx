import React, { useEffect } from 'react';
import Link from 'next/link';
import { AiOutlineShopping } from 'react-icons/ai';
import { useGetCartQuery, useAddToCartMutation, useUpdateCartItemMutation, useRemoveFromCartMutation } from '../redux/api/cartApiSlice';
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { useRouter } from 'next/router';

const Cart = () => {
  const { data, isLoading, error, refetch } = useGetCartQuery();
  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useFetchCategoriesQuery();
  const [removeCartItem] = useRemoveFromCartMutation();
  const router = useRouter();

  console.log(data);

  const calculateTotalPrice = () => {
    return data.items.reduce((total, item) => {
      return total + (item.productId.price * item.quantity);
    }, 0);
  };

  const handleRemoveFromCart = async (itemId) => {
    try {
      let answer = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!answer) return;

      const { data } = await removeCartItem(itemId);
      console.log('Product deleted successfully', data);
      router.reload();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading cart items</div>;

  const categoryMap = categoriesData ? categoriesData.reduce((acc, category) => {
    acc[category._id] = category.name;
    return acc;
  }, {}) : {};

  return (
    <div className="checkout-container">
      <div className="cart-page">
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
        {data.items.length >= 1 && (
          <>
            <div className='address-header'>
              <h4 id='address-header-one'>MY CART </h4>
              <h4 id='address-header-two'>  ------- ADDRESS ------- CHECKOUT ------- PAYMENT </h4>
            </div>
            <div className='cart-content-summary'>
              <div className="cart-content">
                {data.items.map((item) => (
                  <div className="cart-item" key={item._id}>
                    <img src={item.productId.image} className="cart-product-image" />
                    <div className="item-desc">
                      <h5>{item.productId.name}</h5>
                      <p id='cart-item-category'>{categoryMap[item.productId.category]}</p>
                      <p id='cart-item-quantity'>Quantity: {item.quantity}</p>
                      <h4>₹{item.productId.price}</h4>
                      <h3>MRP inclusive of all taxes</h3>
                      <button type="button" className="remove-item" onClick={() => handleRemoveFromCart(item.productId._id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-summary">
                <h6>BILLING DETAILS</h6>
                <h8>Cart Total (Excl. of all taxes)       <span>₹{calculateTotalPrice()}</span></h8>
                <h8>GST                                   <span>₹{calculateTotalPrice()}</span></h8>
                <h8>Shipping Charges                      <span>₹{calculateTotalPrice()}</span></h8>
                <h8>Total Amount:                         <span>₹{calculateTotalPrice()}</span></h8>
                <Link href="/AddressPage">
                  <button type="button" className="btn">
                    PLACE ORDER
                  </button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;
