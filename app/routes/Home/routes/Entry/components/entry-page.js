import React, { Component } from 'react';
import { CardHeader, Tabs, Tab, SvgIcon, IconButton } from 'material-ui';
import { MegadraftEditor, editorStateFromRaw } from 'megadraft';
import styles from './entry-page.scss';
import readOnlyImagePlugin from 'shared-components/EntryEditor/plugins/readOnlyImage/read-only-image-plugin';
import { TagChip, Avatar } from 'shared-components';
import { EntryComment, EntryDownvote, EntryUpvote } from 'shared-components/svg';
import imageCreator from 'utils/imageUtils';

class EntryPage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            publisherTitleShadow: false,
            activeTab: 'all',
            commentEditorState: editorStateFromRaw(null)
        }
    }
    componentWillMount () {
        const { entry, entryActions, params } = this.props;
        if(!entry) {
            entryActions.getEntry(params.entryId, true);
        }
    }
    componentDidMount() {
        window.addEventListener('scroll', this._handleContentScroll);
        console.log(this.props.entry, 'entry');
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this._handleContentScroll);
    }
    handleUpvote = () => {

    }
    handleDownvote = () => {

    }
    _handleCommentChange = (editorState) => {
        this.setState({
            commentEditorState: editorState
        })
    }
    _handleTabChange = (value) => {
        this.setState({
            activeTab: value
        })
    }
    _handleContentScroll = (ev) => {
        const scrollTop = ev.srcElement.body.scrollTop;
        if(scrollTop > 0) {
            this.setState({
                publisherTitleShadow: true
            });
        } else {
            this.setState({
                publisherTitleShadow: false
            })
        }
    }
    _navigateToTag = (ev, tagName) => {
        console.info('navigateToTag', tagName);
    }
    render() {
        const { entry, votePending } = this.props;
        const { publisherTitleShadow, activeTab } = this.state;
        const { palette } = this.context.muiTheme;
        if(!entry) {
            return <div className={styles.loader}>Loading entry..</div>
        }
        const entryBaseUrl = entry.get('baseUrl');
        const publisher = entry.getIn(['entryEth', 'publisher']);
        const publisherBaseUrl = publisher.get('baseUrl');
        const publisherAvatar = imageCreator(publisher.get('avatar'), publisherBaseUrl);
        const cleanupEntry = entry.getIn(['content']).toJS().draft.slice(5, entry.get('content').toJS().draft.length -3)
        const entryContent = editorStateFromRaw(JSON.parse(cleanupEntry));
        const existingVoteWeight = entry.get('voteWeight') || 0;
        const voteEntryPending = votePending && votePending.find(vote =>
                        vote.entryId === entry.get('entryId'));
        const upvoteIconColor = existingVoteWeight > 0 ? palette.accent3Color : '';
        const downvoteIconColor = existingVoteWeight < 0 ? palette.accent1Color : '';
        const profileName = `${publisher.get('firstName')} ${publisher.get('lastName')}`;
        const userInitials = profileName.match(/\b\w/g).reduce((prev, current) => prev + current, '');
        return (
            <div className={`${styles.root} row`} >
              <div className={`col-xs-12`}>
                <div className={`${styles.entry_page_inner}`}>
                  <div id="content-section" className={`${styles.content_section}`}>
                    <div
                      className={`${styles.entry_publisher_info} ${styles.with_shadow}`}
                      style={{ backgroundColor: '#FFF' }}
                    >
                        <CardHeader
                          avatar={publisherAvatar}
                          title={`${publisher.get('lastName')} ${publisher.get('firstName')}`}
                          subtitle={`1 day ago - 5 min read`}
                          style={{
                              maxWidth: 752,
                              margin: '0 auto',
                              transition: 'box-shadow 0.215s ease-in-out',
                              boxShadow: publisherTitleShadow ? '0px 15px 28px -15px #DDD, 0 12px 15px -15px #000000': 'none'
                          }}
                        />
                    </div>
                    <div className={`${styles.content_inner} row`} >
                      <div className={`col-xs-12`}>
                        <h1 className={`${styles.entry_title}`}>
                          {entry.getIn(['content', 'title'])}
                        </h1>
                      </div>
                      <div className={`${styles.entry_content} col-xs-12`} >
                        <MegadraftEditor
                            readOnly={true}
                            editorState={entryContent}
                            onChange = {() => {}}
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
                        <div className={'${styles.entry_upvote}'}>
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
                        <div className={`$styles.entry_downvote`}>
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
                            image={publisherAvatar}
                            userInitials={userInitials}
                            radius={40}
                          />
                        </div>
                        <div className={`${styles.comment_editor}`}>
                          <MegadraftEditor
                            placeholder={`Write a comment...`}
                            editorState={this.state.commentEditorState}
                            onChange={this._handleCommentChange}
                            sidebarRendererFn={() => null}
                          />
                        </div>
                    </div>
                    <div id="comments-section" className={`${styles.comments_section}`}>
                      <Tabs
                        value={activeTab}
                        onChange={this._handleTabChange}
                      >
                        <Tab label={`ALL COMMENTS (${entry.get('commentsCount')})`} value="all"/>
                        <Tab label={`TOP`} value="top"/>
                        <Tab label={'CONTROVERSIAL'} value="controversial" />
                      </Tabs>
                      <div>
                        <div>Show comments for {activeTab}</div>
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

};
EntryPage.contextTypes = {
    muiTheme: React.PropTypes.shape()
};
export default EntryPage;
