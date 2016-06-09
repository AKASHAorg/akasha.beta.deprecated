import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as settingsActions from '../actions/SettingsActions';
import AkashaTheme from '../layouts/AkashaTheme';
import { getMuiTheme } from 'material-ui/styles';

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
    componentWillMount () {
        // check if geth settings are already stored
    }
    render () {
        return (
          <div className="fill-height" >
                {this.props.children}
                {(process.env.NODE_ENV !== 'production') &&
                    React.createElement(require('./DevTools'))
                }
          </div>
        );
    }
}
