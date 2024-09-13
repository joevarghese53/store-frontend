import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { CgProfile } from "react-icons/cg";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FiBox } from "react-icons/fi";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import Link from 'next/link';
import { useSelector, useDispatch } from "react-redux";
import { logout } from '@/redux/features/auth/authSlice';
import { useLogoutMutation } from '../redux/api/usersApiSlice';


const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [scrolling, setScrolling] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);


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
        <div className="top-left-links">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation('/');
            }}
            className={router.pathname !== '/customs' ? 'active' : ''}
          >
            ORIGINALS
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation('/Customs');
            }}
            className={router.pathname === '/customs' ? 'active' : ''}
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
        <div className="nav-logo">
          <Link href="/"><img src="/logo.png" alt="Logo" /></Link>
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
          <Link href="/CartPage">
            <div className="cart-icon">
              <AiOutlineShoppingCart style={{ marginRight: '10px', marginBottom: '4px' }} />
              Cart
              {/* <span className="cart-item-qty">{totalQuantities}</span> */}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
