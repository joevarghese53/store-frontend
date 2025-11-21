// LoginPage.js
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useLoginMutation } from "../redux/api/usersApiSlice";
import { setCredentials } from "../redux/state/auth/authSlice";
import { useDispatch } from "react-redux";
import styles from '../styles/Auth.module.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


const LoginPage = () => {
  const [user, setUser] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const [login] = useLoginMutation();


  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUser({ ...user, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {

      const response = await login({ email: user.email, password: user.password }).unwrap();
      dispatch(setCredentials({ ...response, accessToken: response.accessToken }));
      router.push('/');

    } catch (error) {

      setError(
        error?.data?.message ||
        error?.error ||
        error?.message ||
        "Something went wrong"
      );      

    } finally {
      
      setIsLoading(false)

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
          <button type="button" onClick={() => router.push('/RequestResetPasswordPage')}>Forgot your password?</button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
