import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import SetupPage from './containers/SetupPage';
import SyncStatus from './containers/SyncStatus';
import LoginLayout from './layouts/LoginLayout';
import CreateProfile from './containers/CreateProfile';
import CreateProfileStatus from './containers/CreateProfileStatus';
import LoginPage from './containers/LoginPage';


export default (
  <Route component={App} path="/">
    <Route component={LoginLayout}>
      <IndexRoute component={SetupPage} />
      <Route component={SetupPage} path="setup-options" />
      <Route component={SyncStatus} path="sync-status" />
      <Route component={LoginPage} path="authenticate" />
      <Route component={CreateProfile} path="new-profile" />
      <Route component={CreateProfileStatus} path="new-profile-status" />
    </Route>
  </Route>
);
