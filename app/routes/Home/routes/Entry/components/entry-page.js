/* eslint import/no-unresolved: 0, import/extensions: 0 */
import React, { Component, PropTypes } from 'react';
import ReactTooltip from 'react-tooltip';
import { Divider, IconButton, SvgIcon, FlatButton } from 'material-ui';
import { injectIntl } from 'react-intl';
import { editorStateToJSON } from 'megadraft';
import { TagChip, DataLoader, CommentsList, CommentEditor } from 'shared-components';
import { AllRightsReserved, CreativeCommonsBY, CreativeCommonsCC, CreativeCommonsNCEU,
    CreativeCommonsNCJP, CreativeCommonsNC, CreativeCommonsND, CreativeCommonsREMIX,
    CreativeCommonsSHARE, CreativeCommonsZERO, CreativeCommonsPD,
    CreativeCommonsSA } from 'shared-components/svg';
import debounce from 'lodash.debounce'; // eslint-disable-line no-unused-vars
import { entryMessages } from 'locale-data/messages';
import { getInitials } from 'utils/dataModule';
import { getMentionsFromEditorState } from 'utils/editorUtils';
import EntryPageHeader from './entry-page-header';
import EntryPageContent from './entry-page-content';
import EntryPageActions from './entry-page-actions';
import styles from './entry-page.scss';

const COMMENT_FETCH_LIMIT = 25;
const CHECK_NEW_COMMENTS_INTERVAL = 15; // in seconds

