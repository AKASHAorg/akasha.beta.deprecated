import React, { Component, PropTypes } from 'react';

class Setup extends Component {
    componentDidMount () {
        const { settingsActions } = this.props;
        settingsActions.getSettings('flags');
        settingsActions.getSettings('geth');
        settingsActions.getSettings('ipfs');
    }

    render () {
        return (
          <div className="row">
            <div className="col-xs-5">
               {this.props.children}
            </div>
            <div className="col-xs-7">Setup Tutorials??</div>
          </div>
        );
    }
}

Setup.propTypes = {
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
