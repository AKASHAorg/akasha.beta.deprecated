/* eslint import/no-unresolved: 0, import/extensions: 0 */
import React, { Component } from 'react';
import { CardHeader, SvgIcon, IconButton, RaisedButton, Divider } from 'material-ui';
import { MegadraftEditor, editorStateFromRaw, editorStateToJSON } from 'megadraft';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import { injectIntl } from 'react-intl';
import readOnlyImagePlugin from 'shared-components/EntryEditor/plugins/readOnlyImage/read-only-image-plugin';
import { EntryComment, EntryDownvote, EntryUpvote } from 'shared-components/svg';
import { TagChip, Avatar, DataLoader, Comment } from 'shared-components';
import imageCreator from 'utils/imageUtils';
import { generalMessages, entryMessages } from 'locale-data/messages';
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

        if (!entry && !fetchingFullEntry) {
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
        window.removeEventListener('scroll', this._handleContentScroll);
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
    render () {
        const { entry, votePending, loggedProfile, profiles, intl, fetchingFullEntry } = this.props;
        const { publisherTitleShadow, activeTab } = this.state;
        const { palette } = this.context.muiTheme;
        if (fetchingFullEntry || !entry) {
            return null;
        }
        const publisher = entry.getIn(['entryEth', 'publisher']);
        const publisherBaseUrl = publisher.baseUrl;
        const publisherAvatar = imageCreator(publisher.avatar, publisherBaseUrl);
        const loggedProfileData = profiles.find(prf => prf.get('profile') === loggedProfile.get('profile'));
        const loggedProfileAvatar = loggedProfileData.get('avatar');
        const cleanupEntry = entry.getIn(['content']).toJS().draft.slice(5, entry.get('content').toJS().draft.length - 3);
        const entryContent = editorStateFromRaw(JSON.parse(cleanupEntry));
        const existingVoteWeight = entry.get('voteWeight') || 0;
        const voteEntryPending = votePending && votePending.find(vote =>
                        vote.entryId === entry.get('entryId'));
        const upvoteIconColor = existingVoteWeight > 0 ? palette.accent3Color : '';
        const downvoteIconColor = existingVoteWeight < 0 ? palette.accent1Color : '';
        const profileName = `${publisher.firstName} ${publisher.lastName}`;
        const userInitials = profileName.match(/\b\w/g).reduce((prev, current) => prev + current, '');
        return (
          <DataLoader flag={fetchingFullEntry}>
            <div className={`${styles.root} row`} >
              <div className="col-xs-12">
                <div className={`${styles.entry_page_inner}`}>
                  <div id="content-section" className={`${styles.content_section}`}>
                    <div
                      className={`${styles.entry_publisher_info} ${styles.with_shadow}`}
                      style={{ backgroundColor: '#FFF' }}
                    >
                      <div
                        className={`${styles.entry_publisher_info_inner}`}
                        style={{
                            boxShadow: publisherTitleShadow ?
                              '0px 15px 28px -15px #DDD, 0 12px 15px -15px #000000' : 'none'
                        }}
                      >
                        <CardHeader
                          avatar={publisherAvatar}
                          title={`${publisher.lastName} ${publisher.firstName}`}
                          subtitle={`1 day ago - 5 min read`}
                          style={{
                              width: '93%',
                              display: 'inline-block'
                          }}
                        />
                        <div
                          style={{
                              width: '7%',
                              display: 'inline-block'
                          }}
                        >
                          <IconButton
                            onClick={this._handleBackNavigation}
                          >
                            <SvgIcon>
                              <CloseIcon />
                            </SvgIcon>
                          </IconButton>
                        </div>
                      </div>
                    </div>
                    <div className={`${styles.content_inner} row`} >
                      <div className="col-xs-12">
                        <h1 className={`${styles.entry_title}`}>
                          {entry.getIn(['content', 'title'])}
                        </h1>
                      </div>
                      <div className={`${styles.entry_content} col-xs-12`} >
                        <MegadraftEditor
                          readOnly
                          editorState={entryContent}
                          onChange={() => {}}
                          plugins={[readOnlyImagePlugin]}
                        />
                      </div>
                    </div>
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
                    <div className={`${styles.entry_actions}`}>
                      <div className={`${styles.entry_upvote}`}>
                        <IconButton
                          onTouchTap={this.handleUpvote}
                          iconStyle={{ width: '20px', height: '20px' }}
                          disabled={!entry.get('active') || (voteEntryPending && voteEntryPending.value)
                              || existingVoteWeight !== 0}
                        >
                          <SvgIcon viewBox="0 0 20 20" >
                            <EntryUpvote fill={upvoteIconColor} />
                          </SvgIcon>
                        </IconButton>
                      </div>
                      <div className={`${styles.entry_score_counter}`}>
                        {entry.get('score')}
                      </div>
                      <div className={`${styles.entry_downvote}`}>
                        <IconButton
                          onTouchTap={this.handleDownvote}
                          iconStyle={{ width: '20px', height: '20px' }}
                          disabled={!entry.get('active') || (voteEntryPending && voteEntryPending.value)
                              || existingVoteWeight !== 0}
                        >
                          <SvgIcon viewBox="0 0 20 20">
                            <EntryDownvote fill={downvoteIconColor} />
                          </SvgIcon>
                        </IconButton>
                        {existingVoteWeight < 0 &&
                          <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                textAlign: 'center',
                                fontSize: '10px',
                                color: palette.accent1Color
                            }}
                          >
                            {existingVoteWeight}
                          </div>
                        }
                      </div>
                    </div>
                    <div className={`${styles.comment_writer}`}>
                      <div className={`${styles.avatar_image}`}>
                        <Avatar
                          image={loggedProfileAvatar}
                          userInitials={userInitials}
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
                          <Comment
                            author={'Comment Author name here'}
                            publishDate={'3 days ago'}
                            avatar={'http://c2.staticflickr.com/2/1659/25017672329_e5b9967612_b.jpg'}
                            text={
                              `comment text here!!!`
                            }
                            onReply={ev => this._handleReply(ev, 'comment')}
                            repliesLimit={3}
                            stats={{ upvotes: '', downvotes: '', replies: '' }}
                          />
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
    votePending: React.PropTypes.bool,
    loggedProfile: React.PropTypes.shape(),
    profiles: React.PropTypes.shape(),
    appActions: React.PropTypes.shape(),
    entryActions: React.PropTypes.shape(),
    intl: React.PropTypes.shape(),
    params: React.PropTypes.shape(),
    fetchingFullEntry: React.PropTypes.bool
};
EntryPage.contextTypes = {
    muiTheme: React.PropTypes.shape(),
    router: React.PropTypes.shape()
};
export default injectIntl(EntryPage);
