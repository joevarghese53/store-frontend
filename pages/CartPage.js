import React from 'react';
import Cart from '../components/Cart';
import Link from "next/link";
import { useRouter } from 'next/router';
import useInitializeUser from '../components/useInitializeUser';



const CartPage = () => {
  const { userInfo, loading } = useInitializeUser();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !userInfo) {
      router.push('/LoginPage'); // Redirect to login page if userInfo is null
    }
  }, [userInfo, loading, router]);

  if (loading || !userInfo) {
    return <p>Loading...</p>; // You can replace this with a spinner or any loading indicator
  }

  return (
    <>
      {userInfo ? (
        <Cart />
      ) : (
        <div className="login-redirect">
          <h1>Please <Link href="/LoginPage">
            <span style={{ textDecoration: 'underline' }}>LOGIN</span>
          </Link> to view your cart</h1>
        </div>
      )}
    </>
  );
}

export default CartPage;
