//RegisterPage.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useInitiateRegistrationMutation } from "../redux/api/usersApiSlice";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { setRegisterData } from '../redux/features/auth/registerSlice';
import styles from '../styles/Auth.module.css';

const RegisterPage = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [initiateRegistration] = useInitiateRegistrationMutation();
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const router = useRouter();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUser({ ...user, [id]: value });

  };

  //Hanle Register New User Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate Password Strength
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordPattern.test(user.password)) {
      setError((
        <>
          Password must include:
          <br /> - At least one uppercase letter
          <br /> - One lowercase letter
          <br /> - One number
          <br /> - One special character
          <br /> - Be at least 8 characters long.
        </>
      ));
      setIsLoading(false);
      return;
    }

    // Check if passwords match
    if (user.password !== user.confirmPassword) {
      setError("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      // Data
      const userData = {
        username: user.name,
        email: user.email,
        password: user.password
      };

      // Initiate Registration to store userInfo in server Redis and send OTP to email
      await initiateRegistration(userData).unwrap();

      // Store user data in Redux for use in OTP submission page
      dispatch(setRegisterData({name: userData.username, email: userData.email}));
      router.push('/OtpSubmissionPage');

    } catch (error) {

      setError(
        error?.data?.message ||
        error?.error ||
        error?.message ||
        "Something went wrong"
      );      

    } finally {

      setIsLoading(false);

    }
  };

  return (
    <div className={styles['auth-bg']}>
      <div className={styles['auth-card']}>
        <h2 className={styles['auth-title']}>{isLoading ? "Processing" : "Create your account"}</h2>
        {error && <div className={styles['auth-error']}>{error}</div>}
        <form onSubmit={handleSubmit} className={styles['auth-form']} autoComplete="off">
          <div className={styles['auth-label']} style={{ marginBottom: 0 }}>
            <label htmlFor="name">Name</label>
          </div>
          <input
            id='name'
            type='text'
            value={user.name}
            onChange={handleInputChange}
            className={styles['auth-input']}
            placeholder="Enter your full name"
            required
          />
          <div className={styles['auth-label']} style={{ marginBottom: 0 }}>
            <label htmlFor="email">Email</label>
          </div>
          <input
            id='email'
            type="email"
            value={user.email}
            onChange={handleInputChange}
            className={styles['auth-input']}
            placeholder="Enter your email"
            required
          />
          <div className={styles['auth-label']} style={{ marginBottom: 0 }}>
            <label htmlFor="password">Password</label>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              id='password'
              type={passwordVisible ? "text" : "password"}
              value={user.password}
              onChange={handleInputChange}
              className={styles['auth-input']}
              placeholder="Enter password"
              required
            />
            <button
              type="button"
              className={styles['auth-eye']}
              onClick={() => setPasswordVisible((v) => !v)}
              tabIndex={-1}
              aria-label="Toggle password visibility"
            >
              {passwordVisible ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          <div className={styles['auth-label']} style={{ marginBottom: 0 }}>
            <label htmlFor="confirmPassword">Confirm Password</label>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              id='confirmPassword'
              type={confirmPasswordVisible ? "text" : "password"}
              value={user.confirmPassword}
              onChange={handleInputChange}
              className={styles['auth-input']}
              placeholder="Confirm password"
              required
            />
            <button
              type="button"
              className={styles['auth-eye']}
              onClick={() => setConfirmPasswordVisible((v) => !v)}
              tabIndex={-1}
              aria-label="Toggle confirm password visibility"
            >
              {confirmPasswordVisible ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          <button type="submit" className={styles['auth-button']} disabled={isLoading}>
            {isLoading ? <span>Processing...</span> : 'Sign Up'}
          </button>
        </form>
        <p className={styles['auth-link']}>
          Already have an account? <Link href="/LoginPage">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;