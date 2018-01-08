import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import Masonry from 'react-masonry-component';
import Waypoint from 'react-waypoint';
import { entryMessages } from '../locale-data/messages';
import { entryGetShort, entryPageShow } from '../local-flux/actions/entry-actions';
import { toggleOutsideNavigation } from '../local-flux/actions/app-actions';
import { selectAllPendingClaims, selectAllPendingVotes, selectHideEntrySettings,
    selectLoggedEthAddress } from '../local-flux/selectors';
import { DataLoader, EntryCard } from './index';

class EntryList extends Component {
    shouldComponentUpdate (newProps) {
        return !newProps.entries.equals(this.props.entries) ||
            newProps.fetchingMoreEntries !== this.props.fetchingMoreEntries ||
            newProps.fetchingEntries !== this.props.fetchingEntries ||
            (this.props.pendingEntries && !newProps.pendingEntries.equals(this.props.pendingEntries)) ||
            newProps.large !== this.props.large ||
            !newProps.profiles.equals(this.props.profiles);
    }

    getContainerRef = (el) => { this.container = el; };

    getExistingDraft = (entryId) => {
        const { drafts } = this.props;
        return drafts.find(draft => draft.get('entryId') === entryId);
    }

    handleEdit = (entryId) => {
        const { history, loggedEthAddress } = this.props;
        const existingDraft = this.getExistingDraft(entryId);
        if (existingDraft) {
            history.push(`/${loggedEthAddress}/draft/${existingDraft.get('id')}`);
        } else {
            history.push(`/${loggedEthAddress}/draft/new?editEntry=${entryId}`);
        }
    };

    render () {
        const { baseUrl, baseWidth, blockNr, cardStyle, canClaimPending, contextId, defaultTimeout, entries,
            fetchingEntries, fetchingEntryBalance, fetchingMoreEntries, hideEntrySettings, intl, large,
            loggedEthAddress, masonry, moreEntries, pendingClaims, pendingEntries, pendingVotes,
            placeholderMessage, profiles, style } = this.props;
        const entryCards = entries && entries.map((entry) => {
            if (!entry) {
                return null;
            }
            const claimPending = !!pendingClaims.get(entry.get('entryId'));
            const ethAddress = entry.getIn(['author', 'ethAddress']);
            const author = profiles.get(ethAddress);
            const isPending = pendingEntries && pendingEntries.get(entry.get('entryId'));
            const entryId = entry.get('entryId');
            const onRetry = () => this.props.entryGetShort({ context: contextId, entryId, ethAddress });

            return (<EntryCard
              author={author}
              baseWidth={baseWidth}
              baseUrl={baseUrl}
              blockNr={blockNr}
              canClaimPending={canClaimPending}
              claimPending={claimPending}
              containerRef={this.container}
              entry={entry}
              entryPageShow={this.props.entryPageShow}
              existingDraft={this.getExistingDraft(entry.get('entryId'))}
              fetchingEntryBalance={fetchingEntryBalance}
              handleEdit={this.handleEdit}
              hideEntrySettings={hideEntrySettings}
              isPending={isPending}
              intl={intl}
              key={entry.get('entryId')}
              large={large}
              loggedEthAddress={loggedEthAddress}
              onRetry={onRetry}
              style={cardStyle}
              toggleOutsideNavigation={this.props.toggleOutsideNavigation}
              votePending={!!pendingVotes.get(entry.get('entryId'))}
            />);
        });
        return (
          <div
            className={`entry-list ${!masonry && 'entry-list_flex'}`}
            style={Object.assign({}, style)}
            ref={this.getContainerRef}
          >
            <DataLoader
              flag={fetchingEntries}
              timeout={defaultTimeout}
              style={{ paddingTop: '80px' }}
            >
              <div style={{ width: '100%', height: '100%' }}>
                {entries.size === 0 &&
                  <div className="flex-center entry-list__placeholder">
                    {placeholderMessage || intl.formatMessage(entryMessages.noEntries)}
                  </div>
                }
                {masonry ?
                  <Masonry
                    options={{ transitionDuration: 0, fitWidth: true }}
                    style={{ margin: '0 auto' }}
                  >
                    {entryCards}
                  </Masonry> :
                  entryCards
                }
                {moreEntries &&
                  <div style={{ height: '35px' }}>
                    <DataLoader flag={fetchingMoreEntries} size="small">
                      <div className="flex-center">
                        <Waypoint onEnter={this.props.fetchMoreEntries} />
                      </div>
                    </DataLoader>
                  </div>
                }
              </div>
            </DataLoader>
          </div>
        );
    }
}

EntryList.propTypes = {
    baseUrl: PropTypes.string,
    baseWidth: PropTypes.number,
    blockNr: PropTypes.number,
    cardStyle: PropTypes.shape(),
    canClaimPending: PropTypes.bool,
    contextId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    defaultTimeout: PropTypes.number,
    drafts: PropTypes.shape(),
    entries: PropTypes.shape(),
    entryGetShort: PropTypes.func.isRequired,
    entryPageShow: PropTypes.func.isRequired,
    fetchingEntries: PropTypes.bool,
    fetchingEntryBalance: PropTypes.bool,
    fetchingMoreEntries: PropTypes.bool,
    fetchMoreEntries: PropTypes.func.isRequired,
    hideEntrySettings: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
    intl: PropTypes.shape(),
    large: PropTypes.bool,
    loggedEthAddress: PropTypes.string,
    masonry: PropTypes.bool,
    moreEntries: PropTypes.bool,
    pendingClaims: PropTypes.shape().isRequired,
    pendingEntries: PropTypes.shape(),
    pendingVotes: PropTypes.shape().isRequired,
    placeholderMessage: PropTypes.string,
    profiles: PropTypes.shape().isRequired,
    style: PropTypes.shape(),
    toggleOutsideNavigation: PropTypes.func,
};

function mapStateToProps (state, ownProps) {
    return {
        baseUrl: state.externalProcState.getIn(['ipfs', 'status', 'baseUrl']),
        blockNr: state.externalProcState.getIn(['geth', 'status', 'blockNr']),
        canClaimPending: state.entryState.getIn(['flags', 'canClaimPending']),
        drafts: state.draftState.get('drafts'),
        fetchingEntryBalance: state.entryState.getIn(['flags', 'fetchingEntryBalance']),
        hideEntrySettings: selectHideEntrySettings(state),
        loggedEthAddress: selectLoggedEthAddress(state),
        pendingClaims: selectAllPendingClaims(state),
        pendingEntries: state.entryState.getIn(['flags', 'pendingEntries', ownProps.contextId]),
        pendingVotes: selectAllPendingVotes(state),
        profiles: state.profileState.get('byEthAddress'),
    };
}

export default connect(
    mapStateToProps,
    {
        entryGetShort,
        entryPageShow,
        toggleOutsideNavigation,
    }
)(withRouter(injectIntl(EntryList)));
