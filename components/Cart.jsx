import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { AiOutlineShopping } from 'react-icons/ai';
import { FiTrash2, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import { useGetCartQuery, useAddToCartMutation, useUpdateCartItemMutation, useRemoveFromCartMutation } from '../redux/api/cartApiSlice';
import { useRouter } from 'next/router';
import Loader from './Loader';
import { toast } from 'react-toastify'
import ErrorCallBack from './ErrorCallBack';

const Cart = () => {
  const { data, isLoading, error, refetch } = useGetCartQuery();
  const [removeCartItem] = useRemoveFromCartMutation();
  const router = useRouter();
  const billingRef = useRef(null);

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
      const gstRate = item.productId.price > 1000 ? 0.12 : 0.05;
      const itemPriceBeforeTax = item.productId.price / (1 + gstRate);
      const itemTaxPrice = item.productId.price - itemPriceBeforeTax;
      itemsPriceWithTax += item.productId.price * item.quantity;
      taxPrice += itemTaxPrice * item.quantity;
    });

    const shippingPrice = itemsPriceWithTax > 1000 ? 0 : 150;
    const totalPrice = (
      parseFloat(itemsPriceWithTax) +
      parseFloat(shippingPrice)
    ).toFixed(2);

    return {
      itemsPrice: (itemsPriceWithTax - taxPrice).toFixed(2),
      shippingPrice: shippingPrice.toFixed(2),
      taxPrice: taxPrice.toFixed(2),
      totalPrice,
    };
  }

  const handleRemoveFromCart = async (itemId, size) => {
    try {
      let answer = window.confirm("Are you sure you want to remove this item from your cart?");
      if (!answer) return;

      const { data } = await removeCartItem({ productId: itemId, size: size }).unwrap();
      console.log('Product deleted successfully', data);
      toast.success(`Item removed from cart successfully.`);
    } catch (err) {
      console.log(err);
      toast.error('Failed to remove item from cart.');
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  if (isLoading) return (
    <div className="cart-page-container">
      <Loader />
    </div>
  );

  if (error) return (
    <div className="cart-page-container">
      <ErrorCallBack message={error?.data || error.message} onRetry={() => window.location.reload()} />
    </div>
  );

  const { itemsPrice, shippingPrice, taxPrice, totalPrice } = data ? calcPrices(data) : {};

  return (
    <div className="cart-page-container">
      {data.items.length < 1 ? (
        <div className="cart-empty-state">
          <div className="cart-empty-card">
            <FiShoppingBag className="cart-empty-icon" />
            <h2>Your shopping cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet. Start shopping to see your items here.</p>
            <Link href="/" className="cart-continue-shopping">
              <FiArrowRight className="cart-arrow-icon" />
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className='address-header'>
            <h4 id='address-header-one'>MY CART </h4>
            <h4 id='address-header-two'>  ------- ADDRESS ------- CHECKOUT ------- PAYMENT </h4>
          </div>

          <div className="cart-content-wrapper">
            <div className="cart-items-section">
              <div className="cart-items-header">
                <h3>CART ITEMS</h3>
                <span className="cart-items-count">{data.items.length} {data.items.length === 1 ? 'item' : 'items'}</span>
              </div>

              <div className="cart-items-list">
                {data.items.map((item) => (
                  <div className="cart-item-card" key={`${item.productId._id}-${item.size}`}>
                    <div className="cart-item-image">
                      <img src={item.productId.frontImage} alt={item.productId.name} />
                    </div>

                    <div className="cart-item-details">
                      <div className="cart-item-info">
                        <div>
                          <h4 className="cart-item-name">{item.productId.name}</h4>
                          <p className="cart-item-category">{item.productId.category}</p>
                        </div>
                        <div className="cart-item-meta">
                          <span className="cart-item-size">Size: {item.size}</span>
                          <span className="cart-item-quantity">Qty: {item.quantity}</span>
                        </div>
                      </div>

                      <div className="cart-item-price">
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                        <span className="cart-item-price-amount">₹{item.productId.price}</span>
                        <span className="cart-item-price-note">MRP inclusive of all taxes</span>
                        </div>
                        <button
                          className="cart-item-remove"
                          onClick={() => handleRemoveFromCart(item.productId._id, item.size)}
                          title="Remove item"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="cart-summary-section" ref={billingRef}>
              <div className="cart-summary-card">
                <h3 className="cart-summary-title">ORDER SUMMARY</h3>

                <div className="cart-summary-details">
                  <div className="cart-summary-row">
                    <span>Subtotal</span>
                    <span>₹{itemsPrice}</span>
                  </div>
                  <div className="cart-summary-row">
                    <span>GST</span>
                    <span>₹{taxPrice}</span>
                  </div>
                  <div className="cart-summary-row">
                    <span>Shipping</span>
                    <span>{shippingPrice > 0 ? `₹${shippingPrice}` : 'Free'}</span>
                  </div>

                  <div className="cart-summary-divider"></div>

                  <div className="cart-summary-row cart-summary-total">
                    <span>Total Amount</span>
                    <span>₹{totalPrice}</span>
                  </div>
                </div>

                <Link href="/AddressPage" className="cart-checkout-button">
                  Proceed to Checkout
                  <FiArrowRight />
                </Link>

                <div className="cart-summary-note">
                  <p>Free shipping on orders above ₹1000</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Bottom Bar */}
          <div className="cart-mobile-bottom">
            <div className="cart-mobile-price">
              <span className="cart-mobile-total">₹{totalPrice}</span>
              <button onClick={scrollToBilling} className="cart-mobile-details">
                View Details
              </button>
            </div>
            <Link href="/AddressPage" className="cart-mobile-checkout">
              Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
