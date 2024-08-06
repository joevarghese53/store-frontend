import React, { useState } from 'react';


const RangeInput = () => {
  const [numTShirts, setNumTShirts] = useState(0);

  const handleNumTShirtsChange = (event) => {
    const newValue = parseInt(event.target.value, 10);
    setNumTShirts(newValue);
  };

  return (
    <div className="tshirt-exchange">
      <h1>T-Shirt Exchange</h1>
      <div className="exchange-form">
        <label htmlFor="numTShirts">Number of T-Shirts:</label>
        <input
          type="number"
          id="numTShirts"
          value={numTShirts}
          onChange={handleNumTShirtsChange}
        />
        <button>Exchange</button>
      </div>
      <p>You want to exchange {numTShirts} T-shirts.</p>
    </div>
  );
};

export default RangeInput;