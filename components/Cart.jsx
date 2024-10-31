import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { AiOutlineShopping } from 'react-icons/ai';
import { useGetCartQuery, useAddToCartMutation, useUpdateCartItemMutation, useRemoveFromCartMutation } from '../redux/api/cartApiSlice';
import { useRouter } from 'next/router';
import Loader from './Loader';

const Cart = () => {
  const { data, isLoading, error, refetch } = useGetCartQuery();
  const [removeCartItem] = useRemoveFromCartMutation();
  const router = useRouter();
  const billingRef = useRef(null);

  console.log(data);

  const scrollToBilling = () => {
    if (billingRef.current) {
      const yOffset = -100;
      const y = billingRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  function calcPrices(data) {
    const items = data.items;
    let itemsPriceWithTax = 0;
    let taxPrice = 0;
    items.forEach((item) => {
      const gstRate = item.productId.price > 1000 ? 0.12 : 0.05; // Adjust rates as needed

      // Calculate the price before tax for each item
      const itemPriceBeforeTax = item.productId.price / (1 + gstRate);

      // Calculate the GST for each item
      const itemTaxPrice = item.productId.price - itemPriceBeforeTax;

      // Sum up the total price and tax for all items
      itemsPriceWithTax += item.productId.price * item.quantity;
      taxPrice += itemTaxPrice * item.quantity;
    });

    const shippingPrice = itemsPriceWithTax > 1000 ? 0 : 150;
    const totalPrice = (
      parseFloat(itemsPriceWithTax) +
      parseFloat(shippingPrice)
    ).toFixed(2);

    return {
      itemsPrice: (itemsPriceWithTax - taxPrice).toFixed(2), // Price before tax
      shippingPrice: shippingPrice.toFixed(2), // Shipping charges
      taxPrice: taxPrice.toFixed(2), // Total GST calculated for all items
      totalPrice, // Final price including tax and shipping
    };
  }

  const handleRemoveFromCart = async (itemId, size) => {
    try {
      let answer = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!answer) return;

      const { data } = await removeCartItem({ productId: itemId, size: size }).unwrap();
      console.log('Product deleted successfully', data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  if (isLoading) return (
    <div className="checkout-container">
      <div className="cart-page">
        <div className="empty-cart">
          <AiOutlineShopping size={150} />
          <div className="loader-container">
            <Loader />
          </div>
          <Link href="/">
            <button type="button" className="btn">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="checkout-container">
      <div className="cart-page">
        <div className="empty-cart">
          <AiOutlineShopping size={150} />
          <h3>Your shopping bag is empty</h3>
          <Link href="/">
            <button type="button" className="btn">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );

  const { itemsPrice, shippingPrice, taxPrice, totalPrice } = data ? calcPrices(data) : {};

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
              <h4 id='address-header-two'>  ----- ADDRESS ----- CHECKOUT ----- PAYMENT </h4>
            </div>
            <div className='cart-content-summary'>
              <div className="cart-content">
                {data.items.map((item) => (
                  <div className="cart-item-container">
                    <div className="cart-item" key={item._id}>
                      <img src={item.productId.frontImage} className="cart-product-image" />
                      <div className="item-desc">
                        <h5>{item.productId.name}</h5>
                        <p id='cart-item-category'>{item.productId.category}</p>
                        <p id='cart-item-quantity'>Quantity: {item.quantity}</p>
                        <p id='cart-item-size'>Size: {item.size}</p>
                      </div>
                    </div>
                    <div className="item-price-and-remove">
                      <div className="item-price">
                        <h4>₹{item.productId.price}</h4>
                        <h3>MRP inclusive of all taxes</h3>
                      </div>
                      <button type="button" className="remove-item" onClick={() => handleRemoveFromCart(item.productId._id, item.size)}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-summary" ref={billingRef}>
                <h6>BILLING DETAILS</h6>
                <div className="billing-details-row">
                  <h8>Cart Total (Excl. of all taxes)</h8>
                  <h8>₹{itemsPrice}</h8>
                </div>
                <div className="billing-details-row">
                  <h8>GST</h8>
                  <h8>₹{taxPrice}</h8>
                </div>
                <div className="billing-details-row">
                  <h8>Shipping Charges</h8>
                  <h8>₹{shippingPrice}</h8>
                </div>
                <div className="billing-details-row">
                  <h8>Total Amount</h8>
                  <h8>₹{totalPrice}</h8>
                </div>
                <Link href="/AddressPage">
                  <button type="button" className="cart-page-btn-desktop">
                    PROCEED TO CHECKOUT
                  </button>
                </Link>
              </div>
            </div>
            <div className="cart-page-mobile-bottom">
              <div className='cart-page-mobile-bottom-price'>
                <h6>₹{totalPrice}</h6>
                <span onClick={scrollToBilling}>VIEW DETAILS</span>
              </div>
              <Link href="/AddressPage">
                <button type="button" className="cart-page-btn-mobile">
                  PROCEED TO CHECKOUT
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div >
  );
}

export default Cart;
