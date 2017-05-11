import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import ReactTooltip from 'react-tooltip';
import {
    CardHeader,
    Divider,
    IconButton,
    FlatButton,
    SvgIcon,
  } from 'material-ui';
import { DraftJS, MegadraftEditor, editorStateFromRaw, createTypeStrategy } from 'megadraft';
import Link from 'megadraft/lib/components/Link';
import HubIcon from 'material-ui/svg-icons/hardware/device-hub';
import MoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import LessIcon from 'material-ui/svg-icons/navigation/expand-less';
import { Avatar } from '../';
import { EntryCommentReply } from '../svg';
import { MentionDecorators, ProfileHoverCard } from '../../shared-components';
import { entryMessages } from '../../locale-data/messages';
import { getInitials } from '../../utils/dataModule';
import style from './comment.scss';

const { CompositeDecorator, EditorState } = DraftJS;

class Comment extends Component {
    constructor (props) {
        super(props);

        const decorators = new CompositeDecorator([MentionDecorators.nonEditableDecorator, {
            strategy: createTypeStrategy('LINK'),
            component: Link
        }]);
        this.editorState = EditorState.createEmpty(decorators);
        this.state = {
            isExpanded: null,
            anchorHovered: false,
        };
        this.timeout = null;
    }

    componentDidMount () {
        const { comment } = this.props;
        let { isExpanded } = this.state;
        let contentHeight;
        if (this.editorWrapperRef) {
            contentHeight = this.editorWrapperRef.getBoundingClientRect().height;
        }
        if (!comment.data.content) {
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

    componentWillUnmount () {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    getAuthorNameColor = () => {
        const { comment, entryAuthorProfile, loggedProfile, profiles } = this.props;
        const { palette } = this.context.muiTheme;
        const author = profiles.get(comment.data.profile);
        const isEntryAuthor = entryAuthorProfile === author.get('profile');
        const viewerIsAuthor = loggedProfile.get('profile') === author.get('profile');

        if (viewerIsAuthor) {
            return palette.commentViewerIsAuthorColor;
        } else if (isEntryAuthor) {
            return palette.commentIsEntryAuthorColor;
        }
        return palette.commentAuthorColor;
    };

    getExpandedStyle = () => {
        const { isExpanded } = this.state;
        if (isExpanded === false) {
            return { maxHeight: 155, overflow: 'hidden' };
        }
        if (isExpanded === true) {
            return { maxHeight: 'none', overflow: 'visible' };
        }
        return {};
    };

    handleMouseEnter = (ev) => {
        this.setState({
            hoverNode: ev.currentTarget
        });
        this.timeout = setTimeout(() => {
            this.setState({
                anchorHovered: true,
            });
        }, 500);
    };

    handleMouseLeave = () => {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.setState({
            anchorHovered: false,
            hoverNode: null
        });
    };

    toggleExpanded = (ev, isExpanded) => {
        ev.preventDefault();
        this.setState({
            isExpanded
        });
    };

    render () {
        const { comment, children, intl, onReply, profiles, showReplyButton } = this.props;
        const { isExpanded } = this.state;
        const { data } = comment;
        const { date, content } = data;
        const currentContent = editorStateFromRaw(content).getCurrentContent();
        const author = profiles.get(data.profile);
        const { palette } = this.context.muiTheme;
        const authorAkashaId = author.get('akashaId');
        const authorInitials = getInitials(author.get('firstName'), author.get('lastName'));
        const authorAvatar = author.get('avatar');

        return (
          <div
            id={`comment-${comment.get('commentId')}`}
            className={style.root}
            style={{ position: 'relative' }}
          >
            <div className={style.rootInner}>
              <div
                className={`row ${style.commentHeader}`}
                style={{ marginBottom: !content ? '8px' : '0px' }}
              >
                <div className={`col-xs-5 ${style.commentAuthor}`}>
                  <CardHeader
                    avatar={
                      <Avatar
                        image={authorAvatar}
                        onMouseEnter={this.handleMouseEnter}
                        radius={40}
                        style={{
                            display: 'inline-block',
                            cursor: 'pointer',
                            opacity: !content ? 0.5 : 1
                        }}
                        userInitials={authorInitials}
                        // onClick={ev => onAuthorNameClick(ev, profile.get('profile'))}
                        userInitialsStyle={{ fontSize: '20px' }}
                      />
                    }
                    onMouseLeave={this.handleMouseLeave}
                    style={{ padding: 0 }}
                    subtitle={
                      <div style={{ opacity: !content ? 0.5 : 1 }}>
                        {date && intl.formatRelative(new Date(date))}
                      </div>
                    }
                    subtitleStyle={{ paddingLeft: '2px', fontSize: '80%' }}
                    title={
                      <div
                        onMouseEnter={this.handleMouseEnter}
                        style={{ position: 'relative', opacity: !content ? 0.5 : 1 }}
                      >
                        <FlatButton
                          className={style.author_name}
                          hoverColor="transparent"
                          label={authorAkashaId}
                          labelStyle={{
                              textTransform: 'initial',
                              paddingLeft: 4,
                              paddingRight: 4,
                              color: this.getAuthorNameColor()
                          }}
                          // onClick={ev => onAuthorNameClick(ev, profile.get('profile'))}
                          style={{ height: 28, lineHeight: '28px', textAlign: 'left' }}
                        />
                      </div>
                    }
                    titleStyle={{ fontSize: '100%', height: 24 }}
                  >
                    <ProfileHoverCard
                      anchorHovered={this.state.anchorHovered}
                      anchorNode={this.state.hoverNode}
                      profile={author.toJS()}
                    />
                  </CardHeader>
                </div>
                {showReplyButton && content &&
                  <div className="col-xs-7 end-xs">
                    <div className={style.commentActions}>
                      <IconButton onClick={() => onReply(comment.commentId)}>
                        <SvgIcon>
                          <EntryCommentReply />
                        </SvgIcon>
                      </IconButton>
                    </div>
                  </div>
                }
              </div>
              {content &&
                <div
                  ref={(editorWrap) => { this.editorWrapperRef = editorWrap; }}
                  className={`row ${style.commentBody}`}
                  style={this.getExpandedStyle()}
                >
                  <MegadraftEditor
                    readOnly
                    editorState={EditorState.push(this.editorState, currentContent)}
                    sidebarRendererFn={() => null}
                  />
                </div>
              }
              {!content &&
                <div
                  data-tip={intl.formatMessage(entryMessages.unresolvedEntry)}
                  style={{ position: 'absolute', right: '10px', top: '7px', opacity: 0.5 }}
                >
                  <IconButton>
                    <HubIcon color={palette.accent1Color} />
                  </IconButton>
                </div>
              }
              {isExpanded !== null &&
                <div style={{ fontSize: 12, textAlign: 'center' }}>
                  {(isExpanded === false) &&
                    <IconButton onClick={ev => this.toggleExpanded(ev, true)}>
                      <SvgIcon>
                        <MoreIcon />
                      </SvgIcon>
                    </IconButton>
                  }
                  {isExpanded &&
                    <IconButton onClick={ev => this.toggleExpanded(ev, false)}>
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
              <div className={style.commentReply}>
                {children}
              </div>
            }
          </div>
        );
    }
}

Comment.contextTypes = {
    muiTheme: PropTypes.shape()
};

Comment.propTypes = {
    children: PropTypes.node,
    comment: PropTypes.shape(),
    entryAuthorProfile: PropTypes.string,
    intl: PropTypes.shape(),
    loggedProfile: PropTypes.shape(),
    onReply: PropTypes.func.isRequired,
    profiles: PropTypes.shape(),
    showReplyButton: PropTypes.bool,
};

export default injectIntl(Comment);
