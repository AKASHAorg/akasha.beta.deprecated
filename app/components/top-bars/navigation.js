import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import { generalMessages } from '../../locale-data/messages';
import {
    navCounterDecrement,
    navCounterIncrement,
    toggleNavigationModal
} from '../../local-flux/actions/app-actions';
import { Icon } from '../';
import { appSelectors } from '../../local-flux/selectors';

class Navigation extends Component {
    goBack = disableBack => {
        if (disableBack) {
            return;
        }
        this.props.history.goBack();
        this.props.navCounterIncrement('forward');
        this.props.navCounterDecrement('back');
    };

    goForward = disableForward => {
        const { history } = this.props;
        if (disableForward) {
            return;
        }
        history.goForward();
        this.props.navCounterIncrement('back');
        this.props.navCounterDecrement('forward');
    };

    render () {
        const { intl, navigationBackCounter, navigationForwardCounter } = this.props;
        const disableBack = navigationBackCounter < 1;
        const disableForward = navigationForwardCounter < 1;
        const backBtnClassName = classNames('navigation__icon', {
            navigation__icon_disabled: disableBack,
            'content-link': !disableBack
        });
        const forwardBtnClassName = classNames('navigation__icon', {
            navigation__icon_disabled: disableForward,
            'content-link': !disableForward
        });

        return (
            <div className="flex-center-y navigation">
                <Tooltip mouseEnterDelay={ 0.3 } title={ intl.formatMessage(generalMessages.back) }>
                    <Icon className={ backBtnClassName } onClick={ () => this.goBack(disableBack) }
                          type="back"/>
                </Tooltip>
                <Tooltip mouseEnterDelay={ 0.3 }
                         title={ intl.formatMessage(generalMessages.forward) }>
                    <Icon
                        className={ forwardBtnClassName }
                        onClick={ () => this.goForward(disableForward) }
                        type="forward"
                    />
                </Tooltip>
                <Tooltip mouseEnterDelay={ 0.3 }
                         title={ intl.formatMessage(generalMessages.navigateToLink) }>
                    <Icon
                        className="content-link navigation__icon navigation__link-icon"
                        onClick={ this.props.toggleNavigationModal }
                        type="linkEntry"
                    />
                </Tooltip>
            </div>
        );
    }
}

Navigation.propTypes = {
    history: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    navigationBackCounter: PropTypes.number,
    navigationForwardCounter: PropTypes.number,
    navCounterDecrement: PropTypes.func.isRequired,
    navCounterIncrement: PropTypes.func.isRequired,
    toggleNavigationModal: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    navigationBackCounter: appSelectors.selectNavigationBackCounter(state),
    navigationForwardCounter: appSelectors.selectNavigationForwardCounter(state)
});

export default connect(
    mapStateToProps,
    {
        navCounterDecrement,
        navCounterIncrement,
        toggleNavigationModal
    }
)(withRouter(injectIntl(Navigation)));
