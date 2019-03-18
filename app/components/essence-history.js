import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import Link from 'react-router-dom/Link';
import Waypoint from 'react-waypoint';
import classNames from 'classnames';
import { Spin } from 'antd';
import { Icon } from './';
import { profileEssenceIterator, profileGetBalance,
    profileResetEssenceEvents } from '../local-flux/actions/profile-actions';
import { generalMessages } from '../locale-data/messages';
import { balanceToNumber } from '../utils/number-formatter';
import { entrySelectors, profileSelectors } from '../local-flux/selectors';
import withRequest from '../components/high-order-components/with-request';

class EssenceHistory extends Component {
    componentDidMount () {
        const { dispatchAction } = this.props;
        dispatchAction(profileEssenceIterator());
        dispatchAction(profileGetBalance());
    }

    componentWillUnmount () {
        this.props.profileResetEssenceEvents();
    }

    onEnterIterator = () => {
        const { essenceIterator } = this.props;
        if (essenceIterator.lastBlock !== 0) {
            this.props.dispatchAction(profileEssenceIterator());
        }
    };

    render () {
        const { balance, entries, essenceEvents, intl, loadingLogs, loadingMoreLogs, onBack,
            pendingEntries } = this.props;
        const lastEvent = essenceEvents.last();

        return (
          <div className="essence-history">
            <div className="flex-center-y essence-history__title">
              <Icon className="content-link essence-history__back-icon" onClick={onBack} type="back" />
              <span>{intl.formatMessage(generalMessages.essenceTotal)}</span>
              <span className="essence-history__essence-score">
                {balanceToNumber(balance.getIn(['essence', 'total']), 1)}
              </span>
            </div>
            <div className="essence-history__logs-wrapper">
              {!loadingLogs && essenceEvents.size === 0 &&
                <div
                  className="essence-history__placeholder"
                >
                  <div className="essence-history__placeholder-inner">
                    <div className="essence-history__placeholder-image" />
                    <div className="essence-history__placeholder-text">
                      <div>{intl.formatMessage(generalMessages.noEssenceWasCollectedTitle)}</div>
                      <div>{intl.formatMessage(generalMessages.noEssenceWasCollectedDescription)}</div>
                    </div>
                  </div>
                </div>
              }
              <div className="essence-history__logs">
                {!loadingLogs && (essenceEvents.size > 0) && essenceEvents.map((ev) => {
                    const isLast = lastEvent.equals(ev);
                    const fromComment = ev.action === 'comment:vote';
                    const fromEntry = ev.action === 'entry:claim';
                    const fromEntryVote = ev.action === 'entry:vote:claim';
                    const className = classNames('essence-history__log-row', {
                        'essence-history__log-row_last': isLast
                    });
                    if (pendingEntries && pendingEntries.get(ev.sourceId)) {
                        return (
                          <div className={className} key={ev.hashCode()}>
                            <div className="essence-history__log-placeholder">
                              <div />
                            </div>
                          </div>
                        );
                    }
                    const fallbackMessage = fromEntryVote ?
                        intl.formatMessage(generalMessages.anEntryVote) :
                        intl.formatMessage(generalMessages.anEntry);
                    const entryTitle = entries.getIn([ev.sourceId, 'content', 'title']);
                    const entryLink = (fromEntry || fromEntryVote) && (
                      <Link
                        className="unstyled-link"
                        to={{
                            pathname: `/0x0/${ev.sourceId}`,
                            state: { overlay: true }
                        }}
                      >
                        <span className="content-link heading" onClick={() => this.onVisibleChange(false)}>
                          {entryTitle || fallbackMessage}
                        </span>
                      </Link>
                    );
                    return (
                      <div className={className} key={ev.hashCode()}>
                        <span className="essence-history__log-message">
                          {intl.formatMessage(generalMessages.receivedAmount, {
                              amount: ev.amount,
                              symbol: 'Essence'
                          })}
                        </span>
                        {fromComment ?
                            intl.formatMessage(generalMessages.aComment) :
                            entryLink
                        }
                      </div>
                    );
                })}
                {loadingLogs &&
                  <div className="flex-center-x essence-history__spinner">
                    <Spin spinning />
                  </div>
                }
                {loadingMoreLogs &&
                  <div className="flex-center-x">
                    <Spin spinning />
                  </div>
                }
                {!loadingLogs && !loadingMoreLogs && <Waypoint onEnter={this.onEnterIterator} />}
              </div>
            </div>
          </div>
        );
    }
}

EssenceHistory.propTypes = {
    balance: PropTypes.shape().isRequired,
    entries: PropTypes.shape().isRequired,
    essenceEvents: PropTypes.shape().isRequired,
    essenceIterator: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    loadingLogs: PropTypes.bool,
    loadingMoreLogs: PropTypes.bool,
    onBack: PropTypes.func.isRequired,
    pendingEntries: PropTypes.shape(),
    profileEssenceIterator: PropTypes.func.isRequired,
    profileGetBalance: PropTypes.func.isRequired,
    profileResetEssenceEvents: PropTypes.func.isRequired,
};

function mapStateToProps (state) {
    return {
        balance: profileSelectors.selectBalance(state),
        entries: entrySelectors.selectEntriesById(state),
        essenceEvents: profileSelectors.selectEssenceEvents(state),
        essenceIterator: profileSelectors.selectEssenceIterator(state),
        loadingLogs: profileSelectors.selectProfileFlag(state, 'fetchingEssenceIterator'),
        loadingMoreLogs: profileSelectors.selectProfileFlag(state, 'fetchingMoreEssenceIterator'),
        pendingEntries: entrySelectors.getPendingEntries(state, 'essenceEvents'),
    };
}

export default connect(
    mapStateToProps,
    {
        // profileEssenceIterator,
        // profileGetBalance,
        profileResetEssenceEvents,
    }
)(injectIntl(withRequest(EssenceHistory)));
