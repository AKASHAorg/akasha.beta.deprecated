import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Modal } from 'antd';
import { generalMessages } from '../../locale-data/messages';
import { isInternalLink } from '../../utils/url-utils';

const NavigateAway = (props) => {
    const { intl, navigation, onClick } = props;
    if (navigation.get('isVisible') && isInternalLink(navigation.get('url'))) {
        onClick();
        window.location.href = navigation.get('url');
        return null;
    }

    return (
      <Modal
        onOk={() => {
            onClick();
            window.location.href = navigation.get('url');
        }}
        onCancel={() => onClick()}
        closable={false}
        visible={navigation.get('isVisible')}
        okText={intl.formatMessage(generalMessages.ok)}
        cancelText={intl.formatMessage(generalMessages.cancel)}
        title={intl.formatMessage(generalMessages.waitASecond)}
      >
        {intl.formatMessage(generalMessages.externalNavigationWarning)}
        <div className="navigate-away-modal__url">{navigation.get('url')}</div>
      </Modal>
    );
};

NavigateAway.propTypes = {
    intl: PropTypes.shape().isRequired,
    navigation: PropTypes.shape().isRequired,
    onClick: PropTypes.func.isRequired,
};

export default injectIntl(NavigateAway);
