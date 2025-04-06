import React from 'react';
import { useGetOrderDetailsQuery } from '../redux/api/orderApiSlice';
import { useRouter } from 'next/router';
import OrderStatusBar from '@/components/OrderStatusBar';
import jsPDF from 'jspdf';
import Loader from '@/components/Loader';
import { MdOutlineEmail } from "react-icons/md";
import { MdOutlineLocalPhone } from "react-icons/md";
import { GrLocation } from "react-icons/gr";
import Link from 'next/link';

const OrderDetails = () => {
    const router = useRouter();
    const { order_id: orderId, admin: admin } = router.query;
    const { data: orderDetails, error, isLoading } = useGetOrderDetailsQuery(orderId);
    console.log(orderDetails);
    console.log(admin);

    const downloadImage = async (url, name) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = name;
            link.click();
            URL.revokeObjectURL(link.href); // Cleanup
        } catch (error) {
            console.error("Error downloading image:", error);
        }
    };

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
                }}>We are experiencing issues with server. We are working on it. Please come back again after some time</p>
            </div>)}
            {orderDetails && (
                <div className='order-details-container'>
                    <div className='order-details-left'>
                        <div className='order-details-left-top'>
                            <div className='order-details-left-top-1'>
                                <div className='order-card-top-left-2'>
                                    {orderDetails.isDelivered ? (
                                        <>
                                            <h2 style={{ marginLeft: '5px' }}>Order Delivered on {new Date(orderDetails.deliveredAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/(\d{2}) (\w{3}) (\d{4})/, '$1 $2, $3')}</h2>
                                        </>
                                    ) : orderDetails.isOutForDelivery ? (
                                        <>
                                            <h2 style={{ marginLeft: '5px' }}>Order Out For Delivery on {new Date(orderDetails.outForDeliveryAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/(\d{2}) (\w{3}) (\d{4})/, '$1 $2, $3')}</h2>
                                        </>
                                    ) : orderDetails.isShipped ? (
                                        <>
                                            <h2 style={{ marginLeft: '5px' }}>Order Shipped on {new Date(orderDetails.shippedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/(\d{2}) (\w{3}) (\d{4})/, '$1 $2, $3')}</h2>
                                        </>
                                    ) : orderDetails.isPaid ? (
                                        <>
                                            <h2 style={{ marginLeft: '5px' }}>Order Confirmed on {new Date(orderDetails.paidAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/(\d{2}) (\w{3}) (\d{4})/, '$1 $2, $3')}</h2>
                                        </>
                                    ) : null}

                                </div>
                                <div className='order-status'>
                                    {orderDetails.isDelivered ? (
                                        <>
                                            <p style={{ backgroundColor: '#28a745', paddingTop: '5px', paddingBottom: '5px', borderRadius: '16px', fontSize: '10px', paddingLeft: '10px', paddingRight: '10px' }}>Delivered</p>
                                        </>
                                    ) : orderDetails.isOutForDelivery ? (
                                        <>
                                            <p style={{ backgroundColor: '#ff9800', paddingTop: '5px', paddingBottom: '5px', borderRadius: '16px', fontSize: '10px', paddingLeft: '10px', paddingRight: '10px' }}>Out For Delivery</p>
                                        </>
                                    ) : orderDetails.isShipped ? (
                                        <>
                                            <p style={{ backgroundColor: '#17a2b8', paddingTop: '5px', paddingBottom: '5px', borderRadius: '16px', fontSize: '10px', paddingLeft: '10px', paddingRight: '10px' }}>Shipped</p>
                                        </>
                                    ) : orderDetails.isPaid ? (
                                        <>
                                            <p style={{ backgroundColor: '#ffc107', paddingTop: '5px', paddingBottom: '5px', borderRadius: '16px', fontSize: '10px', paddingLeft: '10px', paddingRight: '10px' }}>Order Placed</p>
                                        </>
                                    ) : null}
                                </div>
                            </div>
                            <div className='order-details-left-top-2'>
                                <OrderStatusBar order={orderDetails} />
                            </div>
                            <div className='order-details-left-top-3'>
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
                        <div className='order-details-left-bottom'>
                            {/* Order Items */}
                            <div className='order-detail-items'>
                                <h2>Order Items</h2>
                                {orderDetails.orderItems.map((item) => (
                                    <div key={item.product} className="order-item">
                                        <div className='order-card-item'>
                                            <div className='order-card-middle-left'>
                                                <img src={item.frontImage} alt={item.name} className="order-product-image" />
                                            </div>
                                            <div className='order-card-middle-right'>
                                                <div className='order-card-middle-right-1'>
                                                    <p style={{ fontWeight: '500', marginBottom: '0' }}>{item.name}</p>
                                                </div>
                                                <div className='order-card-middle-right-2'>
                                                    <p style={{ color: 'grey', marginBottom: '30px' }}>{item.category}</p>
                                                </div>
                                                <div className='order-card-middle-right-3'>
                                                    <p>Size : {item.size}</p>
                                                    <p>Quantity : {item.qty}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='order-card-item-price'>
                                            <p style={{ fontWeight: '500', marginBottom: '0' }}>₹{item.price}</p>
                                        </div>
                                        {admin && (
                                            <div className="images-download-container">
                                                {item.frontImage && item.frontImage != "undefined" && (
                                                    <button
                                                        className="download-image-button"
                                                        onClick={() => downloadImage(item.frontImage, `${item.name}-front.png`)}
                                                    >
                                                        Download Front Image
                                                    </button>
                                                )}
                                                {item.backImage && item.backImage != "undefined" && (
                                                    <button
                                                        className="download-image-button"
                                                        onClick={() => downloadImage(item.backImage, `${item.name}-back.png`)}
                                                    >
                                                        Download Back Image
                                                    </button>
                                                )}
                                                {item.frontDesign && item.frontDesign != "undefined" && (
                                                    <button
                                                        className="download-image-button"
                                                        onClick={() => downloadImage(item.frontDesign, `${item.name}-front-design.png`)}
                                                    >
                                                        Download Front Design
                                                    </button>
                                                )}
                                                {item.backDesign && item.backDesign != "undefined" && (
                                                    <button
                                                        className="download-image-button"
                                                        onClick={() => downloadImage(item.backDesign, `${item.name}-back-design.png`)}
                                                    >
                                                        Download Back Design
                                                    </button>
                                                )}
                                                {item.frontUpload && item.frontUpload != "undefined" && (
                                                    <button
                                                        className="download-image-button"
                                                        onClick={() => downloadImage(item.frontUpload, `${item.name}-front-upload.png`)}
                                                    >
                                                        Download Front Upload
                                                    </button>
                                                )}
                                                {item.backUpload && item.backUpload != "undefined" && (
                                                    <button
                                                        className="download-image-button"
                                                        onClick={() => downloadImage(item.backUpload, `${item.name}-back-upload.png`)}
                                                    >
                                                        Download Back Upload
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div className='order-details-subtotal'>
                                    <div className='order-details-subtotal-row'>
                                        <p style={{ fontSize: '1.2rem', color: 'grey', fontWeight: '500' }}>Subtotal</p>
                                        <p style={{ fontWeight: '500' }}>₹{orderDetails.itemsPrice}</p>
                                    </div>
                                    <div className='order-details-subtotal-row'>
                                        <p style={{ fontSize: '1.2rem', color: 'grey', fontWeight: '500' }}>Shipping</p>
                                        <p style={{ fontWeight: '500' }}>₹{orderDetails.shippingPrice}</p>
                                    </div>
                                    <div className='order-details-subtotal-row'>
                                        <p style={{ fontSize: '1.2rem', color: 'grey', fontWeight: '500' }}>Tax</p>
                                        <p style={{ fontWeight: '500' }}>₹{orderDetails.taxPrice}</p>
                                    </div>
                                </div>
                                <div className='order-details-subtotal-row'>
                                    <p style={{ fontSize: '1.2rem', fontWeight: '500' }}>Total</p>
                                    <p style={{ fontWeight: '500' }}>₹{orderDetails.totalPrice}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='order-details-right'>
                        <div className='order-details-right-top'>
                            {/* Delivery Address */}
                            <div className='order-details-delivery-address'>
                                <h2>Customer Information</h2>
                                <p style={{ fontSize: '1.2rem', color: 'grey' }}>Contact Details</p>
                                <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>{orderDetails.user.username}</p>
                                <p style={{ fontSize: '1rem', fontWeight: '400', display: 'flex', gap: '6px', alignItems: 'center' }}><MdOutlineEmail />{orderDetails.user.email}</p>
                                <p style={{ fontSize: '1rem', fontWeight: '400', display: 'flex', gap: '6px', alignItems: 'center' }}><MdOutlineLocalPhone />{orderDetails.shippingAddress.phoneno}</p>
                                <p>-----------------------------------</p>
                                <p style={{ fontSize: '1.2rem', color: 'grey' }}>Shipping Address</p>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <GrLocation style={{ fontSize: '4rem' }} />
                                    <p style={{ fontSize: '1rem', fontWeight: '400' }}>{`${orderDetails.shippingAddress.address}, ${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.postalCode}, ${orderDetails.shippingAddress.state}, ${orderDetails.shippingAddress.country}`}</p>
                                </div>
                            </div>
                        </div>
                        <div className='order-details-right-bottom'>
                            <div className='order-details-delivery-address'>
                                <h2>Need Help?</h2>
                                <Link href="/ContactUs"><button><MdOutlineLocalPhone />Contact Support</button></Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetails;
