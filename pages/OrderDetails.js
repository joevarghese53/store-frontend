import React from 'react';
import { useGetOrderDetailsQuery } from '../redux/api/orderApiSlice';
import { useRouter } from 'next/router';
import OrderStatusBar from '@/components/OrderStatusBar';
import jsPDF from 'jspdf';
import Loader from '@/components/Loader';

const OrderDetails = () => {
    const router = useRouter();
    const { order_id: orderId } = router.query;
    const { data: orderDetails, error, isLoading } = useGetOrderDetailsQuery(orderId);

    const generateInvoice = () => {
        if (!orderDetails) return;

        const doc = new jsPDF();

        // Adding title
        doc.setFontSize(18);
        doc.text('Invoice', 20, 20);

        // Adding order details
        doc.setFontSize(12);
        doc.text(`Order ID: ${orderDetails._id}`, 20, 30);
        doc.text(`Date: ${new Date(orderDetails.createdAt).toLocaleDateString()}`, 20, 40);
        doc.text(`Transaction ID: ${orderDetails.paymentResult.transaction_id}`, 20, 50);
        doc.text(`Payment Status: ${orderDetails.paymentResult.state}`, 20, 60);

        // Adding shipping address
        doc.text('Shipping Address:', 20, 80);
        doc.text(`${orderDetails.shippingAddress.address}`, 20, 90);
        doc.text(`${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.postalCode}`, 20, 100);
        doc.text(`${orderDetails.shippingAddress.state}`, 20, 110);
        doc.text(`${orderDetails.shippingAddress.country}`, 20, 120);
        doc.text(`Phone: ${orderDetails.shippingAddress.phoneno}`, 20, 130);

        // Adding order items
        doc.text('Order Items:', 20, 140);
        orderDetails.orderItems.forEach((item, index) => {
            doc.text(
                `${index + 1}. ${item.name} (${item.category}) - Quantity: ${item.qty} - Price: ₹${item.price}`,
                20,
                150 + index * 10
            );
        });

        // Adding total prices
        doc.text(`Items Price: ₹${orderDetails.itemsPrice}`, 20, 160 + orderDetails.orderItems.length * 10);
        doc.text(`Tax Price: ₹${orderDetails.taxPrice}`, 20, 170 + orderDetails.orderItems.length * 10);
        doc.text(`Total Price: ₹${orderDetails.totalPrice}`, 20, 180 + orderDetails.orderItems.length * 10);

        // Save the PDF
        doc.save(`Invoice_${orderDetails._id}.pdf`);
    };

    return (
        <div className='order-details-main-container'>
            {isLoading && (<div className="order-details-container">
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '30vh'
                }}>
                    <Loader />
                </div>
            </div>)}
            {error && (<div className="order-details-container">
                <p style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '30vh'
                }}>We are experiencing issues with server. We are working on it. Please come again after some time</p>
            </div>)}
            {orderDetails && (
                <div className='order-details-container'>
                    <div className='order-details-row1'>
                        {/* Delivery Address */}
                        <div className='order-details-delivery-address'>
                            <h2>Delivery Address</h2>
                            <p>{orderDetails.user.username}</p>
                            <p>{`${orderDetails.shippingAddress.address}, ${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.postalCode}, ${orderDetails.shippingAddress.state}, ${orderDetails.shippingAddress.country}`}</p>
                            <p><strong>Phone number: </strong><br></br>{orderDetails.shippingAddress.phoneno}</p>
                        </div>

                        {/* Status Bar */}
                        <OrderStatusBar order={orderDetails} />

                        {/* Additional Actions */}
                        <div className='order-details-more-actions'>
                            <button
                                onClick={generateInvoice}
                                disabled={!orderDetails.isDelivered} // Disable button if order is not delivered
                            >
                                Download Invoice
                            </button>
                            {!orderDetails.isDelivered && (
                                <p style={{ color: 'red', marginTop: '10px' }}>Invoice will be available once the order is delivered.</p>
                            )}
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className='order-detail-items'>
                        <h2>Order Items</h2>
                        {orderDetails.orderItems.map((item) => (
                            <div key={item.product} className="order-item">
                                <img src={item.image} alt={item.name} className="order-product-image" />
                                <div className="order-item-desc">
                                    <h3>{item.name}</h3>
                                    <p>{item.category}</p>
                                    <p>Quantity : {item.qty}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetails;
