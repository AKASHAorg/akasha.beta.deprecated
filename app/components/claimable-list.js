import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { List } from 'immutable';
import { Button, Tooltip } from 'antd';
import classNames from 'classnames';
import { Waypoint } from 'react-waypoint';
import * as actionTypes from '../constants/action-types';
import { actionAdd } from '../local-flux/actions/action-actions';
import { claimableGetEntries } from '../local-flux/actions/claimable-actions';
import { entryMessages, formMessages, generalMessages } from '../locale-data/messages';
import { balanceToNumber } from '../utils/number-formatter';
import { DataLoader } from './';
import {
    actionSelectors,
    claimSelectors,
    entrySelectors,
    profileSelectors
} from '../local-flux/selectors';

class ClaimableList extends Component {
    // eslint-disable-next-line complexity
    shouldComponentUpdate (nextProps) {
        const {
            canClaim,
            canClaimVote,
            claimableEntries,
            claimableLoading,
            claimableLoadingMore,
            entries,
            entryBalance,
            entryVotes,
            fetchingEntries,
            fetchingMoreEntries,
            moreClaimableEntries,
            pendingClaim,
            pendingClaimVote
        } = nextProps;
        if (
            !canClaim.equals(this.props.canClaim) ||
            !canClaimVote.equals(this.props.canClaimVote) ||
            !claimableEntries.equals(this.props.claimableEntries) ||
            claimableLoading !== this.props.claimableLoading ||
            claimableLoadingMore !== this.props.claimableLoadingMore ||
            !entryBalance.equals(this.props.entryBalance) ||
            !entries.equals(this.props.entries) ||
            !entryVotes.equals(this.props.entryVotes) ||
            fetchingEntries !== this.props.fetchingEntries ||
            fetchingMoreEntries !== this.props.fetchingMoreEntries ||
            moreClaimableEntries !== this.props.moreClaimableEntries ||
            !pendingClaim.equals(this.props.pendingClaim) ||
            !pendingClaimVote.equals(this.props.pendingClaimVote)
        ) {
            return true;
        }

        return false;
    }

    canCollect = claimableEntry => {
        const { canClaim, canClaimVote } = this.props;
        const { entryId, isVote } = claimableEntry.toJS();
        return isVote ? canClaimVote.get(entryId) : canClaim.get(entryId);
    };

    getEndPeriod = entryId => this.props.entries.getIn([entryId, 'endPeriod']);

    isActive = claimableEntry => this.getEndPeriod(claimableEntry.entryId) > Date.now() / 1000;

    isOwnEntry = ethAddress => ethAddress === this.props.loggedEthAddress;

    claimableGetMore = () => this.props.claimableGetEntries(true);

    collectAll = claimableActions => {
        const { entries, loggedEthAddress } = this.props;
        const actions = [];
        if (claimableActions.size === 1) {
            const { entryId, isVote } = claimableActions.first().toJS();
            const entryTitle = entries.getIn([entryId, 'content', 'title']);
            const payload = { entryId, entryTitle };
            const type = isVote ? actionTypes.claimVote : actionTypes.claim;
            this.props.actionAdd(loggedEthAddress, type, payload);
            return;
        }
        claimableActions.forEach(claimableAction => {
            const { entryId, isVote } = claimableAction.toJS();
            const entryTitle = entries.getIn([entryId, 'content', 'title']);
            const payload = { entryId, entryTitle };
            const type = isVote ? actionTypes.claimVote : actionTypes.claim;
            actions.push({ ethAddress: loggedEthAddress, actionType: type, payload });
        });
        this.props.actionAdd(loggedEthAddress, actionTypes.batch, { actions });
    };

