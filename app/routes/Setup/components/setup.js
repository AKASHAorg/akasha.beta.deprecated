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
          <div style={{ display: 'flex', padding: 0, overflow: 'hidden' }}>
            <div
              style={{
                  padding: 0,
                  flex: '5 5 auto',
                  maxWidth: '640px'
              }}
            >
              {this.props.children}
            </div>
            <div
              style={{
                  backgroundColor: theme === 'light' ? '#f3f3f3' : '#252525',
                  padding: 0,
                  flex: '7 7 auto'
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
