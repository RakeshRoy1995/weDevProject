import React from 'react';

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Dashboard from './user/Dashboard';
import Login from './user/Login';
import ForgetPassword from './user/ForgetPassword';
import Shops from './admin/Shops';
import Tags from './admin/Tags';
import AddShops from './admin/AddShops';
import AddTags from './admin/AddTags';
import EditTags from './admin/EditTags';
import EditShops from './admin/EditShops';


function AppRoutes() {

  var AuthUserToken = localStorage.getItem("AuthUserToken")
  return (
    <>
        <Switch>
          <Route exact path="/">
            <Dashboard />
          </Route>

          <Route exact path="/shops">
            <Shops />
          </Route>

          <Route exact path="/add-shops">
            <AddShops />
          </Route>

          <Route exact path="/edit-shops/:id">
            <EditShops />
          </Route>

          <Route exact path="/tags">
            <Tags />
          </Route>

          <Route exact path="/add-Tags">
            <AddTags />
          </Route>

          <Route exact path="/edit-tag/:id">
            <EditTags />
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
