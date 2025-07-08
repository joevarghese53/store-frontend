import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BsBagCheckFill } from 'react-icons/bs';
import { useRouter } from 'next/router';
import { runFireworks } from '../lib/utils';
import { useGetOrderDetailsQuery } from '../redux/api/orderApiSlice';
import Loader from "../components/Loader";
import styles from "../styles/PaymentSuccessPage.module.css";

const PaymentSuccessPage = () => {

  const router = useRouter();
  const { id: orderId } = router.query;
  console.log('orderId', orderId);
  const { data: orderDetails, isLoading, error } = useGetOrderDetailsQuery(orderId);

  console.log('orderdetails', orderDetails);

  useEffect(() => {
    if (sessionStorage.getItem('paymentSuccess')) {
      // Show the page
      sessionStorage.removeItem('paymentSuccess'); // Remove so it can't be shown again
    } else {
      // Redirect if flag is missing
      router.replace('/MyOrders');
    }
  }, []);

  useEffect(() => {
    if (orderDetails) {
      runFireworks();
    }
  }, [orderDetails]);

  if (isLoading) {
    return (
      <div className={styles.successWrapper}>
        <div className={styles.success}>
          <Loader />
          <Link href="/">
            <button type="button" className={styles.btn}>
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.successWrapper}>
        <div className={styles.success}>
          <Loader />
          <Link href="/">
            <button type="button" className={styles.btn}>
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.successWrapper}>
      <div className={styles.success}>
        <p className={styles.icon}>
          <BsBagCheckFill />
        </p>
        <h2 className={styles.heading}>Thank you for your order!</h2>
        <p className={styles.emailMsg}>Check your email inbox for the receipt. <br />Please do check the updates/promotions/spam folder for the email.<br /> If you still haven't received a confirmation mail, please contact our customer support.</p>
        <p className={styles.description}>
          If you have any questions, please email
          <a className={styles.email} href="mailto:flowstateprojectinfo@gmail.com">
            flowstateprojectinfo@gmail.com
          </a>
        </p>
        <Link href="/">
          <button type="button" className={styles.btn}>
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  )
}

export default PaymentSuccessPage

