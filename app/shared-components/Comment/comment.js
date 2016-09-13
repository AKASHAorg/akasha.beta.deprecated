import React from 'react';
import {
    CardHeader,
    FlatButton,
    Divider,
    IconButton,
  } from 'material-ui';
import ArrowDownIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import ArrowUpIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import ReplayIcon from 'material-ui/svg-icons/av/replay';
import style from './comment.scss';

class Comment extends React.Component {
    render () {
        return (
          <div className={style.root}>
            <div className={`row ${style.commentHeader}`}>
              <div className={`col-xs-5 ${style.commentAuthor}`}>
                <CardHeader
                  className={style.header}
                  titleStyle={{ fontSize: '80%' }}
                  subtitleStyle={{ fontSize: '80%' }}
                  title={<b>{this.props.author}</b>}
                  subtitle={this.props.publishDate}
                  avatar={this.props.avatar}
                />
              </div>
              <div className="comment-actions col-xs-7">
                <div className="row end-xs">
                  <div className="col-xs-8">
                    <div className="row">
                      <div className="col-xs">
                        <div className="row middle-xs">
                          <div className="col-xs-5">
                            <IconButton><ArrowUpIcon /></IconButton>
                          </div>
                          <div className="col-xs-6">
                            <div style={{ fontSize: '85%' }}>{this.props.stats.upvotes}</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xs">
                        <div className="row middle-xs">
                          <div className="col-xs-5">
                            <IconButton><ArrowDownIcon /></IconButton>
                          </div>
                          <div className="col-xs-6">
                            <div style={{ fontSize: '85%' }}>{this.props.stats.downvotes}</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xs">
                        <div className="row middle-xs">
                          <div className="col-xs-5">
                            <IconButton><ReplayIcon /></IconButton>
                          </div>
                          <div className="col-xs-6 start-xs" style={{ paddingLeft: 16 }}>
                            <div style={{ fontSize: '85%' }}>{this.props.stats.replies}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={`row ${style.commentBody}`}>
              <p style={{ margin: 0 }}>
                {this.props.text}
              </p>
            </div>
            <Divider />
            {this.props.children &&
              <div className={`${style.commentReply}`}>
                {this.props.children}
              </div>
            }
          </div>
        );
    }
}
Comment.propTypes = {
    author: React.PropTypes.string,
    publishDate: React.PropTypes.string,
    avatar: React.PropTypes.string,
    stats: React.PropTypes.object,
    text: React.PropTypes.string,
    children: React.PropTypes.node
};

export default Comment;
