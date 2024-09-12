import React from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { FaBoxOpen, FaUsers } from "react-icons/fa6";
import { BsPersonLock } from "react-icons/bs";
import { IoMdHeartEmpty } from "react-icons/io";
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { RiCustomerServiceLine } from "react-icons/ri";
import { LuBoxes } from "react-icons/lu";
import { MdOutlineCategory } from "react-icons/md";
import { PiTShirt } from "react-icons/pi";
import useInitializeUser from '../components/useInitializeUser';


const ProfilePage = () => {
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
    <div className="account-container">
      <h1 className="account-heading">Hello, {userInfo.username}</h1>
      <div className="account-nav">
        {userInfo.isAdmin ? (
          <>
            <Link href="/UsersList" className="account-navItem">
            <FaUsers className="account-navIcon" />
            Manage Users</Link>
            <Link href="ManageOrders" className="account-navItem">
            <LuBoxes className="account-navIcon" />
            Manage Orders</Link>
            <Link href="/CategoryList" className="account-navItem">
            <MdOutlineCategory className="account-navIcon" />
            Categories</Link>
            <Link href="/AdminProductPage" className="account-navItem">
            <PiTShirt className="account-navIcon" />
            Products</Link>
            <Link href="/UpdateProfile" className="account-navItem">
            <BsPersonLock className="account-navIcon" />
            Personal Information</Link>
          </>
        ) : (
          <>
            <Link href="/UpdateProfile" className="account-navItem">
              <BsPersonLock className="account-navIcon" />
              Personal Information</Link>
            <Link href="/MyOrders" className="account-navItem">
              <FaBoxOpen className="account-navIcon" />
              Your Orders</Link>
            <Link href="WishlistPage" className="account-navItem">
            <IoMdHeartEmpty className="account-navIcon" />
            Your Wishlist</Link>
            <Link href="/CartPage" className="account-navItem">
              <AiOutlineShoppingCart className="account-navIcon" />
            Your Cart</Link>
            <Link href="/ContactUs" className="account-navItem">
              <RiCustomerServiceLine className="account-navIcon" />
            Contact Us</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
