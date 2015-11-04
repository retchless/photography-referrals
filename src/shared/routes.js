import { Route } from "react-router";  
import React from "react";

import AppHandler from "./components/AppHandler";
import ReferralForm from "./components/referralform/referralform"

export default (  
  <Route>
  	<Route handler={ ReferralForm } path="/submit" />
  	<Route handler={ AppHandler } path="/" />
  </Route>
);