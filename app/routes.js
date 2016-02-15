import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import MainLayout from './layouts/MainLayout';


export default (
  <Route path="/" component={App}>
    <Route component={MainLayout}>
      <IndexRoute component={HomePage}/>
      <Route path="register" component={HomePage} />
    </Route>
  </Route>
);
