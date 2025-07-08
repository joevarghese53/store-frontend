import React from 'react';
import Collapsible from 'react-collapsible';

const FAQ = () => {
    // Define the FAQ data with categories
    const faqData = [
        {
            category: 'ORDERS, SHIPPING & PAYMENT',
            faqs: [
                {
                    question: 'How do I check the status of my order?',
                    answer: ' • You can check the status of your order by clicking \'Track Order\' on the Flow State© page post account login. Once your order is placed, we will send you confirmation of your order details by e-mail. Your tracking link may take up to 24 hours from shipping date to get activated. Incase of any unusual event which delays your order, you will receive an update from us.'
                },
                {
                    question: 'What are the charges that will apply on my order?',
                    answer: ' • Shipping charges will be applicable on orders based on the geographical location. Shipping charges will be displayed at the time of checkout. Shipping charges are non-refundable. The price of the products you see is inclusive of taxes.'
                },
                {
                    question: 'How do I know if my order was successfully placed?',
                    answer: ' • Once your order is placed you will be directed to the order confirmation page. You can find details of your order on App/Web under track order/My Orders. E-mail confirmation is sent to your registered e-mail id.'
                },
                {
                    question: 'Why can\'t I see the COD option?',
                    answer: ' • COD option is not available currently. We are working on it and will be available soon.'
                },
                {
                    question: 'I am unable to add products to my Bag.',
                    answer: ' • Please clear cache, cookies and update the app and try again. If the issue persists, You can contact us at flowstateprojectinfo@gmail.com.'
                },
                {
                    question: 'I tried to make a transaction, but it failed. What do I do?',
                    answer: ' • If the amount has been deducted from your bank or card, don\'t worry; it will be refunded to the same account within 3-5 business days. Meanwhile, please wait a while and try again. If the issue persists, please contact us at flowstateprojectinfo@gmail.com.'
                },
                {
                    question: 'How long will it take to receive my order?',
                    answer: ' • The estimated delivery time is 7-10 business days. This is an estimate and delivery times may vary according to the print on demand service provider and delivery partner. You can track your order by clicking on the \'Track Order\' option on the Flow State© page post account login.'
                },
            ],
        },
        {
            category: 'Cancellations & Returns',
            faqs: [
                {
                    question: 'Cancellation Policy',
                    answer: ' • Since our products are made to order, we do not offer cancellations. If you have any issues with your order, please contact our customer service team, and we will work with you to resolve the issue.'
                },
                {
                    question: 'Return and Refund Policy',
                    answer: ' • Since our products are made to order, we do not offer returns or refunds. If there is an issue with your order, such as a defect or incorrect item, please contact our customer service team, and we will work with you to resolve the issue. Please note that we require video evidence of the issue taken during initial unboxing to process a return or refund.'
                },
            ],
        },
        // Add more categories and questions as needed
    ];

    return (
        <div className="faq-container">
            <h1>FAQs</h1>
            <div className="faq-categories">
                {faqData.map((category, index) => (
                    <div key={index} className="faq-category">
                        <h2>{category.category}</h2>
                        <div className="faq-list">
                            {category.faqs.map((faq, idx) => (
                                <Collapsible key={idx} trigger={faq.question}>
                                    <p>{faq.answer}</p>
                                </Collapsible>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQ;
