import React from 'react';


const SizeChart = ({ show, handleClose }) => {
    if (!show) {
        return null;
    }

    const sizeData = [
        { size: 'XS', chest: '30-32"', waist: '24-26"' },
        { size: 'S', chest: '34-36"', waist: '28-30"' },
        { size: 'M', chest: '38-40"', waist: '32-34"' },
        { size: 'L', chest: '42-44"', waist: '36-38"' },
        { size: 'XL', chest: '46-48"', waist: '40-42"' },
        { size: 'XXL', chest: '50-52"', waist: '44-46"' },
    ];

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <span className="close-button" onClick={handleClose}>×</span>
                <h2>Size Chart</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Size</th>
                            <th>Chest (inches)</th>
                            <th>Waist (inches)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sizeData.map((row, index) => (
                            <tr key={index}>
                                <td>{row.size}</td>
                                <td>{row.chest}</td>
                                <td>{row.waist}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SizeChart;
