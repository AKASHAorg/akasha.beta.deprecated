import React from 'react';
import ReactTooltip from 'react-tooltip';
import {
    CardHeader,
    Divider,
    IconButton,
    FlatButton,
    SvgIcon,
    CircularProgress
  } from 'material-ui';
import { DraftJS, MegadraftEditor, editorStateFromRaw } from 'megadraft';
import HubIcon from 'material-ui/svg-icons/hardware/device-hub';
import MoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import LessIcon from 'material-ui/svg-icons/navigation/expand-less';
import { EntryCommentReply } from 'shared-components/svg'; // eslint-disable-line import/no-unresolved, import/extensions
import { Avatar, MentionDecorators, ProfileHoverCard } from 'shared-components'; // eslint-disable-line import/no-unresolved, import/extensions
import { entryMessages } from 'locale-data/messages'; // eslint-disable-line import/no-unresolved, import/extensions
import { getInitials } from 'utils/dataModule'; // eslint-disable-line import/no-unresolved, import/extensions
import style from './comment.scss';

const { CompositeDecorator, EditorState } = DraftJS;
const REPLIES_ENABLED = true;

class Comment extends React.Component {
    constructor (props) {
        super(props);

        const decorators = new CompositeDecorator([MentionDecorators.nonEditableDecorator]);
        this.editorState = EditorState.createEmpty(decorators);
        this.state = {
            isExpanded: null,
            anchorHovered: false,
        };
    }
    componentDidMount () {
        const { comment } = this.props;
        let { isExpanded } = this.state;
        const contentHeight = this.editorWrapperRef.getBoundingClientRect().height;
        if (comment.data && !comment.data.content) {
            isExpanded = null;
        }
        if (contentHeight > 155) {
            isExpanded = false;
        }
        return this.setState({ // eslint-disable-line react/no-did-mount-set-state
            isExpanded
        });
    }

    componentDidUpdate (prevProps, prevState) {
        if (this.state.anchorHovered && !prevState.anchorHovered) {
            ReactTooltip.rebuild();
        }
        if (!this.state.anchorHovered && prevState.anchorHovered) {
            ReactTooltip.hide();
        }
    }

    _handleMouseEnter = (ev) => {
        this.setState({
            anchorHovered: true,
            hoverNode: ev.currentTarget
        });
    };

    _handleMouseLeave = () => {
        this.setState({
            anchorHovered: false
        });
    };

    _toggleExpanded = (ev, isExpanded) => {
        ev.preventDefault();
        this.setState({
            isExpanded
        });
    };

