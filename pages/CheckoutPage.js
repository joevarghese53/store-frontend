import React from 'react';
import toast from 'react-hot-toast';
import { useSelector } from "react-redux";
import { useGetCartQuery } from '../redux/api/cartApiSlice';
import { selectSelectedAddress } from '../redux/slices/checkoutSlice';
import { useCreateOrderMutation } from "../redux/api/orderApiSlice";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiUser, FiMapPin, FiEdit2 } from 'react-icons/fi';

const CheckoutPage = () => {

    const { userInfo } = useSelector((state) => state.auth);
    const { data: cartData, isLoading: isCartLoading, error: isCartError } = useGetCartQuery();
    const selectedAddress = useSelector(selectSelectedAddress);
    const [createOrder, { isLoading, error }] = useCreateOrderMutation();
    const router = useRouter();


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

    const placeOrderHandler = async () => {
        try {
            console.log('Placing order...');
            console.log('Cart Data:', cartData);

            const cartItems = cartData.items.map(item => ({
                name: item.productId.name,
                qty: item.quantity,
                frontImage: item.productId.frontImage,
                backImage: item.productId.backImage,
                frontDesign: item.productId.frontDesign,    
                backDesign: item.productId.backDesign,
                frontUpload: item.productId.frontUpload,
                backUpload: item.productId.backUpload,
                _id: item.productId._id,
                size: item.size,
                category: item.productId.category,
                productType: item.productType,
            }));
            console.log('Cart Items:', cartItems);

            const shippingAddress = {
                address: selectedAddress.address,
                city: selectedAddress.city,
                postalCode: selectedAddress.postalCode,
                state: selectedAddress.state,
                country: selectedAddress.country,
                phoneno: selectedAddress.phoneno
            };
            console.log('Shipping Address:', shippingAddress);

            const totPrice = totalPrice;
            console.log('Total Price:', totPrice);

            const orderData = {
                orderItems: cartItems,
                shippingAddress: shippingAddress,
                paymentMethod: 'Paytm',
                itemsPrice: totPrice,
                shippingPrice: 0,
                taxPrice: 0,
                totalPrice: totPrice,
            };
            console.log('Order Data:', orderData);

            const res = await createOrder(orderData).unwrap();
            console.log('Order Response:', res);

            router.push(`/PaymentPage?orderId=${res._id}`);
        } catch (error) {
            toast.error(error.message || 'Failed to place order');
        }
    };

    if (!userInfo || isCartLoading || !selectedAddress) {
        return (
            <div className="checkout-loading-container">
                <div className="checkout-loading-spinner"></div>
                <p>Loading checkout...</p>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className='address-header'>
                <h4 id='address-header-one'>MY CART ------- ADDRESS ------- CHECKOUT</h4>
                <h4 id='address-header-two'>  ------- PAYMENT </h4>
            </div>
            <div className='checkout-content'>
                <div className='checkout-address-card'>
                    <div className="checkout-address-header">
                        <span className="checkout-address-title"><FiMapPin /> Address Details</span>
                        <Link href="/AddressPage" className="checkout-change-address-btn">
                            <FiEdit2 /> Change
                        </Link>
                    </div>
                    <div className="checkout-address-user">
                        <FiUser className="checkout-address-user-icon" />
                        <span>{userInfo.username}</span>
                    </div>
                    <div className="checkout-address-info">
                        <span>{selectedAddress.address}, {selectedAddress.city}, {selectedAddress.postalCode}</span><br />
                        <span>{selectedAddress.state}, {selectedAddress.country}</span><br />
                        <span>{selectedAddress.phoneno}</span>
                    </div>
                </div>
                <div className="checkout-summary-card">
                    <div className="checkout-summary-header">Order Summary</div>
                    <div className="summary-table">
                        <div className="summary-row">
                            <span className="summary-label">Cart Total (Excl. of all taxes)</span>
                            <span className="summary-value">₹{itemsPrice}</span>
                        </div>
                        <div className="summary-row">
                            <span className="summary-label">GST</span>
                            <span className="summary-value">₹{taxPrice}</span>
                        </div>
                        <div className="summary-row">
                            <span className="summary-label">Shipping Charges</span>
                            <span className="summary-value">₹{shippingPrice}</span>
                        </div>
                        <div className="summary-row total">
                            <span className="summary-label">Total Amount</span>
                            <span className="summary-value">₹{totalPrice}</span>
                        </div>
                    </div>
                </div>
            </div>
            <button type="button" className="checkout-placeorder-btn" onClick={placeOrderHandler}>
                Place Order
            </button>
        </div>
    )
}

export default CheckoutPage;
