import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Modal, Tooltip } from 'antd';
import { Icon, UrlInput } from '../';
import { showNotification } from '../../local-flux/actions/app-actions';
import { formMessages, generalMessages } from '../../locale-data/messages';

class ShareLinkModal extends Component {
    state = { visible: false };

    toggleModal = () => {
        this.setState(prevState => ({ visible: !prevState.visible }));
    };

    render () {
        const { intl, url, withLabel } = this.props;
        return (
            <div className="flex-center-y share-link-modal__container">
                <div className="flex-center-y" onClick={ this.toggleModal }>
                    <Tooltip
                        mouseEnterDelay={ 0.3 }
                        title={ withLabel ? undefined : intl.formatMessage(generalMessages.share) }
                    >
                        <Icon
                            className="share-link-modal__share-icon"
                            type="shareLarge"
                        />
                    </Tooltip>
                    { withLabel &&
                    <span className="share-link-modal__share-text">
                  { intl.formatMessage(generalMessages.share) }
                </span>
                    }
                </div>
                <Modal
                    footer={ null }
                    onCancel={ this.toggleModal }
                    visible={ this.state.visible }
                >
                    <div className="share-link-modal">
                        <div className="flex-center-x share-link-modal__title">
                            { intl.formatMessage(formMessages.shareLinkTitle) }
                        </div>
                        <div className="flex-center-x share-link-modal__subtitle">
                            { intl.formatMessage(formMessages.shareLinkSubtitle) }
                        </div>
                        <UrlInput
                            onSubmit={ this.toggleModal }
                            readOnly
                            showNotification={ this.props.showNotification }
                            value={ url }
                        />
                    </div>
                </Modal>
            </div>
        );
    }
}

ShareLinkModal.propTypes = {
    intl: PropTypes.shape().isRequired,
    showNotification: PropTypes.func.isRequired,
    url: PropTypes.string.isRequired,
    withLabel: PropTypes.bool
};

export default connect(
    null,
    {
        showNotification
    }
)(injectIntl(ShareLinkModal));
