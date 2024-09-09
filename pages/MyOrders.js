import React from 'react'
import { useGetMyOrdersQuery } from '../redux/api/orderApiSlice'
import Link from 'next/link';
import Loader from '../components/Loader';

const MyOrders = () => {

    const { data: orders, error, isLoading } = useGetMyOrdersQuery()
    console.log('Orders : ', orders)

    if (isLoading) return (<div className="orders-container">
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '30vh'
        }}>
            <Loader />
        </div>

    </div>);
    if (error) return (<div className="orders-container">
        <p style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '30vh'
        }}>We are experiencing issues with server. We are working on it. Please come again after some time</p>
    </div>);

    return (
        <div className="orders-container">
            <h2>My Orders</h2>
            <div className="orders-grid">

                {orders?.length < 1 &&
                    <p style={{
                        display: 'inline-block',
                        width: '15px',
                        height: '15px',
                        backgroundColor: 'green',
                        borderRadius: '50%',
                        marginRight: '10px',
                        marginTop: '2px'
                    }}>No orders found.</p>}

                {orders?.length > 0 ? (
                    orders.map((order) => (
                        <Link href={{ pathname: '/OrderDetails', query: { order_id: order._id } }} key={order._id}>
                            <div key={order._id} className="order-card">
                                <div className="order-items">
                                    {order.orderItems.map((item) => (
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
                                <div className='order-price'>
                                    <p>₹{order.totalPrice.toFixed(2)}</p>
                                </div>
                                <div className='order-status'>
                                    {order.isDelivered ? (
                                        <>
                                            <span style={{
                                                display: 'inline-block',
                                                width: '15px',
                                                height: '15px',
                                                backgroundColor: 'green',
                                                borderRadius: '50%',
                                                marginRight: '10px',
                                                marginTop: '2px'
                                            }}></span>
                                            <h2>Delivered</h2>
                                        </>
                                    ) : order.isPaid ? (
                                        <>
                                            <span style={{
                                                display: 'inline-block',
                                                width: '15px',
                                                height: '15px',
                                                backgroundColor: '#ffc107',
                                                borderRadius: '50%',
                                                marginRight: '10px',
                                                marginTop: '2px'
                                            }}></span>
                                            <h2>Order Confirmed on {new Date(order.createdAt).toLocaleDateString()}</h2>
                                        </>
                                    ) : null}
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p>No orders found.</p>
                )}
            </div>
        </div>
    );
};

export default MyOrders