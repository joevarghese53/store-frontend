import React from 'react';

const ContactUs = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Contact Us</h1>
      <p style={styles.description}>
        If you have any questions, feel free to reach out to us. We are here to help!
      </p>
      <form style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="name" style={styles.label}>Name</label>
          <input type="text" id="name" name="name" style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>Email</label>
          <input type="email" id="email" name="email" style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="message" style={styles.label}>Message</label>
          <textarea id="message" name="message" style={styles.textarea}></textarea>
        </div>
        <button type="submit" style={styles.button}>Send Message</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
  },
  heading: {
    fontSize: '2rem',
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333'
  },
  description: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#666'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '15px'
  },
  label: {
    marginBottom: '5px',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    minHeight: '100px'
  },
  button: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '1rem',
    cursor: 'pointer',
    alignSelf: 'center',
    transition: 'background-color 0.3s ease'
  },
  buttonHover: {
    backgroundColor: '#0056b3'
  }
};

export default ContactUs;
