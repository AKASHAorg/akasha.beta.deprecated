import React, { Component, PropTypes } from 'react';

class Setup extends Component {
    componentDidMount () {
        const { appActions, settingsActions, eProcActions } = this.props;
        const timestamp = new Date().getTime();
        appActions.setTimestamp(timestamp);
        setTimeout(() => {
            eProcActions.getGethOptions();
            eProcActions.getIpfsConfig();
        }, 0);
        settingsActions.getSettings('flags');
        settingsActions.getSettings('geth');
        settingsActions.getSettings('ipfs');
    }

    render () {
        return (
          <div className="row">
            <div className="col-xs-6">
               {this.props.children}
            </div>
            <div className="col-xs-6">Setup Tutorials??</div>
          </div>
        );
    }
}

Setup.propTypes = {
    appActions: PropTypes.shape().isRequired,
    eProcActions: PropTypes.shape().isRequired,
    settingsActions: PropTypes.shape().isRequired,
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
