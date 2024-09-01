import React from 'react';
import Cart from '../components/Cart';
import { useSelector } from "react-redux";
import Link from "next/link";

const CartPage = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <>
      {userInfo ? (
        <Cart />
      ) : (
        <div className="cart-page-not-logged-in">
          <h1>Please <Link href="/LoginPage">
            <span style={{ textDecoration: 'underline' }}>LOGIN</span>
          </Link> to view your cart</h1>
        </div>
      )}
    </>
  );
}

export default CartPage;
