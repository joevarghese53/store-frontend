import React from 'react'
import FAQ from '../components/FAQ';
import { MdEmail } from 'react-icons/md';

const ContactUs = () => {
  return (
    <div className='contact-us-main-container'>
      <div className='contact-us-container'>
        <h1>Contact Us</h1>
        <p>
          For any queries, please contact us at
          <span className="contact-us-email">
            <MdEmail style={{ marginRight: '8px', fontSize: '1.2em' }} />
            info@flowstateproject.in
          </span>
          <br />
          We will get back to you within 24 hours. Please refer to the FAQ below and see if it answers your queries.
        </p>
      </div>
      <hr className="contact-us-divider" />
      <FAQ />
    </div>
  )
}

export default ContactUs