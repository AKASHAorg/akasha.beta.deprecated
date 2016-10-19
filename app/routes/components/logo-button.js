import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { FlatButton } from 'material-ui';
import { LogoIcon } from 'shared-components/svg';
import { AppActions } from 'local-flux';

class LogoButton extends Component {

    render () {
        const { appActions } = this.props;
        return <FlatButton
          className="col-xs-1 start-xs"
          icon={<LogoIcon />}
          hoverColor="transparent"
          onClick={appActions.changeTheme}
          style={{ width: 'auto', minWidth: 'initial', borderRadius: '50%' }}
        />;
    }
}

LogoButton.propTypes = {
    appActions: PropTypes.shape().isRequired
};

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch)
    };
}

export default connect(null, mapDispatchToProps)(LogoButton);
