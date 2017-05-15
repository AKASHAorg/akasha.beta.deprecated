import PropTypes from 'prop-types';
/* eslint import/no-unresolved: 0, import/extensions: 0 */
import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import { Divider, IconButton, SvgIcon, FlatButton } from 'material-ui';
import { injectIntl } from 'react-intl';
import { parse } from 'querystring';
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
            scrollDirection: 1,
        };
    }

    componentDidMount () {
        const { commentsActions, entry, entryGetFull, location, match } = this.props;
        const { params } = match;
        window.addEventListener('scroll', this._handleContentScroll, { passive: true });
        this.checkCommentsInterval = setInterval(
            this.checkNewComments,
            CHECK_NEW_COMMENTS_INTERVAL * 1000
        );
        const { version } = parse(location.search);
        if (!entry || entry.get('entryId') !== params.entryId ||
                (version !== undefined && entry.getIn(['content', 'version']) !== version)) {
            const versionNr = isNaN(Number(version)) ? null : Number(version);
            entryGetFull(params.entryId, versionNr);
            commentsActions.unloadComments(parseInt(params.entryId, 10), null);
            this.fetchComments(params.entryId);
        }
    }

    componentWillReceiveProps (nextProps) {
        const { commentsActions, entry, entryGetFull, entryGetLatestVersion,
            fetchingFullEntry, location, match } = this.props;
        const newEntryLoaded = entry && (entry.get('entryId') !== nextProps.entry.get('entryId') ||
            entry.getIn(['content', 'version']) !== nextProps.entry.getIn(['content', 'version'])
        );
        const { params } = match;
        const nextParams = nextProps.match.params;
        const { version } = parse(nextProps.location.search);
        if (!nextProps.fetchingFullEntry && fetchingFullEntry) {
            entryGetLatestVersion(nextProps.match.params.entryId);
        }
        if ((params.entryId !== nextParams.entryId && entry.get('entryId') !== nextParams.entryId) ||
                (version !== undefined && version !== location.query.version)) {
            const versionNr = isNaN(Number(version)) ? null : Number(version);
            entryGetFull(nextParams.entryId, versionNr);
            commentsActions.unloadComments(parseInt(params.entryId, 10));
            this.fetchComments(nextParams.entryId);
        }
        if (nextProps.entry && (!entry || newEntryLoaded)) {
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
        this.resetEditors(nextProps);
        this.onCommentsCountChange(nextProps);
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
        const { commentsActions, entryCleanFull, match } = this.props;
        window.removeEventListener('scroll', this._handleContentScroll);
        clearInterval(this.checkCommentsInterval);
        this.checkCommentsInterval = null;
        entryCleanFull();
        commentsActions.unloadComments(parseInt(match.params.entryId, 10));
        ReactTooltip.hide();
    }

    showNewCommentsNotification = () => {
        this.setState({
            showNewCommentsNotification: true
        });
    };

    requestNewestComments = () => {
        const { entry, comments, newCommentsIds, commentsActions } = this.props;
        let targetParentComment = comments.find(comment => comment.get('commentId') === parseInt(newCommentsIds.first(), 10));
        const findComments = comment => comment.get('commentId') === parseInt(targetParentComment.getIn(['data', 'parent']), 10);
        do {
            targetParentComment = comments.find(findComments);
        } while (targetParentComment && targetParentComment.getIn(['data', 'parent']) !== '0');

        this.setState({
            lastCommentsCount: entry.get('commentsCount')
        }, () => {
            commentsActions.clearNewCommentsIds();
        });
    };

    fetchComments = (entryId, start = 0, reverse = false) => {
        const { fetchingComments, commentsActions } = this.props;
        // if it`s already fetching comments, return
        if (!fetchingComments) {
            commentsActions.getEntryComments(entryId, start, COMMENT_FETCH_LIMIT, reverse);
        }
    };

    resetEditors = (nextProps) => {
        const { match, pendingCommentsActions } = this.props;
        const { params } = match;
        if ((nextProps.pendingCommentsActions.size > 0)) {
            const prevComment = pendingCommentsActions.findLast(comm => comm.getIn(['payload', 'entryId']) === params.entryId);
            const currentComment = nextProps.pendingCommentsActions.findLast(comm => comm.getIn(['payload', 'entryId']) === params.entryId);
            if (currentComment && prevComment && (prevComment.status === 'checkAuth')) {
                this.commentEditor.resetContent();
                this.commentsListRef.resetReplies();
            }
        }
    };

    checkNewComments = () => {
        const { commentsActions, match } = this.props;
        commentsActions.getCommentsCount(match.params.entryId);
    };

    onCommentsCountChange = (nextProps) => {
        const { entry, commentsActions, comments } = this.props;
        if (nextProps.entry && entry && (nextProps.entry.get('entryId') === entry.get('entryId'))) {
            let pendingCommentsCount = 0;
            const entryComments = nextProps.comments.filter(comm => comm.get('entryId') === parseInt(nextProps.entry.get('entryId'), 10));

            if (entryComments.size > 0) {
                pendingCommentsCount = this.getNewlyCreatedComments(nextProps.comments).size;
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
    };

    handleCommentCreate = (editorState, parent) => {
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
    };

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
    };

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
    };

    selectProfile = () => {
        const { entry, history } = this.props;
        const profileAddress = entry.entryEth.publisher;
        history.push(`/${profileAddress}`);
    };

    navigateToTag = (ev, tagName) => {
        const { history } = this.props;
        history.push(`/tag/${tagName}`);
    };

    navigateToProfile = (ev, profileAddress) => {
        const { history } = this.props;
        history.push(`/${profileAddress}`);
    };

    getNewlyCreatedComments = (comments) => {
        const { entry } = this.props;
        return comments.filter(comm => (comm.get('tempTx') && !comm.getIn(['data', 'ipfsHash']) &&
            !comm.get('commentId') && comm.get('entryId') === entry.get('entryId'))
        );
    };

    renderLicenceIcons = () => {
        const { entry, licenses } = this.props;
        const licence = licenses.get(entry.content.licence.id);
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
        const { comments, entry, fetchingFullEntry, intl, licenses, loggedProfile,
            loggedProfileData, profiles, fetchingComments, newCommentsIds } = this.props;
        const { palette } = this.context.muiTheme;
        const { publisherTitleShadow, scrollDirection, commentsSectionTop } = this.state;
        let license;
        let licenseLabel;
        if (!entry || fetchingFullEntry) {
            return (
              <div className={styles.root} style={{ backgroundColor: palette.canvasColor }}>
                <DataLoader flag size={80} style={{ paddingTop: '120px' }} />
              </div>
            );
        }
        if (entry.content) {
            license = licenses.get(entry.content.licence.id);
            licenseLabel = license.parent ?
                licenses.get(license.parent).label :
                license.label;
        }
        const entryId = parseInt(entry.get('entryId'), 10);
        const loggedProfileAvatar = loggedProfileData.get('avatar');
        const loggedProfileUserInitials =
            getInitials(loggedProfileData.firstName, loggedProfileData.lastName);
        return (
          <div className={styles.root} style={{ backgroundColor: palette.canvasColor }}>
              <div className={`${styles.entry_page_inner}`}>
                <div id="content-section" className={`${styles.content_section}`}>
                  <EntryPageHeader
                    commentsSectionTop={commentsSectionTop}
                    newCommentsCount={newCommentsIds.size}
                    onRequestNewestComments={this.requestNewestComments}
                    isScrollingDown={scrollDirection === -1}
                    publisherTitleShadow={publisherTitleShadow}
                  />
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
                      {licenseLabel}
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
                          onTagClick={this.navigateToTag}
                        />
                      )}
                    </div>
                  }
                  {entry.content && <EntryPageActions entry={entry} />}
                  <CommentEditor
                    profileAvatar={loggedProfileAvatar}
                    profileUserInitials={loggedProfileUserInitials}
                    onCommentCreate={this.handleCommentCreate}
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
                      {(newCommentsIds.size > 0) &&
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
                                  count: newCommentsIds.size
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
                          {/*<CommentsList
                            ref={(cList) => { this.commentsListRef = cList; }}
                            loggedProfile={loggedProfile}
                            loggedProfileData={loggedProfileData}
                            profileAvatar={loggedProfileAvatar}
                            profileUserInitials={loggedProfileUserInitials}
                            onReplyCreate={this.handleCommentCreate}
                            comments={comments.filter(comm => (!newCommentsIds.includes(`${comm.get('commentId')}`) && comm.get('entryId') === entryId))}
                            profiles={profiles}
                            entryId={entryId}
                            commentsCount={entry.get('commentsCount')}
                            fetchLimit={COMMENT_FETCH_LIMIT}
                            onLoadMoreRequest={this.fetchComments}
                            onCommenterClick={this.navigateToProfile}
                            entryAuthorProfile={publisher && publisher.profile}
                            fetchingComments={fetchingComments}
                            intl={intl}
                          />*/}
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

EntryPage.contextTypes = {
    muiTheme: PropTypes.shape(),
};

EntryPage.propTypes = {
    appActions: PropTypes.shape(),
    comments: PropTypes.shape(),
    commentsActions: PropTypes.shape(),
    entry: PropTypes.shape(),
    entryCleanFull: PropTypes.func.isRequired,
    entryGetFull: PropTypes.func.isRequired,
    entryGetLatestVersion: PropTypes.func.isRequired,
    fetchingComments: PropTypes.bool,
    fetchingFullEntry: PropTypes.bool,
    history: PropTypes.shape(),
    intl: PropTypes.shape(),
    licenses: PropTypes.shape(),
    location: PropTypes.shape(),
    loggedProfile: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    match: PropTypes.shape(),
    profiles: PropTypes.shape(),
    pendingCommentsActions: PropTypes.shape(),
    newCommentsIds: PropTypes.shape()
};

export default injectIntl(EntryPage);
