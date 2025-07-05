import React, { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useGetOrderDetailsQuery } from '../redux/api/orderApiSlice';
import axios from 'axios';
import { BASE_URL } from "../redux/constants.js";
import { FiUser, FiMapPin, FiMail, FiPhone } from 'react-icons/fi';

const PaymentPage = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const billingRef = useRef(null);

  const {
    data: orderDetails,
    isLoading,
    error
  } = useGetOrderDetailsQuery(orderId || '', {
    skip: !orderId,
  });

  const scrollToBilling = () => {
    if (billingRef.current) {
      const yOffset = -100;
      const y = billingRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (orderId) {
      // For debugging
      // console.log('Order ID:', orderId);
      // console.log('Order Details:', orderDetails);
    }
  }, [orderId, orderDetails]);

  const handlePayment = async () => {
    const data = {
      merchantTransactionId: orderDetails._id,
      customerUserId: orderDetails.user._id,
      amount: orderDetails.totalPrice * 100,
      name: orderDetails.user.username,
    };
    try {
      const res = await axios.post(`${BASE_URL}/api/payment/initiate-payment`, data);
      if (res.data.success) {
        window.location.href = res.data.data.instrumentResponse.redirectInfo.url;
      }
    } catch (error) {
      toast.error('Payment initiation failed');
    }
  };

  if (isLoading) {
    return (
      <div className="checkout-loading-container">
        <div className="checkout-loading-spinner"></div>
        <p>Loading payment page...</p>
      </div>
    );
  }

  if (error) {
    toast.error('Failed to load order details');
    return <div>Error loading order details</div>;
  }

  return (
    <div className='payment-page-main-container'>
      <div className='address-header'>
        <h4 id='address-header-one'>MY CART ------- ADDRESS ------- CHECKOUT  ------- PAYMENT</h4>
        <h4 id='address-header-two'></h4>
      </div>
      <div className='payment-page-bottom-container'>
        <div className='payment-page-left-container'>
          {orderDetails && orderDetails.orderItems ? (
            orderDetails.orderItems.map((item) => (
              <div className="payment-item-card" key={item._id}>
                <div className="payment-item-image">
                  <img src={item.frontImage} alt={item.name} />
                </div>
                <div className="payment-item-desc">
                  <h5 className="payment-item-name">{item.name}</h5>
                  <div className="payment-item-meta">
                    <span className="payment-item-category">{item.category}</span>
                    <span className="payment-item-size">Size: {item.size}</span>
                    <span className="payment-item-qty">Qty: {item.quantity}</span>
                  </div>
                  <div className="payment-item-price">₹{item.price}</div>
                  <div className="payment-item-note">MRP inclusive of all taxes</div>
                </div>
              </div>
            ))
          ) : (
            <div>No items in the order</div>
          )}
        </div>
        <div className='payment-page-right-container'>
          {orderDetails && orderDetails.user && orderDetails.shippingAddress ? (
            <div className='payment-page-summary'>
              <div className='shipping-summary'>
                <div className="shipping-summary-header">
                  <FiMapPin className="shipping-summary-icon" />
                  <span>Shipping Details</span>
                </div>
                <div className='shipping-summary-rows'>
                  <div className='shipping-summary-left'>
                    <div className="shipping-summary-row"><FiUser /> <span>Name:</span></div>
                    <div className="shipping-summary-row"><FiMail /> <span>Email:</span></div>
                    <div className="shipping-summary-row"><FiMapPin /> <span>Address:</span></div>
                    <div className="shipping-summary-row"><FiPhone /> <span>Contact:</span></div>
                  </div>
                  <div className='shipping-summary-right'>
                    <div className="shipping-summary-value">{orderDetails.user.username}</div>
                    <div className="shipping-summary-value">{orderDetails.user.email}</div>
                    <div className="shipping-summary-value">{orderDetails.shippingAddress.address}, {orderDetails.shippingAddress.city} - {orderDetails.shippingAddress.postalCode}, {orderDetails.shippingAddress.state}, {orderDetails.shippingAddress.country}</div>
                    <div className="shipping-summary-value">{orderDetails.shippingAddress.phoneno}</div>
                  </div>
                </div>
              </div>
              <div className="payment-summary-card" ref={billingRef}>
                <div className="payment-summary-header">Order Summary</div>
                <div className="summary-table">
                  <div className="summary-row">
                    <span className="summary-label">Cart Total (Excl. of all taxes)</span>
                    <span className="summary-value">₹{orderDetails.itemsPrice}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">GST</span>
                    <span className="summary-value">₹{orderDetails.taxPrice}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Shipping Charges</span>
                    <span className="summary-value">₹{orderDetails.shippingPrice}</span>
                  </div>
                  <div className="summary-row total">
                    <span className="summary-label">Total Amount</span>
                    <span className="summary-value">₹{orderDetails.totalPrice}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>Loading order details...</div>
          )}
          <button type="button" className="pay-now-button-desktop" onClick={handlePayment}>
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;

