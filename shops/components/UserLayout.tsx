import Link from "next/link";
import React, { useState } from "react";
import Router from 'next/router'

const UserLayout  = ({children , BACKEND_URL}:any)  => {
  const [cart, setCart] = useState([]);
  const [reload, setreload] = useState(true);
  const [login, setLogin] = useState(false);
  setInterval(function() {
    setCart(children.props.store.getState().cart)
    setreload(!reload)
    if (localStorage.getItem("smallShoptoken")) {
      setLogin(true)
    }else{
      setLogin(false)
    }
  }, 1000);

  // const loginLogout = async(value:any) =>{
  //  if (value) {
  //   localStorage.removeItem("smallShoptoken")
  //  } else{
  //   Router.push('/login')
  //  }
  // }

  return (
    <>
        <div className="topbar section">
            <div className="main">
            <div className="language">
              <Link href="/login">
                <a> Login </a>
              </Link>
            </div>
            <div className="account">
                <ul>
                <li>
                  <Link href="/admin">
                    <a>Admin</a>
                  </Link>
                </li>
                <li>
                  <Link href="/my-order">
                    <a>My Account</a>
                  </Link>
                </li>
                </ul>
            </div>
            </div>
        </div>
        <div className="navarea section">
            <div className="main">
            <div className="nav-wrapper">
                <div className="site-logo">
                  <Link href="/">
                    <a>
                      <img src="assets/logo.png" alt="" />
                    </a>
                  </Link>
                </div>
                <div className="navbar desktop">
                <div className="dropdown">
                    <button className="dropbtn">Men</button>
                    <div className="dropdown-content">
                    <div className="row">
                        <div className="column">
                        <a href="#">Accessories</a>
                        <a href="#">Bags</a>
                        <a href="#">Caps &amp; Hats</a>
                        <a href="#">Hoddies</a>
                        <a href="#">Jackets &amp; Coats</a>
                        <a href="#">Jens</a>
                        <a href="#">Jewellery</a>
                        <a href="#">Jumpers &amp; Cardiganes</a>
                        <a href="#">Leather Jacket</a>
                        </div>
                        <div className="column">
                        <a href="#">Shirts</a>
                        <a href="#">Shoes</a>
                        <a href="#">Shorts</a>
                        <a href="#">Suits &amp;Blazers</a>
                        <a href="#">Sunglasses</a>
                        <a href="#">Sweatspants</a>
                        <a href="#">Swimware</a>
                        <a href="#">Trousers &amp; Chinos</a>
                        <a href="#">T-Shirts</a>
                        </div>
                        <div className="column">
                        <a href="#">Accessories</a>
                        <a href="#">Bags</a>
                        <a href="#">Caps &amp; Hats</a>
                        <a href="#">Hoddies</a>
                        <a href="#">Jackets &amp; Coats</a>
                        <a href="#">Jens</a>
                        <a href="#">Jewellery</a>
                        <a href="#">Jumpers &amp; Cardiganes</a>
                        <a href="#">Leather Jacket</a>
                        </div>
                    </div>
                    </div>
                </div>
                <a href="#">Women</a>
                <a href="#">About</a>
                <a href="#">Blog</a>
                <a href="#">Support</a>
                </div>
                <div className="dropdown mobile">
                <button className="dropbtn">
                    <i className="fa fa-bars" />
                </button>
                <div className="dropdown-content">
                    <a href="#">Men</a>
                    <a href="#">Women</a>
                    <a href="#">About</a>
                    <a href="#">Blog</a>
                    <a href="#">Support</a>
                </div>
                </div>
                <div className="cart">

                <Link href="/cart" >
                  <a>
                      <i className="fa fa-shopping-cart" aria-hidden="true" />
                      {
                        cart.length >0 ? cart.length : ""
                      }
                  </a>
                </Link>
                
                </div>
            </div>
            </div>
        </div>
        <div className="banner section">
            <div className="main">
            <h2>NEW SEASON ARRIVALS</h2>
            <h3>CHECK OUT ALL THE NEW TRENDS</h3>
            <a href="#">SHOP NOW</a>
            </div>
        </div>
        {children}

        <div className="footer-wrap section">
          <div className="footer section">
            <div className="main">
              <div className="column">
                <h3>Our Stores</h3>
                <p>
                  Mirpur - 10<br />
                  Dhaka <br />
                  <a href="tel:2137482411">0191656756</a>
                </p>
                <p className="address-bottom">
                  Dhanmondi <br />
                  Dhaka<br />
                  <a href="tel:2137482411">0191656756</a>
                </p>
                <div className="social-icon">
                  <ul>
                    <li>
                      <a href="#">
                        <i className="fa fa-facebook" aria-hidden="true" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fa fa-twitter" aria-hidden="true" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fa fa-google-plus" aria-hidden="true" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fa fa-vimeo" aria-hidden="true" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fa fa-rss" aria-hidden="true" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="column">
                <h3>Blog Posts</h3>
                <div className="blog">
                  <a href="#">In publishing and graphic design</a>
                  <p>
                    Lorem ipsum is a placeholder text commonly used to demonstrate the
                    visual form of a document
                  </p>
                </div>
                <div className="blog">
                  <a href="#">In publishing and graphic design</a>
                  <p>
                    Lorem ipsum is a placeholder text commonly used to demonstrate the
                    visual form of a document
                  </p>
                </div>
                <div className="blog">
                  <a href="#">In publishing and graphic design</a>
                  <p>
                    Lorem ipsum is a placeholder text commonly used to demonstrate the
                    visual form of a document
                  </p>
                </div>
              </div>
              <div className="column">
                <h3>Support</h3>
                <div className="support-menu">
                  <ul>
                    <li>
                      <a href="#">Terms &amp; Condition</a>
                    </li>
                    <li>
                      <a href="#">Services</a>
                    </li>
                    <li>
                      <a href="#">FAQ </a>
                    </li>
                    <li>
                      <a href="#">Press</a>
                    </li>
                    <li>
                      <a href="#">Payment</a>
                    </li>
                    <li>
                      <a href="#">Blog</a>
                    </li>
                    <li>
                      <a href="#">Refunds</a>
                    </li>
                    <li>
                      <a href="#">About Us</a>
                    </li>
                    <li>
                      <a href="#">Track Order</a>
                    </li>
                    <li>
                      <a href="#">Contact Us</a>
                    </li>
                    <li>
                      <a href="#">Services</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="copyright section">
            <div className="main">
              <hr />
              <div className="copyright-info">
                <p>
                  @2014 LASHOOPA.com - All Rights Reserved - Rakesh Roy
                </p>
              </div>
              <div className="company-icon">
                <a href="#">
                  <img src="assets/bank.png" alt="" />
                </a>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}


export default UserLayout;
