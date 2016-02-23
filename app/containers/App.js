import React, { Component, PropTypes } from 'react';
import AkashaTheme from '../layouts/AkashaTheme';
import ThemeManager from 'material-ui/lib/styles/theme-manager';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  };

  static childContextTypes = {
    muiTheme: PropTypes.object
  };

  getChildContext () {
    return {
      muiTheme: ThemeManager.getMuiTheme(AkashaTheme)
    };
  }

  render () {
    return (
      <div className="fill-height">
        {this.props.children}
        {
          (() => {
            if (process.env.NODE_ENV !== 'production') {
              const DevTools = require('./DevTools');
              return <DevTools />;
            }
          })()
        }
      </div>
    );
  }
}