    render () {
        const { isPublishing, comment, children, intl, onAuthorNameClick, entryAuthorProfile,
          loggedProfile, showReplyButton } = this.props;
        const { isExpanded } = this.state;
        const { data } = comment;
        const { profile, date, content } = data;
        const { palette } = this.context.muiTheme;
        const authorAkashaId = `${profile.get('akashaId')}`;
        const authorInitials = getInitials(profile.get('firstName'), profile.get('lastName'));
        const authorAvatar = (profile.get('avatar') === `${profile.get('baseUrl')}/`) ?
            null : profile.get('avatar');
        const isEntryAuthor = entryAuthorProfile === profile.get('profile');
        const viewerIsAuthor = loggedProfile.get('profile') === profile.get('profile');
        let commentAuthorNameColor = palette.commentAuthorColor;
        let expandedStyle = {};
        if (isExpanded === false) {
            expandedStyle = {
                maxHeight: 155,
                overflow: 'hidden'
            };
        }
        if (isExpanded === true) {
            expandedStyle = {
                maxHeight: 'none',
                overflow: 'visible'
            };
        }
        if (viewerIsAuthor) {
            commentAuthorNameColor = palette.commentViewerIsAuthorColor;
        }
        if (isEntryAuthor) {
            commentAuthorNameColor = palette.commentIsEntryAuthorColor;
        }
        return (
          <div
            id={`comment-${comment.get('commentId')}`}
            className={`${style.root}`}
            style={{ position: 'relative' }}
          >
            <div className={`${style.rootInner}`}>
              <div
                className={`row ${style.commentHeader}`}
                style={{ marginBottom: !content ? '8px' : '0px' }}
              >
                <div className={`col-xs-5 ${style.commentAuthor}`}>
                  <CardHeader
                    style={{ padding: 0 }}
                    titleStyle={{ fontSize: '100%', height: 24 }}
                    subtitleStyle={{ paddingLeft: '2px', fontSize: '80%' }}
                    onMouseLeave={this._handleMouseLeave}
                    title={
                      <div
                        style={{
                            position: 'relative',
                            opacity: !content ? 0.5 : 1
                        }}
                        onMouseEnter={this._handleMouseEnter}
                      >
                        <FlatButton
                          label={authorAkashaId}
                          hoverColor="transparent"
                          style={{ height: 28, lineHeight: '28px', textAlign: 'left' }}
                          labelStyle={{
                              textTransform: 'initial',
                              paddingLeft: 4,
                              paddingRight: 4,
                              color: commentAuthorNameColor
                          }}
                          onClick={ev => onAuthorNameClick(ev, profile.get('profile'))}
                          className={`${viewerIsAuthor && style.viewer_is_author}
                            ${isEntryAuthor && style.is_entry_author} ${style.author_name}`}
                        />
                      </div>
                    }
                    subtitle={
                      <div
                        style={{
                            opacity: !content ? 0.5 : 1
                        }}
                      >
                        {date && intl.formatRelative(new Date(date))}
                      </div>
                    }
                    avatar={
                      <Avatar
                        image={authorAvatar}
                        style={{
                            display: 'inline-block',
                            cursor: 'pointer',
                            opacity: !content ? 0.5 : 1
                        }}
                        userInitials={authorInitials}
                        radius={40}
                        onClick={ev => onAuthorNameClick(ev, profile.get('profile'))}
                        userInitialsStyle={{ fontSize: 20, textTransform: 'uppercase', fontWeight: 500 }}
                        onMouseEnter={this._handleMouseEnter}
                      />
                    }
                  >
                    <ProfileHoverCard
                      anchorHovered={this.state.anchorHovered}
                      profile={profile.toJS()}
                      anchorNode={this.state.hoverNode}
                    />
                  </CardHeader>
                </div>
                {!isPublishing && REPLIES_ENABLED && showReplyButton && content &&
                  <div className={'col-xs-7 end-xs'}>
                    <div className={`${style.commentActions}`}>
                      <IconButton onClick={this.props.onReply}>
                        <SvgIcon>
                          <EntryCommentReply />
                        </SvgIcon>
                      </IconButton>
                    </div>
                  </div>
                }
                {isPublishing &&
                  <div className={'col-xs-7 end-xs'}>
                    <CircularProgress size={32} />
                  </div>
                }
              </div>
              {content &&
                <div
                  ref={(editorWrap) => { this.editorWrapperRef = editorWrap; }}
                  className={`row ${style.commentBody}`}
                  style={expandedStyle}
                >
                  <MegadraftEditor
                    readOnly
                    editorState={EditorState.push(this.editorState, editorStateFromRaw(content).getCurrentContent())}
                    sidebarRendererFn={() => null}
                  />
                </div>
              }
              {!content &&
                <div data-tip={intl.formatMessage(entryMessages.unresolvedEntry)}>
                  <IconButton
                    style={{
                        position: 'absolute',
                        right: '10px',
                        top: '7px',
                        opacity: 0.5
                    }}
                  >
                    <HubIcon color={palette.accent1Color} />
                  </IconButton>
                </div>
              }
              {isExpanded !== null &&
                <div style={{ fontSize: 12, textAlign: 'center' }}>
                  {(isExpanded === false) &&
                    <IconButton onClick={ev => this._toggleExpanded(ev, true)}>
                      <SvgIcon>
                        <MoreIcon />
                      </SvgIcon>
                    </IconButton>
                  }
                  {isExpanded &&
                    <IconButton onClick={ev => this._toggleExpanded(ev, false)}>
                      <SvgIcon>
                        <LessIcon />
                      </SvgIcon>
                    </IconButton>
                  }
                </div>
              }
              <Divider />
            </div>
            {children &&
              <div className={`${style.commentReply}`}>
                {children}
              </div>
            }
          </div>
        );
    }
}
Comment.propTypes = {
    children: React.PropTypes.node,
    comment: React.PropTypes.shape(),
    entryAuthorProfile: React.PropTypes.string,
    intl: React.PropTypes.shape(),
    isPublishing: React.PropTypes.bool,
    loggedProfile: React.PropTypes.shape(),
    onAuthorNameClick: React.PropTypes.func,
    onReply: React.PropTypes.func,
    showReplyButton: React.PropTypes.bool,
};
Comment.contextTypes = {
    router: React.PropTypes.shape(),
    muiTheme: React.PropTypes.shape()
};

export default Comment;
