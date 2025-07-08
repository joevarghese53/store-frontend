import React, { useState, useEffect } from 'react';
import { useResetPasswordMutation } from "../../redux/api/usersApiSlice";
import { useRouter } from 'next/router';


const ResetPasswordPage = () => {
  const router = useRouter();
  const { token } = router.query;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetPassword, { isLoading, isError, isSuccess, error }] = useResetPasswordMutation();
  const [message, setMessage] = useState("");
  const [errorPattern, setErrorPattern] = useState('');

  useEffect(() => {
    if (!router.isReady) return; // Ensure the router is ready before accessing query
    if (!token) {
      setMessage("Invalid or expired token.");
    } else {
      setMessage(""); // Clear any previous message
    }
  }, [router.isReady, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorPattern('');
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!passwordPattern.test(newPassword)) {
      setErrorPattern((
        <>
          Password must include:
          <br /> - At least one uppercase letter
          <br /> - One lowercase letter
          <br /> - One number
          <br /> - One special character
          <br /> - Be at least 8 characters long.
        </>
      ));
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await resetPassword({ token, newPassword }).unwrap();
      setMessage(response.message || "Password reset successfully.");
      router.push('/LoginPage');
    } catch (err) {
      setMessage(err?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-form">
        <h2>Reset Your Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Processing..." : "Reset Password"}
          </button>
        </form>
        {message && <p className="message">{message}</p>}
        {errorPattern && <p className="error-message">{errorPattern}</p>}
        {isError && <p className="error-message">Error: {error?.data?.message?.message || "Something went wrong."}</p>}
        {isSuccess && <p className="success-message">Your password has been reset successfully. You can now log in.</p>}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
