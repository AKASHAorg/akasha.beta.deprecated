import React, { Component, PropTypes } from 'react';

class Setup extends Component {
    constructor (props) {
        super(props);
        this.state = {
            gethLogs: []
        };
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
    eProcActions: PropTypes.object.isRequired,
    setupActions: PropTypes.object.isRequired,
    settingsActions: PropTypes.object.isRequired,
    setupConfig: PropTypes.object.isRequired,
    style: PropTypes.object,
    intl: PropTypes.object,
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
