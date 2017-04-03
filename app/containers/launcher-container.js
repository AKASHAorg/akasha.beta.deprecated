import React, { Component, PropTypes } from 'react';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import { injectIntl } from 'react-intl';
import PanelContainer from '../components/PanelContainer/panel-container';
import { PanelHeader } from '../shared-components';
import { ConfigurationContainer, SynchronizationContainer, AuthContainer,
  LogDetailsContainer, NewProfileContainer } from './';

const getRouteConfig = match =>
    [
        {
            path: `${match.url}`,
            exact: true,
            component: props => <ConfigurationContainer {...props} />,
            title: () => <h3>Configuration</h3>
        }, {
            path: '/sync',
            component: props => <SynchronizationContainer {...props} />,
            title: () => <h3>Synchronization</h3>
        }, {
            path: '/log-details',
            component: props => <LogDetailsContainer {...props} />,
            title: () => <h3>Log Details</h3>
        }, {
            path: '/authenticate',
            component: props => <AuthContainer {...props} />,
            title: () => <h3>Login</h3>
        }, {
            path: '/new-identity',
            component: props => <NewProfileContainer {...props} />,
            title: () => <h3>New Identity</h3>
        }
    ];

class LauncherContainer extends Component {
    componentWillMount () {
        this.titles = this.getRouteMap('title');
        this.components = this.getRouteMap('component');
    }
    getRouteMap = cFilter =>
        getRouteConfig(this.props.match).map((route, index) =>
          <Route
            path={route.path}
            component={route[cFilter]}
            key={`${index}-${cFilter}`} // eslint-disable-line react/no-array-index-key
            exact={route.exact}
          />
      )
    render () {
        return (
          <PanelContainer
            showBorder
          >
            <PanelHeader
              title={
                <Switch>
                  {this.titles}
                </Switch>
              }
            />
            <Switch>
              {this.components}
            </Switch>
          </PanelContainer>
        );
    }
}
LauncherContainer.propTypes = {
    match: PropTypes.shape()
};
export default injectIntl(LauncherContainer);
