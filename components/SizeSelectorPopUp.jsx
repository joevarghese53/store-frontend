import React, { useState } from 'react';
import { Modal } from 'react-bootstrap'; // You can use any modal library you prefer

const SizeSelectorPopUp = ({ show, onClose, onConfirm, product }) => {
    const [selectedSize, setSelectedSize] = useState(null);

    const handleConfirm = () => {
        if (selectedSize) {
            onConfirm(product._id, selectedSize); // Call the onConfirm function passed as prop
            onClose(); // Close the modal
        }
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Select Size for {product.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Please select a size:</p>
                {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <button
                        key={size}
                        className={`size-button ${selectedSize === size ? 'selected' : ''}`}
                        onClick={() => setSelectedSize(size)}
                    >
                        {size}
                    </button>
                ))}
            </Modal.Body>
            <Modal.Footer>
                <button onClick={onClose}>Cancel</button>
                <button onClick={handleConfirm} disabled={!selectedSize}>Add to Cart</button>
            </Modal.Footer>
        </Modal>
    );
};

export default SizeSelectorPopUp;
