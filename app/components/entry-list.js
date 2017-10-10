import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import Masonry from 'react-masonry-component';
import throttle from 'lodash.throttle';
import { entryMessages } from '../locale-data/messages';
import { entryPageShow } from '../local-flux/actions/entry-actions';
import { selectAllPendingClaims, selectAllPendingVotes,
    selectLoggedEthAddress } from '../local-flux/selectors';
import { isInViewport } from '../utils/domUtils';
import { DataLoader, EntryCard } from './';

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
    }

    getContainerRef = (el) => { this.container = el; };

    getTriggerRef = (el) => { this.trigger = el; };

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
        const { history, loggedAkashaId } = this.props;
        const existingDraft = this.getExistingDraft(entryId);
        if (existingDraft) {
            history.push(`/${loggedAkashaId}/draft/${existingDraft.get('id')}`);
        } else {
            history.push(`/${loggedAkashaId}/draft/new?editEntry=${entryId}`);
        }
    };

    render () {
        const { blockNr, cardStyle, canClaimPending, defaultTimeout, entries, fetchingEntries,
            fetchingEntryBalance, fetchingMoreEntries, intl, loggedEthAddress, masonry, moreEntries,
            pendingClaims, pendingEntries, pendingVotes, placeholderMessage, profiles,
            style } = this.props;
        const entryCards = entries && entries.map((entry) => {
            if (!entry) {
                return null;
            }
            const claimPending = !!pendingClaims.get(entry.get('entryId'));
            const author = profiles.get(entry.getIn(['author', 'ethAddress']));
            const isPending = pendingEntries && pendingEntries.get(entry.get('entryId'));

            return (<EntryCard
              blockNr={blockNr}
              canClaimPending={canClaimPending}
              claimPending={claimPending}
              entry={entry}
              existingDraft={this.getExistingDraft(entry.get('entryId'))}
              fetchingEntryBalance={fetchingEntryBalance}
              handleEdit={this.handleEdit}
              key={entry.get('entryId')}
              loggedEthAddress={loggedEthAddress}
              style={cardStyle}

              author={author}
              containerRef={this.container}
              entryPageShow={this.props.entryPageShow}
              isPending={isPending}
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
              <div style={{ width: '100%' }}>
                {entries.size === 0 &&
                  <div className="flex-center-x entry-list__placeholder">
                    {placeholderMessage || intl.formatMessage(entryMessages.noEntries)}
                  </div>
                }
                {masonry ?
                  <Masonry options={{ transitionDuration: 0 }}>
                    {entryCards}
                  </Masonry> :
                  entryCards
                }
                {moreEntries &&
                  <div style={{ height: '35px' }}>
                    <DataLoader flag={fetchingMoreEntries} size="small">
                      <div className="flex-center">
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
    defaultTimeout: PropTypes.number,
    drafts: PropTypes.shape(),
    entries: PropTypes.shape(),
    fetchingEntries: PropTypes.bool,
    fetchingEntryBalance: PropTypes.bool,
    fetchingMoreEntries: PropTypes.bool,
    intl: PropTypes.shape(),
    moreEntries: PropTypes.bool,
    placeholderMessage: PropTypes.string,
    style: PropTypes.shape(),

    // used in mapStateToProps
    contextId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // eslint-disable-line
    entryPageShow: PropTypes.func.isRequired,
    fetchMoreEntries: PropTypes.func.isRequired,
    history: PropTypes.shape().isRequired,
    loggedEthAddress: PropTypes.string,
    masonry: PropTypes.bool,
    pendingClaims: PropTypes.shape().isRequired,
    pendingEntries: PropTypes.shape(),
    pendingVotes: PropTypes.shape().isRequired,
    profiles: PropTypes.shape().isRequired,
};

function mapStateToProps (state, ownProps) {
    return {
        blockNr: state.externalProcState.getIn(['gethStatus', 'blockNr']),
        canClaimPending: state.entryState.getIn(['flags', 'canClaimPending']),
        drafts: state.draftState.get('drafts'),
        fetchingEntryBalance: state.entryState.getIn(['flags', 'fetchingEntryBalance']),
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
        entryPageShow
    }
)(withRouter(injectIntl(EntryList)));
