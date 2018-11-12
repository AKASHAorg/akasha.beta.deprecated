import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import Masonry from 'react-masonry-component';
import Waypoint from 'react-waypoint';
import { entryMessages, generalMessages } from '../locale-data/messages';
import { entryGetShort, entryPageShow } from '../local-flux/actions/entry-actions';
import { toggleOutsideNavigation } from '../local-flux/actions/app-actions';
import { selectPendingClaims, getBaseUrl, getHideEntrySettings, getPendingEntries,
    selectLoggedEthAddress, selectDrafts, selectSearchQuery, getCanClaimPendingEntry,
    getCurrentBlockNumber, getFetchingEntryBalance} from '../local-flux/selectors';
import { DataLoader, EntryCard } from './index';

class EntryList extends Component {
    shouldComponentUpdate (newProps) {
        return !newProps.entries.equals(this.props.entries) ||
            newProps.fetchingMoreEntries !== this.props.fetchingMoreEntries ||
            newProps.fetchingEntries !== this.props.fetchingEntries ||
            (newProps.pendingEntries && !newProps.pendingEntries.equals(this.props.pendingEntries)) ||
            newProps.large !== this.props.large ||
            !newProps.profiles.equals(this.props.profiles);
    }

    getContainerRef = (el) => { this.container = el; };

    getExistingDraft = (entryId) => {
        const { drafts } = this.props;
        return drafts.find(draft => draft.get('entryId') === entryId);
    }

    render () { // eslint-disable-line complexity
        const { baseUrl, baseWidth, blockNr, cardStyle, canClaimPending, contextId, defaultTimeout, entries,
            fetchingEntries, fetchingEntryBalance, fetchingMoreEntries, hideEntrySettings, intl, large,
            loggedEthAddress, masonry, moreEntries, pendingClaims, pendingEntries, pendingVotes,
            placeholderMessage, profiles, style, searchQuery, searching } = this.props;
        const entryCards = entries && entries.map((entry) => {
            if (!entry) {
                return null;
            }
            const claimPending = !!pendingClaims.get(entry.get('entryId'));
            const ethAddress = entry.getIn(['author', 'ethAddress']);
            const author = profiles.get(ethAddress);
            const isPending = pendingEntries && pendingEntries.get(entry.get('entryId'));

            return (<EntryCard
              author={author}
              baseWidth={baseWidth}
              baseUrl={baseUrl}
              blockNr={blockNr}
              canClaimPending={canClaimPending}
              claimPending={claimPending}
              containerRef={this.container}
              contextId={contextId}
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
              onRetry={this.props.entryGetShort}
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
                {(entries.size === 0) && searching && (searchQuery.length > 2 || searchQuery.length === 0) &&
                  <div className="entry-list__search-placeholder">
                    <div
                      className="entry-list__search-placeholder-inner"
                    >
                      <div className="entry-list__search-placeholder_image" />
                      <div className="entry-list__search-placeholder_text">
                        {(searchQuery.length === 0) && intl.formatMessage(generalMessages.startTypingToSearch)}
                        {(searchQuery.length > 0) && (placeholderMessage || intl.formatMessage(generalMessages.searchingNoResults, {
                            searchTerm: searchQuery,
                            resource: intl.formatMessage(entryMessages.entries)
                        }))}
                      </div>
                    </div>
                  </div>
                }
                {(entries.size === 0) && !searching &&
                  <div className="flex-center entry-list__empty-placeholder">
                    <div className="entry-list__empty-placeholder-inner">
                      <div className="entry-list__empty-placeholder-image" />
                      <div className="entry-list__empty-placeholder-text">
                        {placeholderMessage || intl.formatMessage(entryMessages.noEntries)}
                      </div>
                    </div>
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
    searchQuery: PropTypes.string,
    searching: PropTypes.bool,
};

function mapStateToProps (state, ownProps) {
    return {
        baseUrl: getBaseUrl(state),
        blockNr: getCurrentBlockNumber(state),
        canClaimPending: getCanClaimPendingEntry(state),
        drafts: selectDrafts(state),
        fetchingEntryBalance: getFetchingEntryBalance(state),
        hideEntrySettings: getHideEntrySettings(state),
        loggedEthAddress: selectLoggedEthAddress(state),
        pendingClaims: selectPendingClaims(state),
        pendingEntries: getPendingEntries(state, ownProps.contextId),
        pendingVotes: getPendingActionByType(state, 'entryVote'),
        profiles: selectProfilesByEthAddress(state),
        searchQuery: selectSearchQuery(state),
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
