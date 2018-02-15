import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Checkbox, Modal } from 'antd';
import { generalMessages } from '../../locale-data/messages';
import { isInternalLink } from '../../utils/url-utils';
import { parseUrl } from '../../utils/parsers/parser-utils';

class NavigateAway extends Component {
    state = {
        trustedDomain: false,
        redirect: false
    }
    componentWillReceiveProps (nextProps) {
        const { navigation } = nextProps;
        if (navigation.get('isVisible') && navigation.get('url') &&
            (isInternalLink(navigation.get('url')) || navigation.get('isTrusted'))) {
            this.setState({ redirect: true });
            this.props.onClick();
        }
        if (!navigation.get('isVisible')) {
            this.setState({ redirect: false });
        }
    }

    changeCheckbox = (e) => {
        this.setState({ trustedDomain: e.target.checked });
    }

    handleOk = () => {
        const { userSettingsAddTrustedDomain, navigation, onClick, loggedEthAddress } = this.props;
        const domain = parseUrl(navigation.get('url')).hostname;
        if (this.state.trustedDomain) {
            userSettingsAddTrustedDomain(loggedEthAddress, domain);
        }
        onClick();
        window.location.href = navigation.get('url');
        this.setState({ trustedDomain: false });
    }

    handleCancel = () => {
        this.props.onClick();
        this.setState({ trustedDomain: false });
    }

    render () {
        const { intl, navigation } = this.props;
        if (this.state.redirect) {
            window.location.href = navigation.get('url');
            return null;
        }

        return (
          <Modal
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            closable={false}
            visible={navigation.get('isVisible')}
            okText={intl.formatMessage(generalMessages.ok)}
            cancelText={intl.formatMessage(generalMessages.cancel)}
            title={intl.formatMessage(generalMessages.waitASecond)}
          >
            {intl.formatMessage(generalMessages.externalNavigationWarning)}
            <div className="navigate-away-modal__url">{navigation.get('url')}</div>
            <Checkbox
              value={this.state.trustedDomain}
              onChange={this.changeCheckbox}
            >
              {intl.formatMessage(generalMessages.trustedDomain)}
            </Checkbox>
          </Modal>
        );
    }
}

NavigateAway.propTypes = {
    userSettingsAddTrustedDomain: PropTypes.func,
    intl: PropTypes.shape().isRequired,
    loggedEthAddress: PropTypes.string,
    navigation: PropTypes.shape().isRequired,
    onClick: PropTypes.func.isRequired,
};

export default injectIntl(NavigateAway);
