import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BsBagCheckFill } from 'react-icons/bs';
import { useRouter } from 'next/router';
import { runFireworks } from '../lib/utils';
import { useGetOrderDetailsQuery } from '../redux/api/orderApiSlice';
import Loader from "../components/Loader";

const PaymentSuccessPage = () => {

  const router = useRouter();
  const { id: orderId } = router.query;
  console.log('orderId',orderId);
  const { data: orderDetails, isLoading, error } = useGetOrderDetailsQuery(orderId);

  console.log('orderdetails',orderDetails);

  useEffect(() => {
    if (orderDetails) {
      runFireworks();
    }
  }, [orderDetails]);

  if (isLoading) {
    return (
      <div className="success-wrapper">
        <div className="success">
          <Loader />
          <Link href="/">
            <button type="button" width="300px" className="btn">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="success-wrapper">
        <div className="success">
        <Loader />
          <Link href="/">
            <button type="button" width="300px" className="btn">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="success-wrapper">
      <div className="success">
        <p className="icon">
          <BsBagCheckFill />
        </p>
        <h2>Thank you for your order!</h2>
        <p className="email-msg">Check your email inbox for the receipt.</p>
        <p className="description">
          If you have any questions, please email
          <a className="email" href="mailto:order@example.com">
            dgencustomercare@gmail.com
          </a>
        </p>
        <Link href="/">
          <button type="button" width="300px" className="btn">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  )
}

export default PaymentSuccessPage

