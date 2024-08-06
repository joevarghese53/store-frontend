import React, { useState } from 'react';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';

const ProductInfo = ({ title, content }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="collapsible-section">
            <div className="collapsible-header" onClick={toggleOpen}>
                <span>{title}</span>
                {isOpen ? <AiOutlineMinus /> : <AiOutlinePlus />}
            </div>
            {isOpen && <div className="collapsible-content">{content}</div>}
        </div>
    );
};

export default ProductInfo;
