import React, { useState, useEffect } from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu } from 'reactstrap'; 
import cellPhoneImg from '../assets/images/cellPhone.png'; 
import userImg from '../assets/images/user.png'; 
import {UploadToS3} from './UploadS3';
import logImg from '../assets/images/log.png';
import { Link, useHistory } from 'react-router-dom';
import { FrontURL, S3KEY } from '../Constant';
import axios from "axios";
import cogoToast from "cogo-toast";
import { Modal  } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { userInfo } from '../actions/index'


function Navbar() {
  

    useEffect(() => {
        // fetchData()
    } , []);

    


  return (
    <>
  <header id="header" className="d-flex align-items-center">
    <div className="container d-flex align-items-center justify-content-between">
      <div className="logo">
        <h1 className="text-light">
          <a href="#">
            <span>Shop</span>
          </a>
        </h1>
        {/* Uncomment below if you prefer to use an image logo */}
        {/* <a href="index.html"><img src="assets/img/logo.png" alt="" class="img-fluid"></a>*/}
      </div>
      <nav id="navbar" className="navbar">
        <ul>
          <li>
            <a className="nav-link scrollto active" href="#">
              Home
            </a>
          </li>
        </ul>
        <i className="bi bi-list mobile-nav-toggle" />
      </nav>
      {/* .navbar */}
    </div>
  </header>
  {/* End Header */}
</>

  );
}

export default Navbar;
