import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { EntryActions, TagActions } from 'local-flux';
import { FlatButton } from 'material-ui';
import { DataLoader, EntryCard } from 'shared-components';

class EntryList extends Component {
    render () {
        const { blockNr, entries, entryActions, fetchingEntries, fetchingMoreEntries,
            fetchMoreEntries, getTriggerRef, loggedProfileData, moreEntries, savedEntriesIds,
            selectedTag, tagActions, votePending } = this.props;
        const { palette } = this.context.muiTheme;

        return (
          <div style={{ paddingBottom: moreEntries && !fetchingMoreEntries ? '30px' : '0px' }}>
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
                {entries && entries.map((entry, key) => {
                    const voteEntryPending = votePending && votePending.find(vote =>
                        vote.entryId === entry.get('entryId'));
                    const isSaved = !!savedEntriesIds.find(id => id === entry.get('entryId'));
                    return <EntryCard
                      loggedAkashaId={loggedProfileData.get('akashaId')}
                      entry={entry}
                      key={key}
                      blockNr={blockNr}
                      selectTag={tagActions.saveTag}
                      selectedTag={selectedTag}
                      voteEntryPending={voteEntryPending}
                      entryActions={entryActions}
                      isSaved={isSaved}
                    />;
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
    blockNr: PropTypes.number,
    entries: PropTypes.shape(),
    entryActions: PropTypes.shape(),
    fetchingEntries: PropTypes.bool,
    fetchingMoreEntries: PropTypes.bool,
    fetchMoreEntries: PropTypes.func,
    getTriggerRef: PropTypes.func,
    loggedProfileData: PropTypes.shape(),
    moreEntries: PropTypes.bool,
    savedEntriesIds: PropTypes.shape(),
    selectedTag: PropTypes.string,
    tagActions: PropTypes.shape(),
    votePending: PropTypes.shape()
};

EntryList.contextTypes = {
    muiTheme: PropTypes.shape()
};

function mapStateToProps (state) {
    return {
        blockNr: state.externalProcState.getIn(['gethStatus', 'blockNr']),
        loggedProfileData: state.profileState.get('profiles').find(prf =>
            prf.get('akashaId') === state.profileState.getIn(['loggedProfile', 'akashaId'])),
        savedEntriesIds: state.entryState.get('savedEntries').map(entry => entry.get('entryId')),
        selectedTag: state.tagState.get('selectedTag'),
        votePending: state.entryState.getIn(['flags', 'votePending'])
    };
}

function mapDispatchToProps (dispatch) {
    return {
        entryActions: new EntryActions(dispatch),
        tagActions: new TagActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EntryList);
