import React from 'react';
import {
    CardHeader,
    Divider,
    IconButton,
    FlatButton,
    SvgIcon,
    CircularProgress
  } from 'material-ui';
import { MegadraftEditor, editorStateFromRaw } from 'megadraft';
import { injectIntl } from 'react-intl';
import ArrowDownIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import ArrowUpIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import ReplayIcon from 'material-ui/svg-icons/av/replay';
import MoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import LessIcon from 'material-ui/svg-icons/navigation/expand-less';
import { Avatar } from 'shared-components';
import style from './comment.scss';
import { getWordCount } from 'utils/dataModule';

class Comment extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isExpanded: null,
            editorState: null
        };
    }
    componentWillMount () {
        const { rawContent } = this.props;
        let isExpanded = null;
        const editorState = editorStateFromRaw(rawContent);
        const wordCount = getWordCount(editorState.getCurrentContent());
        if (wordCount > 60) {
            isExpanded = false;
        }
        this.setState({
            isExpanded,
            editorState
        });
    }
    _toggleExpanded = (ev, isExpanded) => {
        ev.preventDefault();
        this.setState({
            isExpanded
        });
    }
    render () {
        const { isPublishing, viewerIsAuthor, authorName, publishDate, avatar,
            children, isEntryAuthor, intl, onAuthorNameClick } = this.props;
        const { palette } = this.context.muiTheme;
        const { editorState, isExpanded } = this.state;
        let expandedStyle = {};
        let commentAuthorNameColor = palette.commentAuthorColor;
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
          <div className={`${style.root}`}>
            <div className={`row ${style.commentHeader}`}>
              <div className={`col-xs-5 ${style.commentAuthor}`}>
                <CardHeader
                  style={{ padding: 0 }}
                  titleStyle={{ fontSize: '100%' }}
                  subtitleStyle={{ fontSize: '80%' }}
                  title={
                    <FlatButton
                      label={authorName}
                      hoverColor="transparent"
                      style={{ height: 28, lineHeight: '28px' }}
                      labelStyle={{
                          textTransform: 'capitalize',
                          paddingLeft: 4,
                          paddingRight: 4,
                          color: commentAuthorNameColor
                      }}
                      onClick={onAuthorNameClick}
                      className={`${viewerIsAuthor && style.viewer_is_author}
                        ${isEntryAuthor && style.is_entry_author} ${style.author_name}`}
                    />
                  }
                  subtitle={intl.formatRelative(new Date(publishDate))}
                  avatar={
                    <Avatar
                      image={avatar}
                      style={{ display: 'inline-block', cursor: 'pointer' }}
                      userInitials={authorName.match(/\b\w/g).reduce((prev, current) => prev + current, '')}
                      radius={40}
                      onClick={onAuthorNameClick}
                      userInitialsStyle={{ fontSize: 20, textTransform: 'uppercase', fontWeight: 500 }}
                    />
                  }
                />
              </div>
              {isPublishing &&
                <div className={'col-xs-7 end-xs'}>
                  <CircularProgress size={32} />
                </div>
              }
            </div>
            <div className={`row ${style.commentBody}`} style={expandedStyle}>
              <MegadraftEditor
                readOnly
                editorState={editorState}
                sidebarRendererFn={() => null}
              />
            </div>
            {isExpanded !== null &&
              <div style={{ paddingTop: 16, fontSize: 12, textAlign: 'center' }}>
                {(this.state.isExpanded === false) &&
                  <IconButton onClick={ev => this._toggleExpanded(ev, true)}>
                    <SvgIcon>
                      <MoreIcon />
                    </SvgIcon>
                  </IconButton>
                }
                {this.state.isExpanded &&
                  <IconButton onClick={ev => this._toggleExpanded(ev, false)}>
                    <SvgIcon>
                      <LessIcon />
                    </SvgIcon>
                  </IconButton>
                }
              </div>
            }
            <Divider />
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
    authorName: React.PropTypes.string,
    publishDate: React.PropTypes.string,
    avatar: React.PropTypes.string,
    stats: React.PropTypes.object,
    rawContent: React.PropTypes.shape(),
    children: React.PropTypes.node,
    isPublishing: React.PropTypes.bool,
    viewerIsAuthor: React.PropTypes.bool,
    isEntryAuthor: React.PropTypes.bool,
    intl: React.PropTypes.shape(),
    onAuthorNameClick: React.PropTypes.func
};
Comment.contextTypes = {
    router: React.PropTypes.shape(),
    muiTheme: React.PropTypes.shape()
};

export default injectIntl(Comment);
