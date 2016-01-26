import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import LoginLayout from './layouts/LoginLayout';


export default (
  <Route path="/" component={App}>
    <Route component={LoginLayout}>
      <IndexRoute component={HomePage}/>
      <Route path="register" component={HomePage} />
    </Route>
  </Route>
);
