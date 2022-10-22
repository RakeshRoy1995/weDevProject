import React, { useState } from 'react';
import { Link , useLocation  } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';

function Sidebar() {
    const [dropdownOpen, setOpen] = useState(false);
    function logout() {
      localStorage.removeItem('AuthUserToken')
      window.location.href = process.env.PORT
    }

  return (
    <>
    
    <div id="pgside">
        {/* (A1) BRANDING OR USER */}
        {/* LINK TO DASHBOARD OR LOGOUT */}
        <div id="pguser">
            <i className="txt">Shops ADMIN</i>
        </div>
        {/* (A2) MENU ITEMS */}
        <Link to="/shops" className="current">
            <i className="ico">★</i>
            <i className="txt">Shops</i>
        </Link>
        <Link to="/tags">
            <i className="ico">☀</i>
            <i className="txt">Tags</i>
        </Link>
        <Link to="#" onClick={logout}>
            <i className="ico">☉</i>
            <i className="txt">Logout</i>
        </Link>
    </div>


    </>
  );
}

export default Sidebar;
