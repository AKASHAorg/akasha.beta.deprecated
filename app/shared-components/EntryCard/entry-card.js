import React, { Component, PropTypes } from 'react';
import { Card, CardHeader, CardTitle, CardText, CardActions, IconButton, FlatButton,
    SvgIcon } from 'material-ui';
import WarningIcon from 'material-ui/svg-icons/alert/warning';
import HubIcon from 'material-ui/svg-icons/hardware/device-hub';
import EditIcon from 'material-ui/svg-icons/image/edit';
import { EntryBookmarkOn, EntryBookmarkOff, EntryComment, EntryDownvote,
    EntryUpvote, ToolbarEthereum } from 'shared-components/svg';
import { injectIntl } from 'react-intl';
import { Avatar, EntryVotesPanel, TagChip } from 'shared-components';
import { calculateReadingTime, getInitials } from 'utils/dataModule';
import imageCreator from 'utils/imageUtils';
import { entryMessages } from 'locale-data/messages';
import styles from './entry-card.scss';

class EntryCard extends Component {
    constructor (props) {
        super(props);

        this.state = {
            expanded: false,
            showVotes: false
        };
    }

    componentDidMount () {
        const { entryActions, loggedAkashaId, entry } = this.props;
        entryActions.getVoteOf(loggedAkashaId, entry.get('entryId'));
        if (this.isOwnEntry()) {
            entryActions.canClaim(entry.get('entryId'));
            entryActions.getEntryBalance(entry.get('entryId'));
        }
    }

    shouldComponentUpdate (nextProps, nextState) {
        const { blockNr, canClaimPending, claimPending, entry, fetchingEntryBalance, isSaved,
            voteEntryPending } = nextProps;
        if (blockNr !== this.props.blockNr ||
            canClaimPending !== this.props.canClaimPending ||
            claimPending !== this.props.claimPending ||
            !entry.equals(this.props.entry) ||
            fetchingEntryBalance !== this.props.fetchingEntryBalance ||
            isSaved !== this.props.isSaved ||
            voteEntryPending !== this.props.voteEntryPending ||
            nextState.expanded !== this.state.expanded ||
            nextState.showVotes !== this.state.showVotes
        ) {
            return true;
        }
        return false;
    }

    onExpandChange = (expanded) => {
        this.setState({
            expanded
        });
    };

    isOwnEntry = () => {
        const { entry, loggedAkashaId } = this.props;
        return entry.getIn(['entryEth', 'publisher', 'akashaId']) === loggedAkashaId;
    };

    isPossiblyUnsafe = () => {
        const { entry } = this.props;
        return !this.isOwnEntry() && parseInt(entry.get('score'), 10) <= -30;
    };

    selectProfile = () => {
        const { entry, hidePanel, loggedAkashaId } = this.props;
        const { router } = this.context;
        const profileAddress = entry.getIn(['entryEth', 'publisher', 'profile']);
        hidePanel();
        router.push(`/${loggedAkashaId}/profile/${profileAddress}`);
    };

    selectTag = (ev, tag) => {
        const { hidePanel, selectTag } = this.props;
        hidePanel();
        selectTag(tag);
    };

    handleUpvote = () => {
        const { entry, entryActions } = this.props;
        const akashaId = entry.getIn(['entryEth', 'publisher', 'akashaId']);
        const payload = {
            publisherAkashaId: akashaId,
            entryTitle: entry.getIn(['content', 'title']),
            entryId: entry.get('entryId'),
            active: entry.get('active')
        };
        entryActions.addUpvoteAction(payload);
    };

    handleDownvote = () => {
        const { entry, entryActions } = this.props;
        const akashaId = entry.getIn(['entryEth', 'publisher', 'akashaId']);
        const payload = {
            publisherAkashaId: akashaId,
            entryTitle: entry.getIn(['content', 'title']),
            entryId: entry.get('entryId')
        };
        entryActions.addDownvoteAction(payload);
    };

