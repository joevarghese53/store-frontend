import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useRegisterMutation } from "../redux/api/usersApiSlice";


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
  const [error, setError] = useState('');
  const router = useRouter();

  const [register] = useRegisterMutation();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUser({ ...user, [id]: value });

    if (user.name && user.email && user.password && user.confirmPassword) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (user.password !== user.confirmPassword) {
      setError("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await register({username: user.name, email: user.email, password: user.password}).unwrap();

      console.log('User registered successfully:', response.data);

      // Redirect to login page or home page
      router.push('/LoginPage');
    } catch (error) {
      console.error('Error registering user:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.message : 'An error occurred');
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
            placeholder="Enter your Name"
          />
          <label>Email</label>
          <input
            id='email'
            type="email"
            value={user.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
          />
          <label>Password</label>
          <input
            id='password'
            type="password"
            value={user.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
          />
          <label>Confirm Password</label>
          <input
            type="password"
            id='confirmPassword'
            value={user.confirmPassword}
            onChange={handleInputChange}
            placeholder="Enter your password again"
          />
          <button type="submit" disabled={buttonDisabled}>{buttonDisabled ? "Enter all details" : "Sign Up"}</button>
          <button type="button" className="google-signin">Sign Up with Google</button>
        </form>
        <p>Already have an account? <Link id='login' href="/LoginPage">Login</Link></p>
      </div>
      <div className="register-image">
        <img src={slide1} alt="Login Page Image"/>
      </div>
    </div>
  );
};

export default RegisterPage;
