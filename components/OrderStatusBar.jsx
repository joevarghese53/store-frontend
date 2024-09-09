import React from 'react';

const OrderStatusBar = ({ order }) => {
  // Extracting the status properties from the order
  const { isPaid, isShipped, isOutForDelivery, isDelivered } = order;

  // Mapping order status to the steps
  const statusSteps = [
    {
      label: 'Order Confirmed',
      date: order.paidAt ? new Date(order.paidAt).toDateString() : 'N/A',
      isCompleted: isPaid,
    },
    {
      label: 'Shipped',
      date: order.isShipped ? new Date(order.updatedAt).toDateString() : 'N/A',
      isCompleted: isShipped,
    },
    {
      label: 'Out for delivery',
      date: order.isOutForDelivery ? new Date(order.updatedAt).toDateString() : 'N/A',
      isCompleted: isOutForDelivery,
    },
    {
      label: 'Delivered',
      date: order.isDelivered ? new Date(order.updatedAt).toDateString() : 'N/A',
      isCompleted: isDelivered,
    },
  ];

  return (
    <div className="status-bar-container">
      <div className="status-bar">
        {statusSteps.map((step, index) => (
          <div key={index} className="status-step">
            <div className={`status-circle ${step.isCompleted ? 'completed' : ''}`}>
              <span className="status-checkmark">{step.isCompleted ? '✔' : ''}</span>
            </div>
            <div className="status-label">{step.label}</div>
            <div className="status-date">{step.date}</div>
            {index < statusSteps.length - 1 && (
              <div className={`status-line ${step.isCompleted ? 'completed' : ''}`}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStatusBar;
