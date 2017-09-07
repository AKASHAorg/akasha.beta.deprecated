import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardText, CardActions, IconButton, FlatButton,
    SvgIcon } from 'material-ui';
import WarningIcon from 'material-ui/svg-icons/alert/warning';
import HubIcon from 'material-ui/svg-icons/hardware/device-hub';
import EditIcon from 'material-ui/svg-icons/image/edit';
import { EntryBookmarkOn, EntryBookmarkOff, EntryComment, EntryDownvote,
    EntryUpvote, ToolbarEthereum } from '../../components/svg';
import { EntryVotesPanel, TagChip } from '../';
import { Avatar, EntryVersionsPanel, ProfilePopover } from '../../components';
import { calculateReadingTime } from '../../utils/dataModule';
import { entryMessages, generalMessages } from '../../locale-data/messages';

class EntryCard extends Component {
    constructor (props) {
        super(props);

        this.state = {
            expanded: false,
            showVotes: false,
            showVersions: false
        };
    }

    shouldComponentUpdate (nextProps, nextState) {
        const { blockNr, canClaimPending, claimPending, entry, entryResolvingIpfsHash,
            fetchingEntryBalance, isSaved, publisher, style, voteEntryPending } = nextProps;
        if (blockNr !== this.props.blockNr ||
            canClaimPending !== this.props.canClaimPending ||
            claimPending !== this.props.claimPending ||
            !entry.equals(this.props.entry) ||
            entryResolvingIpfsHash !== this.props.entryResolvingIpfsHash ||
            fetchingEntryBalance !== this.props.fetchingEntryBalance ||
            isSaved !== this.props.isSaved ||
            !publisher.equals(this.props.publisher) ||
            (style && style.width !== this.props.style.width) ||
            voteEntryPending !== this.props.voteEntryPending ||
            nextState.expanded !== this.state.expanded ||
            nextState.showVotes !== this.state.showVotes ||
            nextState.showVersions !== this.state.showVersions
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
        if (profileAddress) {
            hidePanel();
            router.push(`/${loggedAkashaId}/profile/${profileAddress}`);
        }
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
        const { entry, handleEdit, hidePanel } = this.props;
        hidePanel();
        handleEdit(entry.get('entryId'));
    };

    handleEntryNavigation = (tar, ev, version) => {
        const { entry, hidePanel, loggedAkashaId, entryPageShow } = this.props;
        // hidePanel();
        // const query = version !== undefined ? `?version=${version}` : '';
        // this.context.router.push(`/${loggedAkashaId}/entry/${entry.get('entryId')}${query}`);
        // entryPageShow(entry.get('entryId'));
    };

    getVersion = version => this.handleEntryNavigation(null, null, version);

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

    openVersionsPanel = () => {
        this.setState({
            showVersions: true
        });
    };

    closeVersionsPanel = () => {
        this.setState({
            showVersions: false
        });
    };

    renderResolvingPlaceholder = () => (
      <Card style={{ margin: '5px 10px 10px 5px', width: '340px', height: '300px', opacity: '0.5' }}>
        <CardText style={{ position: 'relative' }}>
          <div style={{ maxWidth: '175px' }}>
            Resolving ipfs hash
          </div>
        </CardText>
      </Card>
    );

    renderUnresolvedPlaceholder = () => {
        const { intl } = this.props;
        const { palette } = this.context.muiTheme;
        return (
          <Card style={{ margin: '5px 10px 10px 5px', width: '340px', height: '300px' }}>
            <CardText style={{ position: 'relative' }}>
              <div style={{ maxWidth: '175px' }}>
                {intl.formatMessage(entryMessages.unresolvedEntry)}
              </div>
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
    };

    renderSubtitle = () => {
        const { entry, intl } = this.props;
        const content = entry.get('content');
        const publishDate = new Date(entry.getIn(['entryEth', 'unixStamp']) * 1000);
        const wordCount = (content && content.get('wordCount')) || 0;
        const readingTime = calculateReadingTime(wordCount);
        const latestVersion = content && content.get('version');
        const publishedMessage = latestVersion ?
          (<span>
            <span onClick={this.openVersionsPanel} className="link">
              {intl.formatMessage(entryMessages.published)}
            </span>
            <span> *</span>
          </span>) :
          intl.formatMessage(entryMessages.published);

        return (
          <div
            className="overflow-ellipsis"
            style={{ maxWidth: '270px', textAlign: 'left' }}
          >
            <span style={{ paddingRight: '5px' }}>
              {publishedMessage}
            </span>
            <span
              data-tip={`Block ${entry.getIn(['entryEth', 'blockNr'])}`}
              style={{ display: 'inline-block', fontWeight: 600 }}
            >
              {intl.formatRelative(publishDate)}
            </span>
            <span style={{ padding: '0 5px' }}>-</span>
            {readingTime.hours &&
              intl.formatMessage(generalMessages.hoursCount, { hours: readingTime.hours })
            }
            {intl.formatMessage(generalMessages.minCount, { minutes: readingTime.minutes })}
            <span style={{ paddingLeft: '5px' }}>{intl.formatMessage(entryMessages.readTime)}</span>
            <span style={{ padding: '0 5px' }}>
              ({intl.formatMessage(entryMessages.wordsCount, { words: wordCount })})
            </span>
          </div>
        );
    };

    render () {
        const { canClaimPending, claimPending, containerRef, entry, entryResolvingIpfsHash, existingDraft,
            fetchingEntryBalance, intl, isSaved, selectedTag, style, voteEntryPending,
            publisher } = this.props;
        const { palette } = this.context.muiTheme;
        const content = entry.get('content');
        const latestVersion = content && content.get('version');
        const existingVoteWeight = entry.get('voteWeight') || 0;
        if (entryResolvingIpfsHash) {
            return this.renderResolvingPlaceholder();
        }
        if (!publisher) {
            return this.renderUnresolvedPlaceholder();
        }
        const upvoteIconColor = existingVoteWeight > 0 ? palette.accent3Color : '';
        const downvoteIconColor = existingVoteWeight < 0 ? palette.accent1Color : '';

        return (
          <Card
            className="start-xs"
            expanded={this.isPossiblyUnsafe() ? this.state.expanded : true}
            onExpandChange={this.onExpandChange}
            style={Object.assign(
                {},
                {
                    margin: '5px 10px 10px 5px',
                    transition: 'none',
                    width: '340px',
                    opacity: (this.isPossiblyUnsafe() && !this.state.expanded) || !content ? 0.5 : 1
                },
                style
            )}
          >
            <CardHeader
              title={publisher ?
                <ProfilePopover akashaId={publisher.get('akashaId')} containerRef={containerRef}>
                  <div
                    className="overflow-ellipsis"
                    style={{ maxWidth: '270px', textAlign: 'left' }}
                  >
                    <span className="content-link">
                      {publisher.get('akashaId')}
                    </span>
                  </div>
                </ProfilePopover> :
                <div style={{ height: '22px' }} />
              }
              subtitle={this.renderSubtitle()}
              avatar={
                <button
                  style={{
                      border: '0px',
                      outline: 'none',
                      background: 'transparent',
                      borderRadius: '50%',
                      margin: '0 10px 0 0',
                      padding: 0
                  }}
                  onClick={this.selectProfile}
                >
                  <ProfilePopover akashaId={publisher.get('akashaId')} containerRef={containerRef}>
                    <Avatar
                      firstName={publisher.get('firstName')}
                      image={publisher.get('avatar')}
                      lastName={publisher.get('lastName')}
                      size="small"
                    />
                  </ProfilePopover>
                </button>
              }
              textStyle={{ paddingRight: '0px' }}
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
              {!content && !entryResolvingIpfsHash &&
                <div style={{ height: '240px' }}>
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
              <Link
                to={{
                    pathname: `/@${entry.getIn(['entryEth', 'publisher'])}/${entry.get('entryId')}`,
                    state: { overlay: true }
                }}
              >
                <CardTitle
                  title={content.get('title')}
                  expandable
                  className="content-link"
                  style={{
                      paddingTop: '4px',
                      paddingBottom: '4px',
                      fontWeight: '600',
                      wordWrap: 'break-word',
                      maxHeight: '80px',
                      overflow: 'hidden'
                  }}
                />
              </Link>
            }
            {content &&
              <CardText style={{ paddingTop: '4px', paddingBottom: '4px' }} expandable>
                {content.get('tags').map(tag =>
                  <TagChip
                    key={tag}
                    tag={tag}
                    isSelected={selectedTag === tag}
                    onTagClick={this.selectTag}
                    style={{ height: '24px' }}
                  />
                )}
              </CardText>
            }
            {content &&
              <Link
                to={{
                    pathname: `/@${entry.getIn(['entryEth', 'publisher'])}/${entry.get('entryId')}`,
                    state: { overlay: true }
                }}
              >
                <CardText
                  className="content-link"
                  style={{
                      paddingTop: '4px',
                      paddingBottom: '4px',
                      wordWrap: 'break-word',
                      fontSize: '16px'
                  }}
                  expandable
                >
                  {content.get('excerpt')}
                </CardText>
              </Link>
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
            {latestVersion && this.state.showVersions &&
              <EntryVersionsPanel
                closeVersionsPanel={this.closeVersionsPanel}
                currentVersion={latestVersion}
                existingDraft={existingDraft}
                getVersion={this.getVersion}
                handleEdit={this.handleEdit}
                isOwnEntry={this.isOwnEntry()}
                latestVersion={latestVersion}
              />
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
    existingDraft: PropTypes.shape(),
    fetchingEntryBalance: PropTypes.bool,
    handleEdit: PropTypes.func,
    hidePanel: PropTypes.func,
    intl: PropTypes.shape(),
    isSaved: PropTypes.bool,
    loggedAkashaId: PropTypes.string,
    selectedTag: PropTypes.string,
    selectTag: PropTypes.func,
    style: PropTypes.shape(),
    voteEntryPending: PropTypes.bool,

    containerRef: PropTypes.shape(),
    entryPageShow: PropTypes.func.isRequired,
    entryResolvingIpfsHash: PropTypes.bool,
    publisher: PropTypes.shape()
};

EntryCard.contextTypes = {
    muiTheme: PropTypes.shape(),
    router: PropTypes.shape()
};

export default injectIntl(EntryCard);
