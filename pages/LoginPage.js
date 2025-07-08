// LoginPage.js
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useLoginMutation } from "../redux/api/usersApiSlice";
import { setCredentials } from "../redux/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import styles from '../styles/Auth.module.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
// import axios from 'axios';


const LoginPage = () => {
  const [user, setUser] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();

  const [login] = useLoginMutation();

  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUser({ ...user, [id]: value });
  };

  const handleResetPassword = () => {
    router.push('/RequestResetPasswordPage');
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await login({ email: user.email, password: user.password }).unwrap();
      console.log('User logged in successfully:', response.data);
      dispatch(setCredentials({ ...response }));
      router.push('/');
    } catch (error) {
      console.error('Error logging in user:', error?.data?.message);
      setError(error?.data?.message);
      setIsLoading(false);
    }
  };

  return (
    <div className={styles['auth-bg']}>
      <div className={styles['auth-card']}>
        <h2 className={styles['auth-title']}>Sign In</h2>
        {error && <div className={styles['auth-error']}>{error}</div>}
        <form onSubmit={handleSubmit} className={styles['auth-form']} autoComplete="off">
          <label htmlFor='email' className={styles['auth-label']}>Email</label>
          <input
            id='email'
            type="email"
            value={user.email}
            onChange={handleInputChange}
            className={styles['auth-input']}
            placeholder="Enter your email"
            required
          />
          <label htmlFor='password' className={styles['auth-label']}>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              id='password'
              type={isPasswordVisible ? "text" : "password"}
              value={user.password}
              onChange={handleInputChange}
              className={styles['auth-input']}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              className={styles['auth-eye']}
              onClick={() => setIsPasswordVisible((v) => !v)}
              tabIndex={-1}
              aria-label="Toggle password visibility"
            >
              {isPasswordVisible ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          <button
            className={styles['auth-button']}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <p className={styles['auth-link']}>
          Don't have an account? <Link href="/RegisterPage">Sign up</Link>
        </p>
        <p className={styles['auth-reset']}>
          <button type="button" onClick={handleResetPassword}>Forgot your password?</button>
        </p>
      </div>
      {/* <div className="login-image">
        <img src={slide1} alt="Login Page Image" />
      </div> */}
    </div>
  );
};

export default LoginPage;
