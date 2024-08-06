// LoginPage.js
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useLoginMutation } from "../redux/api/usersApiSlice";
import { setCredentials } from "../redux/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
// import axios from 'axios';

const slide1 = '/img/LoginPageImage.jpg';

const LoginPage = () => {
  const [user, setUser] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();

  const [login] = useLoginMutation();

  const [isLoading, setIsLoading] = useState(false);

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
      // const response = await axios.post('http://localhost:5000/api/users/auth', {
      //   email: user.email,
      //   password: user.password
      // }, {
      //   withCredentials: true // Include credentials with this request
      // });
      console.log('User logged in successfully:', response.data);
      dispatch(setCredentials({ ...response }));
      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Error logging in user:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Please Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor='email'>Email</label>
          <input
            id='email'
            type="email"
            value={user.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
          />
          <label htmlFor='password'>Password</label>
          <input
            id='password'
            type="password"
            value={user.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
          />
          <button
            
            type="submit"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <p>Don't have an account? <Link id='signup' href="/RegisterPage">Sign up</Link></p>
      </div>
      <div className="login-image">
        <img src={slide1} alt="Login Page Image" />
      </div>
    </div>
  );
};

export default LoginPage;
