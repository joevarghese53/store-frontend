import React, { useState } from 'react';
import SizeChart from './SizeChart';

const SizeSelector = () => {
    const [showSizeChart, setShowSizeChart] = useState(false);

    const toggleSizeChart = () => {
        setShowSizeChart(!showSizeChart);
    };

    return (
        <div className="size-selection">
            <p>Please select a size. <span className="size-chart-link" onClick={toggleSizeChart}>SIZE CHART</span></p>
            <div className="size-options">
                {['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((size, index) => (
                    <button key={index} className="size-button">{size}</button>
                ))}
            </div>
            <SizeChart show={showSizeChart} handleClose={toggleSizeChart} />
        </div>
    );
};

export default SizeSelector;
