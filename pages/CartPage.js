import React from 'react';
import Cart from '../components/Cart';
import Link from "next/link";
import { useRouter } from 'next/router';
import useInitializeUser from '../components/useInitializeUser';
import { FiShoppingCart } from 'react-icons/fi';

const CartPage = () => {
  const { userInfo, loading } = useInitializeUser();
  const router = useRouter();
  
  React.useEffect(() => {
    if (!loading && !userInfo) {
      router.push('/LoginPage');
    }
  }, [userInfo, loading, router]);

  if (loading) {
    return (
      <div className="cart-loading-container">
        <div className="cart-loading-spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="cart-login-redirect">
        <div className="cart-login-card">
          <FiShoppingCart className="cart-login-icon" />
          <h2>Please login to view your cart</h2>
          <p>Sign in to access your shopping cart and saved items</p>
          <Link href="/LoginPage" className="cart-login-button">
            Login to Continue
          </Link>
        </div>
      </div>
    );
  }

  return <Cart />;
}

export default CartPage;
