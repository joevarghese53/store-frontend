import React from 'react';
import { useGetOrderDetailsQuery } from '../redux/api/orderApiSlice';
import { useRouter } from 'next/router';
import OrderStatusBar from '@/components/OrderStatusBar';
import jsPDF from 'jspdf';
import Loader from '@/components/Loader';
import { MdOutlineEmail, MdOutlineLocalPhone } from "react-icons/md";
import { GrLocation } from "react-icons/gr";
import Link from 'next/link';
import { toast } from 'react-toastify'

const statusMap = {
  delivered: { label: 'Delivered', color: '#28a745' },
  outForDelivery: { label: 'Out For Delivery', color: '#ff9800' },
  shipped: { label: 'Shipped', color: '#17a2b8' },
  paid: { label: 'Order Placed', color: '#ffc107' },
};

const getOrderStatus = (order) => {
  if (order.isDelivered) return 'delivered';
  if (order.isOutForDelivery) return 'outForDelivery';
  if (order.isShipped) return 'shipped';
  if (order.isPaid) return 'paid';
  return null;
};

const getOrderDate = (order) => {
  if (order.isDelivered) return order.deliveredAt;
  if (order.isOutForDelivery) return order.outForDeliveryAt;
  if (order.isShipped) return order.shippedAt;
  if (order.isPaid) return order.paidAt;
  return null;
};

const getOrderDateLabel = (order) => {
  if (order.isDelivered) return 'Delivered on';
  if (order.isOutForDelivery) return 'Out For Delivery on';
  if (order.isShipped) return 'Shipped on';
  if (order.isPaid) return 'Confirmed on';
  return '';
};

