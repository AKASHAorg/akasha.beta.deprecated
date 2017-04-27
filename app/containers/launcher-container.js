import PropTypes from 'prop-types';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import PanelContainer from '../components/PanelContainer/panel-container';
import { PanelHeader } from '../shared-components';
import { ConfigurationContainer, SynchronizationContainer, AuthContainer,
  LogDetailsContainer, NewProfileContainer, NewProfileStatusContainer } from './';
import { setupMessages, generalMessages } from '../locale-data/messages';

const LauncherContainer = ({ intl, location }) => {
    const routes = [
        {
            path: '/setup/configuration',
            component: ConfigurationContainer,
            title: intl.formatMessage(setupMessages.configuration)
        }, {
            path: '/setup/synchronization',
            component: SynchronizationContainer,
            title: intl.formatMessage(setupMessages.synchronization)
        }, {
            path: '/setup/log-details',
            component: LogDetailsContainer,
            title: intl.formatMessage(setupMessages.logDetails)
        }, {
            path: '/setup/authenticate',
            component: AuthContainer,
            title: intl.formatMessage(setupMessages.login)
        }, {
            path: '/setup/new-identity',
            component: NewProfileContainer,
            title: intl.formatMessage(setupMessages.newIdentity)
        }, {
            path: '/setup/new-identity-status',
            component: NewProfileStatusContainer,
            title: intl.formatMessage(generalMessages.akasha)
        }
    ];
    const titleRoutes = routes.map(route => (
      <Route key={route.path} path={route.path} render={() => <h3>{route.title}</h3>} />
    ));
    const componentRoutes = routes.map(route => (
      <Route key={route.path} path={route.path} component={route.component} />
    ));
    return (
      <PanelContainer showBorder>
        <PanelHeader title={titleRoutes} />
        {location.pathname === '/setup' && <Redirect to={'/setup/configuration'} />}
        {componentRoutes}
      </PanelContainer>
    );
};

LauncherContainer.propTypes = {
    intl: PropTypes.shape(),
    location: PropTypes.shape()
};

export default injectIntl(LauncherContainer);
