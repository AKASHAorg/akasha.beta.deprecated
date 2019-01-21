import React from 'react';
import Route from 'react-router-dom/Route';
import { AuthContainer, ConfigurationContainer, NewIdentityContainer,
    SynchronizationContainer } from '../../containers';
import { NewIdentityInterests, ProfileComplete, SetupHeader, SetupHeaderSplit } from '../';

const SetupPages = () => (
  <div className="setup-pages">
    <div className="setup-pages__header">
      <Route path="/setup/configuration" component={SetupHeaderSplit} />
      {/* <Route path="/setup/synchronization" component={SetupHeaderSplit} /> */}
      <Route path="/setup/authenticate" component={SetupHeader} />
      <Route path="/setup/new-identity" component={SetupHeader} />
      <Route path="/setup/new-identity-interests" component={SetupHeader} />
      <Route path="/setup/profile-complete" component={SetupHeader} />
    </div>
    <div className="setup-pages__content">
      <Route path="/setup/configuration" component={ConfigurationContainer} />
      {/* <Route path="/setup/synchronization" component={SynchronizationContainer} /> */}
      <Route path="/setup/authenticate" component={AuthContainer} />
      <Route path="/setup/new-identity" component={NewIdentityContainer} />
      <Route path="/setup/new-identity-interests" component={NewIdentityInterests} />
      <Route path="/setup/profile-complete" component={ProfileComplete} />
    </div>
  </div>
);

export default SetupPages;
