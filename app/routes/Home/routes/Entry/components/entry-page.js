/* eslint import/no-unresolved: 0, import/extensions: 0 */
import React, { Component, PropTypes } from 'react';
import { Divider, IconButton, SvgIcon } from 'material-ui';
import { injectIntl } from 'react-intl';
import { TagChip, DataLoader, CommentsList, CommentEditor } from 'shared-components';
import { AllRightsReserved, CreativeCommonsBY, CreativeCommonsCC, CreativeCommonsNCEU,
    CreativeCommonsNCJP, CreativeCommonsNC, CreativeCommonsND, CreativeCommonsREMIX,
    CreativeCommonsSHARE, CreativeCommonsZERO, CreativeCommonsPD,
    CreativeCommonsSA } from 'shared-components/svg';
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

        const { entry, entryActions, params, fetchingFullEntry, commentsActions } = this.props;

        if ((!entry && !fetchingFullEntry) || entry.get('entryId') !== params.entryId) {
            entryActions.getFullEntry(params.entryId);
            commentsActions.unloadComments(parseInt(params.entryId, 10), null);
            this.fetchComments(params.entryId);
        }
    }

    componentWillReceiveProps (nextProps) {
        const { params, entry, entryActions,
            loggedProfile } = this.props;

        if (params.entryId !== nextProps.params.entryId && entry.get('entryId') !== nextProps.params.entryId) {
            entryActions.getFullEntry(nextProps.params.entryId);
            this.fetchComments(nextProps.params.entryId);
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
        const { entryActions, commentsActions, params } = this.props;
        window.removeEventListener('scroll', this._handleContentScroll);
        entryActions.unloadFullEntry();
        commentsActions.unloadComments(parseInt(params.entryId, 10));
    }
    fetchComments = (entryId, startId = 0) => {
        const { fetchingComments, commentsActions } = this.props;
        // if it`s not already fetching comments, return
        if (fetchingComments) {
            return;
        }
        commentsActions.getEntryComments(entryId, startId, COMMENT_FETCH_LIMIT);
    }

    isOwnEntry = (nextProps) => {
        const { entry, loggedProfile } = nextProps || this.props;
        return entry.entryEth.publisher.akashaId === loggedProfile.get('akashaId');
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
            {licence.description.map((descr, index) => { // eslint-disable-line consistent-return, array-callback-return, max-len
                if (descr.icon && licenceIcons[descr.icon] !== undefined) {
                    const viewBox = descr.icon === 'CCBY' || descr.icon === 'copyright-1' ?
                        '0 0 20 20' :
                        '0 0 18 18';
                    return (
                      <IconButton
                        key={index}
                        tooltip={descr.text}
                        style={{ padding: '6px', width: '30px', height: '30px' }}
                        iconStyle={{ width: '18px', height: '18px' }}
                      >
                        <SvgIcon viewBox={viewBox}>
                          {React.createElement(licenceIcons[descr.icon])}
                        </SvgIcon>
                      </IconButton>
                    );
                }
            })}
          </div>
        );
    };

    render () {
        const { blockNr, canClaimPending, claimPending, comments, entry,
            fetchingEntryBalance, fetchingFullEntry, intl, licences, loggedProfile, profiles,
            savedEntries, votePending } = this.props;
        const { publisherTitleShadow } = this.state;
        if (!entry || fetchingFullEntry) {
            return <DataLoader flag size={80} style={{ paddingTop: '120px' }} />;
        }
        const licence = licences ?
            licences.find(lic => lic.id === entry.content.licence.id) :
            {};
        const licenceLabel = licence.parent ?
            licences.find(lic => lic.id === licence.parent).label :
            licence.label;
        const loggedProfileData = profiles.find(prf => prf.get('profile') === loggedProfile.get('profile'));
        const loggedProfileAvatar = loggedProfileData.get('avatar');
        const loggedProfileName = `${loggedProfileData.firstName} ${loggedProfileData.lastName}`;
        const loggedProfileUserInitials = loggedProfileName.match(/\b\w/g).reduce((prev, current) => prev + current, '');
        const isSaved = entry && !!savedEntries.find(id => id === entry.entryId);
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
                    blockNr={blockNr}
                    entryBlockNr={entry.entryEth.blockNr}
                    publisher={entry.entryEth.publisher}
                    publisherTitleShadow={publisherTitleShadow}
                    selectProfile={this.selectProfile}
                    timestamp={entry.entryEth.unixStamp}
                    wordCount={entry.content.wordCount}
                  />
                  <EntryPageContent
                    entry={entry}
                  />
                </div>
                <div
                  className={`${styles.entry_infos}`}
                  style={{ display: 'flex', alignItems: 'center', padding: '8px 0' }}
                >
                  <span style={{ textDecoration: 'underline', paddingRight: '10px' }}>
                    {licenceLabel}
                  </span>
                  {this.renderLicenceIcons()}
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
                        {`${intl.formatMessage(entryMessages.allComments)} (${entry.get('commentsCount')})`}
                      </h4>
                      <Divider />
                    </div>
                    <div>
                      <div>
                        <div>
                          <CommentsList
                            loggedProfile={loggedProfile}
                            newlyCreatedComments={
                                comments.filter(comm =>
                                    (!comm.get('tempTx') && !comm.getIn(['data', 'ipfsHash']) &&
                                        !comm.get('commentId'))
                                )
                            }
                            publishingComments={
                                comments.filter(comm => (comm.get('tempTx') && comm.getIn('data', 'profile')))
                            }
                            comments={
                                comments.filter(comm =>
                                  (comm.getIn(['data', 'active']) && !comm.get('tempTx') &&
                                    comm.get('commentId') && comm.getIn(['data', 'ipfsHash']) &&
                                  (comm.get('entryId') === parseInt(entry.get('entryId'), 10)))
                                )
                            }
                            entryId={parseInt(entry.get('entryId'), 10)}
                            commentsCount={entry.get('commentsCount')}
                            fetchLimit={COMMENT_FETCH_LIMIT}
                            onLoadMoreRequest={this.fetchComments}
                            onCommenterClick={this._navigateToProfile}
                            entryAuthorProfile={entry.getIn(['entryEth', 'publisher']).profile}
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
    fetchingComments: PropTypes.bool,
    fetchingEntryBalance: PropTypes.bool,
    fetchingFullEntry: PropTypes.bool,
    intl: PropTypes.shape(),
    licences: PropTypes.shape(),
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
