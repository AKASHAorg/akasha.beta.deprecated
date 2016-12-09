/* eslint import/no-unresolved: 0, import/extensions: 0 */
import React, { Component } from 'react';
import { RaisedButton, Divider } from 'material-ui';
import { MegadraftEditor, editorStateFromRaw, editorStateToJSON } from 'megadraft';
import { injectIntl } from 'react-intl';
import { EntryComment } from 'shared-components/svg';
import { TagChip, Avatar, DataLoader, CommentsList } from 'shared-components';
import { generalMessages, entryMessages } from 'locale-data/messages';
import EntryPageHeader from './entry-page-header';
import EntryPageContent from './entry-page-content';
import EntryPageActions from './entry-page-actions';
import styles from './entry-page.scss';

class EntryPage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            publisherTitleShadow: false,
            activeTab: 'all',
            commentEditorState: editorStateFromRaw(null)
        };
    }
    componentDidMount () {
        window.addEventListener('scroll', this._handleContentScroll);
        const { entry, entryActions, commentsActions, params, fetchingFullEntry,
          fetchingComments } = this.props;

        if ((!entry && !fetchingFullEntry) || entry.get('entryId') !== params.entryId) {
            entryActions.getFullEntry(params.entryId);
            if (!fetchingComments) {
                commentsActions.getEntryComments(params.entryId, 0, 7);
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
    _handleCommentChange = (editorState) => {
        this.setState({
            commentEditorState: editorState
        });
    }
    _handleCommentCreate = (parent) => {
        const { appActions, entry } = this.props;
        const comment = editorStateToJSON(this.state.commentEditorState);
        const payload = {
            content: comment,
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
        this.setState({
            commentEditorState: editorStateFromRaw(null)
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
    _handleLoadMoreComments = () => {
        const { comments } = this.props;
        const lastCommentIndex = comments.sort((a, b) => a.get('commentId') > b.get('commentId')).first();
        console.log('load more comment starting from index', lastCommentIndex);
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
                    <div className={`${styles.comment_writer}`}>
                      <div className={`${styles.avatar_image}`}>
                        <Avatar
                          image={loggedProfileAvatar}
                          userInitials={loggedProfileUserInitials}
                          radius={48}
                        />
                      </div>
                      <div className={`${styles.comment_editor}`}>
                        <MegadraftEditor
                          placeholder={`${intl.formatMessage(entryMessages.writeComment)}...`}
                          editorState={this.state.commentEditorState}
                          onChange={this._handleCommentChange}
                          sidebarRendererFn={() => null}
                        />
                      </div>
                      {this.state.commentEditorState.getCurrentContent().hasText() &&
                        <div className={`${styles.comment_publish_actions} end-xs`}>
                          <RaisedButton
                            label={intl.formatMessage(generalMessages.cancel)}
                            onClick={this._handleCommentCancel}
                          />
                          <RaisedButton
                            label={intl.formatMessage(generalMessages.publish)}
                            onClick={() => this._handleCommentCreate(null)}
                            primary
                            style={{ marginLeft: 8 }}
                          />
                        </div>
                      }
                    </div>
                    <div id="comments-section" className={`${styles.comments_section}`}>
                      <div>
                        <h4>
                          {intl.formatMessage(entryMessages.allComments, {
                              commentsCount: entry.get('commentsCount').toString()
                          })}
                        </h4>
                        <Divider />
                      </div>
                      <div>
                        <div>
                          <DataLoader flag={fetchingComments} >
                            <CommentsList
                              loggedProfile={loggedProfile}
                              comments={comments}
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
