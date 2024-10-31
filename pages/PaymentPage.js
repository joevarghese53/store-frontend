import React, { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useGetOrderDetailsQuery } from '../redux/api/orderApiSlice';
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import axios from 'axios';
import { BASE_URL } from "../redux/constants.js";


const PaymentPage = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useFetchCategoriesQuery();
  console.log('orderId:', orderId);
  const billingRef = useRef(null);

  // Conditional query call
  const {
    data: orderDetails,
    isLoading,
    error
  } = useGetOrderDetailsQuery(orderId || '', {
    skip: !orderId, // Skip the query if orderId is not available
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
      console.log('Order ID:', orderId);
      console.log('Order Details:', orderDetails);
    }
  }, [orderId, orderDetails]);

 

    const handlePayment = async () => {
      const data = {
        merchantTransactionId: orderDetails._id,
        customerUserId: orderDetails.user._id,
        amount: orderDetails.totalPrice * 100,
        name: orderDetails.user.username,
      };
      console.log('Payment data:', data);
    
      try {
        const res = await axios.post(`${BASE_URL}/api/payment/initiate-payment`, data);
        console.log('Payment response:', res.data); 
        if (res.data.success) {
          window.location.href = res.data.data.instrumentResponse.redirectInfo.url;
        }
      } catch (error) {
        console.log(error);
      }
    };


    
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    toast.error('Failed to load order details');
    return <div>Error loading order details</div>;
  }



  return (
    <div className='payment-page-main-container'>
      <div className='address-header'>
        <h4 id='address-header-one'>MY CART ------- ADDRESS ------- CHECKOUT  ------- PAYMENT</h4>
        <h4 id='address-header-two'>  </h4>
      </div>
      <div className='payment-page-bottom-container'>
        <div className='payment-page-left-container'>
            {orderDetails && orderDetails.orderItems ? (
              orderDetails.orderItems.map((item) => (
                <div className="cart-item-container">
                    <div className="cart-item" key={item._id}>
                      <img src={item.frontImage} className="cart-product-image" />
                      <div className="item-desc">
                        <h5>{item.name}</h5>
                        <p id='cart-item-category'>{item.category}</p>
                        <p id='cart-item-quantity'>Quantity: {item.quantity}</p>
                        <p id='cart-item-size'>Size: {item.size}</p>
                      </div>
                    </div>
                    <div className="item-price-and-remove">
                      <div className="item-price">
                        <h4>₹{item.price}</h4>
                        <h3>MRP inclusive of all taxes</h3>
                      </div>
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
              <h1 id='shipping-summary-heading'>SHIPPING</h1>
              <div className='shipping-summary'>
                <div className='shipping-summary-left'>
                  <h2>Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</h2>
                  <h2>Email&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</h2>
                  <h2>Address&nbsp;&nbsp;&nbsp;:</h2>
                </div>
                <div className='shipping-summary-right'>
                  <h3>{orderDetails.user.username}</h3>
                  <h3>{orderDetails.user.email}</h3>
                  <p id='address'>{orderDetails.shippingAddress.address}.<br /> {orderDetails.shippingAddress.city} - {orderDetails.shippingAddress.postalCode}, {orderDetails.shippingAddress.state}, {orderDetails.shippingAddress.country}.<br /> CONTACT : {orderDetails.shippingAddress.phoneno}</p>
                </div>
              </div>
              <div className="cart-summary" ref={billingRef} >
                <h4>BILLING DETAILS</h4>
                <div className="billing-details-row">
                  <h6>Cart Total (Excl. of all taxes)</h6>
                  <h6>₹{orderDetails.itemsPrice}</h6>
                </div>
                <div className="billing-details-row">
                  <h6>GST</h6>
                  <h6>₹{orderDetails.taxPrice}</h6>
                </div>
                <div className="billing-details-row">
                  <h6>Shipping Charges</h6>
                  <h6>₹{orderDetails.shippingPrice}</h6>
                </div>
                <div className="billing-details-row">
                  <h6>Total Amount</h6>
                  <h6>₹{orderDetails.totalPrice}</h6>
                </div>
              </div>
            </div>
          ) : (
            <div>Loading order details...</div>
          )}
          <button type="button" className="pay-now-button-desktop" onClick={handlePayment} >
            PAY WITH PHONEPE
          </button>
          <div className="cart-page-mobile-bottom">
              <div className='cart-page-mobile-bottom-price'>
                <h6>₹{orderDetails.totalPrice}</h6>
                <span onClick={scrollToBilling}>VIEW DETAILS</span>
              </div>
                <button type="button" className="cart-page-btn-mobile" onClick={handlePayment} >
                PAY WITH PHONEPE
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
