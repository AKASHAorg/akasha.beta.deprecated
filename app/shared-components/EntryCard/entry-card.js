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
import { calculateReadingTime } from '../../utils/dataModule';

const EntryCard = (props) => {
    const {
      entry,
      onContentClick,
      onTagClick,
      onUpvote,
      onDownvote,
      onComment,
      onShare,
      onBookmark,
      intl
    } = props;
    const wordCount = entry.get('wordCount');
    const publishedDate = intl.formatRelative(
        new Date(entry.getIn(['status', 'created_at'])).getTime()
    );
    const readingTime = calculateReadingTime(wordCount);
    const cardSubtitle = `${publishedDate} - 
      ${readingTime.hours ? readingTime.hours + ' hours' : ''}
      ${readingTime.minutes} minutes (${wordCount} words)`;
    return (
      <Card className="start-xs" style={{ marginBottom: 16 }}>
        <CardHeader
          title={`${entry.getIn(['author', 'firstName'])} ${entry.getIn(['author', 'lastName'])}`}
          subtitle={`${cardSubtitle}`}
          avatar={entry.getIn(['author', 'optionalData', 'avatar'])}
        />
        <CardTitle
          style={{ padding: '0 16px 8px' }}
          title={entry.get('title')}
          onTouchTap={onContentClick}
        />
        <CardText style={{ padding: '0 16px 8px' }}>
          <div style={{ marginBottom: 8 }}>
            {entry.get('tags').map((tag, key) =>
              <TagChip
                key={key}
                onTagClick={onTagClick}
                tag={tag}
              />
            )}
          </div>
          {entry.get('excerpt')}
        </CardText>
        <CardActions className="col-xs-12">
          <div className="row">
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
          </div>
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
