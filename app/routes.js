import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import SetupPage from './containers/SetupPage';
import SyncStatus from './containers/SyncStatus';
import LoginLayout from './layouts/LoginLayout';
import LoginPage from './containers/LoginPage';
import HomeLayout from './layouts/HomeLayout';
import NewEntryPage from './containers/NewEntryPage';
import StreamPage from './containers/StreamPage';

import {
  CreateProfile,
  CreateProfileStatus,
  CreateProfileComplete
} from './containers/CreateProfile';

export default (
  <Route component={App} path="/" >
    <Route component={LoginLayout} >
      <IndexRoute component={SetupPage} />
      <Route component={SetupPage} path="setup-options" />
      <Route component={SyncStatus} path="sync-status" />
      <Route component={LoginPage} path="authenticate" />
      <Route component={CreateProfile} path="new-profile" />
      <Route component={CreateProfileStatus} path="new-profile-status" />
      <Route component={CreateProfileComplete} path="new-profile-complete" />
    </Route>
    <Route component={HomeLayout} path=":username" >
      <IndexRoute component={StreamPage} />
      <Route component={NewEntryPage} path="new-entry" />
      <Route component={NewEntryPage} path="drafts/:draftId" />
    </Route>
  </Route>
);
