import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Button, Checkbox, Modal } from 'antd';
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
            closable
            onCancel={this.handleCancel}
            onOk={this.handleOk}
            visible={navigation.get('isVisible')}
            footer={null}
            title={intl.formatMessage(generalMessages.waitASecond)}
            wrapClassName="navigate-away-modal"
          >
            <div className="navigate-away-modal__warn">
              <div>{intl.formatMessage(generalMessages.externalNavigationWarning)}</div>
              <div>{intl.formatMessage(generalMessages.externalNavigationAreYouSure)}</div>
            </div>
            <div className="navigate-away-modal__url">{navigation.get('url')}</div>
            <div className="navigate-away-modal__custom-footer">
              <div className="navigate-away-modal__checkbox">
                <Checkbox
                  checked={this.state.trustedDomain}
                  onChange={this.changeCheckbox}
                >
                  {intl.formatMessage(generalMessages.trustedDomain)}
                </Checkbox>
              </div>
              <div className="navigate-away-modal__footer-btns">
                <div className="navigate-away-modal__cancel-btn">
                  <Button key="back" onClick={this.handleCancel}>
                    {intl.formatMessage(generalMessages.cancel)}
                  </Button>
                </div>
                <Button key="submit" type="primary" onClick={this.handleOk}>
                  {intl.formatMessage(generalMessages.confirm)}
                </Button>
              </div>
            </div>
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
