import React from 'react';
import toast from 'react-hot-toast';
import { useSelector } from "react-redux";
import { useGetCartQuery } from '../redux/api/cartApiSlice';
import { selectSelectedAddress } from '../redux/slices/checkoutSlice';
import { useCreateOrderMutation } from "../redux/api/orderApiSlice";
import Link from 'next/link';
import { useRouter } from 'next/router';

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
                image: item.productId.image,
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
        return <div>Loading...</div>;
    }

    return (
        <div className="checkout-page">
            <div className='address-header'>
                <h4 id='address-header-one'>MY CART ------- ADDRESS ------- CHECKOUT</h4>
                <h4 id='address-header-two'>  ------- PAYMENT </h4>
            </div>
            <div className='checkout-address-summary'>
                <p>{userInfo.username}</p>
                <h6>ADDRESS DETAILS </h6>
                <Link href="/AddressPage" className='checkout-change-address-link'>change</Link>
                <p>{`${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.postalCode}, ${selectedAddress.state}, ${selectedAddress.country}, ${selectedAddress.phoneno}`}</p>
            </div>
            <div className="checkout-cart-summary">
                <h6>BILLING DETAILS</h6>
                <p>Cart Total (Excl. of all taxes) <span>₹{itemsPrice}</span></p>
                <p>GST <span>₹{taxPrice}</span></p>
                <p>Shipping Charges <span>₹{shippingPrice}</span></p>
                <p>Total Amount: <span>₹{totalPrice}</span></p>
            </div>
            <button type="button" className="btn1" onClick={placeOrderHandler} >
                PLACE ORDER
            </button>
        </div>
    )
}

export default CheckoutPage;
