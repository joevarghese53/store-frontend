import React, { useState } from 'react';

const PinCodeCheck = () => {
    const [pinCode, setPinCode] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [message, setMessage] = useState('');

    const validatePinCode = (code) => {
        // Simple validation for Indian pin codes
        return /^[1-9][0-9]{5}$/.test(code);
    };

    const handleCheck = () => {
        if (validatePinCode(pinCode)) {
            setIsValid(true);
            // Call your API or service to check delivery availability here
            // For now, we'll just set a dummy message
            setMessage('Delivery is available for this pin code.');
        } else {
            setIsValid(false);
            setMessage('Please enter a valid pin code.');
        }
    };

    return (
        <div className="pincode-check-container">
            <h4>CHECK FOR DELIVERY DETAILS</h4>
            <p>Delivering all across <span className="india-flag">India 🇮🇳</span></p>
            <div className="pincode-input-container">
                <input
                    type="text"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="Enter Pincode"
                    className={!isValid ? 'invalid' : ''}
                />
                <button onClick={handleCheck}>Check</button>
            </div>
            <p className="message">{message}</p>
        </div>
    );
};

export default PinCodeCheck;
