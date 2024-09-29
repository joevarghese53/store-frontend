import React from 'react'
import { useGetMyOrdersQuery } from '../redux/api/orderApiSlice'
import Link from 'next/link';
import Loader from '../components/Loader';
import { useRouter } from 'next/router';
import useInitializeUser from '../components/useInitializeUser';




const MyOrders = () => {

    const { data: orders, error, isLoading } = useGetMyOrdersQuery()
    console.log('Orders : ', orders)

    const { userInfo, loading } = useInitializeUser();
    const router = useRouter();

    React.useEffect(() => {
        if (!loading && !userInfo) {
            router.push('/LoginPage'); // Redirect to login page if userInfo is null
        }
    }, [userInfo, loading, router]);

    if (loading || !userInfo) {
        return <p>Loading...</p>; // You can replace this with a spinner or any loading indicator
    }
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
        }}>No orders😢</p>
    </div>);

    return (
        <div className="orders-container">
            <h2>My Orders</h2>
            <div className="orders-grid">
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
                                                backgroundColor: '#28a745',
                                                borderRadius: '50%',
                                                marginRight: '10px',
                                                marginTop: '2px'
                                            }}></span>
                                            <h2>Order Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</h2>
                                        </>
                                    ) : order.isOutForDelivery ? (
                                        <>
                                            <span style={{
                                                display: 'inline-block',
                                                width: '15px',
                                                height: '15px',
                                                backgroundColor: '#ff9800',
                                                borderRadius: '50%',
                                                marginRight: '10px',
                                                marginTop: '2px'
                                            }}></span>
                                            <h2>Order Out For Delivery on {new Date(order.outForDeliveryAt).toLocaleDateString()}</h2>
                                        </>
                                    ) : order.isShipped ? (
                                        <>
                                            <span style={{
                                                display: 'inline-block',
                                                width: '15px',
                                                height: '15px',
                                                backgroundColor: '#17a2b8',
                                                borderRadius: '50%',
                                                marginRight: '10px',
                                                marginTop: '2px'
                                            }}></span>
                                            <h2>Order Shipped on {new Date(order.shippedAt).toLocaleDateString()}</h2>
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
                                            <h2>Order Confirmed on {new Date(order.paidAt).toLocaleDateString()}</h2>
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