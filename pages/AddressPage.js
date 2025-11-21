import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useGetUserShippingAddressesQuery,
  useCreateShippingAddressMutation,
  useUpdateShippingAddressMutation,
  useDeleteShippingAddressMutation
} from '../redux/api/shippingAddressApiSlice';
import { selectShippingAddress } from '../redux/state/checkout/checkoutSlice';
import { useGetCartQuery } from '../redux/api/cartApiSlice';
import Link from 'next/link';
import Loader from '../components/Loader';
import ErrorCallBack from '../components/ErrorCallBack';
import { FiMapPin, FiEdit3, FiTrash2, FiCheck, FiPlus, FiUser, FiPhone, FiHome } from 'react-icons/fi';
import Modal from '../components/Modal';

const AddressPage = () => {
  const dispatch = useDispatch();
  const { data: addresses, isLoading: isAddressLoading, error: isAddressError } = useGetUserShippingAddressesQuery();
  const { data: cartData, isLoading: isCartLoading, error: isCartError } = useGetCartQuery();
  const [createShippingAddress] = useCreateShippingAddressMutation();
  const [updateShippingAddress] = useUpdateShippingAddressMutation();
  const [deleteShippingAddress] = useDeleteShippingAddressMutation();
  const selectedAddress = useSelector((state) => state.checkout.selectedAddress);

  const [editingAddress, setEditingAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    state: '',
    country: '',
    phoneno: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({ ...newAddress, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingAddress) {
      await updateShippingAddress({ id: editingAddress._id, updatedAddress: newAddress });
      setEditingAddress(null);
    } else {
      await createShippingAddress(newAddress);
    }
    setNewAddress({ address: '', city: '', postalCode: '', state: '', country: '', phoneno: '' });
    setShowForm(false);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setNewAddress(address);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await deleteShippingAddress(id);

    if (selectedAddress && selectedAddress._id === id) {
      dispatch(selectShippingAddress(null));
      localStorage.removeItem('selectedAddress');
    }
  };

  const handleSelectAddress = (address) => {
    dispatch(selectShippingAddress(address));
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setNewAddress({ address: '', city: '', postalCode: '', state: '', country: '', phoneno: '' });
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingAddress(null);
    setShowForm(false);
    setNewAddress({ address: '', city: '', postalCode: '', state: '', country: '', phoneno: '' });
  };

  function calcPrices(data) {
    const items = data.items;
    let itemsPriceWithTax = 0;
    let taxPrice = 0;
    items.forEach((item) => {
      const gstRate = item.productId.price > 1000 ? 0.12 : 0.05;
      const itemPriceBeforeTax = item.productId.price / (1 + gstRate);
      const itemTaxPrice = item.productId.price - itemPriceBeforeTax;
      itemsPriceWithTax += item.productId.price * item.quantity;
      taxPrice += itemTaxPrice * item.quantity;
    });

    const shippingPrice = itemsPriceWithTax > 1000 ? 0 : 150;
    const totalPrice = (
      parseFloat(itemsPriceWithTax) +
      parseFloat(shippingPrice)
    ).toFixed(2);

    return {
      itemsPrice: (itemsPriceWithTax - taxPrice).toFixed(2),
      shippingPrice: shippingPrice.toFixed(2),
      taxPrice: taxPrice.toFixed(2),
      totalPrice,
    };
  }

  const { itemsPrice, shippingPrice, taxPrice, totalPrice } = cartData ? calcPrices(cartData) : {};

  if (isAddressLoading || isCartLoading) {
    return (
      <div className="address-page-main-container">
        <Loader />
      </div>
    );
  }

   if (isAddressError || isCartError) {
    return (
      <div className="address-page-main-container">
        <ErrorCallBack 
          message={isAddressError?.data?.message || isCartError?.data?.message || 'An error occurred while fetching data.'} 
          onRetry={() => window.location.reload()} 
        />
      </div>
    );
  }

  return (
    <div className='address-page-main-container'>
      <div className='address-header'>
        <h4 id='address-header-one'>MY CART ------- ADDRESS</h4>
        <h4 id='address-header-two'>  ------- CHECKOUT ------- PAYMENT </h4>
      </div>
      
      <div className='address-content'>
        <div className="address-header-section">
          <h3 className="address-page-title">Select Delivery Address</h3>
          <p className="address-page-subtitle">Choose where you'd like your order delivered</p>
        </div>

        <div className='address-content-body'>
          <div className="addresses-section">
            <div className="addresses-header">
              <h3 id='deliver-to-heading'>Deliver To:</h3>
              <button className="add-address-button" onClick={handleAddNew}>
                <FiPlus />
                Add New Address
              </button>
            </div>

            {isAddressLoading ? (
              <div className="address-loading-state">
                <div className="address-loading-spinner"></div>
                <p>Loading addresses...</p>
              </div>
            ) : addresses && addresses.length > 0 ? (
              <div className='addresses-container'>
                {addresses.map((address) => (
                  <div 
                    key={address._id} 
                    className={`address-select-container ${selectedAddress?._id === address._id ? 'selected' : ''}`}
                  >
                    <div className="address-card-header">
                      <div className="address-icon">
                        <FiMapPin />
                      </div>
                      <div className="address-selection-indicator">
                        {selectedAddress?._id === address._id && <FiCheck />}
                      </div>
                    </div>
                    
                    <div className="address-content">
                      <p id='address' className="address-text">
                        {address.address}.<br />
                        {address.city} - {address.postalCode}, {address.state}, {address.country}.<br />
                        <span className="contact-info">
                          <FiPhone className="contact-icon" />
                          {address.phoneno}
                        </span>
                      </p>
                    </div>

                    <div className='button-container'>
                      <button 
                        className='address-page-button edit-button' 
                        onClick={() => handleEdit(address)}
                      >
                        <FiEdit3 />
                        Edit
                      </button>
                      <button 
                        className='address-page-button remove-button' 
                        onClick={() => handleDelete(address._id)}
                      >
                        <FiTrash2 />
                        Remove
                      </button>
                      <button 
                        className={`address-page-button select-button ${selectedAddress?._id === address._id ? 'selected' : ''}`}
                        onClick={() => handleSelectAddress(address)}
                      >
                        {selectedAddress?._id === address._id ? <FiCheck /> : <FiMapPin />}
                        {selectedAddress?._id === address._id ? 'Selected' : 'Select'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="address-empty-state">
                <div className="address-empty-icon">
                  <FiMapPin />
                </div>
                <h3>No addresses found</h3>
                <p>Add your first delivery address to continue</p>
                <button className="add-address-button primary" onClick={handleAddNew}>
                  <FiPlus />
                  Add Address
                </button>
              </div>
            )}

            {showForm && (
              <Modal isOpen={showForm} onClose={handleCancel}>
                <form onSubmit={handleSubmit} className='address-form'>
                  <div className="form-header">
                    <h2 id='address-form-heading'>
                      {editingAddress ? 'Edit Address' : 'Add New Address'}
                    </h2>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="address">
                        <FiHome className="input-icon" />
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        placeholder="Enter your full address"
                        value={newAddress.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="city">
                        <FiMapPin className="input-icon" />
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        placeholder="Enter city"
                        value={newAddress.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="postalCode">
                        <FiMapPin className="input-icon" />
                        Postal Code
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        placeholder="Enter postal code"
                        value={newAddress.postalCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="state">
                        <FiMapPin className="input-icon" />
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        placeholder="Enter state"
                        value={newAddress.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="country">
                        <FiMapPin className="input-icon" />
                        Country
                      </label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        placeholder="Enter country"
                        value={newAddress.country}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="phoneno">
                        <FiPhone className="input-icon" />
                        Contact Number
                      </label>
                      <input
                        type="text"
                        id="phoneno"
                        name="phoneno"
                        placeholder="Enter contact number"
                        value={newAddress.phoneno}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="form-cancel-button" onClick={handleCancel}>
                      Cancel
                    </button>
                    <button className='address-form-submit' type="submit">
                      {editingAddress ? 'Update Address' : 'Add Address'}
                    </button>
                  </div>
                </form>
              </Modal>
            )}
          </div>

          <div className="address-cart-summary-desktop">
            <div className="cart-summary-card">
              <h4>ORDER SUMMARY</h4>
              <div className="summary-table">
                <div className="summary-row">
                  <span className="summary-label">Items Price:</span>
                  <span className="summary-value">₹{itemsPrice}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Shipping:</span>
                  <span className="summary-value">₹{shippingPrice}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Tax:</span>
                  <span className="summary-value">₹{taxPrice}</span>
                </div>
                <div className="summary-row total">
                  <span className="summary-label">Total:</span>
                  <span className="summary-value">₹{totalPrice}</span>
                </div>
              </div>
              <Link href={selectedAddress ? "/CheckoutPage" : "#"} onClick={(e) => !selectedAddress && e.preventDefault()}>
                <button
                  type="button"
                  className="address-page-checkout-btn"
                  disabled={!selectedAddress}
                >
                  {selectedAddress ? 'Proceed to Checkout' : 'Select Address to Continue'}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="cart-mobile-bottom">
        <Link href={selectedAddress ? "/CheckoutPage" : "#"} onClick={(e) => !selectedAddress && e.preventDefault()}>
          <button type="button" className="cart-mobile-checkout" disabled={!selectedAddress}>
            {selectedAddress ? 'Proceed to Checkout' : 'Select Address'}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AddressPage;
