//RegisterPage.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRegisterMutation } from "../redux/api/usersApiSlice";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const slide1 = '/img/LoginPageImage.jpg';

const RegisterPage = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);  // Toggle for password visibility
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);  // Toggle for confirm password visibility
  const [error, setError] = useState('');
  const router = useRouter();

  const [register] = useRegisterMutation();

  // Toggle password visibility
  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);


  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUser({ ...user, [id]: value });

  };

  useEffect(() => {
    const allFieldsFilled = Object.values(user).every(field => field !== '');
    const passwordsMatch = user.password === user.confirmPassword;
    setButtonDisabled(!(allFieldsFilled && passwordsMatch));
  }, [user]);

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
      const response = await register({ username: user.name, email: user.email, password: user.password }).unwrap();

      console.log('User registered successfully:', response.data);

      router.push('/LoginPage');
    } catch (error) {
      console.error('Error registering user:', error);
      if (error?.data?.message === "User with this email already exists.") {
        setError("An account with this email already exists. Please try logging in or use a different email.");
      } else {
        setError(error?.data?.message || 'An error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>{isLoading ? "Processing" : "Please Sign Up"}</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            id='name'
            type='text'
            value={user.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
          />
          <label>Email</label>
          <input
            id='email'
            type="email"
            value={user.email}
            onChange={handleInputChange}
            placeholder="Enter your valid email"
          />
          <label>Password</label>
          <div className="password-input-container">
            <input
              id='password'
              type={passwordVisible ? "text" : "password"}
              value={user.password}
              onChange={handleInputChange}
              placeholder="Enter new password"
            />
            <button
              type="button"
              className="password-field-eye-icon"
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <label>Confirm Password</label>
          <div className="password-input-container">
            <input
              type="password"
              id='confirmPassword'
              value={user.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm password"
            />
            <button
              type="button"
              className="password-field-eye-icon"
              onClick={toggleConfirmPasswordVisibility}
            >
              {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button type="submit" className='register-form-button' disabled={buttonDisabled}>Sign Up</button>
          {/* <p>---------------------OR----------------------</p>
          <button type="button" className="google-signin">Sign Up with Google 
            <FaGoogle style={{marginLeft: '10px', marginBottom:'2px'}}/>
          </button> */}
        </form>
        <p>Already have an account? <Link id='login' href="/LoginPage">Login</Link></p>
      </div>

    </div>
  );
};

export default RegisterPage;