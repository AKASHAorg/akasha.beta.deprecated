import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import Masonry from 'react-masonry-component';
import throttle from 'lodash.throttle';
import { entryMessages } from '../locale-data/messages';
import { entryPageShow } from '../local-flux/actions/entry-actions';
import { EntryCard } from '../shared-components';
import { isInViewport } from '../utils/domUtils';
import { DataLoader } from './';

class EntryList extends Component {

    componentDidMount () {
        if (this.container) {
            this.container.addEventListener('scroll', this.throttledHandler);
        }
        window.addEventListener('resize', this.throttledHandler);
    }

    componentWillUnmount () {
        if (this.container) {
            this.container.removeEventListener('scroll', this.throttledHandler);
        }
        window.removeEventListener('resize', this.throttledHandler);
        ReactTooltip.hide();
    }

    getContainerRef = el => (this.container = el);

    getTriggerRef = el => (this.trigger = el);

    checkTrigger = () => {
        if (this.trigger && isInViewport(this.trigger)) {
            this.props.fetchMoreEntries();
        }
    };

    throttledHandler = throttle(this.checkTrigger, 500);

    getExistingDraft = (entryId) => {
        const { drafts } = this.props;
        return drafts.find(draft => draft.get('entryId') === entryId);
    }

    handleEdit = (entryId) => {
        const { loggedAkashaId } = this.props;
        const { router } = this.context;
        const existingDraft = this.getExistingDraft(entryId);
        if (existingDraft) {
            router.push(`/${loggedAkashaId}/draft/${existingDraft.get('id')}`);
        } else {
            router.push(`/${loggedAkashaId}/draft/new?editEntry=${entryId}`);
        }
    };

    selectTag = (tag) => {
        const { params } = this.context.router;
        this.context.router.push(`/${params.akashaId}/explore/tag/${tag}`);
    };

    render () {
        const { blockNr, cardStyle, claimPending, canClaimPending, defaultTimeout,
            entries, entryActions, entryResolvingIpfsHash, fetchingEntries, fetchingEntryBalance,
            fetchingMoreEntries, intl, loggedAkashaId, masonry, moreEntries, placeholderMessage,
            savedEntriesIds, selectedTag, style, votePending, profiles } = this.props;
        const { palette } = this.context.muiTheme;
        const entryCards = entries && entries.map((entry) => {
            if (!entry) {
                return null;
            }
            const voteEntryPending = votePending && votePending.find(vote =>
                vote.entryId === entry.get('entryId'));
            const claimEntryPending = claimPending && claimPending.find(claim =>
                claim.entryId === entry.get('entryId'));
            const isSaved = !!savedEntriesIds.find(id => id === entry.get('entryId'));
            const publisher = profiles.get(entry.getIn(['entryEth', 'publisher']));
            const entryIpfsHash = entry.getIn(['entryEth', 'ipfsHash']);
            const resolvingEntry = entryResolvingIpfsHash &&
                entryResolvingIpfsHash.get(entryIpfsHash);

            return (<EntryCard
              blockNr={blockNr}
              canClaimPending={canClaimPending}
              claimPending={claimEntryPending && claimEntryPending.value}
              entry={entry}
              entryActions={entryActions}
              entryResolvingIpfsHash={resolvingEntry}
              existingDraft={this.getExistingDraft(entry.get('entryId'))}
              fetchingEntryBalance={fetchingEntryBalance}
              handleEdit={this.handleEdit}
              isSaved={isSaved}
              key={entry.get('entryId')}
              loggedAkashaId={loggedAkashaId}
              selectedTag={selectedTag}
              selectTag={this.selectTag}
              style={cardStyle}
              voteEntryPending={voteEntryPending && voteEntryPending.value}

              containerRef={this.container}
              publisher={publisher}
              entryPageShow={this.props.entryPageShow}
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
              size={60}
              style={{ paddingTop: '80px' }}
            >
              <div style={{ width: '100%' }}>
                {entries.size === 0 &&
                  <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        color: palette.disabledColor,
                        paddingTop: '10px'
                    }}
                  >
                    {placeholderMessage || intl.formatMessage(entryMessages.noEntries)}
                  </div>
                }
                {masonry ?
                  <Masonry>
                    {entryCards}
                  </Masonry> :
                  entryCards
                }
                {moreEntries &&
                  <div style={{ height: '35px' }}>
                    <DataLoader flag={fetchingMoreEntries} size={30}>
                      <div
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                      >
                        <div ref={this.getTriggerRef} style={{ height: 0 }} />
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
    blockNr: PropTypes.number,
    cardStyle: PropTypes.shape(),
    canClaimPending: PropTypes.bool,
    claimPending: PropTypes.shape(),
    defaultTimeout: PropTypes.number,
    drafts: PropTypes.shape(),
    entries: PropTypes.shape(),
    entryActions: PropTypes.shape(),
    fetchingEntries: PropTypes.bool,
    fetchingEntryBalance: PropTypes.bool,
    fetchingMoreEntries: PropTypes.bool,
    intl: PropTypes.shape(),
    moreEntries: PropTypes.bool,
    placeholderMessage: PropTypes.string,
    savedEntriesIds: PropTypes.shape(),
    selectedTag: PropTypes.string,
    style: PropTypes.shape(),
    votePending: PropTypes.shape(),

    // used in mapStateToProps
    contextId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // eslint-disable-line react/no-unused-prop-types
    entryPageShow: PropTypes.func.isRequired,
    entryResolvingIpfsHash: PropTypes.shape(),
    fetchMoreEntries: PropTypes.func.isRequired,
    loggedAkashaId: PropTypes.string,
    masonry: PropTypes.bool,
    profiles: PropTypes.shape().isRequired,
};

EntryList.contextTypes = {
    muiTheme: PropTypes.shape(),
    router: PropTypes.shape()
};

function mapStateToProps (state, ownProps) {
    return {
        blockNr: state.externalProcState.getIn(['gethStatus', 'blockNr']),
        canClaimPending: state.entryState.getIn(['flags', 'canClaimPending']),
        claimPending: state.entryState.getIn(['flags', 'claimPending']),
        drafts: state.draftState.get('drafts'),
        entryResolvingIpfsHash: state.entryState.getIn(['flags', 'resolvingIpfsHash', ownProps.contextId]),
        fetchingEntryBalance: state.entryState.getIn(['flags', 'fetchingEntryBalance']),
        loggedAkashaId: state.profileState.getIn(['loggedProfile', 'akashaId']),
        profiles: state.profileState.get('byId'),
        savedEntriesIds: state.entryState.get('savedEntries').map(entry => entry.get('entryId')),
        selectedTag: state.tagState.get('selectedTag'),
        votePending: state.entryState.getIn(['flags', 'votePending'])
    };
}

export default connect(
    mapStateToProps,
    {
        entryPageShow
    }
)(injectIntl(EntryList));
