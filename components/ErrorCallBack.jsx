import { FaExclamationTriangle } from "react-icons/fa";
import React from "react";

const ErrorFallback = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="centered-container">
      <div className="status-box error-box">
        <FaExclamationTriangle size={100} className="status-icon error-icon" />
        <h2>{message}</h2>
        <p>We're having trouble loading your data. Please try again later.</p>
        <button type="button" className="primary-btn" onClick={onRetry || (() => location.reload())}>
          Retry
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback;
