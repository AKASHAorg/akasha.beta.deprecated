import React from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardText,
    CardActions,
    IconButton } from 'material-ui';
import ThumbUpIcon from 'material-ui/svg-icons/action/thumb-up';
import ThumbDownIcon from 'material-ui/svg-icons/action/thumb-down';
import CommentIcon from 'material-ui/svg-icons/communication/comment';
import ShareIcon from 'material-ui/svg-icons/social/share';
import BookmarkIcon from 'material-ui/svg-icons/action/bookmark-border';
import { injectIntl } from 'react-intl';
import { TagChip } from 'shared-components';
import { calculateReadingTime } from 'utils/dataModule';
import style from './entry-card.scss';

const EntryCard = (props) => {
    const {
      headerTitle,
      publishedDate,
      wordCount,
      excerpt,
      title,
      headerActions,
      cardActions,
      onTitleClick,
      onContentClick,
      onTagClick,
      onUpvote,
      onDownvote,
      onComment,
      onShare,
      onBookmark,
      intl
    } = props;
    const readingTime = calculateReadingTime(wordCount);
    const cardSubtitle = `${publishedDate} -
      ${readingTime.hours ? readingTime.hours + ' hours' : ''}
      ${readingTime.minutes} minutes (${wordCount} words)`;
    return (
      <Card className="start-xs" style={{ marginBottom: 16 }}>
        <div className="row" style={{ padding: '4px 16px' }}>
          <div className="col-xs-12">
            <div className="row middle-xs">
              <div className="col-xs-9 start-xs">
                <h4 style={{ margin: '8px 0' }}>{headerTitle}</h4>
                <h5 style={{ margin: '8px 0' }}>
                  {cardSubtitle}
                </h5>
              </div>
              <div className="col-xs-3 end-xs">
                {headerActions}
              </div>
            </div>
          </div>
        </div>
        <CardText>
          <h2
            onClick={ev => onTitleClick(ev)}
            style={{ cursor: 'pointer' }}
          >
            {title}
          </h2>
        </CardText>
        <CardText>
          <p>{excerpt}</p>
        </CardText>
        <CardActions className="col-xs-12">
          {cardActions}
          {/* <div className="row">
            <div className="col-xs-7">
              <div className="row">
                <div className="col-xs-3">
                  <div className="row middle-xs">
                    <div className="col-xs-7">
                      <IconButton
                        onTouchTap={(ev) => onUpvote(ev, entry)}
                      >
                        <ThumbUpIcon />
                      </IconButton>
                    </div>
                    <div className="col-xs-5">
                      {entry.get('upvotes')}
                    </div>
                  </div>
                </div>
                <div className="col-xs-3">
                  <div className="row middle-xs">
                    <div className="col-xs-7">
                      <IconButton
                        onTouchTap={(ev) => onDownvote(ev, entry)}
                      >
                        <ThumbDownIcon />
                      </IconButton>
                    </div>
                    <div className="col-xs-5">
                      {entry.get('downvotes')}
                    </div>
                  </div>
                </div>
                <div className="col-xs-3">
                  <div className="row middle-xs">
                    <div className="col-xs-7">
                      <IconButton
                        onTouchTap={(ev) => onComment(ev, entry.get('address'))}
                      >
                        <CommentIcon />
                      </IconButton>
                    </div>
                    <div className="col-xs-5">
                      {entry.get('commentCount')}
                    </div>
                  </div>
                </div>
                <div className="col-xs-3">
                  <div className="row middle-xs">
                    <div className="col-xs-7">
                      <IconButton
                        onTouchTap={(ev) => onShare(ev, entry)}
                      >
                        <ShareIcon />
                      </IconButton>
                    </div>
                    <div className="col-xs-5">
                      {entry.get('shareCount')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xs-5 end-xs">
              <IconButton
                onTouchTap={(ev) => onBookmark(ev, entry)}
              >
                <BookmarkIcon />
              </IconButton>
            </div>
          </div> */}
        </CardActions>
      </Card>
    );
};

EntryCard.propTypes = {
    entry: React.PropTypes.object,
    onContentClick: React.PropTypes.func,
    intl: React.PropTypes.object,
    onTagClick: React.PropTypes.func,
    onUpvote: React.PropTypes.func,
    onDownvote: React.PropTypes.func,
    onComment: React.PropTypes.func,
    onShare: React.PropTypes.func,
    onBookmark: React.PropTypes.func,
};
export default injectIntl(EntryCard);
