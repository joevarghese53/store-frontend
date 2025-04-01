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
                        <>
                            <div key={order._id} className="order-card">
                                <div className='order-card-top'>
                                    <div className='order-card-top-left'>
                                        <div className='order-card-top-left-1'>
                                            <div className='order-status'>
                                                {order.isDelivered ? (
                                                    <>
                                                        <p style={{ backgroundColor: '#28a745', paddingTop: '5px', paddingBottom: '5px', borderRadius: '16px', fontSize: '10px', paddingLeft: '10px', paddingRight: '10px' }}>Delivered</p>
                                                    </>
                                                ) : order.isOutForDelivery ? (
                                                    <>
                                                        <p style={{ backgroundColor: '#ff9800', paddingTop: '5px', paddingBottom: '5px', borderRadius: '16px', fontSize: '10px', paddingLeft: '10px', paddingRight: '10px' }}>Out For Delivery</p>
                                                    </>
                                                ) : order.isShipped ? (
                                                    <>
                                                        <p style={{ backgroundColor: '#17a2b8', paddingTop: '5px', paddingBottom: '5px', borderRadius: '16px', fontSize: '10px', paddingLeft: '10px', paddingRight: '10px' }}>Shipped</p>
                                                    </>
                                                ) : order.isPaid ? (
                                                    <>
                                                        <p style={{ backgroundColor: '#ffc107', paddingTop: '5px', paddingBottom: '5px', borderRadius: '16px', fontSize: '10px', paddingLeft: '10px', paddingRight: '10px' }}>Order Placed</p>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className='order-card-top-left-2'>
                                            {order.isDelivered ? (
                                                <>
                                                    <h2 style={{ marginLeft: '5px' }}>Order Delivered on {new Date(order.deliveredAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/(\d{2}) (\w{3}) (\d{4})/, '$1 $2, $3')}</h2>
                                                </>
                                            ) : order.isOutForDelivery ? (
                                                <>
                                                    <h2 style={{ marginLeft: '5px' }}>Order Out For Delivery on {new Date(order.outForDeliveryAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/(\d{2}) (\w{3}) (\d{4})/, '$1 $2, $3')}</h2>
                                                </>
                                            ) : order.isShipped ? (
                                                <>
                                                    <h2 style={{ marginLeft: '5px' }}>Order Shipped on {new Date(order.shippedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/(\d{2}) (\w{3}) (\d{4})/, '$1 $2, $3')}</h2>
                                                </>
                                            ) : order.isPaid ? (
                                                <>
                                                    <h2 style={{ marginLeft: '5px' }}>Order Confirmed on {new Date(order.paidAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/(\d{2}) (\w{3}) (\d{4})/, '$1 $2, $3')}</h2>
                                                </>
                                            ) : null}

                                        </div>
                                    </div>
                                    <div className='order-card-top-right'>
                                        <div className='order-price'>
                                            <p style={{ fontWeight: '600' }}>₹{order.totalPrice.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='order-card-middle'>
                                    {order.orderItems.map((item) => (
                                        <div className='order-card-item'>
                                            <div className='order-card-middle-left'>
                                                <img src={item.frontImage} alt={item.name} className="order-product-image" />
                                            </div>
                                            <div className='order-card-middle-right'>
                                                <div className='order-card-middle-right-1'>
                                                    <p style={{ fontWeight: '500', marginBottom: '0' }}>{item.name}</p>
                                                </div>
                                                <div className='order-card-middle-right-2'>
                                                    <p style={{color: 'grey', marginBottom: '30px'}}>{item.category}</p>
                                                </div>
                                                <div className='order-card-middle-right-3'>
                                                    <p>Size : {item.size}</p>
                                                    <p>Quantity : {item.qty}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className='order-card-bottom'>
                                    <Link href={{ pathname: '/OrderDetails', query: { order_id: order._id } }} key={order._id}>
                                        <button>
                                            Track Order
                                        </button>
                                    </Link>

                                </div>
                            </div>
                        </>
                    ))
                ) : (
                    <p>No orders found.</p>
                )}
            </div>
        </div>

    );
};

export default MyOrders