    handleComments = () => {
        const { router } = this.context;
        const { entry, hidePanel, loggedAkashaId } = this.props;
        hidePanel();
        router.push(`/${loggedAkashaId}/entry/${entry.get('entryId')}#comments-section`);
    };

    handleBookmark = () => {
        const { entry, loggedAkashaId, isSaved, entryActions } = this.props;
        if (isSaved) {
            entryActions.deleteEntry(loggedAkashaId, entry.get('entryId'));
            entryActions.moreSavedEntriesList(1);
        } else {
            entryActions.saveEntry(loggedAkashaId, entry.get('entryId'));
        }
    };

    handleClaim = () => {
        const { entry, entryActions } = this.props;
        if (!entry.get('canClaim')) {
            return;
        }
        const payload = {
            entryTitle: entry.getIn(['content', 'title']),
            entryId: entry.get('entryId')
        };
        entryActions.addClaimAction(payload);
    };

    handleEdit = () => {
        const { entry, hidePanel, loggedAkashaId } = this.props;
        const { router } = this.context;
        hidePanel();
        router.push(`/${loggedAkashaId}/draft/new?editEntry=${entry.get('entryId')}`);
    };

    _handleEntryNavigation = () => {
        const { entry, hidePanel, loggedAkashaId } = this.props;
        hidePanel();
        this.context.router.push(`/${loggedAkashaId}/entry/${entry.get('entryId')}`);
    };

    openVotesPanel = () => {
        this.setState({
            showVotes: true
        });
    };

    closeVotesPanel = () => {
        this.setState({
            showVotes: false
        });
    };

    renderPlaceholder = () => {
        const { intl } = this.props;
        const { palette } = this.context.muiTheme;
        return (
          <Card style={{ margin: '5px 5px 16px 5px', width: '640px', paddingTop: '8px' }}>
            <CardText style={{ position: 'relative' }}>
              {intl.formatMessage(entryMessages.unresolvedEntry)}
              <div
                data-tip={intl.formatMessage(entryMessages.unresolvedEntry)}
                style={{
                    position: 'absolute',
                    right: '10px',
                    top: '2px',
                    display: 'inline-block'
                }}
              >
                <IconButton>
                  <HubIcon color={palette.accent1Color} />
                </IconButton>
              </div>
            </CardText>
          </Card>
        );
    }

