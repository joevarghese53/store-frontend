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
  const { data: cartData, isLoading: isCartLoading, error: isCartError } = useGetCartQuery();
  const [createShippingAddress] = useCreateShippingAddressMutation();
  const [updateShippingAddress] = useUpdateShippingAddressMutation();
  const [deleteShippingAddress] = useDeleteShippingAddressMutation();
  const selectedAddress = useSelector((state) => state.checkout.selectedAddress);

  const [editingAddress, setEditingAddress] = useState(null);
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
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setNewAddress(address);
  };

  const handleDelete = async (id) => {
    const addressToDelete = addresses.find(address => address._id === id);

    await deleteShippingAddress(id);

    if (selectedAddress && selectedAddress._id === id) {
      dispatch(selectShippingAddress(null)); // Clear from Redux
      localStorage.removeItem('selectedAddress'); // Clear from local storage
    }

  };

  const handleSelectAddress = (address) => {
    dispatch(selectShippingAddress(address));
  };

  function calcPrices(data) {
    const items = data.items;
    let itemsPriceWithTax = 0;
    let taxPrice = 0;
    items.forEach((item) => {
      const gstRate = item.productId.price > 1000 ? 0.12 : 0.05; // Adjust rates as needed

      // Calculate the price before tax for each item
      const itemPriceBeforeTax = item.productId.price / (1 + gstRate);

      // Calculate the GST for each item
      const itemTaxPrice = item.productId.price - itemPriceBeforeTax;

      // Sum up the total price and tax for all items
      itemsPriceWithTax += item.productId.price * item.quantity;
      taxPrice += itemTaxPrice * item.quantity;
    });

    const shippingPrice = itemsPriceWithTax > 1000 ? 0 : 150;
    const totalPrice = (
      parseFloat(itemsPriceWithTax) +
      parseFloat(shippingPrice)
    ).toFixed(2);

    return {
      itemsPrice: (itemsPriceWithTax - taxPrice).toFixed(2), // Price before tax
      shippingPrice: shippingPrice.toFixed(2), // Shipping charges
      taxPrice: taxPrice.toFixed(2), // Total GST calculated for all items
      totalPrice, // Final price including tax and shipping
    };
  }
  const { itemsPrice, shippingPrice, taxPrice, totalPrice } = cartData ? calcPrices(cartData) : {};
  return (
    <div className='address-page-main-container'>
      <div className='address-header'>
        <h4 id='address-header-one'>MY CART ------- ADDRESS</h4>
        <h4 id='address-header-two'>  ------- CHECKOUT ------- PAYMENT </h4>
      </div>
      <div className='address-content'>
        <h3 id='deliver-to-heading'>Deliver To : </h3>
        <div className='address-content-body'>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className='addresses-container'>
              {addresses.map((address) => (
                <div key={address._id} className='address-select-container' style={{ border: selectedAddress?._id === address._id ? '2px solid #2d8700f2' : '' }}>
                  <p id='address'>{address.address}.<br></br> {address.city} - {address.postalCode}, {address.state}, {address.country}.<br></br> CONTACT : {address.phoneno}</p>
                  <div className='button-container'>
                    <button className='address-page-button' onClick={() => handleEdit(address)}>EDIT</button>
                    <button className='address-page-button' onClick={() => handleDelete(address._id)}>REMOVE</button>
                    <button className='address-page-button' onClick={() => handleSelectAddress(address)}>SELECT</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="address-cart-summary-desktop">
            <Link href={selectedAddress ? "/CheckoutPage" : "#"} onClick={(e) => !selectedAddress && e.preventDefault()}>
              <button
                type="button"
                className="address-page-main-container-btn"
                disabled={!selectedAddress} // Disable if no address is selected
              >
                PROCEED TO CHECKOUT
              </button>
            </Link>
          </div>
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
            name="state"
            placeholder="State"
            value={newAddress.state}
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
      <div className="cart-page-mobile-bottom">
        <Link href={selectedAddress ? "/CheckoutPage" : "#"} onClick={(e) => !selectedAddress && e.preventDefault()}>
          <button type="button" className="cart-page-btn-mobile" disabled={!selectedAddress} >
            PROCEED TO CHECKOUT
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AddressPage;
