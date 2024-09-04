import React from 'react'
import FAQ from '../components/FAQ';

const ContactUs = () => {
  return (
    <div className='contact-us-main-container'>
      <div className='contact-us-container'>
        <h1>CONTACT US</h1>
        <p>For any queries, please contact us at <b><i>dgencustomercare@gmail.com</i></b>. We will get back to you within 24 hours. Please refer the FAQ below and see if it answers your queries.</p>
      </div>
      <FAQ />
    </div>
  )
}

export default ContactUs