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

    componentDidMount () {
        const { entryActions, loggedAkashaId, entry } = this.props;
        entryActions.getVoteOf(loggedAkashaId, entry.get('entryId'));
    }

    selectProfile = () => {
        const { entry, loggedAkashaId } = this.props;
        const { router } = this.context;
        const profileAddress = entry.getIn(['entryEth', 'publisher', 'profile']);
        router.push(`/${loggedAkashaId}/profile/${profileAddress}`);
    }

    selectTag = (ev, tag) => {
        const { selectTag } = this.props;
        selectTag(tag);
    }

    handleUpvote = () => {
        const { entry, entryActions } = this.props;
        const firstName = entry.getIn(['entryEth', 'publisher', 'firstName']);
        const lastName = entry.getIn(['entryEth', 'publisher', 'lastName']);
        const payload = {
            publisherName: `${firstName} ${lastName}`,
            entryTitle: entry.getIn(['content', 'title']),
            entryId: entry.get('entryId'),
            active: entry.get('active')
        };
        entryActions.addUpvoteAction(payload);
    }

    handleDownvote = () => {
        const { entry, entryActions } = this.props;
        const firstName = entry.getIn(['entryEth', 'publisher', 'firstName']);
        const lastName = entry.getIn(['entryEth', 'publisher', 'lastName']);
        const payload = {
            publisherName: `${firstName} ${lastName}`,
            entryTitle: entry.getIn(['content', 'title']),
            entryId: entry.get('entryId')
        };
        entryActions.addDownvoteAction(payload);
    }

    handleBookmark = () => {
        const { entry, loggedAkashaId, isSaved, entryActions } = this.props;
        if (isSaved) {
            entryActions.deleteEntry(loggedAkashaId, entry.get('entryId'));
            entryActions.moreSavedEntriesList(1);
        } else {
            entryActions.saveEntry(loggedAkashaId, entry.get('entryId'));
        }
    }
    _handleEntryNavigation = () => {
      const { entry, loggedAkashaId } = this.props;
      this.context.router.push(`/${loggedAkashaId}/entry/${entry.get('entryId')}`);
    }
    render () {
        const { entry, blockNr, selectedTag, voteEntryPending, isSaved, style, intl } = this.props;
        const { palette } = this.context.muiTheme;
        const content = entry.get('content');
        const existingVoteWeight = entry.get('voteWeight') || 0;
        const blockNumberDiff = blockNr - entry.getIn(['entryEth', 'blockNr']);
        const publisher = entry.getIn(['entryEth', 'publisher']);
        const profileName = `${publisher.get('firstName')} ${publisher.get('lastName')}`;
        const userInitials = profileName.match(/\b\w/g).reduce((prev, current) => prev + current, '');
        const avatar = imageCreator(publisher.get('avatar'), publisher.get('baseUrl'));
        const wordCount = content.get('wordCount') || 0;
        const readingTime = calculateReadingTime(wordCount);
        const upvoteIconColor = existingVoteWeight > 0 ? palette.accent3Color : '';
        const downvoteIconColor = existingVoteWeight < 0 ? palette.accent1Color : '';
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
          <Card
            className="start-xs"
            style={Object.assign({}, { margin: '5px 5px 16px 5px' }, style)}
          >
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
                  overflow: 'hidden',
                  cursor: 'pointer'
              }}
              onClick={this._handleEntryNavigation}
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
                <div style={{ position: 'relative' }}>
                  <IconButton
                    onTouchTap={this.handleUpvote}
                    iconStyle={{ width: '20px', height: '20px' }}
                    disabled={!entry.get('active') || (voteEntryPending && voteEntryPending.value)
                        || existingVoteWeight !== 0}
                  >
                    <SvgIcon viewBox="0 0 20 20" >
                      <EntryUpvote fill={upvoteIconColor} />
                    </SvgIcon>
                  </IconButton>
                  {existingVoteWeight > 0 &&
                    <div
                      style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          textAlign: 'center',
                          fontSize: '10px',
                          color: palette.accent3Color
                      }}
                    >
                      +{existingVoteWeight}
                    </div>
                  }
                </div>
                <div style={{ fontSize: '16px', padding: '0 5px', letterSpacing: '2px' }}>
                  {entry.get('score')}
                </div>
                <div style={{ position: 'relative' }}>
                  <IconButton
                    onTouchTap={this.handleDownvote}
                    iconStyle={{ width: '20px', height: '20px' }}
                    disabled={!entry.get('active') || (voteEntryPending && voteEntryPending.value)
                        || existingVoteWeight !== 0}
                  >
                    <SvgIcon viewBox="0 0 20 20">
                      <EntryDownvote fill={downvoteIconColor} />
                    </SvgIcon>
                  </IconButton>
                  {existingVoteWeight < 0 &&
                    <div
                      style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          textAlign: 'center',
                          fontSize: '10px',
                          color: palette.accent1Color
                      }}
                    >
                      {existingVoteWeight}
                    </div>
                  }
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
                </div>
                <div style={{ fontSize: '16px', paddingRight: '5px' }}>
                  {entry.get('commentsCount')}
                </div>
                <div style={{ flex: '1 1 auto', textAlign: 'right' }}>
                  <IconButton
                    onTouchTap={this.handleBookmark}
                    iconStyle={{ width: '20px', height: '20px' }}
                  >
                    <SvgIcon viewBox="0 0 20 20">
                      {isSaved ?
                        <EntryBookmarkOn /> :
                        <EntryBookmarkOff />
                      }
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
    loggedAkashaId: PropTypes.string,
    entry: PropTypes.shape(),
    blockNr: PropTypes.number,
    selectedTag: PropTypes.string,
    selectProfile: PropTypes.func,
    selectTag: PropTypes.func,
    voteEntryPending: PropTypes.shape(),
    isSaved: PropTypes.bool,
    entryActions: PropTypes.shape(),
    style: PropTypes.shape(),
    intl: PropTypes.shape()
};

EntryCard.contextTypes = {
    muiTheme: PropTypes.shape(),
    router: PropTypes.shape()
};

export default injectIntl(EntryCard);
