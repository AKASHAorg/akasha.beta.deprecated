import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { FlatButton } from 'material-ui';
import { LogoIcon } from 'shared-components/svg';
import { AppActions } from 'local-flux';

const buttonStyle = {
    width: '48px',
    height: '48px',
    minWidth: 'initial',
    borderRadius: '50%',
    marginRight: '10px'
};

class LogoButton extends Component {

    render () {
        const { appActions, logoStyle, viewBox, className } = this.props;
        return <FlatButton
          className={className}
          icon={<LogoIcon logoStyle={logoStyle} viewBox={viewBox} />}
          hoverColor="transparent"
          onClick={appActions.changeTheme}
          style={buttonStyle}
        />;
    }
}

LogoButton.propTypes = {
    appActions: PropTypes.shape().isRequired,
    logoStyle: PropTypes.shape(),
    viewBox: PropTypes.string,
    className: PropTypes.string
};

function mapStateToProps (state, ownProps) {
    return {};
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LogoButton);
