import axios from 'axios';
import cogoToast from 'cogo-toast';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Form } from 'reactstrap';
import { FrontURL } from '../Constant';
import './assets/css/admin.css';

function Sidebar() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    

  return (

    <div id="pgside">
        {/* (A1) BRANDING OR USER */}
        {/* LINK TO DASHBOARD OR LOGOUT */}
        <div id="pguser">
            <img src="potato.png" />
            <i className="txt">MY ADMIN</i>
        </div>
        {/* (A2) MENU ITEMS */}
        <a href="#" className="current">
            <i className="ico">★</i>
            <i className="txt">Section A</i>
        </a>
        <a href="#">
            <i className="ico">☀</i>
            <i className="txt">Section B</i>
        </a>
        <a href="#">
            <i className="ico">☉</i>
            <i className="txt">Section C</i>
        </a>
    </div>


  );
}

export default Sidebar;