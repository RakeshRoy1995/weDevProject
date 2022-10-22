import React, { useState } from 'react';
import { Link , useLocation  } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';

function Sidebar() {
    const location = useLocation();

    const [dropdownOpen, setOpen] = useState(false);
    const toggle = () => setOpen(!dropdownOpen); 

  return (
    <>
    
    <div className="main_nav">
    </div>


    </>
  );
}

export default Sidebar;
