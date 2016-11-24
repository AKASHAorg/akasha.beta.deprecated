import React, { Component, PropTypes } from 'react';
import { Card, CardHeader, CardTitle, CardText, CardActions, IconButton,
    SvgIcon } from 'material-ui';
import { EntryBookmarkOn, EntryBookmarkOff, EntryComment, EntryDownvote,
    EntryUpvote } from 'shared-components/svg';
import { injectIntl } from 'react-intl';
import { Avatar, TagChip } from 'shared-components';
import { calculateReadingTime } from 'utils/dataModule';
import imageCreator from 'utils/imageUtils';
import { entryMessages } from 'locale-data/messages';
import style from './entry-card.scss';

class EntryCard extends Component {

    selectProfile = () => {
        const { entry, selectProfile } = this.props;
        const profileAddress = entry.getIn(['entryEth', 'publisher', 'profile']);
        selectProfile(profileAddress);
    }

    selectTag = (ev, tag) => {
        const { selectTag } = this.props;
        selectTag(tag);
    }

    render () {
        const { entry, blockNr, selectedTag, intl } = this.props;
        const content = entry.get('content');
        const blockNumberDiff = blockNr - entry.getIn(['entryEth', 'blockNr']);
        const publisher = entry.getIn(['entryEth', 'publisher']);
        const profileName = `${publisher.get('firstName')} ${publisher.get('lastName')}`;
        const userInitials = profileName.match(/\b\w/g).reduce((prev, current) => prev + current, '');
        const avatar = imageCreator(publisher.get('avatar'), publisher.get('baseUrl'));
        const wordCount = content.get('wordCount') || 0;
        const readingTime = calculateReadingTime(wordCount);
        const cardSubtitle = (
          <div>
            {intl.formatMessage(entryMessages.publishedBlockDiff, { blockDiff: blockNumberDiff })}
            <span style={{ padding: '0 5px' }}>-</span>
            {readingTime.hours &&
              intl.formatMessage(entryMessages.hoursCount, { hours: readingTime.hours })
            }
            {intl.formatMessage(entryMessages.minutesCount, { minutes: readingTime.minutes })}
            <span style={{ paddingLeft: '5px' }}>{intl.formatMessage(entryMessages.readTime)}</span>
            <span style={{ padding: '0 5px' }}>
              ({intl.formatMessage(entryMessages.wordsCount, { words: wordCount })})
            </span>
          </div>
        );
        return (
          <Card className="start-xs" style={{ marginBottom: 16 }}>
            <CardHeader
              title={
                <button
                  style={{
                      border: '0px', outline: 'none', background: 'transparent', padding: 0
                  }}
                  onClick={this.selectProfile}
                >
                  {`${publisher.get('firstName')} ${publisher.get('lastName')}`}
                </button>
              }
              subtitle={cardSubtitle}
              avatar={
                <button
                  style={{
                      border: '0px', outline: 'none', background: 'transparent', borderRadius: '50%'
                  }}
                  onClick={this.selectProfile}
                >
                  <Avatar
                    image={avatar}
                    style={{ display: 'inline-block' }}
                    radius={40}
                    userInitials={userInitials}
                    userInitialsStyle={{
                        textTransform: 'uppercase',
                        fontSize: '12px',
                        fontWeight: '600',
                        margin: '0px'
                    }}
                  />
                </button>
              }
              titleStyle={{ fontSize: '16px', fontWeight: '600' }}
              subtitleStyle={{ fontSize: '12px' }}
              style={{ paddingBottom: '4px' }}
            />
            <CardTitle
              title={content.get('title')}
              style={{
                  paddingTop: '4px',
                  paddingBottom: '4px',
                  fontWeight: '600',
                  wordWrap: 'break-word',
                  maxHeight: '80px',
                  overflow: 'hidden'
              }}
            />
            <CardText style={{ paddingTop: '4px', paddingBottom: '4px' }}>
              <div style={{ display: 'flex' }}>
                {content.get('tags').map((tag, key) =>
                  <TagChip
                    key={key}
                    tag={tag}
                    selectedTag={selectedTag}
                    onTagClick={this.selectTag}
                    style={{ height: '24px' }}
                  />
                )}
              </div>
            </CardText>
            <CardText style={{ paddingTop: '4px', paddingBottom: '4px', wordWrap: 'break-word' }}>
              {content.get('excerpt')}
            </CardText>
            <CardActions className="col-xs-12">
              <div style={{ display: 'flex', alignItems: 'center' }} >
                <div>
                  <IconButton
                    onTouchTap={() => null}
                    iconStyle={{ width: '20px', height: '20px' }}
                  >
                    <SvgIcon viewBox="0 0 20 20">
                      <EntryUpvote />
                    </SvgIcon>
                  </IconButton>
                  {entry.get('upvotes')}
                </div>
                <div style={{ fontSize: '16px', padding: '0 5px' }}>
                  {entry.get('score')}
                </div>
                <div>
                  <IconButton
                    onTouchTap={() => null}
                    iconStyle={{ width: '20px', height: '20px' }}
                  >
                    <SvgIcon viewBox="0 0 20 20">
                      <EntryDownvote />
                    </SvgIcon>
                  </IconButton>
                  {entry.get('downvotes')}
                </div>
                <div>
                  <IconButton
                    onTouchTap={() => null}
                    iconStyle={{ width: '20px', height: '20px' }}
                  >
                    <SvgIcon viewBox="0 0 20 20">
                      <EntryComment />
                    </SvgIcon>
                  </IconButton>
                  {entry.get('commentCount')}
                </div>
                <div style={{ flex: '1 1 auto', textAlign: 'right' }}>
                  <IconButton
                    onTouchTap={() => null}
                    iconStyle={{ width: '20px', height: '20px' }}
                  >
                    <SvgIcon viewBox="0 0 20 20">
                      <EntryBookmarkOff />
                    </SvgIcon>
                  </IconButton>
                </div>
              </div>
            </CardActions>
          </Card>
        );
    }
};

EntryCard.propTypes = {
    entry: PropTypes.shape(),
    blockNr: PropTypes.number,
    selectedTag: PropTypes.string,
    selectProfile: PropTypes.func,
    selectTag: PropTypes.func,
    intl: PropTypes.shape()
};
export default injectIntl(EntryCard);
