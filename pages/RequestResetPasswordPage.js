import React, { useState } from 'react';
import { useResetPasswordLinkMutation } from "../redux/api/usersApiSlice";
import styles from '../styles/Auth.module.css';
import Link from 'next/link';

const RequestResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [resetPasswordLink, { isLoading, isError, isSuccess, error }] = useResetPasswordLinkMutation();
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Init Reset password reset for email:", email);
      const response = await resetPasswordLink({ email }).unwrap();
      setMessage(response.message || "If the email exists, a reset link has been sent.");
    } catch (err) {
      setMessage(err?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className={styles['auth-bg']}>
      <div className={styles['auth-card']}>
        <h2 className={styles['auth-title']}>Reset Password</h2>
        <form className={styles['auth-form']} onSubmit={handleSubmit}>
          <input
            type="email"
            className={styles['auth-input']}
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className={styles['auth-button']} disabled={isLoading}>
            {isLoading ? "Processing..." : "Request Password Reset"}
          </button>
        </form>
        <p className={styles['auth-link']}>
          Remembered your password? <Link href="/LoginPage">Sign In</Link>
        </p>
        {isError && (
          <div className={styles['auth-error']}>
            Error: {error?.data?.message?.message || "Something went wrong."}
          </div>
        )}
        {isSuccess && (
          <div className={styles['auth-info']}>
            {message}
          </div>
        )}
        {message && !isError && !isSuccess && (
          <div className={styles['auth-info']}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestResetPasswordPage;
