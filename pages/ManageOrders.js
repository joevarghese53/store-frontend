import React, { useState } from 'react';
import { useGetOrdersQuery } from '../redux/api/orderApiSlice'
import {useDeliveredOrderMutation,
    useShippedOrderMutation,
    useOutForDeliveryOrderMutation,} from '../redux/api/orderApiSlice'
import toast from 'react-hot-toast';

const ManageOrders = () => {

    const { data: ordersData, error, isLoading } = useGetOrdersQuery();
    console.log("orders : ", ordersData);

    const [searchTerm, setSearchTerm] = useState('');
    
    const [shippedOrder] = useShippedOrderMutation();
    const [outForDeliveryOrder] = useOutForDeliveryOrderMutation();
    const [deliveredOrder] = useDeliveredOrderMutation();

    const handleShipped = async (orderId) => {
        try {
            await shippedOrder(orderId).unwrap();
            toast.success("Item Shipped successfully");
        } catch (error) {
            toast.error(error?.data || error.message);
        }
    };

    const handleOutForDelivery = async (orderId) => {
        try {
            await outForDeliveryOrder(orderId).unwrap();
            toast.success("Item out for delivery successfully");
        } catch (error) {
            toast.error(error?.data || error.message);
        }
    };

    const handleDelivered = async (orderId) => {
        try {
            await deliveredOrder(orderId).unwrap();
            toast.success("Item delivered successfully");
        } catch (error) {
            toast.error(error?.data || error.message);
        }
    }; 
    
    const filteredOrders = ordersData?.filter((order) =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return (
        <div className="manage-orders-container">
            <header className="manage-orders-header">
                <h1 className="manage-orders-title">Order Management</h1>
                <div className="manage-orders-search-container">
                    <input
                        type="search"
                        placeholder="Search orders..."
                        className="manage-orders-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="manage-orders-search-icon">🔍</span>
                </div>
            </header>

            <div className="manage-orders-table-container">
                <table className="manage-orders-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Placed</th>
                            <th>Shipped</th>
                            <th>Out for Delivery</th>
                            <th>Delivered</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders?.length > 0 ? (
                            filteredOrders.map((order) => (
                                <tr key={order._id} className="manage-orders-table-row">
                                    <td>{order._id}</td>
                                    <td>{order.user.username}</td>
                                    <td>{order.paidAt ? new Date(order.paidAt).toDateString() : 'N/A'}</td>
                                    <td>{order.totalPrice}</td>
                                    <td><span className={order.isPaid ? 'manage-orders-status-true' : 'manage-orders-status-false'}>{order.isPaid ? '✓' : '×'}</span></td>
                                    <td><span className={order.isShipped ? 'manage-orders-status-true' : 'manage-orders-status-false'}>{order.isShipped ? '✓' : '×'}</span></td>
                                    <td><span className={order.isOutForDelivery ? 'manage-orders-status-true' : 'manage-orders-status-false'}>{order.isOutForDelivery ? '✓' : '×'}</span></td>
                                    <td><span className={order.isDelivered ? 'manage-orders-status-true' : 'manage-orders-status-false'}>{order.isDelivered ? '✓' : '×'}</span></td>
                                    <td>
                                        <div className="manage-orders-action-buttons">
                                            {!order.isShipped && (
                                                <button onClick={() => handleShipped(order._id)} className="manage-orders-ship-button">
                                                    Ship
                                                </button>
                                            )}
                                            {order.isShipped && !order.isOutForDelivery && (
                                                <button onClick={() => handleOutForDelivery(order._id)} className="manage-orders-delivery-button">
                                                    Out for Delivery
                                                </button>
                                            )}
                                            {order.isOutForDelivery && !order.isDelivered && (
                                                <button onClick={() => handleDelivered(order._id)} className="manage-orders-complete-button">
                                                    Mark Delivered
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))) : (
                            <p>No orders found.</p>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="manage-orders-pagination">
                <button className="manage-orders-pagination-button">&laquo; Previous</button>
                <button className="manage-orders-pagination-button manage-orders-active">1</button>
                <button className="manage-orders-pagination-button">2</button>
                <button className="manage-orders-pagination-button">3</button>
                <button className="manage-orders-pagination-button">Next &raquo;</button>
            </div>
        </div>
    )
}

export default ManageOrders;
