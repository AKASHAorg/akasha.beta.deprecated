import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import Waypoint from 'react-waypoint';
import { Button, Form, Popover, Progress, Spin, Tooltip } from 'antd';
import classNames from 'classnames';
import { ClaimableList, Icon, ShiftForm } from '../';
import * as actionTypes from '../../constants/action-types';
import { actionAdd } from '../../local-flux/actions/action-actions';
import { profileEssenceIterator,
    profileResetEssenceEvents } from '../../local-flux/actions/profile-actions';
import { selectBalance, selectLoggedEthAddress,
    selectPendingTransformEssence } from '../../local-flux/selectors';
import { formMessages, generalMessages } from '../../locale-data/messages';
import { balanceToNumber } from '../../utils/number-formatter';

const COLLECT = 'collect';
const DEFAULT = 'default';
const FORGE = 'forge';

class EssencePopover extends Component {
    state = {
        page: DEFAULT,
        popoverVisible: false
    };
    wasVisible = false;

    componentWillUnmount () {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    onVisibleChange = (popoverVisible) => {
        this.wasVisible = true;
        if (popoverVisible) {
            this.props.profileEssenceIterator();
        } else {
            this.props.profileResetEssenceEvents();
        }

        this.setState({
            popoverVisible
        });
        if (!popoverVisible) {
            // Delay state reset until popover animation is finished
            this.timeout = setTimeout(() => {
                this.timeout = null;
                this.setState({
                    page: DEFAULT
                });
            }, 100);
        }
    };

    onCollect = () => { this.setState({ page: COLLECT }); };

    onEnterIterator = () => {
        const { essenceIterator } = this.props;
        if (essenceIterator.lastBlock !== 0) {
            this.props.profileEssenceIterator();
        }
    };

    onForge = () => { this.setState({ page: FORGE }); };

    onCancel = () => { this.setState({ page: DEFAULT }); };

    onShiftDownSubmit = (amount) => {
        const { loggedEthAddress } = this.props;
        this.props.actionAdd(loggedEthAddress, actionTypes.cycleAeth, { amount });
    };

    onShiftUpSubmit = (amount) => {
        const { loggedEthAddress } = this.props;
        this.props.actionAdd(loggedEthAddress, actionTypes.bondAeth, { amount });
    };

    renderContent = () => {
        const { balance, entries, essenceEvents, intl, loadingLogs, pendingEntries,
            pendingTransformEssence } = this.props;
        const { page } = this.state;
        const lastEvent = essenceEvents.last();
        if (page === COLLECT) {
            return (
              <ClaimableList />
            );
        }

        if (page === FORGE) {
            return (
              <ShiftForm
                balance={balance}
                onCancel={this.onCancel}
                onShift={this.onShiftUpSubmit}
                pendingShift={pendingTransformEssence}
                type="transformEssence"
              />
            );
        }

        return (
          <div className="essence-popover__content">
            <div className="flex-center essence-popover__title">
              {intl.formatMessage(generalMessages.essence)}
              <span className="essence-popover__essence-score">
                {balanceToNumber(balance.getIn(['essence', 'total']), 1)}
              </span>
            </div>
            <div className="essence-popover__logs-wrapper">
              <div className="essence-popover__logs">
                {!loadingLogs && essenceEvents.map((ev) => {
                    const isLast = lastEvent.equals(ev);
                    const fromComment = ev.action === 'comment:claim';
                    const fromEntry = ev.action === 'entry:claim';
                    const fromEntryVote = ev.action === 'entry:vote:claim';
                    const className = classNames('flex-center-y essence-popover__log-row', {
                        'essence-popover__log-row_last': isLast
                    });
                    if (pendingEntries && pendingEntries.get(ev.sourceId)) {
                        return (
                          <div className={className} key={ev.hashCode()}>
                            <div className="essence-popover__log-placeholder">
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
                        <span className="essence-popover__log-message">
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
                  <div className="flex-center-x essence-popover__spinner">
                    <Spin spinning={loadingLogs} />
                  </div>
                }
                <Waypoint onEnter={this.onEnterIterator} />
              </div>
            </div>
            <div className="essence-popover__actions">
              <Button
                className="essence-popover__button"
                onClick={this.onCollect}
              >
                {intl.formatMessage(generalMessages.collect)}
              </Button>
              <Button
                className="essence-popover__button"
                onClick={this.onForge}
              >
                {intl.formatMessage(formMessages.forgeAeth)}
              </Button>
            </div>
          </div>
        );
    };

    render () {
        const { balance, intl } = this.props;
        const total = balanceToNumber(balance.getIn(['essence', 'total']));
        // 1000 Essence should be considered the first step because it unlocks creating tags
        const firstStep = 1000;
        const percent = (total / firstStep) * 100;
        const tooltip = (
          <div>
            <div>{intl.formatMessage(generalMessages.essence)}</div>
            <div>{total} / {firstStep}</div>
          </div>
        );

        return (
          <Popover
            content={this.wasVisible ? this.renderContent() : null}
            onVisibleChange={this.onVisibleChange}
            overlayClassName="essence-popover"
            placement="leftBottom"
            trigger="click"
            visible={this.state.popoverVisible}
          >
            <Tooltip placement="topLeft" title={tooltip}>
              <Progress
                className="essence-popover__progress"
                format={() => <Icon className="essence-popover__icon" type="essence" />}
                percent={percent}
                strokeWidth={10}
                type="circle"
                width={35}
              />
            </Tooltip>
          </Popover>
        );
    }
}

EssencePopover.propTypes = {
    actionAdd: PropTypes.func.isRequired,
    balance: PropTypes.shape().isRequired,
    entries: PropTypes.shape().isRequired,
    essenceEvents: PropTypes.shape().isRequired,
    essenceIterator: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    loadingLogs: PropTypes.bool,
    loggedEthAddress: PropTypes.string,
    pendingEntries: PropTypes.shape(),
    pendingTransformEssence: PropTypes.bool,
    profileEssenceIterator: PropTypes.func.isRequired,
    profileResetEssenceEvents: PropTypes.func.isRequired,
};

function mapStateToProps (state) {
    return {
        balance: selectBalance(state),
        entries: state.entryState.get('byId'),
        loggedEthAddress: selectLoggedEthAddress(state),
        pendingTransformEssence: selectPendingTransformEssence(state),
        essenceEvents: state.profileState.get('essenceEvents'),
        essenceIterator: state.profileState.get('essenceIterator'),
        loadingLogs: state.profileState.getIn(['flags', 'fetchingEssenceIterator']),
        pendingEntries: state.entryState.getIn(['flags', 'pendingEntries', 'essenceEvents']),
    };
}

export default connect(
    mapStateToProps,
    {
        actionAdd,
        profileEssenceIterator,
        profileResetEssenceEvents
    }
)(Form.create()(injectIntl(EssencePopover)));
