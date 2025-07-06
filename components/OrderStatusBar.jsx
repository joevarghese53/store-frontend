import React from 'react';

const GREEN = '#28a745';
const GREY = '#e0e0e0';

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

  // Find the last completed step index
  const lastCompletedIdx = statusSteps.map(s => s.isCompleted).lastIndexOf(true);

  return (
    <nav className="order-status-bar-modern" aria-label="Order progress">
      <ol className="order-status-bar-list">
        {statusSteps.map((step, idx) => {
          const isCompleted = idx <= lastCompletedIdx;
          return (
            <li className="order-status-bar-step" key={step.label}>
              <div className="order-status-bar-step-inner">
                <div
                  className={`order-status-bar-circle${isCompleted ? ' completed' : ''}`}
                  style={{ background: isCompleted ? GREEN : GREY, borderColor: isCompleted ? GREEN : GREY }}
                  aria-label={step.label + (isCompleted ? ' completed' : '')}
                  aria-current={isCompleted && idx === lastCompletedIdx ? 'step' : undefined}
                >
                  {isCompleted ? <span className="order-status-bar-check">✔</span> : <span className="order-status-bar-dot" />}
                </div>
                {/* Render the line after the circle for all except the last step */}
                {idx < statusSteps.length - 1 && (
                  <div
                    className={`order-status-bar-line${idx < lastCompletedIdx ? ' completed' : ''}`}
                    style={{ background: idx < lastCompletedIdx ? GREEN : GREY }}
                    aria-hidden="true"
                  />
                )}
              </div>
              <div className="order-status-bar-label">{step.label}</div>
              <div className="order-status-bar-date">{step.date}</div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default OrderStatusBar;
