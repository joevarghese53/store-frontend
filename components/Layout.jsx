import React from 'react';
import Head from 'next/head';
import Footer from './Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar } from '.';
import useInitializeUser from '../components/useInitializeUser'; 


const Layout = ({ children }) => {
  useInitializeUser();
  return (
    <div className="layout">
      <Head>
        <title>DGen Store</title>
      </Head>
      <header>
        <Navbar />
      </header>
      <main className="main-container">
        {children}
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  )
}

export default Layout