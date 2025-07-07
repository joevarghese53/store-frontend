//RegisterPage.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSendEmailOtpMutation } from "../redux/api/emailOtpSlice";
import { useCheckUserExistsMutation } from "../redux/api/usersApiSlice";
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
  const [sendEmailOtp] = useSendEmailOtpMutation();
  const [checkUserExists] = useCheckUserExistsMutation();
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const router = useRouter();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUser({ ...user, [id]: value });

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

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

    if (user.password !== user.confirmPassword) {
      setError("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {

      const userData = {
        name: user.name,
        email: user.email,
        password: user.password
      };

      console.log("checking user exists")

      const userExistsResponse = await checkUserExists({ email: user.email }).unwrap();
      console.log("User existence", userExistsResponse)
      if (userExistsResponse.exists) {
        setError("User with this email already exists. Please login or use a different email.");
        setIsLoading(false);
        return;
      }

      // Send email OTP before registration
      const otpResponse = await sendEmailOtp(userData).unwrap();
      if (otpResponse.status !== 'success') {
        throw new Error(otpResponse.message || 'Failed to send OTP');
      }
      console.log('OTP sent successfully:', otpResponse.data);

      dispatch(setRegisterData(userData));

      router.push('/OtpSubmissionPage');
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError(error.message || 'An error occurred while sending OTP');
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