import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './routes/AppContainer';
import SetupPage from './containers/SetupPage';
import SyncStatus from './containers/SyncStatus';
import Login from './layouts/LoginLayout';
import LoginPage from './containers/LoginPage';
import Home from './layouts/HomeLayout';
import NewEntryPage from './containers/NewEntryPage';
import PublishEntryPanel from './containers/PublishEntryPanel';
import StreamPage from './containers/StreamPage';

import {
  CreateProfile,
  CreateProfileStatus,
  CreateProfileComplete
} from './containers/CreateProfile';

export default (
  <Route component={App} path="/" >
    <IndexRoute component={BootApp} />
    <Route component={Setup}>
      <IndexRoute component={Configuration} />
      <Route component={Synchronization} path="sync-status" />
    </Route>
    <Route component={Login}>
      <IndexRoute component={LoginPage} path="authenticate" />
      <Route component={CreateProfile} path="new-profile" />
      <Route component={CreateProfileStatus} path="new-profile-status" />
      <Route component={CreateProfileComplete} path="new-profile-complete" />
    </Route>
    <Route component={Home} path=":username" >
      <IndexRoute component={StreamPage} />
      <Route component={NewEntryPage} path="draft/:draftId">
        <Route component={PublishEntryPanel} path="publish"/>
      </Route>
    </Route>
  </Route>
);
