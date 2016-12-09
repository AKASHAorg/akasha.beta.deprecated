/* eslint import/no-unresolved: 0, import/extensions: 0 */
import React, { Component, PropTypes } from 'react';
import { Divider } from 'material-ui';
import { injectIntl } from 'react-intl';
import { TagChip, DataLoader, CommentsList, CommentEditor } from 'shared-components';
import { entryMessages } from 'locale-data/messages';
import EntryPageHeader from './entry-page-header';
import EntryPageContent from './entry-page-content';
import EntryPageActions from './entry-page-actions';
import styles from './entry-page.scss';

const COMMENT_FETCH_LIMIT = 7;

class EntryPage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            publisherTitleShadow: false,
            activeTab: 'all'
        };
    }

    componentDidMount () {
        window.addEventListener('scroll', this._handleContentScroll);
        const { commentsActions, entry, entryActions, fetchingComments, fetchingFullEntry,
            params } = this.props;

        if ((!entry && !fetchingFullEntry) || entry.get('entryId') !== params.entryId) {
            entryActions.getFullEntry(params.entryId);
            if (!fetchingComments) {
                commentsActions.getEntryComments(params.entryId, 0, COMMENT_FETCH_LIMIT);
            }
        }
    }

    componentWillReceiveProps (nextProps) {
        const { params, entry, entryActions, fetchingComments, commentsActions,
            loggedProfile } = this.props;
        if (params.entryId !== nextProps.params.entryId && entry.get('entryId') !== nextProps.params.entryId) {
            entryActions.getFullEntry(params.entryId);
            if (!fetchingComments) {
                commentsActions.getEntryComments(params.entryId, 0, 7);
            }
        }
        if (nextProps.entry && !entry) {
            entryActions.getVoteOf(loggedProfile.get('akashaId'), nextProps.entry.get('entryId'));
            if (this.isOwnEntry(nextProps)) {
                entryActions.canClaim(nextProps.entry.get('entryId'));
                entryActions.getEntryBalance(nextProps.entry.get('entryId'));
            }
        }
    }

    shouldComponentUpdate (nextProps, nextState) {
        return (nextProps !== this.props) || (nextState !== this.state);
    }

    componentWillUnmount () {
        const { entryActions } = this.props;
        window.removeEventListener('scroll', this._handleContentScroll);
        entryActions.unloadFullEntry();
    }

    isOwnEntry = (nextProps) => {
        const { entry, loggedProfile } = nextProps || this.props;
        return entry.entryEth.publisher.akashaId === loggedProfile.get('akashaId');
    };

    handleUpvote = () => {
        const { entry, entryActions } = this.props;
        const firstName = entry.entryEth.publisher.firstName;
        const lastName = entry.entryEth.publisher.lastName;
        const payload = {
            publisherName: `${firstName} ${lastName}`,
            entryTitle: entry.content.title,
            entryId: entry.entryId,
            active: entry.active
        };
        entryActions.addUpvoteAction(payload);
    };

    handleDownvote = () => {
        const { entry, entryActions } = this.props;
        const firstName = entry.entryEth.publisher.firstName;
        const lastName = entry.entryEth.publisher.lastName;
        const payload = {
            publisherName: `${firstName} ${lastName}`,
            entryTitle: entry.content.title,
            entryId: entry.entryId
        };
        entryActions.addDownvoteAction(payload);
    };

    handleBookmark = () => {
        const { entry, entryActions, loggedProfile, savedEntries } = this.props;
        const loggedAkashaId = loggedProfile.get('akashaId');
        const isSaved = !!savedEntries.find(id => id === entry.entryId);

        if (isSaved) {
            entryActions.deleteEntry(loggedAkashaId, entry.entryId);
            entryActions.moreSavedEntriesList(1);
        } else {
            entryActions.saveEntry(loggedAkashaId, entry.entryId);
        }
    };

    handleClaim = () => {
        const { entry, entryActions } = this.props;
        if (!entry.canClaim) {
            return;
        }
        const payload = {
            entryTitle: entry.content.title,
            entryId: entry.entryId
        };
        entryActions.addClaimAction(payload);
    };

    _handleCommentCreate = (editorState, parent) => {
        const { appActions, entry } = this.props;
        const payload = {
            content: editorState,
            entryId: entry.get('entryId')
        };
        if (parent) {
            payload.parent = parent;
        }
        appActions.addPendingAction({
            type: 'publishComment',
            payload,
            titleId: 'publishCommentTitle',
            messageId: 'publishComment',
            gas: 2000000,
            status: 'needConfirmation'
        });
    }
    _handleContentScroll = (ev) => {
        const scrollTop = ev.srcElement.body.scrollTop;
        /**
         * prevent setting state on every frame
         */
        if ((scrollTop > 0) && !this.state.publisherTitleShadow) {
            this.setState({
                publisherTitleShadow: true
            });
        } else if ((scrollTop === 0) && this.state.publisherTitleShadow) {
            this.setState({
                publisherTitleShadow: false
            });
        }
    }
    selectProfile = () => {
        const { entry, loggedProfile } = this.props;
        const { router } = this.context;
        const profileAddress = entry.entryEth.publisher.profile;
        router.push(`/${loggedProfile.get('akashaId')}/profile/${profileAddress}`);
    };
    _navigateToTag = (ev, tagName) => {
        const { saveTag } = this.props.tagActions;
        saveTag(tagName);
    }

    _handleLoadMoreComments = (fromId) => {
        console.log('load more comment starting from id', fromId);
    }
    render () {
        const { blockNr, canClaimPending, claimPending, comments, entry, fetchingComments,
            fetchingEntryBalance, fetchingFullEntry, intl, loggedProfile, profiles, savedEntries,
            votePending } = this.props;
        const { publisherTitleShadow } = this.state;
        if (!entry || fetchingFullEntry) {
            return <DataLoader flag={true} size={80} style={{ paddingTop: '120px' }} />;
        }
        const blockNumberDiff = blockNr - entry.entryEth.blockNr;
        const loggedProfileData = profiles.find(prf => prf.get('profile') === loggedProfile.get('profile'));
        const loggedProfileAvatar = loggedProfileData.get('avatar');
        const loggedProfileName = `${loggedProfileData.firstName} ${loggedProfileData.lastName}`;
        const loggedProfileUserInitials = loggedProfileName.match(/\b\w/g).reduce((prev, current) => prev + current, '');
        const isSaved = entry && !!savedEntries.find(id => id === entry.entryId);
        const existingVoteWeight = entry.voteWeight || 0;
        const claimEntryPending = claimPending && claimPending.find(claim =>
            claim.entryId === entry.entryId);
        const voteEntryPending = votePending && votePending.find(vote =>
              vote.entryId === entry.entryId);
        return (
          <div className={`${styles.root} row`} >
            <div className="col-xs-12">
              <div className={`${styles.entry_page_inner}`}>
                <div id="content-section" className={`${styles.content_section}`}>
                  <EntryPageHeader
                    blockNumberDiff={blockNumberDiff}
                    publisher={entry.entryEth.publisher}
                    publisherTitleShadow={publisherTitleShadow}
                    selectProfile={this.selectProfile}
                    wordCount={entry.content.wordCount}
                  />
                  <EntryPageContent
                    entry={entry}
                  />
                </div>
                <div className={`${styles.entry_infos}`}>
                  <div className={`${styles.entry_tags}`}>
                    {entry.getIn(['content', 'tags']).map((tag, key) =>
                      <TagChip
                        key={key}
                        tag={tag}
                        onTagClick={this._navigateToTag}
                      />
                    )}
                  </div>
                  <EntryPageActions
                    canClaimPending={canClaimPending}
                    claimPending={claimEntryPending && claimEntryPending.value}
                    entry={entry}
                    fetchingEntryBalance={fetchingEntryBalance}
                    handleBookmark={this.handleBookmark}
                    handleClaim={this.handleClaim}
                    handleDownvote={this.handleDownvote}
                    handleUpvote={this.handleUpvote}
                    isOwnEntry={this.isOwnEntry()}
                    isSaved={isSaved}
                    votePending={voteEntryPending && voteEntryPending.value}
                  />
                  <CommentEditor
                    profileAvatar={loggedProfileAvatar}
                    profileUserInitials={loggedProfileUserInitials}
                    onCommentCreate={this._handleCommentCreate}
                  />
                  <div id="comments-section" className={`${styles.comments_section}`}>
                    <div>
                      <h4>
                        {intl.formatMessage(entryMessages.allComments, {
                            commentsCount: entry.get('commentsCount')
                        })}
                      </h4>
                      <Divider />
                    </div>
                    <div>
                      <div>
                        <DataLoader flag={fetchingComments} >
                          <CommentsList
                            loggedProfile={loggedProfile}
                            publishingComments={
                                comments.filter(comm => comm.get('tempTx'))
                            }
                            comments={
                                comments.filter(comm =>
                                  (comm.getIn(['data', 'active']) && !comm.get('tempTx') &&
                                    (comm.get('entryId') === entry.get('entryId')))
                                )
                            }
                            commentsCount={entry.get('commentsCount')}
                            fetchLimit={COMMENT_FETCH_LIMIT}
                            onLoadMoreRequest={this._handleLoadMoreComments}
                            onCommenterClick={this._navigateToProfile}
                            entryAuthorProfile={entry.getIn(['entryEth', 'publisher']).profile}
                          />
                        </DataLoader>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
}
EntryPage.propTypes = {
    appActions: PropTypes.shape(),
    blockNr: PropTypes.number,
    canClaimPending: PropTypes.bool,
    claimPending: PropTypes.shape(),
    comments: PropTypes.shape(),
    commentsActions: PropTypes.shape(),
    entry: PropTypes.shape(),
    entryActions: PropTypes.shape(),
    fetchingComments: PropTypes.bool,
    fetchingEntryBalance: PropTypes.bool,
    fetchingFullEntry: PropTypes.bool,
    intl: PropTypes.shape(),
    loggedProfile: PropTypes.shape(),
    params: PropTypes.shape(),
    profiles: PropTypes.shape(),
    savedEntries: PropTypes.shape(),
    tagActions: PropTypes.shape(),
    votePending: PropTypes.shape(),
};
EntryPage.contextTypes = {
    muiTheme: PropTypes.shape(),
    router: PropTypes.shape()
};
export default injectIntl(EntryPage);
