import React, {Component, PropTypes} from 'react';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import { injectIntl } from 'react-intl';
import PanelContainer from '../components/PanelContainer/panel-container';
import { PanelHeader } from '../shared-components'
import { ConfigurationContainer, SynchronizationContainer, CreateProfileContainer } from './';

class LauncherContainer extends Component {
    routeConfig = [
      {
        path: `${this.props.match.url}/`,
        exact: true,
        component: props => <ConfigurationContainer {...props} />,
        title: () => <h4>Configuration</h4>
      },
      {
        path: `${this.props.match.url}/sync`,
        component: props => <SynchronizationContainer {...props} />,
        title: () => <h4>Synchronization</h4>
      },
      {
        path: `${this.props.match.url}/new-profile`,
        component: props => <CreateProfileContainer {...props} />,
        title: () => <h4>Create New Identity</h4>
      }
    ]
    render() {
        const { intl } = this.props;
        return (
          <PanelContainer
            showBorder
          >
            <PanelHeader
              title={
                <Switch>
                  {this.routeConfig.map((route, index) =>
                    <Route
                      key={index}
                      exact={route.exact}
                      component={route.title}
                    />
                  )}
                </Switch>
              }
            />
            <div>
              <Switch>
                {this.routeConfig.map((route, index) =>
                  <Route
                    key={index}
                    exact={route.exact}
                    component={route.component}
                  />
                )}
              </Switch>
            </div>
          </PanelContainer>
        );
    }
}
export default injectIntl(LauncherContainer);
