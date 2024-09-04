import Link from 'next/link';
import React from 'react';
import { AiFillInstagram, AiFillFacebook } from 'react-icons/ai';

const phonepe = '/img/phonepe.png';

const Footer = () => {
  return (
    <div className="footer-container" >
      <div className='footer-container-title'>
        <h1>DGEN©</h1>
      </div>
      <div className="footer-row">
        <div className="footer-section">
          <h3>CUSTOMER SERVICE</h3>
          <Link href="/ContactUs"> Contact Us</Link>
          <Link href="/TrackOrder"> Track Order</Link>
          <Link href="/ContactUs"> Return policy</Link>
          <Link href="/ContactUs"> Cancellation policy</Link>
          <Link href="/ContactUs"> Cash on delivery</Link>
        </div>

        <div className="footer-section">
          <h3>COMPANY</h3>
          <Link href="/AboutUs"> About Us</Link>
          <Link href="/Hiring"> We're Hiring</Link>
          <Link href="/TandC"> Terms & Conditions</Link>
          <Link href="/PrivacyPolicy"> Privacy Policy</Link>
        </div>

        <div className="footer-section">
          <h3>CONNECT WITH US</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <AiFillFacebook size={24} />
            <AiFillInstagram size={24} />
          </div>
        </div>

        <div className="footer-section">
          <h3>100% SECURE PAYMENT</h3>
          <div className='phonepe-logo'>
            <img src={phonepe} id='phonepe-logo' />
          </div>

        </div>

        <div className="footer-section">
          <h3>KEEP UP TO DATE</h3>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input type="email" placeholder="Enter Email Id" style={{ padding: '10px', marginRight: '10px', marginLeft: '0px', border: 'none', borderRadius: '4px', width: '130px' }} />
            <button style={{ padding: '10px 20px', backgroundColor: '#FFD700', border: 'none', borderRadius: '4px', color: '#000' }}>Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