class EntryPage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            publisherTitleShadow: false,
            activeTab: 'all',
            scrollDirection: 1
        };
    }

    componentDidMount () {
        const { entry, entryActions, location, params, commentsActions } = this.props;
        window.addEventListener('scroll', this._handleContentScroll, { passive: true });
        this.checkCommentsInterval = setInterval(
            this._checkNewComments,
            CHECK_NEW_COMMENTS_INTERVAL * 1000
        );
        const { version } = location.query;
        if (!entry || entry.get('entryId') !== params.entryId ||
                (version !== undefined && entry.content.version !== version)) {
            const versionNr = isNaN(Number(version)) ? null : Number(version);
            entryActions.getFullEntry(params.entryId, versionNr);
            commentsActions.unloadComments(parseInt(params.entryId, 10), null);
            this.fetchComments(params.entryId);
        }
    }

    componentWillReceiveProps (nextProps) { // eslint-disable-line max-statements, :D
        const { params, entry, entryActions, fetchingFullEntry, commentsActions,
            location, loggedProfile } = this.props;
        const newEntryLoaded = entry && (entry.get('entryId') !== nextProps.entry.get('entryId') ||
            (entry.content && nextProps.entry.content &&
            entry.content.version !== nextProps.entry.content.version)
        );
        const { version } = nextProps.location.query;
        if (!nextProps.fetchingFullEntry && fetchingFullEntry) {
            entryActions.getLatestVersion(nextProps.params.entryId);
        }
        if ((params.entryId !== nextProps.params.entryId && entry.get('entryId') !== nextProps.params.entryId) ||
                (version !== undefined && version !== location.query.version)) {
            const versionNr = isNaN(Number(version)) ? null : Number(version);
            entryActions.getFullEntry(nextProps.params.entryId, versionNr);
            commentsActions.unloadComments(parseInt(params.entryId, 10));
            this.fetchComments(nextProps.params.entryId);
        }
        if (nextProps.entry && (!entry || newEntryLoaded)) {
            entryActions.getVoteOf(loggedProfile.get('akashaId'), nextProps.entry.get('entryId'));
            if (this.isOwnEntry(nextProps)) {
                entryActions.canClaim(nextProps.entry.get('entryId'));
                entryActions.getEntryBalance(nextProps.entry.get('entryId'));
            }
            this.setState({
                lastCommentsCount: nextProps.entry.get('commentsCount')
            });
        }
        // this will pass only the first time a new entry loaded
        if (entry && nextProps.entry && (nextProps.entry.get('entryId') !== entry.get('entryId'))) {
            this.setState({
                lastCommentsCount: nextProps.entry.get('commentsCount')
            });
        }
        this._resetEditors(nextProps);
        this._onCommentsCountChange(nextProps);
    }

    shouldComponentUpdate (nextProps, nextState) {
        return (nextProps !== this.props) || (nextState !== this.state);
    }

    componentDidUpdate (prevProps) {
        // target the first new comment loaded and scroll into view
        const { newCommentsIds } = this.props;
        if ((prevProps.newCommentsIds.size > 0) && (newCommentsIds.size === 0)) {
            const targetId = prevProps.newCommentsIds.first();
            const node = document.getElementById(`comment-${targetId}`);
            if (node) {
                node.scrollIntoViewIfNeeded(true);
            }
        }
    }

    componentWillUnmount () {
        const { entryActions, commentsActions, params } = this.props;
        window.removeEventListener('scroll', this._handleContentScroll);
        // window.removeEventListener('mousewheel', this.debouncedMouseWheel);
        clearInterval(this.checkCommentsInterval);
        this.checkCommentsInterval = null;
        entryActions.unloadFullEntry();
        commentsActions.unloadComments(parseInt(params.entryId, 10));
        ReactTooltip.hide();
    }
    requestNewestComments = () => {
        const { entry, comments, newCommentsIds, commentsActions } = this.props;
        let targetParentComment = comments.find(comment => comment.get('commentId') === parseInt(newCommentsIds.first(), 10));

        do {
            targetParentComment = comments.find(comment => comment.get('commentId') === parseInt(targetParentComment.getIn(['data', 'parent']), 10));
        } while (targetParentComment && targetParentComment.getIn(['data', 'parent']) !== '0');

        this.setState({
            lastCommentsCount: entry.get('commentsCount')
        }, () => {
            commentsActions.clearNewCommentsIds();
        });
    };

    showNewCommentsNotification = () => {
        this.setState({
            showNewCommentsNotification: true
        });
    };
    fetchComments = (entryId, start = 0, reverse = false) => {
        const { fetchingComments, commentsActions } = this.props;
        // if it`s already fetching comments, return
        if (!fetchingComments) {
            commentsActions.getEntryComments(entryId, start, COMMENT_FETCH_LIMIT, reverse);
        }
    };
    _resetEditors = (nextProps) => {
        const { pendingCommentsActions, params } = this.props;
        if ((nextProps.pendingCommentsActions.size > 0)) {
            const prevComment = pendingCommentsActions.findLast(comm => comm.getIn(['payload', 'entryId']) === params.entryId);
            const currentComment = nextProps.pendingCommentsActions.findLast(comm => comm.getIn(['payload', 'entryId']) === params.entryId);
            if (currentComment && prevComment && (prevComment.status === 'checkAuth')) {
                this.commentEditor.resetContent();
                this.commentsListRef.resetReplies();
            }
        }
    }
    _checkNewComments = () => {
        const { commentsActions, params } = this.props;
        commentsActions.getCommentsCount(params.entryId);
    };
    _onCommentsCountChange = (nextProps) => {
        const { entry, commentsActions, comments } = this.props;
        if (nextProps.entry && entry && (nextProps.entry.get('entryId') === entry.get('entryId'))) {
            let pendingCommentsCount = 0;
            const entryComments = nextProps.comments.filter(comm => comm.get('entryId') === parseInt(nextProps.entry.get('entryId'), 10));

            if (entryComments.size > 0) {
                pendingCommentsCount = this._getNewlyCreatedComments(nextProps.comments).size;
            }

            if ((this.state.lastCommentsCount + pendingCommentsCount) < nextProps.entry.get('commentsCount')) {
                // new comments will be loaded automatically but if can be shown,
                // ie. comment.data.parent = 0 or parent already loaded, show a notification
                // else do nothing as it will load on scroll
                if ((comments.size <= nextProps.comments.size) && !nextProps.fetchingComments) {
                    commentsActions.fetchNewComments(entry.get('entryId'));
                }
            }
        }
    }
    isOwnEntry = (nextProps) => {
        const { entry, loggedProfile } = nextProps || this.props;
        const publisher = entry.entryEth.publisher;
        return publisher && publisher.akashaId === loggedProfile.get('akashaId');
    };

    handleUpvote = () => {
        const { entry, entryActions } = this.props;
        const akashaId = entry.entryEth.publisher.akashaId;
        const payload = {
            publisherAkashaId: akashaId,
            entryTitle: entry.content.title,
            entryId: entry.entryId,
            active: entry.active
        };
        entryActions.addUpvoteAction(payload);
    };

    handleDownvote = () => {
        const { entry, entryActions } = this.props;
        const akashaId = entry.entryEth.publisher.akashaId;
        const payload = {
            publisherAkashaId: akashaId,
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
        const mentions = getMentionsFromEditorState(editorState);
        const payload = {
            content: editorStateToJSON(editorState),
            entryId: entry.get('entryId'),
            mentions
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
            status: 'checkAuth'
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
    _handleMouseWheel = (ev) => {
        const { newCommentsIds } = this.props;
        let scrollDirection = -1;
        if (ev.detail < 0) {
            scrollDirection = 1;
        }
        if (ev.nativeEvent.wheelDelta > 0) {
            scrollDirection = 1;
        }
        if (newCommentsIds.size > 0) {
            this.setState({
                commentsSectionTop: this.commentsSectionRef.getBoundingClientRect().top,
                scrollDirection
            });
        }
    }
    handleEdit = () => {
        const { existingDraft, entry, loggedProfile } = this.props;
        const { router } = this.context;
        const akashaId = loggedProfile.get('akashaId');
        if (existingDraft) {
            router.push(`/${akashaId}/draft/${existingDraft.get('id')}`);
        } else {
            const { version } = entry.content;
            const query = `editEntry=${entry.get('entryId')}&version=${version}`;
            router.push(`/${akashaId}/draft/new?${query}`);
        }
    };
    selectProfile = () => {
        const { entry, params } = this.props;
        const profileAddress = entry.entryEth.publisher.profile;
        this.context.router.push(`/${params.akashaId}/profile/${profileAddress}`);
    };
    _navigateToTag = (ev, tagName) => {
        const { params } = this.props;
        this.context.router.push(`/${params.akashaId}/explore/tag/${tagName}`);
    }
    _navigateToProfile = (ev, profileHash) => {
        const { params } = this.props;
        this.context.router.push(`${params.akashaId}/profile/${profileHash}`);
    }
    _getNewlyCreatedComments = comments =>
        comments.filter(comm => (!comm.get('tempTx') && !comm.getIn(['data', 'ipfsHash']) &&
            !comm.get('commentId'))
        );
    _getNewCommentsCount = () => {
        const { newCommentsIds } = this.props;
        return newCommentsIds.size;
    }
    getVersion = (version) => {
        const { entry, loggedProfile } = this.props;
        const loggedAkashaId = loggedProfile.get('akashaId');
        const query = version !== undefined ? `?version=${version}` : '';
        this.context.router.replace(`/${loggedAkashaId}/entry/${entry.get('entryId')}${query}`);
    }
    renderLicenceIcons = () => {
        const { entry, licences } = this.props;
        const licence = licences.find(lic => lic.id === entry.content.licence.id);
        if (!licence) {
            return null;
        }
        const licenceIcons = {
            'copyright-1': AllRightsReserved,
            CCBY: CreativeCommonsBY,
            CCCC: CreativeCommonsCC,
            CCNCEU: CreativeCommonsNCEU,
            CCNCJP: CreativeCommonsNCJP,
            CCNC: CreativeCommonsNC,
            CCND: CreativeCommonsND,
            CCREMIX: CreativeCommonsREMIX,
            CCSHARE: CreativeCommonsSHARE,
            CCZERO: CreativeCommonsZERO,
            CCPD: CreativeCommonsPD,
            CCSA: CreativeCommonsSA
        };
        return (
          <div style={{ display: 'inline-flex' }}>
            {licence.description.map((descr) => { // eslint-disable-line consistent-return, array-callback-return, max-len
                if (descr.icon && licenceIcons[descr.icon] !== undefined) {
                    const viewBox = descr.icon === 'CCBY' || descr.icon === 'copyright-1' ?
                        '0 0 20 20' :
                        '0 0 18 18';
                    return (
                      <div key={descr.icon} data-tip={descr.text} >
                        <IconButton
                          style={{ padding: '6px', width: '30px', height: '30px' }}
                          iconStyle={{ width: '18px', height: '18px' }}
                        >
                          <SvgIcon viewBox={viewBox}>
                            {React.createElement(licenceIcons[descr.icon])}
                          </SvgIcon>
                        </IconButton>
                      </div>
                    );
                }
            })}
          </div>
        );
    };

    render () {
        const { blockNr, canClaimPending, claimPending, comments, entry, existingDraft,
            fetchingEntryBalance, fetchingFullEntry, intl, licences, loggedProfile,
            profiles, savedEntries, votePending, fetchingComments, newCommentsIds,
            profileActions, latestVersion, location } = this.props;
        const { palette } = this.context.muiTheme;
        const { publisherTitleShadow, scrollDirection, commentsSectionTop } = this.state;
        let currentVersion;
        let licence;
        let licenceLabel;
        if (!entry || fetchingFullEntry) {
            return <DataLoader flag size={80} style={{ paddingTop: '120px' }} />;
        }
        if (entry.content) {
            currentVersion = entry.content.version;
            licence = licences ?
                licences.find(lic => lic.id === entry.content.licence.id) :
                {};
            licenceLabel = licence.parent ?
                licences.find(lic => lic.id === licence.parent).label :
                licence.label;
        } else {
            currentVersion = location.query && location.query.version ?
                Number(location.query.version) :
                latestVersion;
        }
        const entryId = parseInt(entry.get('entryId'), 10);
        const loggedProfileData = profiles.find(prf => prf.get('profile') === loggedProfile.get('profile'));
        const loggedProfileAvatar = loggedProfileData.get('avatar');
        const loggedProfileUserInitials =
            getInitials(loggedProfileData.firstName, loggedProfileData.lastName);
        const isSaved = entry && !!savedEntries.find(id => id === entry.entryId);
        const claimEntryPending = claimPending && claimPending.find(claim =>
            claim.entryId === entry.entryId);
        const voteEntryPending = votePending && votePending.find(vote =>
              vote.entryId === entry.entryId);
        return (
          <div className={`${styles.root} row`}>
            <div className="col-xs-12">
              <div className={`${styles.entry_page_inner}`}>
                <div id="content-section" className={`${styles.content_section}`}>
                  {entry.entryEth && entry.entryEth.publisher &&
                    <EntryPageHeader
                      commentsSectionTop={commentsSectionTop}
                      currentVersion={currentVersion}
                      entryBlockNr={entry.entryEth.blockNr}
                      existingDraft={existingDraft}
                      getVersion={this.getVersion}
                      handleEdit={this.handleEdit}
                      intl={intl}
                      isActive={entry.active}
                      isOwnEntry={this.isOwnEntry()}
                      latestVersion={latestVersion}
                      newCommentsCount={this._getNewCommentsCount()}
                      onRequestNewestComments={this.requestNewestComments}
                      publisher={entry.entryEth.publisher}
                      publisherTitleShadow={publisherTitleShadow}
                      scrollDirection={scrollDirection}
                      selectProfile={this.selectProfile}
                      timestamp={entry.entryEth.unixStamp}
                      wordCount={entry.content ? entry.content.wordCount : 0}
                    />
                  }
                  {entry.content &&
                    <EntryPageContent
                      entry={entry}
                    />
                  }
                  {!entry.content &&
                    <div
                      style={{
                          height: '300px',
                          marginTop: '80px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          fontSize: '16px',
                          color: palette.disabledColor,
                      }}
                    >
                      {intl.formatMessage(entryMessages.unresolvedEntry)}
                    </div>
                  }
                </div>
                {entry.content &&
                  <div
                    className={`${styles.entry_infos}`}
                    style={{ display: 'flex', alignItems: 'center', padding: '8px 0' }}
                  >
                    <span style={{ paddingRight: '10px' }}>
                      {licenceLabel}
                    </span>
                    {this.renderLicenceIcons()}
                  </div>
                }
                <div className={`${styles.entry_infos}`}>
                  {entry.content &&
                    <div className={`${styles.entry_tags}`}>
                      {entry.getIn(['content', 'tags']).map(tag =>
                        <TagChip
                          key={tag}
                          tag={tag}
                          onTagClick={this._navigateToTag}
                        />
                      )}
                    </div>
                  }
                  {entry.content &&
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
                  }
                  <CommentEditor
                    profileAvatar={loggedProfileAvatar}
                    profileUserInitials={loggedProfileUserInitials}
                    onCommentCreate={this._handleCommentCreate}
                    ref={(editor) => { this.commentEditor = editor; }}
                    intl={intl}
                  />
                  <div
                    id="comments-section"
                    className={`${styles.comments_section}`}
                    ref={((commentsSectionRef) => {
                        this.commentsSectionRef = commentsSectionRef;
                    })}
                  >
                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <h4>
                        {`${intl.formatMessage(entryMessages.allComments)} (${entry.get('commentsCount')})`}
                      </h4>
                      {(this._getNewCommentsCount() > 0) &&
                        <div
                          style={{
                              position: 'absolute',
                              top: 40,
                              transform: 'translate3d(0,0,0)',
                              textAlign: 'center',
                              margin: '0 auto',
                              zIndex: 1,
                              padding: 0,
                              width: 700,
                              height: 1,
                              willChange: 'top'
                          }}
                          className="row middle-xs"
                        >
                          <div className="col-xs-12 center-xs" style={{ position: 'relative' }}>
                            <FlatButton
                              primary
                              label={intl.formatMessage(entryMessages.newComments, {
                                  count: this._getNewCommentsCount()
                              })}
                              hoverColor="#ececec"
                              backgroundColor="#FFF"
                              style={{ position: 'absolute', top: -18, zIndex: 2, left: '50%', marginLeft: '-70px' }}
                              labelStyle={{ fontSize: 12 }}
                              onClick={this.requestNewestComments}
                            />
                          </div>
                        </div>
                    }
                      <Divider />
                    </div>
                    <div>
                      <div>
                        <div>
                          <CommentsList
                            ref={(cList) => { this.commentsListRef = cList; }}
                            loggedProfile={loggedProfile}
                            loggedProfileData={loggedProfileData}
                            profileAvatar={loggedProfileAvatar}
                            profileUserInitials={loggedProfileUserInitials}
                            onReplyCreate={this._handleCommentCreate}
                            comments={comments.filter(comm => !newCommentsIds.includes(`${comm.get('commentId')}`))}
                            profiles={profiles}
                            profileActions={profileActions}
                            entryId={entryId}
                            commentsCount={entry.get('commentsCount')}
                            fetchLimit={COMMENT_FETCH_LIMIT}
                            onLoadMoreRequest={this.fetchComments}
                            onCommenterClick={this._navigateToProfile}
                            entryAuthorProfile={entry.getIn(['entryEth', 'publisher']).profile}
                            fetchingComments={fetchingComments}
                            intl={intl}
                          />
                        </div>
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
    existingDraft: PropTypes.shape(),
    fetchingComments: PropTypes.bool,
    fetchingEntryBalance: PropTypes.bool,
    fetchingFullEntry: PropTypes.bool,
    latestVersion: PropTypes.number,
    intl: PropTypes.shape(),
    licences: PropTypes.shape(),
    location: PropTypes.shape(),
    loggedProfile: PropTypes.shape(),
    params: PropTypes.shape(),
    profiles: PropTypes.shape(),
    profileActions: PropTypes.shape(),
    savedEntries: PropTypes.shape(),
    votePending: PropTypes.shape(),
    pendingCommentsActions: PropTypes.shape(),
    newCommentsIds: PropTypes.shape()
};
EntryPage.contextTypes = {
    muiTheme: PropTypes.shape(),
    router: PropTypes.shape()
};
export default injectIntl(EntryPage);