const OrderDetails = () => {
  const router = useRouter();
  const { order_id: orderId, admin: admin } = router.query;
  const { data: orderDetails, error, isLoading } = useGetOrderDetailsQuery(orderId);

  const downloadImage = async (url, name) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = name;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      toast.error("Error downloading image");
    }
  };

  const generateInvoice = () => {
    if (!orderDetails) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Invoice', 20, 20);
    doc.setFontSize(12);
    doc.text(`Order ID: ${orderDetails._id}`, 20, 30);
    doc.text(`Date: ${new Date(orderDetails.createdAt).toLocaleDateString()}`, 20, 40);
    doc.text(`Transaction ID: ${orderDetails.paymentResult.transaction_id}`, 20, 50);
    doc.text(`Payment Status: ${orderDetails.paymentResult.state}`, 20, 60);
    doc.text('Shipping Address:', 20, 80);
    doc.text(`${orderDetails.shippingAddress.address}`, 20, 90);
    doc.text(`${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.postalCode}`, 20, 100);
    doc.text(`${orderDetails.shippingAddress.state}`, 20, 110);
    doc.text(`${orderDetails.shippingAddress.country}`, 20, 120);
    doc.text(`Phone: ${orderDetails.shippingAddress.phoneno}`, 20, 130);
    doc.text('Order Items:', 20, 140);
    orderDetails.orderItems.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item.name} (${item.category}) - Quantity: ${item.qty} - Price: ₹${item.price}`,
        20,
        150 + index * 10
      );
    });
    doc.text(`Items Price: ₹${orderDetails.itemsPrice}`, 20, 160 + orderDetails.orderItems.length * 10);
    doc.text(`Tax Price: ₹${orderDetails.taxPrice}`, 20, 170 + orderDetails.orderItems.length * 10);
    doc.text(`Total Price: ₹${orderDetails.totalPrice}`, 20, 180 + orderDetails.orderItems.length * 10);
    doc.save(`Invoice_${orderDetails._id}.pdf`);
  };

  return (
    <div className='order-details-main-container-bw'>
      {isLoading && (
        <div className="order-details-container-bw">
          <div className="order-details-loading-bw">
            <Loader />
          </div>
        </div>
      )}
      {error && (
        <div className="order-details-container-bw">
          <div className="order-details-error-bw">
            We are experiencing issues with server. We are working on it. Please come back again after some time
          </div>
        </div>
      )}
      {orderDetails && (
        <div className='order-details-container-bw'>
          <div className='order-details-left-bw'>
            <div className='order-details-header-bw'>
              <div className='order-details-header-row-bw'>
                <div className='order-details-status-badge-bw' style={{ background: statusMap[getOrderStatus(orderDetails)]?.color }}>
                  {statusMap[getOrderStatus(orderDetails)]?.label}
                </div>
                <div className='order-details-header-info-bw'>
                  <span className='order-details-header-date-bw'>
                    {getOrderDateLabel(orderDetails)}{' '}
                    {getOrderDate(orderDetails) && new Date(getOrderDate(orderDetails)).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    }).replace(/(\d{2}) (\w{3}) (\d{4})/, '$1 $2, $3')}
                  </span>
                </div>
              </div>
              <OrderStatusBar order={orderDetails} />
            </div>
            <div className='order-details-invoice-row-bw'>
              <button
                className='order-details-invoice-btn-bw'
                onClick={generateInvoice}
                disabled={!orderDetails.isDelivered}
              >
                Download Invoice
              </button>
              {!orderDetails.isDelivered && (
                <p className='order-details-invoice-note-bw'>Invoice will be available once the order is delivered.</p>
              )}
            </div>
            <div className='order-details-items-card-bw'>
              <h2 className='order-details-section-title-bw'>Order Items</h2>
              {orderDetails.orderItems.map((item) => (
                <div key={item.product} className="order-details-item-row-bw">
                  <div className='order-details-item-img-bw'>
                    <img src={item.frontImage} alt={item.name} />
                  </div>
                  <div className='order-details-item-info-bw'>
                    <div className='order-details-item-name-bw'>{item.name}</div>
                    <div className='order-details-item-meta-bw'>
                      <span>{item.category}</span>
                      <span>Size: {item.size}</span>
                      <span>Qty: {item.qty}</span>
                    </div>
                  </div>
                  <div className='order-details-item-price-bw'>₹{item.price}</div>
                  {admin && (
                    <div className="order-details-item-downloads-bw">
                      {item.frontImage && item.frontImage !== "undefined" && (
                        <button
                          className="order-details-download-btn-bw"
                          onClick={() => downloadImage(item.frontImage, `${item.name}-front.png`)}
                        >
                          Download Front Image
                        </button>
                      )}
                      {item.backImage && item.backImage !== "undefined" && (
                        <button
                          className="order-details-download-btn-bw"
                          onClick={() => downloadImage(item.backImage, `${item.name}-back.png`)}
                        >
                          Download Back Image
                        </button>
                      )}
                      {item.frontDesign && item.frontDesign !== "undefined" && (
                        <button
                          className="order-details-download-btn-bw"
                          onClick={() => downloadImage(item.frontDesign, `${item.name}-front-design.png`)}
                        >
                          Download Front Design
                        </button>
                      )}
                      {item.backDesign && item.backDesign !== "undefined" && (
                        <button
                          className="order-details-download-btn-bw"
                          onClick={() => downloadImage(item.backDesign, `${item.name}-back-design.png`)}
                        >
                          Download Back Design
                        </button>
                      )}
                      {item.frontUpload && item.frontUpload !== "undefined" && (
                        <button
                          className="order-details-download-btn-bw"
                          onClick={() => downloadImage(item.frontUpload, `${item.name}-front-upload.png`)}
                        >
                          Download Front Upload
                        </button>
                      )}
                      {item.backUpload && item.backUpload !== "undefined" && (
                        <button
                          className="order-details-download-btn-bw"
                          onClick={() => downloadImage(item.backUpload, `${item.name}-back-upload.png`)}
                        >
                          Download Back Upload
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <div className='order-details-summary-card-bw'>
                <div className='order-details-summary-row-bw'>
                  <span className='order-details-summary-label-bw'>Subtotal</span>
                  <span className='order-details-summary-value-bw'>₹{orderDetails.itemsPrice}</span>
                </div>
                <div className='order-details-summary-row-bw'>
                  <span className='order-details-summary-label-bw'>Shipping</span>
                  <span className='order-details-summary-value-bw'>₹{orderDetails.shippingPrice}</span>
                </div>
                <div className='order-details-summary-row-bw'>
                  <span className='order-details-summary-label-bw'>Tax</span>
                  <span className='order-details-summary-value-bw'>₹{orderDetails.taxPrice}</span>
                </div>
                <div className='order-details-summary-row-bw order-details-summary-total-bw'>
                  <span className='order-details-summary-label-bw'>Total</span>
                  <span className='order-details-summary-value-bw'>₹{orderDetails.totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
          <div className='order-details-right-bw'>
            <div className='order-details-info-card-bw'>
              <h2 className='order-details-section-title-bw'>Customer Information</h2>
              <div className='order-details-info-meta-bw'>
                <span className='order-details-info-label-bw'>Contact Details</span>
                <span className='order-details-info-value-bw'>{orderDetails.user.username}</span>
                <span className='order-details-info-value-bw'><MdOutlineEmail /> {orderDetails.user.email}</span>
                <span className='order-details-info-value-bw'><MdOutlineLocalPhone /> {orderDetails.shippingAddress.phoneno}</span>
              </div>
              <div className='order-details-info-divider-bw' />
              <span className='order-details-info-label-bw'>Shipping Address</span>
              <div className='order-details-info-address-bw'>
                <GrLocation className='order-details-info-location-icon-bw' />
                <span className='order-details-info-value-bw'>{`${orderDetails.shippingAddress.address}, ${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.postalCode}, ${orderDetails.shippingAddress.state}, ${orderDetails.shippingAddress.country}`}</span>
              </div>
            </div>
            <div className='order-details-info-card-bw'>
              <h2 className='order-details-section-title-bw'>Need Help?</h2>
              <Link href="/ContactUs">
                <button className='order-details-support-btn-bw'><MdOutlineLocalPhone /> Contact Support</button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
