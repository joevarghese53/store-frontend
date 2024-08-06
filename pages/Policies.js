import React from 'react';
import Head from 'next/head';

const Policies = () => {
  return (
    <>
      <Head>
        <title>Policies</title>
        <meta name="description" content="Shipping Policy, Privacy Policy, and Return & Refund Policy" />
      </Head>
      <div className='policies-main-container'>
        <h1>Policies</h1>
        
        <section>
          <h2>Shipping Policy</h2>
          <p>
            Our shipping is handled by a third-party service. Once your order is processed and printed, it will be shipped directly to the address you provided during checkout. 
            Shipping times and costs may vary based on your location  chosen at checkout.
          </p>
        </section>
        
        <section>
          <h2>Privacy Policy</h2>
          <p>
            We value your privacy and are committed to protecting your personal information. 
            We collect information necessary to process your orders and improve your shopping experience. 
            Your data is securely stored and will not be shared with third parties except as required to fulfill your order or as required by law.
          </p>
        </section>
        
        <section>
          <h2>Return and Refund Policy</h2>
          <p>
            Since our products are made to order, we do not offer returns or refunds. 
            If there is an issue with your order, such as a defect or incorrect item, please contact our customer service team, and we will work with you to resolve the issue.
          </p>
        </section>
      </div>
    </>
  );
};

export default Policies;
