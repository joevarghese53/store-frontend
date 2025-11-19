import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { Layout } from '../components';
import '../styles/globals.css';
import store from "../redux/store";
import axios from 'axios';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

axios.defaults.withCredentials = true;
function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
        <Layout>
          <Toaster />
          <ToastContainer
            position='bottom-center'
            autoClose='2000'
            closeOnClick={true}
            pauseOnHover={false}
            pauseOnFocusLoss={false}
            closeButton={false}
            toastClassName="custom-toast"
            bodyClassName="custom-toast-body"
          />
          <Component {...pageProps} />
        </Layout>
    </Provider>
  )
}

export default MyApp