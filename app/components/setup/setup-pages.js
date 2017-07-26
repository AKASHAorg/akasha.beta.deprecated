import React from 'react';
import { Route } from 'react-router-dom';
import { AuthContainer, ConfigurationContainer, NewIdentityContainer,
    SynchronizationContainer } from '../../containers';
import { SetupHeader, SetupHeaderSplit } from '../';

const SetupPages = () => (
  <div className="setup-pages">
    <div className="setup-pages__header">
      <Route path="/setup/configuration" component={SetupHeaderSplit} />
      <Route path="/setup/synchronization" component={SetupHeaderSplit} />
      <Route path="/setup/authenticate" component={SetupHeader} />
      <Route path="/setup/new-identity" component={SetupHeader} />
    </div>
    <div className="setup-pages__content">
      <Route path="/setup/configuration" component={ConfigurationContainer} />
      <Route path="/setup/synchronization" component={SynchronizationContainer} />
      <Route path="/setup/authenticate" component={AuthContainer} />
      <Route path="/setup/new-identity" component={NewIdentityContainer} />
    </div>
  </div>
);

export default SetupPages;
