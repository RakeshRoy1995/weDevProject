import React from 'react';

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Dashboard from './user/Dashboard';
import Login from './user/Login';
import ForgetPassword from './user/ForgetPassword';


function AppRoutes() {

  var AuthUserToken = localStorage.getItem("AuthUserToken")
  return (
    <>
        <Switch>
          <Route exact path="/">
            <Dashboard />
          </Route>

          <Route path="/sign-up">
            <ForgetPassword />
          </Route>

          <Route path="/login">
            <Login />
          </Route>

        </Switch>
    </>
  );
  
}

export default AppRoutes;
