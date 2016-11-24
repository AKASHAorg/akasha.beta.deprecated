import React, { Component, PropTypes } from 'react';
import { Tutorials } from 'shared-components';

class Setup extends Component {
    componentDidMount () {
        const { settingsActions } = this.props;
        settingsActions.getSettings('flags');
        settingsActions.getSettings('geth');
        settingsActions.getSettings('ipfs');
    }

    render () {
        const { theme } = this.props;
        return (
          <div className="col-xs-12" style={{ padding: 0 }}>
            <div
              className="col-xs-5"
              style={{
                  padding: 0
              }}
            >
              {this.props.children}
            </div>
            <div
              className="col-xs-7"
              style={{
                  backgroundColor: theme === 'light' ? '#f3f3f3' : '#252525',
                  padding: 0
              }}
            >
              <Tutorials theme={theme} />
            </div>
          </div>
        );
    }
}

Setup.propTypes = {
    settingsActions: PropTypes.shape().isRequired,
    children: PropTypes.element,
    theme: PropTypes.string
};

Setup.contextTypes = {
    muiTheme: React.PropTypes.object,
    router: React.PropTypes.object
};

Setup.defaultProps = {
    style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
    }
};

export default Setup;