    render () {
        const { canClaimPending, claimPending, entry, fetchingEntryBalance, intl, isSaved,
            selectedTag, style, voteEntryPending } = this.props;
        const { palette } = this.context.muiTheme;
        const content = entry.get('content');
        const existingVoteWeight = entry.get('voteWeight') || 0;
        const publishDate = new Date(entry.getIn(['entryEth', 'unixStamp']) * 1000);
        const publisher = entry.getIn(['entryEth', 'publisher']);
        if (!publisher) {
            return this.renderPlaceholder();
        }
        const userInitials = getInitials(publisher.get('firstName'), publisher.get('lastName'));
        const avatar = publisher.get('avatar') ?
            imageCreator(publisher.get('avatar'), publisher.get('baseUrl')) :
            null;
        const wordCount = (content && content.get('wordCount')) || 0;
        const readingTime = calculateReadingTime(wordCount);
        const upvoteIconColor = existingVoteWeight > 0 ? palette.accent3Color : '';
        const downvoteIconColor = existingVoteWeight < 0 ? palette.accent1Color : '';
        const cardSubtitle = (
          <div>
            <span style={{ paddingRight: '5px' }}>
              {intl.formatMessage(entryMessages.published)}
            </span>
            <span
              data-tip={`Block ${entry.getIn(['entryEth', 'blockNr'])}`}
              style={{ display: 'inline-block', fontWeight: 600 }}
            >
              {intl.formatRelative(publishDate)}
            </span>
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
            expanded={this.isPossiblyUnsafe() ? this.state.expanded : true}
            onExpandChange={this.onExpandChange}
            style={Object.assign(
                {},
                {
                    margin: '5px 5px 16px 5px',
                    width: '640px',
                    opacity: (this.isPossiblyUnsafe() && !this.state.expanded) || !content ? 0.5 : 1
                },
                style
            )}
          >
            <CardHeader
              title={
                <button
                  className={styles.contentLink}
                  style={{ border: '0px', outline: 'none', background: 'transparent', padding: 0 }}
                  onClick={this.selectProfile}
                >
                  <div
                    style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '470px',
                        textAlign: 'left'
                    }}
                  >
                    {`${publisher.get('firstName')} ${publisher.get('lastName')}`}
                  </div>
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
              actAsExpander={this.isPossiblyUnsafe()}
            >
              {this.isPossiblyUnsafe() && content &&
                <div
                  data-tip="Possibly unsafe content"
                  style={{
                      display: 'inline-block',
                      position: 'absolute',
                      right: '16px',
                      top: '10px'
                  }}
                >
                  <IconButton>
                    <WarningIcon color={palette.accent1Color} />
                  </IconButton>
                </div>
              }
              {this.isOwnEntry() &&
                <div
                  data-tip={entry.get('active') ?
                      'Edit entry' :
                      'This entry can no longer be edited'
                  }
                  style={{
                      display: 'inline-block',
                      position: 'absolute',
                      right: '16px',
                      top: '10px'
                  }}
                >
                  <IconButton
                    onTouchTap={this.handleEdit}
                    iconStyle={{ width: '20px', height: '20px' }}
                    disabled={!entry.get('active')}
                  >
                    <SvgIcon viewBox="0 0 20 20">
                      <EditIcon />
                    </SvgIcon>
                  </IconButton>
                </div>
              }
              {!content &&
                <div>
                  <div
                    data-tip="Bookmark"
                    style={{
                        position: 'absolute',
                        right: '10px',
                        top: '10px',
                        display: 'inline-block'
                    }}
                  >
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
                  <div
                    data-tip={intl.formatMessage(entryMessages.unresolvedEntry)}
                    style={{
                        position: 'absolute',
                        right: '50px',
                        top: '10px',
                        display: 'inline-block'
                    }}
                  >
                    <IconButton>
                      <HubIcon color={palette.accent1Color} />
                    </IconButton>
                  </div>
                </div>
              }
            </CardHeader>
            {content &&
              <CardTitle
                title={content.get('title')}
                expandable
                className={styles.contentLink}
                style={{
                    paddingTop: '4px',
                    paddingBottom: '4px',
                    fontWeight: '600',
                    wordWrap: 'break-word',
                    maxHeight: '80px',
                    overflow: 'hidden'
                }}
                onClick={this._handleEntryNavigation}
              />
            }
            {content &&
              <CardText style={{ paddingTop: '4px', paddingBottom: '4px' }} expandable>
                {content.get('tags').map(tag =>
                  <TagChip
                    key={tag}
                    tag={tag}
                    selectedTag={selectedTag}
                    onTagClick={this.selectTag}
                    style={{ height: '24px' }}
                  />
                )}
              </CardText>
            }
            {content &&
              <CardText
                className={styles.contentLink}
                style={{
                    paddingTop: '4px',
                    paddingBottom: '4px',
                    wordWrap: 'break-word',
                    fontSize: '16px'
                }}
                expandable
                onClick={this._handleEntryNavigation}
              >
                {content.get('excerpt')}
              </CardText>
            }
            {content &&
              <CardActions className="col-xs-12">
                <div style={{ display: 'flex', alignItems: 'center' }} >
                  <div style={{ position: 'relative' }}>
                    <div
                      data-tip={entry.get('active') ? 'Upvote' : 'Voting period has ended'}
                    >
                      <IconButton
                        onTouchTap={this.handleUpvote}
                        iconStyle={{ width: '20px', height: '20px' }}
                        disabled={!entry.get('active') || voteEntryPending || existingVoteWeight !== 0}
                      >
                        <SvgIcon viewBox="0 0 20 20" >
                          <EntryUpvote fill={upvoteIconColor} />
                        </SvgIcon>
                      </IconButton>
                    </div>
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
                    <FlatButton
                      label={entry.get('score')}
                      onClick={this.openVotesPanel}
                      style={{ minWidth: '10px', borderRadius: '6px' }}
                    />
                  </div>
                  <div style={{ position: 'relative' }}>
                    <div
                      data-tip={entry.get('active') ? 'Downvote' : 'Voting period has ended'}
                    >
                      <IconButton
                        onTouchTap={this.handleDownvote}
                        iconStyle={{ width: '20px', height: '20px' }}
                        disabled={!entry.get('active') || voteEntryPending || existingVoteWeight !== 0}
                      >
                        <SvgIcon viewBox="0 0 20 20">
                          <EntryDownvote fill={downvoteIconColor} />
                        </SvgIcon>
                      </IconButton>
                    </div>
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
                    <div data-tip="Comments">
                      <IconButton
                        onTouchTap={this.handleComments}
                        iconStyle={{ width: '20px', height: '20px' }}
                      >
                        <SvgIcon viewBox="0 0 20 20">
                          <EntryComment />
                        </SvgIcon>
                      </IconButton>
                    </div>
                  </div>
                  <div style={{ fontSize: '16px', paddingRight: '5px' }}>
                    {entry.get('commentsCount')}
                  </div>
                  <div style={{ flex: '1 1 auto', textAlign: 'right' }}>
                    {!this.isOwnEntry() &&
                      <div
                        data-tip="Bookmark"
                        style={{ display: 'inline-block' }}
                      >
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
                    }
                    {this.isOwnEntry() && (!canClaimPending || entry.get('canClaim') !== undefined)
                        && (!fetchingEntryBalance || entry.get('balance') !== undefined) &&
                      <div style={{ display: 'inline-flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        {!entry.get('active') &&
                          <div data-tip={!entry.get('canClaim') ? 'Already claimed' : 'Claim'}>
                            <IconButton
                              onTouchTap={this.handleClaim}
                              iconStyle={{
                                  width: '20px',
                                  height: '20px',
                                  fill: !entry.get('canClaim') ? palette.accent3Color : 'currentColor'
                              }}
                              disabled={claimPending}
                            >
                              <SvgIcon viewBox="0 0 16 16">
                                <ToolbarEthereum />
                              </SvgIcon>
                            </IconButton>
                          </div>
                        }
                        {entry.get('balance') !== 'claimed' &&
                          <div style={{ fontSize: '16px', paddingRight: '5px' }}>
                            {entry.get('balance')} AETH
                          </div>
                        }
                      </div>
                    }
                  </div>
                </div>
                {this.state.showVotes &&
                  <EntryVotesPanel
                    closeVotesPanel={this.closeVotesPanel}
                    entryId={entry.get('entryId')}
                    entryTitle={content.get('title')}
                  />
                }
              </CardActions>
            }
          </Card>
        );
    }
}

EntryCard.propTypes = {
    blockNr: PropTypes.number,
    canClaimPending: PropTypes.bool,
    claimPending: PropTypes.bool,
    entry: PropTypes.shape(),
    entryActions: PropTypes.shape(),
    fetchingEntryBalance: PropTypes.bool,
    hidePanel: PropTypes.func,
    intl: PropTypes.shape(),
    isSaved: PropTypes.bool,
    loggedAkashaId: PropTypes.string,
    selectedTag: PropTypes.string,
    selectTag: PropTypes.func,
    style: PropTypes.shape(),
    voteEntryPending: PropTypes.bool,
};

EntryCard.contextTypes = {
    muiTheme: PropTypes.shape(),
    router: PropTypes.shape()
};

export default injectIntl(EntryCard);
