import React, { useState } from 'react';
import { useResetPasswordLinkMutation } from "../redux/api/usersApiSlice";

const RequestResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [resetPasswordLink, { isLoading, isError, isSuccess, error }] = useResetPasswordLinkMutation();
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await resetPasswordLink({ email }).unwrap();
      setMessage(response.message || "If the email exists, a reset link has been sent.");
    } catch (err) {
      setMessage(err?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="login-form-btn" disabled={isLoading}>
            {isLoading ? "Processing..." : "Request Password Reset"}
          </button>
        </form>
        {message && <p className="message">{message}</p>}
        {isError && <p className="error-message">Error: {error?.data?.message || "Something went wrong."}</p>}
        {isSuccess && <p className="success-message">Check your email for the reset link.</p>}
      </div>
    </div>
  );
};

export default RequestResetPasswordPage;
