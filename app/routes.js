import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import SetupPage from './containers/SetupPage';
import MainLayout from './layouts/MainLayout';
import LoginLayout from './layouts/LoginLayout';

export default (
  <Route path="/" component={App}>
    <Route component={LoginLayout}>
      <IndexRoute component={SetupPage}/>
      <Route path="register" component={SetupPage} />
    </Route>
  </Route>
);
