import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useGetOrderDetailsQuery } from '../redux/api/orderApiSlice';
import { usePayForOrderMutation } from '@/redux/api/orderApiSlice';
import { FiUser, FiMapPin, FiMail, FiPhone } from 'react-icons/fi';
import Script from "next/script";
import { useCheckPaymentStatusMutation } from '@/redux/api/paymentApiSlice';
import { RiseLoader } from 'react-spinners';

const PaymentPage = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const billingRef = useRef(null);
  const [initiatePayment] = usePayForOrderMutation()
  const [isPolling, setIsPolling] = useState(false);
  const [pollStatus, setPollStatus] = useState("INITIATED");
  const [pollAttempts, setPollAttempts] = useState(0);
  const pollingIntervalRef = useRef(null);
  const [checkPaymentStatus] = useCheckPaymentStatusMutation();

  const {
    data: orderDetails,
    isLoading,
    error
  } = useGetOrderDetailsQuery(orderId || '', {
    skip: !orderId,
  });

  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, []);

  const MAX_ATTEMPTS = 12; // ~1 minute if interval = 5s
  const POLL_INTERVAL = 5000;

  const pollPaymentStatus = async (orderId) => {
    if (pollingIntervalRef.current) return;
    setIsPolling(true);
    setPollStatus("INITIATED");
    setPollAttempts(0);

    let attempts = 0;

    pollingIntervalRef.current = setInterval(async () => {
      attempts++;

      try {
        const res = await checkPaymentStatus(orderId).unwrap();

        console.log("Payment status response:", res);
        setPollStatus(res.status);
        setPollAttempts(attempts);

        if (res.status === "SUCCESS") {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
          setIsPolling(false);
          toast.success("Payment successful 🎉");
          return;
        }

        if (res.status === "FAILED") {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
          setIsPolling(false);
          toast.error("Payment failed. Please try again.");
          return;
        }

        if (attempts >= MAX_ATTEMPTS) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
          setIsPolling(false);
          toast.info("Payment is still processing. Tries will be added once confirmed.");
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    }, POLL_INTERVAL);
  };

  const handlePayment = async () => {
    const data = {
      orderId: orderDetails._id,
    };

    try {
      const initRes = await initiatePayment(data).unwrap();
      if (!initRes?.success || !initRes?.redirectUrl || !initRes?.merchantOrderId) {
        toast.error("Failed to initiate payment");
        return;
      }

      if (!window.PhonePeCheckout) {
        toast.error("Payment system still loading. Try again.");
        return;
      }
      console.log("Response-----", initRes)

      window.PhonePeCheckout.transact({
        tokenUrl: initRes.redirectUrl,
        type: "IFRAME",

        callback: async (result) => {
          if (result === "USER_CANCEL") {
            toast.info("Payment cancelled");
            return;
          }

          if (result === "CONCLUDED") {
            pollPaymentStatus(initRes.merchantOrderId);
          }
        },
      });
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast.error("Payment initiation failed");
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
      <Script
        src="https://mercury.phonepe.com/web/bundle/checkout.js"
        strategy="afterInteractive"
      />
      <div className='address-header'>
        <h4 id='address-header-one'>MY CART ------- ADDRESS ------- CHECKOUT  ------- PAYMENT</h4>
        <h4 id='address-header-two'></h4>
      </div>
      <div className='payment-page-bottom-container'>
        <div className='payment-page-left-container'>
          <div className="cart-items-list">
            {orderDetails && orderDetails.orderItems ? (
              orderDetails.orderItems.map((item) => (
                <div className="cart-item-card" key={item._id}>
                  <div className="cart-item-image">
                    <img src={item.frontImage} alt={item.name} />
                  </div>
                  {/* cart */}
                  <div className="cart-item-details">
                    <div className="cart-item-info">
                      <div>
                        <h4 className="cart-item-name">{item.name}</h4>
                        <p className="cart-item-category">{item.category}</p>
                      </div>
                      <div className="cart-item-meta">
                        <span className="cart-item-size">Size: {item.size}</span>
                        <span className="cart-item-quantity">Qty: {item.qty}</span>
                      </div>
                    </div>

                    <div className="cart-item-price">
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span className="cart-item-price-amount">₹{item.price}</span>
                        <span className="cart-item-price-note">MRP inclusive of all taxes</span>
                      </div>
                    </div>
                  </div>
                  {/* cart */}
                </div>
              ))
            ) : (
              <div>No items in the order</div>
            )}
          </div>
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
                  <div className="shipping-summary-row">
                    <div className='shipping-summary-left'>
                      <FiUser /> <span>Name:</span>
                    </div>
                    <div className='shipping-summary-value'>
                      {orderDetails.user.username}
                    </div>
                  </div>

                  <div className="shipping-summary-row">
                    <div className='shipping-summary-left'>
                      <FiMail /> <span>Email:</span>
                    </div>
                    <div className='shipping-summary-value'>
                      {orderDetails.user.email}
                    </div>
                  </div>

                  <div className="shipping-summary-row">
                    <div className='shipping-summary-left'>
                      <FiMapPin /> <span>Address:</span>
                    </div>
                    <div className='shipping-summary-value'>
                      {orderDetails.shippingAddress.fullName}, <br />
                      {orderDetails.shippingAddress.addressLine1}, <br />
                      {orderDetails.shippingAddress.addressLine2 && (
                        <>
                          {orderDetails.shippingAddress.addressLine2}, <br />
                        </>
                      )}
                      {orderDetails.shippingAddress.landmark && (
                        <>
                          {orderDetails.shippingAddress.landmark}, <br />
                        </>
                      )}
                      {orderDetails.shippingAddress.city} - {orderDetails.shippingAddress.postalCode}, {orderDetails.shippingAddress.state}, {orderDetails.shippingAddress.country}
                    </div>
                  </div>

                  <div className="shipping-summary-row">
                    <div className='shipping-summary-left'>
                      <FiPhone /> <span>Contact:</span>
                    </div>
                    <div className='shipping-summary-value'>
                      {orderDetails.shippingAddress.phoneNumber}
                    </div>
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
      <div className="cart-mobile-bottom">
        <button type="button" className="cart-mobile-checkout" onClick={handlePayment}>
          Pay Now
        </button>
      </div>
      {isPolling && (
        <div className="loading-screen-overlay">
          <div className="loading-box">
            <RiseLoader className='rise-loader' color='#00d0ff'></RiseLoader>
            <h2 style={{ "margin": "50px 0px" }}>
              {pollStatus === "INITIATED" || pollStatus === "PENDING"
                ? "Confirming payment…"
                : pollStatus === "COMPLETED"
                  ? "Payment successful 🎉"
                  : "Payment failed"}
            </h2>

            <p>
              {pollStatus === "PENDING"
                ? "This may take a few seconds. Please don’t close the page."
                : "Checking payment status with PhonePe"}
            </p>

            {pollAttempts >= 6 && (
              <p className="hint">
                Taking longer than usual. You can safely close this page —
                your tries will be added once confirmed.
              </p>
            )}

            {pollAttempts >= MAX_ATTEMPTS && (
              <button onClick={() => setIsPolling(false)}>
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;