    renderRow = (claimableEntry, index) => {
        // eslint-disable-line
        const {
            claimableEntries,
            entryBalance,
            entries,
            entryVotes,
            intl,
            loggedEthAddress,
            pendingClaim,
            pendingClaimVote
        } = this.props;
        const { entryId, isVote } = claimableEntry.toJS();
        let entryTitle = entries.getIn([entryId, 'content', 'title']);
        const className = classNames('claimable-list__row', {
            'claimable-list__row_last': index === claimableEntries.size - 1
        });
        const vote = entryVotes.get(entryId);

        const onCollect = () => {
            const payload = { entryId, entryTitle };
            const type = isVote ? actionTypes.claimVote : actionTypes.claim;
            this.props.actionAdd(loggedEthAddress, type, payload);
        };

        const balance = isVote
            ? balanceToNumber(vote && vote.get('essence'))
            : balanceToNumber(entryBalance.getIn([entryId, 'totalKarma']));
        let timeDiff;
        const isActive = this.isActive(claimableEntry);
        if (isActive) {
            const endPeriod = this.getEndPeriod(claimableEntry.entryId);
            timeDiff = intl.formatRelative(new Date(endPeriod * 1000));
        }
        const loading = isVote ? pendingClaimVote.get(entryId) : pendingClaim.get(entryId);
        let buttonTooltip;
        if (!this.canCollect(claimableEntry)) {
            buttonTooltip = isVote
                ? intl.formatMessage(entryMessages.cannotClaimVote)
                : intl.formatMessage(entryMessages.cannotClaimEntry);
        }
        return (
            <div className={ className } key={ entryId }>
                <div className="claimable-list__entry-info">
                    <div>
                        { entryTitle && (
                            <Link
                                className="unstyled-link"
                                to={ {
                                    pathname: `/0x0/${ entryId }`,
                                    state: { overlay: true }
                                } }
                            >
                                <span
                                    className="content-link overflow-ellipsis claimable-list__entry-title">
                                    { entryTitle }
                                </span>
                            </Link>
                        ) }
                        { !entryTitle &&
                        <div className="claimable-list__entry-title-placeholder"/> }
                    </div>
                    <div>
                        { entryTitle ? (
                            `${ balance } ${ intl.formatMessage(generalMessages.essence) }`
                        ) : (
                            <div className="claimable-list__entry-balance-placeholder"/>
                        ) }
                    </div>
                </div>
                <div className="flex-center claimable-list__button-wrapper">
                    { !isActive && (
                        <Tooltip arrowPointAtCenter title={ buttonTooltip }>
                            <Button
                                disabled={ loading || !this.canCollect(claimableEntry) }
                                loading={ loading }
                                onClick={ onCollect }
                                size="small"
                                type="primary"
                            >
                                { intl.formatMessage(generalMessages.collect) }
                            </Button>
                        </Tooltip>
                    ) }
                    { isActive && (
                        <div className="claimable-list__collect-in">
                            { intl.formatMessage(generalMessages.collect) } { timeDiff }
                        </div>
                    ) }
                </div>
            </div>
        );
    };

