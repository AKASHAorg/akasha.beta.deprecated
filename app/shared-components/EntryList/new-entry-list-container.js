import React, { Component, PropTypes } from 'react';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import throttle from 'lodash.throttle';
import { entryMessages } from '../../locale-data/messages';
import { AppActions } from '../../local-flux';
import { DataLoader, EntryCard } from '../';
import { isInViewport } from '../../utils/domUtils';

class EntryList extends Component {

    componentDidMount () {
        if (this.container) {
            this.container.addEventListener('scroll', this.throttledScrollHandler);
        }
    }

    componentWillUnmount () {
        if (this.container) {
            this.container.removeEventListener('scroll', this.throttledScrollHandler);
        }
        ReactTooltip.hide();
    }

    getContainerRef = el => (this.container = el);

    getTriggerRef = el => (this.trigger = el);

    handleScroll = () => {
        if (this.trigger && isInViewport(this.trigger)) {
            this.props.fetchMoreEntries();
        }
    };

    throttledScrollHandler = throttle(this.handleScroll, 500);

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
        const { appActions, blockNr, cardStyle, claimPending, canClaimPending, defaultTimeout,
            entries, entryActions, fetchingEntries, fetchingEntryBalance, fetchingMoreEntries,
            intl, loggedAkashaId, moreEntries, placeholderMessage,
            savedEntriesIds, selectedTag, style, votePending, profiles } = this.props;
        const { palette } = this.context.muiTheme;
        const timeout = defaultTimeout === undefined ? 700 : defaultTimeout;
        return (
          <div
            style={Object.assign({}, {
                paddingBottom: moreEntries && !fetchingMoreEntries ? '30px' : '0px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                overflowY: 'auto',
                overflowX: 'hidden',
                minHeight: '500px'
            }, style)}
            ref={this.getContainerRef}
          >
            <DataLoader
              flag={fetchingEntries}
              timeout={timeout}
              size={80}
              style={{ paddingTop: '80px' }}
            >
              <div>
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
                {entries && entries.map((entry) => {
                    const voteEntryPending = votePending && votePending.find(vote =>
                        vote.entryId === entry.get('entryId'));
                    const claimEntryPending = claimPending && claimPending.find(claim =>
                        claim.entryId === entry.get('entryId'));
                    const isSaved = !!savedEntriesIds.find(id => id === entry.get('entryId'));
                    const publisher = profiles.get(entry.getIn(['entryEth', 'publisher']));
                    return (<EntryCard
                      blockNr={blockNr}
                      canClaimPending={canClaimPending}
                      claimPending={claimEntryPending && claimEntryPending.value}
                      entry={entry}
                      entryActions={entryActions}
                      existingDraft={this.getExistingDraft(entry.get('entryId'))}
                      fetchingEntryBalance={fetchingEntryBalance}
                      handleEdit={this.handleEdit}
                      hidePanel={appActions.hidePanel}
                      isSaved={isSaved}
                      key={entry.get('entryId')}
                      loggedAkashaId={loggedAkashaId}
                      selectedTag={selectedTag}
                      selectTag={this.selectTag}
                      style={cardStyle}
                      voteEntryPending={voteEntryPending && voteEntryPending.value}

                      publisher={publisher}
                    />);
                })}
                {moreEntries &&
                  <DataLoader flag={fetchingMoreEntries} size={30}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <div ref={this.getTriggerRef} style={{ height: 0 }} />
                    </div>
                  </DataLoader>
                }
              </div>
            </DataLoader>
          </div>
        );
    }
}

EntryList.propTypes = {
    appActions: PropTypes.shape(),
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

    fetchMoreEntries: PropTypes.func.isRequired,
    loggedAkashaId: PropTypes.string,
    profiles: PropTypes.shape().isRequired,
};

EntryList.contextTypes = {
    muiTheme: PropTypes.shape(),
    router: PropTypes.shape()
};

function mapStateToProps (state) {
    return {
        blockNr: state.externalProcState.getIn(['gethStatus', 'blockNr']),
        canClaimPending: state.entryState.getIn(['flags', 'canClaimPending']),
        claimPending: state.entryState.getIn(['flags', 'claimPending']),
        drafts: state.draftState.get('drafts'),
        fetchingEntryBalance: state.entryState.getIn(['flags', 'fetchingEntryBalance']),
        loggedAkashaId: state.profileState.getIn(['loggedProfile', 'akashaId']),
        savedEntriesIds: state.entryState.get('savedEntries').map(entry => entry.get('entryId')),
        selectedTag: state.tagState.get('selectedTag'),
        votePending: state.entryState.getIn(['flags', 'votePending'])
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch),
        // entryActions: new EntryActions(dispatch),
        // tagActions: new TagActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(injectIntl(EntryList));
