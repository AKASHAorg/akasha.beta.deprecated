import React from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardText,
    CardActions,
    Chip,
    FlatButton,
    IconButton } from 'material-ui';
import ThumbUpIcon from 'material-ui/svg-icons/action/thumb-up';
import ThumbDownIcon from 'material-ui/svg-icons/action/thumb-down';
import CommentIcon from 'material-ui/svg-icons/communication/comment';
import ShareIcon from 'material-ui/svg-icons/social/share';
import BookmarkIcon from 'material-ui/svg-icons/action/bookmark-border';
import { injectIntl } from 'react-intl';
import { calculateReadingTime } from '../../utils/dataModule';

const EntryCard = ({ entry, onContentClick, intl }) => {
    console.log(entry, 'card entry');
    const wordCount = entry.get('wordCount');
    const publishedDate = intl.formatRelative(
        new Date(entry.getIn(['status', 'created_at'])).getTime()
    );
    const readingTime = calculateReadingTime(wordCount);
    const cardSubtitle = `${publishedDate} - ${readingTime.hours ? readingTime.hours + ' hours' : ''}
      ${readingTime.minutes} minutes (${wordCount} words)`;
    const tagStyle = {
        display: 'inline-block',
        border: '1px solid',
        borderColor: '#DDD',
        backgroundColor: '#FFF',
        borderRadius: 3,
        height: 34,
        verticalAlign: 'middle',
        marginRight: 4,
        marginBottom: 4
    };
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
              <Chip style={tagStyle} key={key} >{tag}</Chip>
            )}
          </div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate (…)
        </CardText>
        <CardActions className="col-xs-12">
          <div className="row">
            <div className="col-xs-7">
              <FlatButton label={entry.get('upvotes')} icon={<ThumbUpIcon />} />
              <FlatButton label={entry.get('downvotes')} icon={<ThumbDownIcon />} />
              <FlatButton label={entry.get('commentCount')} icon={<CommentIcon />} />
              <FlatButton label={entry.get('shareCount')} icon={<ShareIcon />} />
            </div>
            <div className="col-xs-5 end-xs">
              <IconButton><BookmarkIcon /></IconButton>
            </div>
          </div>
        </CardActions>
      </Card>
    );
}

EntryCard.propTypes = {
  entry: React.PropTypes.object,
  onContentClick: React.PropTypes.func,
  intl: React.PropTypes.object
};
export default injectIntl(EntryCard);
