import React from 'react';

import './assets/css/bootstrap.min.css';
// import './assets/css/style.css';  
// import './assets/css/media.css';
import './assets/css/admin.css';


import Navbar from './common/Navbar';
import Sidebar from './common/Sidebar';

import AppRoutes from './AppRoutes';
import { useHistory } from 'react-router';

function UserPanel() {

  var AuthUserToken = localStorage.getItem("AuthUserToken")
  const routerHistory = useHistory();
  
  if(window.location.pathname != "/login" && AuthUserToken != null){
    return (
      <div className='main'>
      <Sidebar />

      <main id="pgmain">

      <AppRoutes />
        
      </main>

      
      </div>
    );
  }else{
    routerHistory.push("login");
    return (
      <>
      <AppRoutes />
      </>
    );
  }
  
}

export default UserPanel;