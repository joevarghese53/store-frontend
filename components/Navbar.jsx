import React, { use, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { CgProfile } from "react-icons/cg";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FiBox } from "react-icons/fi";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import { RiCustomerService2Line } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import Link from 'next/link';
import { useSelector, useDispatch } from "react-redux";
import { logout } from '@/redux/features/auth/authSlice';
import { useLogoutMutation } from '../redux/api/usersApiSlice';
import { FaBars } from 'react-icons/fa';
import { IoArrowBack } from "react-icons/io5";


const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [scrolling, setScrolling] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [hamburgerOpen, setHamburgerOpen] = React.useState(false);


  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNavigation = (path) => {
    router.push(path);
  };

  const [logoutApiCall] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      router.push('/');
    } catch (error) {
      console.error('Error logging out user:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="navbar-container">
      <div className={`top-navbar ${scrolling ? 'hidden' : ''}`}>
        <div className="nav-logo-mobile">
          <Link href="/"><img src="/img/logo.png" alt="Logo" /></Link>
        </div>
        <div className="top-left-links">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation('/');
            }}
            className={router.pathname !== '/Customs' ? 'active' : ''}
          >
            ORIGINALS
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation('/Customs');
            }}
            className={router.pathname === '/Customs' ? 'active' : ''}
          >
            CUSTOMS
          </a>
        </div>
        <div className="top-right-links">
          <Link href="/MyOrders">Track Order</Link>
          <Link href="/ContactUs">Contact Us</Link>
        </div>
      </div>
      <div className="red-line"></div>
      <div className="bottom-navbar">
        {router.pathname === '/' || router.pathname === '/women' || router.pathname === '/Customs' ? (
          <div className="hamburger-menu" onClick={() => setHamburgerOpen(!hamburgerOpen)}>
            <FaBars size={20} />
          </div>
        ) : (
          <div className="back-button" onClick={() => router.back()}>
            <IoArrowBack size={20} />
          </div>
        )}


        {/* Overlay for hamburger menu */}
        {hamburgerOpen && (
          <div
            className="navbar-overlay"
            onClick={() => setHamburgerOpen(false)}
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0, 0, 0, 0.73)', zIndex: 999 }}
          />
        )}

        {userInfo && (
          <div className={`hamburger-menu-mobile ${hamburgerOpen ? 'open' : ''}`} >
            <div className="hamburger-menu-header">
              <div className="hamburger-menu-header-user-info">
                <div className="hamburger-menu-header-avatar">
                  {userInfo.username && userInfo.username.charAt(0).toUpperCase()}
                </div>
                <div className="hamburger-menu-header-welcome-text">
                  <span>Hello,</span>
                  <span className="hamburger-menu-header-user-name">{userInfo.username}</span>
                </div>
              </div>
            </div>
            <div className="hamburger-menu-links">
              <button onClick={() => setHamburgerOpen(false)} className='hamburger-menu-links-close-btn'><IoClose /></button>
              <Link href="/ProfilePage" className='hamburger-menu-link' onClick={() => setHamburgerOpen(false)}>
                <CgProfile className='hamburger-menu-icons' /> <span>MY PROFILE</span>
              </Link>
              <Link href="/MyOrders" className='hamburger-menu-link' onClick={() => setHamburgerOpen(false)}>
                <FiBox className='hamburger-menu-icons' /> <span>ORDERS</span>
              </Link>
              <Link href="/WishlistPage" className='hamburger-menu-link' onClick={() => setHamburgerOpen(false)}>
                <IoMdHeartEmpty className='hamburger-menu-icons' /> <span>WISHLIST</span>
              </Link>
              <Link href="/CartPage" className='hamburger-menu-link' onClick={() => setHamburgerOpen(false)}>
                <AiOutlineShoppingCart className='hamburger-menu-icons' /> <span>CART</span>
              </Link>
              <Link href="/ContactUs" className='hamburger-menu-link' onClick={() => setHamburgerOpen(false)}>
                <RiCustomerService2Line className='hamburger-menu-icons' /> <span>CONTACT US</span>
              </Link>

              <button onClick={handleLogout} className='logout-btn'>
                <IoIosLogOut className='hamburger-menu-logout-icon' />
                LOGOUT</button>
            </div>
          </div>
        )}
        {!userInfo && (
          <div className={`hamburger-menu-mobile ${hamburgerOpen ? 'open' : ''}`}>
            <div className="hamburger-menu-header">
              <div className="hamburger-menu-header-user-info">
                <div className="hamburger-menu-header-avatar">
                  G
                </div>
                <div className="hamburger-menu-header-welcome-text">
                  <span>Hello,</span>
                  <span className="hamburger-menu-header-user-name">Guest</span>
                </div>
              </div>
            </div>
            <div className="hamburger-menu-links">
              <button onClick={() => setHamburgerOpen(false)} className='hamburger-menu-links-close-btn'><IoClose /></button>
              <Link href="/LoginPage" className='hamburger-menu-link' onClick={() => setHamburgerOpen(false)}>
                <CgProfile className='hamburger-menu-icons' /> <span>Login</span>
              </Link>
              <Link href="/ContactUs" className='hamburger-menu-link' onClick={() => setHamburgerOpen(false)}>
                <RiCustomerService2Line className='hamburger-menu-icons' /> <span>Contact Us</span>
              </Link>
            </div>
          </div>
        )}

        <div className="nav-logo-desktop">
          <Link href="/"><img src="/img/logo.png" alt="Logo" /></Link>
        </div>
        <div className="bottom-left-links">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation('/');
            }}
            className={router.pathname === '/' || router.pathname === '/FilteredProductsMale' ? 'active' : ''}
          >
            MEN
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation('/women');
            }}
            className={router.pathname === '/women' || router.pathname === '/FilteredProductsFemale' ? 'active' : ''}
          >
            WOMEN
          </a>
        </div>

        <div className="bottom-right-links">
          {userInfo ? (
            <div
              className="profile-icon"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >

              <span style={{
                color: 'black',
                fontWeight: '600',
                fontSize: '18px',
                fontFamily: 'monospace',
                margin: '0 10px'
              }}>
                {userInfo.username}
              </span>
              <MdKeyboardArrowDown />
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link href="/ProfilePage">
                    <CgProfile style={{ marginRight: '10px' }} />
                    My Profile
                  </Link>
                  <Link href="/MyOrders">
                    <FiBox style={{ marginRight: '10px' }} />
                    Orders
                  </Link>
                  <Link href="/WishlistPage">
                    <IoMdHeartEmpty style={{ marginRight: '10px' }} />
                    WishList</Link>
                  <Link href="/CartPage">
                    <AiOutlineShoppingCart style={{ marginRight: '10px' }} />
                    Cart</Link>
                  <button onClick={handleLogout}>
                    <IoIosLogOut style={{ marginRight: '10px' }} />
                    Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/LoginPage">
              <div className="login-icon">
                Login
              </div>
            </Link>
          )}
          {userInfo && (
            <Link href="/WishlistPage">
              <div className="wishlist-icon-mobile">
                <IoMdHeartEmpty size={24} />
              </div>
            </Link>
          )}

          <Link href="/CartPage">
            <div className="cart-icon">
              <AiOutlineShoppingCart style={{ marginRight: '10px', marginBottom: '4px' }} />
              <span style={{ fontWeight: '600', fontFamily: "monospace" }}>Cart</span>
              {/* <span className="cart-item-qty">{totalQuantities}</span> */}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

