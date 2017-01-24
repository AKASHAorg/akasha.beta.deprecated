import React, { Component, PropTypes } from 'react';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';
import { AppActions, EntryActions, TagActions } from 'local-flux';
import { DataLoader, EntryCard } from 'shared-components';

class EntryList extends Component {
    componentWillUnmount () {
        ReactTooltip.hide();
    }

    getExistingDraft = (entryId) => {
        const { drafts } = this.props;
        return drafts.find(draft => draft.get('entryId') === entryId);
    }

    handleEdit = (entryId) => {
        const { loggedProfileData } = this.props;
        const { router } = this.context;
        const akashaId = loggedProfileData.get('akashaId');
        const existingDraft = this.getExistingDraft(entryId);
        if (existingDraft) {
            router.push(`/${akashaId}/draft/${existingDraft.get('id')}`);
        } else {
            router.push(`/${akashaId}/draft/new?editEntry=${entryId}`);
        }
    };

    selectTag = (tag) => {
        const { params } = this.context.router;
        this.context.router.push(`/${params.akashaId}/explore/tag/${tag}`);
    };

    render () {
        const { appActions, blockNr, cardStyle, claimPending, canClaimPending, entries,
            entryActions, fetchingEntries, fetchingEntryBalance, fetchingMoreEntries, getTriggerRef,
            loggedProfileData, moreEntries, savedEntriesIds, selectedTag, style,
            votePending } = this.props;
        const { palette } = this.context.muiTheme;

        return (
          <div
            style={Object.assign({}, {
                paddingBottom: moreEntries && !fetchingMoreEntries ? '30px' : '0px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }, style)}
          >
            <DataLoader flag={fetchingEntries} timeout={700} size={80} style={{ paddingTop: '120px' }}>
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
                    No entries
                  </div>
                }
                {entries && entries.map((entry) => {
                    const voteEntryPending = votePending && votePending.find(vote =>
                        vote.entryId === entry.get('entryId'));
                    const claimEntryPending = claimPending && claimPending.find(claim =>
                        claim.entryId === entry.get('entryId'));
                    const isSaved = !!savedEntriesIds.find(id => id === entry.get('entryId'));
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
                      loggedAkashaId={loggedProfileData.get('akashaId')}
                      selectedTag={selectedTag}
                      selectTag={this.selectTag}
                      style={cardStyle}
                      voteEntryPending={voteEntryPending && voteEntryPending.value}
                    />);
                })}
                {moreEntries &&
                  <DataLoader flag={fetchingMoreEntries} size={30}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <div ref={getTriggerRef} style={{ height: 0 }} />
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
    drafts: PropTypes.shape(),
    entries: PropTypes.shape(),
    entryActions: PropTypes.shape(),
    fetchingEntries: PropTypes.bool,
    fetchingEntryBalance: PropTypes.bool,
    fetchingMoreEntries: PropTypes.bool,
    getTriggerRef: PropTypes.func,
    loggedProfileData: PropTypes.shape(),
    moreEntries: PropTypes.bool,
    savedEntriesIds: PropTypes.shape(),
    selectedTag: PropTypes.string,
    style: PropTypes.shape(),
    votePending: PropTypes.shape()
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
        loggedProfileData: state.profileState.get('profiles').find(prf =>
            prf.get('profile') === state.profileState.getIn(['loggedProfile', 'profile'])),
        savedEntriesIds: state.entryState.get('savedEntries').map(entry => entry.get('entryId')),
        selectedTag: state.tagState.get('selectedTag'),
        votePending: state.entryState.getIn(['flags', 'votePending'])
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch),
        entryActions: new EntryActions(dispatch),
        tagActions: new TagActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EntryList);
