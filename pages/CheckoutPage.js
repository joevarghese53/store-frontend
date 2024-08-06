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


    const calculateTotalPrice = () => {
        if (!cartData || !cartData.items) {
            return 0;
        }
        return cartData.items.reduce((total, item) => {
            return total + (item.productId.price * item.quantity);
        }, 0);
    };

    const placeOrderHandler = async () => {
        try {
            console.log('Placing order...');

            const cartItems = cartData.items.map(item => ({
                name: item.productId.name,
                qty: item.quantity,
                image: item.productId.image,
                _id: item.productId._id,
                category: item.productId.category,
            }));
            console.log('Cart Items:', cartItems);

            const shippingAddress = {
                address: selectedAddress.address,
                city: selectedAddress.city,
                postalCode: selectedAddress.postalCode,
                country: selectedAddress.country,
                phoneno: selectedAddress.phoneno
            };
            console.log('Shipping Address:', shippingAddress);

            const totalPrice = calculateTotalPrice();
            console.log('Total Price:', totalPrice);

            const orderData = {
                orderItems: cartItems,
                shippingAddress: shippingAddress,
                paymentMethod: 'Paytm',
                itemsPrice: totalPrice,
                shippingPrice: 0,
                taxPrice: 0,
                totalPrice: totalPrice,
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
                <p>{`${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.postalCode}, ${selectedAddress.country}, ${selectedAddress.phoneno}`}</p>
            </div>
            <div className="checkout-cart-summary">
                <h6>BILLING DETAILS</h6>
                <p>Cart Total (Excl. of all taxes) <span>₹{calculateTotalPrice()}</span></p>
                <p>GST <span>₹0</span></p>
                <p>Shipping Charges <span>₹0</span></p>
                <p>Total Amount: <span>₹{calculateTotalPrice()}</span></p>
            </div>
            <button type="button" className="btn1" onClick={placeOrderHandler} >
                PLACE ORDER
            </button>
        </div>
    )
}

export default CheckoutPage;
