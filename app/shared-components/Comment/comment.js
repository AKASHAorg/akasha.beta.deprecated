import React from 'react';
import {
    CardHeader,
    FlatButton,
    Divider,
    IconButton,
  } from 'material-ui';
import { MegadraftEditor, editorStateFromRaw } from 'megadraft';
import { injectIntl } from 'react-intl';
import ArrowDownIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import ArrowUpIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import ReplayIcon from 'material-ui/svg-icons/av/replay';
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
        const { isPublishing, viewerIsAuthor, authorName, publishDate, avatar, children,
          isEntryAuthor, intl } = this.props;
        const { editorState, isExpanded } = this.state;
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
        return (
          <div className={`${style.root}`}>
            <div className={`row ${style.commentHeader}`}>
              <div className={`col-xs-5 ${style.commentAuthor}`}>
                <CardHeader
                  style={{ padding: 0 }}
                  titleStyle={{ fontSize: '100%' }}
                  subtitleStyle={{ fontSize: '80%' }}
                  title={
                    <b
                      className={`${viewerIsAuthor && style.viewer_is_author}
                        ${isEntryAuthor && style.is_entry_author} ${style.author_name}`}
                    >
                      {authorName}
                    </b>
                  }
                  subtitle={intl.formatRelative(new Date(publishDate))}
                  avatar={avatar}
                />
              </div>
              {isPublishing &&
                <div className={'col-xs-7 end-xs'}>
                  *
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
              <div style={{ paddingTop: 16, fontSize: 12 }}>
                {(this.state.isExpanded === false) &&
                  <a href="#" onClick={ev => this._toggleExpanded(ev, true)}>View More</a>
                }
                {this.state.isExpanded &&
                  <a href="#" onClick={ev => this._toggleExpanded(ev, false)}>View less</a>
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
    intl: React.PropTypes.shape()
};

export default injectIntl(Comment);
