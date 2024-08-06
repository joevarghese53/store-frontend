import React from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

const ProfilePage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const router = useRouter();

  React.useEffect(() => {
    if (!userInfo) {
      router.push('/'); // Redirect to login page if userInfo is null
    }
  }, [userInfo, router]);

  if (!userInfo) {
    return <p>Loading...</p>; // You can replace this with a spinner or any loading indicator
  }

  return (
    <div className="account-container">
      <h1 className="account-heading">My Account</h1>
      <div className="account-nav">
        {userInfo.isAdmin ? (
          <>
            <Link href="/UsersList" className="account-navItem">Users</Link>
            <Link href="#" className="account-navItem">Orders</Link>
            <Link href="/CategoryList" className="account-navItem">Categories</Link>
            <Link href="/AdminProductPage" className="account-navItem">Products</Link>
            <Link href="/UpdateProfile" className="account-navItem">My Profile</Link>
            <Link href="#" className="account-navItem">Marketing and Promotions</Link>
            <Link href="#" className="account-navItem">Customer Support</Link>
          </>
        ) : (
          <>
            <Link href="#" className="account-navItem">My Orders</Link>
            <Link href="#" className="account-navItem">My Payments</Link>
            <Link href="#" className="account-navItem">My Addresses</Link>
            <Link href="/UpdateProfile" className="account-navItem">My Profile</Link>
            <Link href="#" className="account-navItem">My Wishlist</Link>
            <Link href="#" className="account-navItem">Refer and Earn</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