    render () {
        const {
            claimableEntries,
            claimableLoading,
            claimableLoadingMore,
            entryBalance,
            entryVotes,
            fetchingEntries,
            fetchingMoreEntries,
            intl,
            moreClaimableEntries,
            pendingClaim,
            pendingClaimVote
        } = this.props;
        let collectableEntries = List();

        const entriesList = claimableEntries.filter(claimableEntry => {
            const { entryId, isVote } = claimableEntry.toJS();
            const endPeriod = this.getEndPeriod(entryId);
            if (!endPeriod) {
                return false;
            }
            const balance = isVote
                ? balanceToNumber(entryVotes.getIn([entryId, 'essence']))
                : balanceToNumber(entryBalance.getIn([entryId, 'totalKarma']));
            return this.isActive(claimableEntry) || (balance && this.canCollect(claimableEntry));
        });
        entriesList.forEach(claimableEntry => {
            if (this.canCollect(claimableEntry)) {
                collectableEntries = collectableEntries.push(claimableEntry);
            }
        });
        const onCollectAll = () => this.collectAll(collectableEntries);
        const claimPending = pendingClaim.find(claim => !!claim);
        const claimVotePending = pendingClaimVote.find(claim => !!claim);
        const collectAllDisabled =
            claimPending || claimVotePending || !collectableEntries.size || claimableLoading;

        return (
            <div className="claimable-list">
                <div className="flex-center-y claimable-list__title">
                    { intl.formatMessage(entryMessages.collectEssence) }
                    <span
                        className="flex-center claimable-list__counter">{ collectableEntries.size }</span>
                    <div className="claimable-list__collect-all-wrapper">
                        <Button
                            className="claimable-list__collect-all"
                            disabled={ collectAllDisabled }
                            onClick={ onCollectAll }
                            size="small"
                            type="primary"
                        >
                            { intl.formatMessage(generalMessages.collectAll) }
                        </Button>
                    </div>
                </div>
                <div className="claimable-list__list-wrapper">
                    { !fetchingEntries && !moreClaimableEntries && entriesList.size === 0 && (
                        <div className="claimable-list__list-placeholder-wrapper">
                            <div className="claimable-list__list-placeholder">
                                <div className="claimable-list__list-placeholder_image"/>
                                <div className="claimable-list__list-placeholder_text">
                                    <div>{ intl.formatMessage(generalMessages.noEssenceToCollectTitle) }</div>
                                    <div>
                                        { intl.formatMessage(generalMessages.noEssenceToCollectDescription) }
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) }
                    <DataLoader flag={ fetchingEntries } style={ { paddingTop: '40px' } }>
                        <div className="claimable-list__list">
                            { entriesList.map(this.renderRow) }
                            { moreClaimableEntries && (
                                <div style={ { height: '35px' } }>
                                    <DataLoader flag={ fetchingMoreEntries } size="small">
                                        <div className="flex-center">
                                            <Waypoint onEnter={ this.claimableGetMore }/>
                                        </div>
                                    </DataLoader>
                                </div>
                            ) }
                        </div>
                    </DataLoader>
                </div>
                <div className="claimable-list__actions">
                    <Button className="claimable-list__button" onClick={ this.props.onHistory }>
                        { intl.formatMessage(generalMessages.history) }
                    </Button>
                    <Button className="claimable-list__button" onClick={ this.props.onForge }>
                        { intl.formatMessage(formMessages.forgeAeth) }
                    </Button>
                </div>
            </div>
        );
    }
}

ClaimableList.propTypes = {
    actionAdd: PropTypes.func.isRequired,
    canClaim: PropTypes.shape().isRequired,
    canClaimVote: PropTypes.shape().isRequired,
    claimableEntries: PropTypes.shape().isRequired,
    claimableGetEntries: PropTypes.func.isRequired,
    claimableLoading: PropTypes.bool,
    claimableLoadingMore: PropTypes.bool,
    entries: PropTypes.shape().isRequired,
    entryBalance: PropTypes.shape().isRequired,
    entryVotes: PropTypes.shape().isRequired,
    fetchingEntries: PropTypes.bool,
    fetchingMoreEntries: PropTypes.bool,
    intl: PropTypes.shape().isRequired,
    loggedEthAddress: PropTypes.string,
    moreClaimableEntries: PropTypes.bool,
    onForge: PropTypes.func.isRequired,
    onHistory: PropTypes.func.isRequired,
    pendingClaim: PropTypes.shape().isRequired,
    pendingClaimVote: PropTypes.shape().isRequired
};

function mapStateToProps (state) {
    return {
        canClaim: entrySelectors.selectEntryCanClaim(state),
        canClaimVote: entrySelectors.selectEntryCanClaimVote(state),
        claimableEntries: claimSelectors.selectClaimableEntries(state),
        claimableLoading: claimSelectors.selectClaimableLoading(state),
        claimableLoadingMore: claimSelectors.selectClaimableLoadingMore(state),
        entries: claimSelectors.getClaimableEntriesById(state),
        entryBalance: entrySelectors.selectEntryBalance(state),
        entryVotes: entrySelectors.selectEntryVotes(state),
        fetchingEntries: claimSelectors.selectClaimableFetchingEntries(state),
        fetchingMoreEntries: claimSelectors.selectClaimableFetchingMoreEntries(state),
        loggedEthAddress: profileSelectors.selectLoggedEthAddress(state),
        moreClaimableEntries: claimSelectors.selectClaimableMoreEntries(state),
        pendingClaim: actionSelectors.selectPendingClaims(state),
        pendingClaimVote: actionSelectors.selectPendingClaimVotes(state)
    };
}

export default connect(
    mapStateToProps,
    {
        actionAdd,
        claimableGetEntries
    },
    null,
    { pure: false }
)(injectIntl(ClaimableList));
