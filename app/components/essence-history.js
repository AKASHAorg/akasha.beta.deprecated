import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import Waypoint from 'react-waypoint';
import classNames from 'classnames';
import { Spin } from 'antd';
import { Icon } from './';
import { profileEssenceIterator, profileGetBalance,
    profileResetEssenceEvents } from '../local-flux/actions/profile-actions';
import { selectBalance } from '../local-flux/selectors';
import { generalMessages } from '../locale-data/messages';
import { balanceToNumber } from '../utils/number-formatter';
import { selectEntriesById, getPendingEntries, selectEssenceIterator,
    selectEssenceEvents, selectProfileFlag } from '../local-flux/selectors';

class EssenceHistory extends Component {
    componentDidMount () {
        this.props.profileEssenceIterator();
        this.props.profileGetBalance();
    }

    componentWillUnmount () {
        this.props.profileResetEssenceEvents();
    }

    onEnterIterator = () => {
        const { essenceIterator } = this.props;
        if (essenceIterator.lastBlock !== 0) {
            this.props.profileEssenceIterator();
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
        balance: selectBalance(state),
        entries: selectEntriesById(state),
        essenceEvents: selectEssenceEvents(state),
        essenceIterator: selectEssenceIterator(state),
        loadingLogs: selectProfileFlag(state, 'fetchingEssenceIterator'),
        loadingMoreLogs: selectProfileFlag(state, 'fetchingMoreEssenceIterator'),
        pendingEntries: getPendingEntries(state, 'essenceEvents'),
    };
}

export default connect(
    mapStateToProps,
    {
        profileEssenceIterator,
        profileGetBalance,
        profileResetEssenceEvents,
    }
)(injectIntl(EssenceHistory));
