import React from 'react';
import Head from 'next/head';
import Footer from './Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar } from '.';
import Loader from './Loader';
import useInitializeUser from '../components/useInitializeUser';


const Layout = ({ children }) => {
  const { loading } = useInitializeUser();

  if (loading) {
    return (
      <div className="layout">
        <Loader />
      </div>
    );
  }

  return (
    <div className="layout">
      <Head>
        <title>Flow State</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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