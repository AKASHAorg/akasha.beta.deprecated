/* eslint import/no-unresolved: 0, import/extensions: 0 */
import React, { Component } from 'react';
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
        const { entry, entryActions, commentsActions, params, fetchingFullEntry,
          fetchingComments } = this.props;

        if ((!entry && !fetchingFullEntry) || entry.get('entryId') !== params.entryId) {
            entryActions.getFullEntry(params.entryId);
            if (!fetchingComments) {
                commentsActions.getEntryComments(params.entryId, 0, COMMENT_FETCH_LIMIT);
            }
        }
    }
    componentWillReceiveProps (nextProps) {
        const { params, entry, entryActions, fetchingComments, commentsActions } = this.props;
        if (params.entryId !== nextProps.params.entryId && entry.get('entryId') !== nextProps.params.entryId) {
            entryActions.getFullEntry(params.entryId);
            if (!fetchingComments) {
                commentsActions.getEntryComments(params.entryId, 0, 7);
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
    handleUpvote = () => {

    }
    handleDownvote = () => {

    }
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
    _navigateToTag = (ev, tagName) => {
        console.info('navigateToTag', tagName);
    }
    _handleBackNavigation = () => {
        this.context.router.goBack();
    }
    _handleLoadMoreComments = (fromId) => {
        console.log('load more comment starting from id', fromId);
    }
    render () {
        const { entry, votePending, loggedProfile, profiles, intl, fetchingFullEntry,
          fetchingComments, comments } = this.props;
        const { publisherTitleShadow } = this.state;
        const loggedProfileData = profiles.find(prf => prf.get('profile') === loggedProfile.get('profile'));
        const loggedProfileAvatar = loggedProfileData.get('avatar');
        const loggedProfileName = `${loggedProfileData.firstName} ${loggedProfileData.lastName}`;
        const loggedProfileUserInitials = loggedProfileName.match(/\b\w/g).reduce((prev, current) => prev + current, '');
        return (
          <DataLoader flag={!entry || fetchingFullEntry} timeout={500}>
            <div className={`${styles.root} row`} >
              <div className="col-xs-12">
                <div className={`${styles.entry_page_inner}`}>
                  <div id="content-section" className={`${styles.content_section}`}>
                    <EntryPageHeader
                      publisher={entry.entryEth.publisher}
                      publisherTitleShadow={publisherTitleShadow}
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
                      existingVoteWeight={(entry.get('voteWeight') || 0)}
                      votePending={votePending}
                      entryIsActive={entry.get('active')}
                      entryScore={entry.get('score')}
                      entryId={entry.get('entryId')}
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
          </DataLoader>
        );
    }
}
EntryPage.propTypes = {
    entry: React.PropTypes.shape(),
    votePending: React.PropTypes.shape(),
    loggedProfile: React.PropTypes.shape(),
    profiles: React.PropTypes.shape(),
    appActions: React.PropTypes.shape(),
    entryActions: React.PropTypes.shape(),
    commentsActions: React.PropTypes.shape(),
    intl: React.PropTypes.shape(),
    params: React.PropTypes.shape(),
    fetchingFullEntry: React.PropTypes.bool,
    fetchingComments: React.PropTypes.bool,
    comments: React.PropTypes.shape()
};
EntryPage.contextTypes = {
    muiTheme: React.PropTypes.shape(),
    router: React.PropTypes.shape()
};
export default injectIntl(EntryPage);
