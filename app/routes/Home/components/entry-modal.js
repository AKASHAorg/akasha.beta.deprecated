import React from 'react';
import { connect } from 'react-redux';
import {
    CardHeader,
    IconButton,
    FlatButton,
    IconMenu,
    MenuItem,
    Tabs,
    Tab } from 'material-ui';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import { TagChip, Avatar, CommentEditor, Comment, EntryContent } from 'shared-components';
import ArrowDownIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import ArrowUpIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import CommentIcon from 'material-ui/svg-icons/communication/comment';
import ShareIcon from 'material-ui/svg-icons/social/share';
import BookmarkIcon from 'material-ui/svg-icons/action/bookmark-border';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { AppActions, ProfileActions, CommentActions } from 'local-flux';
import imageCreator from '../../../utils/imageUtils';
import styles from './entry-modal.scss';

class EntryModal extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            activeTab: 'all'
        };
    }
    componentDidMount () {
        const { commentActions } = this.props;
        // commentActions.getCommentsByEntry();
    }
    // handle tab changing logic here
    _handleTabChange = (val, ev) => {
        this.setState({
            activeTab: val,
            isTabLoading: true
        });
    };
    // handle tab specific data loading here
    _handleCommentTabActivation = (tab) => {
        const { entryId, commentActions } = this.props;
        commentActions.getCommentsByEntry('entryId', {
            filter: tab.props.value,
            limit: 15,
            skip: 0
        }).then(() => {
            this.setState({
                isTabLoading: false
            });
        });
    };
    _hideEntryModal = () => {
        const { appActions } = this.props;
        appActions.hideEntryModal();
    }
    _handleTagNavigation = (ev, tag) => {
        const { profileState } = this.props;
        const loggedProfile = profileState.get('loggedProfile');
        this._hideEntryModal();
        this.context.router.push(`/${loggedProfile.get('akashaId')}/explore/tag/${tag}`);
    }
    render () {
        const { profileState, appState } = this.props;
        const { palette } = this.context.muiTheme;
        if (!appState.get('showEntry').modal) {
            return null;
        }
        const loggedProfile = profileState.get('loggedProfile');
        const avatarImage = imageCreator(loggedProfile.getIn(['optionalData', 'avatar']));
        const entryContent = appState.get('showEntry').content;
        return (
          <div className={`${styles.root} row center-xs`}>
            <div className="col-xs-6">
              <div className="row start-xs">
                <div className={`${styles.author} col-xs-12 start-xs`}>
                  <div className="row">
                    <div className="col-xs-8">
                      <CardHeader
                        title="Andrei Biga"
                        subtitle="1 day ago - 5 min read (333 words)"
                        avatar="http://c2.staticflickr.com/2/1659/25017672329_e5b9967612_b.jpg"
                      />
                    </div>
                    <div className={`${styles.entryBar} col-xs-4 row end-xs`}>
                      <IconButton onTouchTap={this._hideEntryModal}>
                        <CloseIcon />
                      </IconButton>
                    </div>
                  </div>
                </div>
                <section className={`${styles.entryBody} col-xs-12`}>
                  <h1>
                    The rise of decentralized applications
                  </h1>
                  <EntryContent content={entryContent} />
                </section>
                <div className={`${styles.tags} col-xs-12`}>
                  <div className="row">
                    <TagChip
                      tag="mathempatics"
                      onTagClick={this._handleTagNavigation}
                    />
                    <TagChip
                      tag="apps"
                      onTagClick={this._handleTagNavigation}
                    />
                  </div>
                </div>
                <div className={`${styles.entryActions} col-xs-12`}>
                  <div className="row">
                    <div className="col-xs-8">
                      <div className="row">
                        <div>
                          <FlatButton
                            label="159"
                            icon={<ArrowUpIcon />}
                          />
                        </div>
                        <div>
                          <FlatButton
                            label="3"
                            icon={<ArrowDownIcon />}
                          />
                        </div>
                        <div>
                          <FlatButton
                            label="0"
                            icon={<CommentIcon />}
                          />
                        </div>
                        <div>
                          <FlatButton
                            label="2"
                            icon={<ShareIcon />}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-4 end-xs">
                      <IconButton>
                        <BookmarkIcon />
                      </IconButton>
                      <IconMenu
                        iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                      >
                        <MenuItem primaryText="Flag" />
                      </IconMenu>
                    </div>
                  </div>
                </div>
                <div id="comments" className="comments col-xs-12">
                  <div className="write-comment row middle-xs" style={{ margin: '16px 0' }}>
                    <div>
                      <Avatar
                        editable={false}
                        userInitials={
                          `${loggedProfile.get('firstName')[0]}${loggedProfile.get('lastName')[0]}`
                        }
                        image={avatarImage}
                        radius={40}
                      />
                    </div>
                    <div className="col-xs-10" style={{ marginLeft: 16 }}>
                      <CommentEditor />
                    </div>
                  </div>
                  <div
                    className="comment-list row"
                    style={{
                        borderBottom: '2px solid #DDD',
                        position: 'relative',
                        height: 48
                    }}
                  >
                    <div
                      style={{
                          position: 'absolute',
                          left: 0,
                          height: 48,
                          width: '75%'
                      }}
                    >
                      <Tabs
                        className="comment-list"
                        tabItemContainerStyle={{
                            backgroundColor: 'transparent'
                        }}
                        onChange={this._handleTabChange}
                        value={this.state.activeTab}
                      >
                        <Tab
                          label="ALL COMMENTS (32)"
                          style={{
                              color: '#444',
                              fontWeight: (this.state.activeTab === 'all' ? 600 : 100)
                          }}
                          value={'all'}
                          onActive={this._handleCommentTabActivation}
                        />
                        <Tab
                          label="TOP"
                          style={{
                              color: '#444',
                              fontWeight: (this.state.activeTab === 'top' ? 600 : 100)
                          }}
                          value={'top'}
                          onActive={this._handleCommentTabActivation}
                        />
                        <Tab
                          label="CONTROVERSIAL"
                          style={{
                              color: '#444',
                              fontWeight: (this.state.activeTab === 'controversial' ? 600 : 100)
                          }}
                          value={'controversial'}
                          onActive={this._handleCommentTabActivation}
                        />
                      </Tabs>
                    </div>
                  </div>
                  <Comment
                    author={'Andrei Biga'}
                    publishDate={'3 days ago'}
                    avatar={'http://c2.staticflickr.com/2/1659/25017672329_e5b9967612_b.jpg'}
                    text={
                      `Aww..!! It’s a perfect inspiring article for a beginner. Thanks a
                      looooooooooooot for sharing it Cammi..:-)`
                    }
                    onReply={ev => this._handleReply(ev, comment)}
                    repliesLimit={3}
                    stats={{ upvotes: 159, downvotes: 340, replies: 7 }}
                  >
                    <Comment
                      id="{comment.get('address')}"
                      author={'Andra Mandrea'}
                      publishDate={'1 day ago'}
                      avatar={'https://c2.staticflickr.com/2/1268/552681861_5046590531_q.jpg'}
                      text={
                        '@AndreiBiga Thanks!'
                      }
                      onReply={ev => this._handleReply(ev, comment)}
                      repliesLimit={3}
                      stats={{ upvotes: 159, downvotes: 340, replies: 7 }}
                    />
                  </Comment>
                </div>
              </div>
            </div>
          </div>
        );
    }
}
EntryModal.propTypes = {
    profileState: React.PropTypes.object,
    appActions: React.PropTypes.object,
    appState: React.PropTypes.object,
    entryId: React.PropTypes.object,
    commentActions: React.PropTypes.object
};
EntryModal.contextTypes = {
    router: React.PropTypes.object
};
function mapStateToProps (state) {
    return {
        panelState: state.panelState,
        profileState: state.profileState,
        entryState: state.entryState,
        appState: state.appState
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch),
        commentActions: new CommentActions(dispatch),
        profileActions: new ProfileActions(dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EntryModal);

