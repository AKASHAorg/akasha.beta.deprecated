import React, { Component, PropTypes } from 'react';
import AkashaTheme from '../layouts/AkashaTheme';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  };

  static childContextTypes = {
    muiTheme: PropTypes.object
  };

  getChildContext () {
    return {
      muiTheme: getMuiTheme(AkashaTheme)
    };
  }

  render () {
    return (
      <div className="fill-height" >
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
