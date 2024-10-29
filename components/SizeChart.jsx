import React from 'react';


const SizeChart = ({ show, handleClose, category }) => {
    if (!show) {
        return null;
    }
    console.log("sizechart",category);

    let sizeData = [];

    if(category === "Regular T-Shirts"){
        sizeData = [
            { size: 'S', chest: '36"', length: '25"' },
            { size: 'M', chest: '38"', length: '26"' },
            { size: 'L', chest: '40"', length: '27"' },
            { size: 'XL', chest: '42"', length: '28"' },
            { size: 'XXL', chest: '44"', length: '29"' },
        ];
    } else if(category === "Oversized T-shirts"){
        sizeData = [
            { size: 'S', chest: '43"', length: '28.5"' },
            { size: 'M', chest: '45"', length: '29"' },
            { size: 'L', chest: '47"', length: '29.5"' },
            { size: 'XL', chest: '49"', length: '30"' },
            { size: 'XXL', chest: '51"', length: '30.5"' },
        ];
    } else if(category === "Oversized Hoodies"){
        sizeData = [
            { size: 'S', chest: '44"', length: '26"', Sleeve: '22"', Shoulder: '21"' },
            { size: 'M', chest: '46"', length: '27"', Sleeve: '22.5"', Shoulder: '22"' },
            { size: 'L', chest: '48"', length: '28"', Sleeve: '23"', Shoulder: '23"' },
            { size: 'XL', chest: '50"', length: '29"', Sleeve: '23.5"', Shoulder: '24"' },
            { size: 'XXL', chest: '52"', length: '30"', Sleeve: '24"', Shoulder: '25"' },
        ];
    }

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
                            <th>Length (inches)</th>
                            {category === "Oversized Hoodies" && (
                                <>
                                    <th>Sleeve (inches)</th>
                                    <th>Shoulder (inches)</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {sizeData.map((row, index) => (
                            <tr key={index}>
                                <td>{row.size}</td>
                                <td>{row.chest}</td>
                                <td>{row.length}</td>
                                {category === "Oversized Hoodies" && (
                                    <>
                                        <td>{row.Sleeve}</td>
                                        <td>{row.Shoulder}</td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="3"><strong>Tip: </strong>If you don’t find an exact match go for the next size.<br></br>Measurements may vary 1 inch ( + or - )</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default SizeChart;
