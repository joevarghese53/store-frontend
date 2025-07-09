import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MdErrorOutline } from 'react-icons/md';
import styles from '../styles/PaymentFailedPage.module.css';

const PaymentFailedPage = () => {
  const router = useRouter();

  useEffect(() => {
    const flag = sessionStorage.getItem('paymentStarted');
    if (flag) {
      sessionStorage.removeItem('paymentStarted');
    } else {
      router.replace('/'); // Redirect to home if no payment was started
    }
  }, []);

  return (
    <div className={styles.failedWrapper}>
      <div className={styles.failed}>
        <p className={styles.icon}>
          <MdErrorOutline />
        </p>
        <h2 className={styles.heading}>Payment Failed</h2>
        <p className={styles.message}>
          Oops! Something went wrong with your payment.<br />
          Please try again or contact customer support if the issue persists.
        </p>
        <p className={styles.description}>
          If you have any questions, please email
          <a className={styles.email} href="mailto:flowstateprojectinfo@gmail.com">
            flowstateprojectinfo@gmail.com
          </a>
        </p>
        <Link href="/">
          <button type="button" className={styles.btn}>
            Return to Shop
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentFailedPage;
