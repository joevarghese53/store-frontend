import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useGetUserShippingAddressesQuery,
  useCreateShippingAddressMutation,
  useUpdateShippingAddressMutation,
  useDeleteShippingAddressMutation
} from '../redux/api/shippingAddressApiSlice';
import { selectShippingAddress } from '../redux/slices/checkoutSlice';
import { useGetCartQuery } from '../redux/api/cartApiSlice';
import Link from 'next/link';

const AddressPage = () => {
  const dispatch = useDispatch();
  const { data: addresses, isLoading } = useGetUserShippingAddressesQuery();
  const { data: cartData, isLoading : isCartLoading, error: isCartError } = useGetCartQuery();
  const [createShippingAddress] = useCreateShippingAddressMutation();
  const [updateShippingAddress] = useUpdateShippingAddressMutation();
  const [deleteShippingAddress] = useDeleteShippingAddressMutation();
  const selectedAddress = useSelector((state) => state.checkout.selectedAddress);

  const [editingAddress, setEditingAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
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
    setNewAddress({ address: '', city: '', postalCode: '', country: '', phoneno: '' });
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setNewAddress(address);
  };

  const handleDelete = async (id) => {
    await deleteShippingAddress(id);
  };

  const handleSelectAddress = (address) => {
    dispatch(selectShippingAddress(address));
  };

  const calculateTotalPrice = () => {
    if (!cartData || !cartData.items) {
      return 0;
    }
    return cartData.items.reduce((total, item) => {
      return total + (item.productId.price * item.quantity);
    }, 0);
  };

  return (
    <div className='address-page-main-container'>
      <div className='address-header'>
        <h4 id='address-header-one'>MY CART ------- ADDRESS</h4>
        <h4 id='address-header-two'>  ------- CHECKOUT ------- PAYMENT </h4>
      </div>
        <h3 id='deliver-to-heading'>Deliver To : </h3>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className='addresses-container'>
            {addresses.map((address) => (
              <div key={address._id} className='address-select-container' style={{ border: selectedAddress?._id === address._id ? '4px solid green' : '', padding: '10px', margin: '10px' }}>
                <p id='address'>{address.address}.<br></br> {address.city} - {address.postalCode},  {address.country}.<br></br> CONTACT : {address.phoneno}</p>
                <div className='button-container'>
                  <button className='address-page-button' onClick={() => handleEdit(address)}>Edit</button>
                  <button className='address-page-button' onClick={() => handleDelete(address._id)}>Delete</button>
                  <button className='address-page-button' onClick={() => handleSelectAddress(address)}>Select</button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="address-cart-summary">
          <h6>BILLING DETAILS</h6>
          <h8>Cart Total (Excl. of all taxes)       <span>₹{calculateTotalPrice()}</span></h8>
          <h8>GST                                   <span>₹{calculateTotalPrice()}</span></h8>
          <h8>Shipping Charges                      <span>₹{calculateTotalPrice()}</span></h8>
          <h8>Total Amount:                         <span>₹{calculateTotalPrice()}</span></h8>
          <Link href="/CheckoutPage">
            <button type="button" className="btn">
              PROCEED TO CHECKOUT
            </button>
          </Link>
        </div>
      <form onSubmit={handleSubmit} className='address-form'>
        <h2 id='address-form-heading'>{editingAddress ? 'Edit Address' : 'Add New Address'}</h2>
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={newAddress.address}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={newAddress.city}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={newAddress.postalCode}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={newAddress.country}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="phoneno"
          placeholder="Contact Number"
          value={newAddress.phoneno}
          onChange={handleInputChange}
          required
        />
        <button className='address-form-submit' type="submit">{editingAddress ? 'Update Address' : 'Add Address'}</button>
      </form>
      
    </div>
  );
};

export default AddressPage;
