import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Tooltip } from 'antd';
import { Icon } from '../';
import * as actionTypes from '../../constants/action-types';
import { actionMessages, generalMessages } from '../../locale-data/messages';
import { getDisplayName } from '../../utils/dataModule';

class TransactionLog extends Component {
    shouldComponentUpdate (nextProps) {
        const { action } = nextProps;
        if (!action.equals(this.props.action)) {
            return true;
        }
        return false;
    }

    getExtraInfo = () => { // eslint-disable-line complexity
        const { action, intl, loggedEthAddress } = this.props;
        const payload = action.get('payload').toJS();
        const isDraft = [actionTypes.draftPublish, actionTypes.draftPublishUpdate]
            .includes(action.get('type'));
        const entryTitle = isDraft ?
            payload.draft.title :
            payload.entryTitle;
        const entryActions = [actionTypes.claim, actionTypes.claimVote, actionTypes.comment,
            actionTypes.commentDownvote, actionTypes.commentUpvote, actionTypes.draftPublish,
            actionTypes.draftPublishUpdate, actionTypes.entryDownvote, actionTypes.entryUpvote];
        const profileActions = [actionTypes.follow, actionTypes.sendTip, actionTypes.transferAeth,
            actionTypes.transferEth, actionTypes.unfollow];
        if (entryActions.includes(action.get('type'))) {
            const ethAddress = action.get('type') === actionTypes.claim ?
                loggedEthAddress :
                payload.ethAddress || '0x0';
            return (
              <Link
                className="unstyled-link"
                to={{
                    pathname: `/${ethAddress}/${payload.entryId}`,
                    state: { overlay: true }
                }}
              >
                <span className="content-link transaction-log__highlight">
                  {entryTitle || intl.formatMessage(generalMessages.anEntry)}
                </span>
              </Link>
            );
        }
        if (profileActions.includes(action.get('type'))) {
            const displayName = getDisplayName(payload);
            if (!payload.ethAddress) {
                return (
                  <span className="transaction-log__highlight">
                    {displayName}
                  </span>
                );
            }
            return (
              <Link
                className="unstyled-link"
                to={`/${payload.ethAddress}`}
              >
                <span className="content-link transaction-log__highlight">
                  {displayName}
                </span>
              </Link>
            );
        }
        return null;
    };

    render () {
        const { action, intl } = this.props;
        const payload = action.get('payload').toJS();
        const blockNr = action.get('blockNumber');
        const extraInfo = this.getExtraInfo();
        const isPending = action.get('status') === 'publishing';
        const isFailed = !action.get('success');
        const description = (
          <div>
            {intl.formatMessage(actionMessages[action.get('type')], payload)}
            {extraInfo}
          </div>
        );
        const url = `https://rinkeby.etherscan.io/tx/${action.get('tx')}`;
        let linkText;
        if (isPending) {
            linkText = intl.formatMessage(generalMessages.pendingConfirmation);
        } else if (isFailed) {
            linkText = intl.formatMessage(generalMessages.failedAtBlock, { blockNr });
        } else {
            linkText = intl.formatMessage(generalMessages.confirmedAtBlock, { blockNr });
        }

        return (
          <div className="transaction-log">
            <div className="transaction-log__description">
              {description}
            </div>
            <div>
              <Tooltip title={intl.formatMessage(generalMessages.seeOnEtherscan)}>
                <a className="unstyled-link has-hidden-action transaction-log__link" href={url}>
                  {linkText}
                  <Icon className="hidden-action transaction-log__link-icon" type="linkEntry" />
                </a>
              </Tooltip>
            </div>
          </div>
        );
    }
}

TransactionLog.propTypes = {
    action: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    loggedEthAddress: PropTypes.string.isRequired,
};

export default injectIntl(TransactionLog);
