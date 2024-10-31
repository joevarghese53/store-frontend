import React, { useState } from 'react';
import SizeChart from './SizeChart';

const SizeSelector = ({ onSizeSelect, category }) => {
    const [showSizeChart, setShowSizeChart] = useState(false);
    const [selectedSize, setSelectedSize] = useState(null);

    console.log("sizeselector",category);

    const toggleSizeChart = () => {
        setShowSizeChart(!showSizeChart);
    };

    const handleSizeSelect = (size) => {
        setSelectedSize(size);
        onSizeSelect(size); // Call the passed function to update size in ProductDetails
    };

    return (
        <div className="size-selection">
            <div className="size-title">
            <p>Select Size </p>
            <span className="size-chart-link" onClick={toggleSizeChart}>SIZE GUIDE</span>
            </div>
            <div className="size-options">
                {['S', 'M', 'L', 'XL', 'XXL'].map((size, index) => (
                    <button key={index} className={`size-button ${selectedSize === size ? 'selected' : ''}`} onClick={() => handleSizeSelect(size)}>{size}</button>
                ))}
            </div>
            <SizeChart show={showSizeChart} handleClose={toggleSizeChart} category = {category}/>
        </div>
    );
};

export default SizeSelector;
