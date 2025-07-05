import React from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { FaBoxOpen, FaUsers, FaUser, FaCrown, FaHeart, FaShoppingCart, FaHeadset, FaTags, FaTshirt, FaChartLine, FaCog } from "react-icons/fa";
import { BsPersonLock } from "react-icons/bs";
import { IoMdHeartEmpty } from "react-icons/io";
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { RiCustomerServiceLine } from "react-icons/ri";
import { LuBoxes } from "react-icons/lu";
import { MdOutlineCategory } from "react-icons/md";
import { PiTShirt } from "react-icons/pi";
import useInitializeUser from '../components/useInitializeUser';
import { AiFillDashboard } from "react-icons/ai";

const ProfilePage = () => {
  const { userInfo, loading } = useInitializeUser();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !userInfo) {
      router.push('/LoginPage'); // Redirect to login page if userInfo is null
    }
  }, [userInfo, loading, router]);

  if (loading || !userInfo) {
    return (
      <div className="profile-loading">
        <div className="profile-loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  const adminMenuItems = [
    {
      title: "Manage Users",
      description: "View and manage user accounts",
      icon: <FaUsers />,
      href: "/UsersList",
      color: "#667eea"
    },
    {
      title: "Manage Orders",
      description: "Track and update order status",
      icon: <LuBoxes />,
      href: "ManageOrders",
      color: "#10b981"
    },
    {
      title: "Categories",
      description: "Manage product categories",
      icon: <MdOutlineCategory />,
      href: "/CategoryList",
      color: "#f59e0b"
    },
    {
      title: "Products",
      description: "Add and manage products",
      icon: <PiTShirt />,
      href: "/AdminProductPage",
      color: "#ef4444"
    },
    {
      title: "Personal Information",
      description: "Update your profile details",
      icon: <BsPersonLock />,
      href: "/UpdateProfile",
      color: "#8b5cf6"
    },
    {
      title: "Admin Dashboard",
      description: "View analytics and insights",
      icon: <AiFillDashboard />,
      href: "/AdminDashboard",
      color: "#06b6d4"
    }
  ];

  const userMenuItems = [
    {
      title: "Personal Information",
      description: "Update your profile details",
      icon: <BsPersonLock />,
      href: "/UpdateProfile",
      color: "#667eea"
    },
    {
      title: "Your Orders",
      description: "View your order history",
      icon: <FaBoxOpen />,
      href: "/MyOrders",
      color: "#10b981"
    },
    {
      title: "Your Wishlist",
      description: "Manage your saved items",
      icon: <IoMdHeartEmpty />,
      href: "WishlistPage",
      color: "#ef4444"
    },
    {
      title: "Your Cart",
      description: "View your shopping cart",
      icon: <AiOutlineShoppingCart />,
      href: "/CartPage",
      color: "#f59e0b"
    },
    {
      title: "Contact Us",
      description: "Get help and support",
      icon: <RiCustomerServiceLine />,
      href: "/ContactUs",
      color: "#8b5cf6"
    }
  ];

  const menuItems = userInfo.isAdmin ? adminMenuItems : userMenuItems;

  return (
    <div className="profile-main-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-welcome">
            <div className="profile-avatar">
              {userInfo.isAdmin ? <FaCrown className="profile-avatar-icon admin" /> : <FaUser className="profile-avatar-icon" />}
            </div>
            <div className="profile-welcome-text">
              <h1 className="profile-title">Welcome back, {userInfo.username}!</h1>
              <p className="profile-subtitle">
                {userInfo.isAdmin ? "Admin Dashboard" : "Your Account Dashboard"}
              </p>
            </div>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-menu-grid">
            {menuItems.map((item, index) => (
              <Link href={item.href} key={index} className="profile-menu-item">
                <div className="profile-menu-icon" style={{ backgroundColor: item.color }}>
                  {item.icon}
                </div>
                <div className="profile-menu-content">
                  <h3 className="profile-menu-title">{item.title}</h3>
                  <p className="profile-menu-description">{item.description}</p>
                </div>
                <div className="profile-menu-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
