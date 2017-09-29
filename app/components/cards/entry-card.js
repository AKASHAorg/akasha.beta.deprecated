import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Card } from 'antd';
import classNames from 'classnames';
import { EntryCardHeader, EntryPageActions, EntryVersionsPanel, TagPopover } from '../';

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

    handleComments = () => {
        const { entry, hidePanel, history, loggedAkashaId } = this.props;
        hidePanel();
        history.push(`/${loggedAkashaId}/entry/${entry.get('entryId')}#comments-section`);
    };

    handleEdit = () => {
        const { entry, handleEdit, hidePanel } = this.props;
        hidePanel();
        handleEdit(entry.get('entryId'));
    };

    getVersion = (version) => {
        const { entry, hidePanel, loggedAkashaId, entryPageShow } = this.props;
        // hidePanel();
        // const query = version !== undefined ? `?version=${version}` : '';
        // this.context.router.push(`/${loggedAkashaId}/entry/${entry.get('entryId')}${query}`);
        // entryPageShow(entry.get('entryId'));
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
      <Card className="entry-card entry-card_transparent entry-card_fixed-height">
        <div style={{ maxWidth: '175px' }}>
          Resolving ipfs hash
        </div>
      </Card>
    );

    render () {
        const { containerRef, entry, entryResolvingIpfsHash, existingDraft, style,
            publisher } = this.props;
        const content = entry.get('content');
        const latestVersion = content && content.get('version');
        if (entryResolvingIpfsHash) {
            return this.renderResolvingPlaceholder();
        }
        if (!publisher) {
            console.error('cannot resolve publisher');
        }
        const cardClass = classNames('entry-card', {
            'entry-card_transparent': (this.isPossiblyUnsafe() && !this.state.expanded) || !content
        });

        return (
          <Card
            className={cardClass}
            // expanded={this.isPossiblyUnsafe() ? this.state.expanded : true}
            // onExpandChange={this.onExpandChange}
            style={style}
            title={
              <EntryCardHeader
                containerRef={containerRef}
                entry={entry}
                isNotSafe={this.isPossiblyUnsafe()}
                isOwnEntry={this.isOwnEntry()}
                openVersionsPanel={this.openVersionsPanel}
                publisher={publisher}
              />
            }
          >
            {/* <CardHeader
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
            </CardHeader> */}
            {!content && !entryResolvingIpfsHash &&
              <div style={{ height: '240px' }}>Cannot resolve content</div>
            }
            {content &&
              <Link
                className="unstyled-link"
                to={{
                    pathname: `/@${entry.getIn(['entryEth', 'publisher'])}/${entry.get('entryId')}`,
                    state: { overlay: true }
                }}
              >
                <div className="content-link entry-card__title">
                  {content.get('title')}
                </div>
              </Link>
            }
            {content &&
              <Link
                className="unstyled-link"
                to={{
                    pathname: `/@${entry.getIn(['entryEth', 'publisher'])}/${entry.get('entryId')}`,
                    state: { overlay: true }
                }}
              >
                <div className="content-link entry-card__excerpt">
                  {content.get('excerpt')}
                </div>
              </Link>
            }
            {content &&
              <div className="entry-card__tags">
                {content.get('tags').map(tag => (
                  <TagPopover
                    containerRef={containerRef}
                    key={tag}
                    tag={tag}
                  />
                ))}
              </div>
            }
            {content &&
              <EntryPageActions
                containerRef={containerRef}
                entry={entry}
                noVotesBar
              />
            }
            {!!latestVersion && this.state.showVersions &&
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
    existingDraft: PropTypes.shape(),
    fetchingEntryBalance: PropTypes.bool,
    handleEdit: PropTypes.func,
    hidePanel: PropTypes.func,
    isSaved: PropTypes.bool,
    loggedAkashaId: PropTypes.string,
    style: PropTypes.shape(),
    voteEntryPending: PropTypes.bool,

    containerRef: PropTypes.shape(),
    entryPageShow: PropTypes.func.isRequired,
    entryResolvingIpfsHash: PropTypes.bool,
    history: PropTypes.shape().isRequired,
    publisher: PropTypes.shape()
};

export default withRouter(injectIntl(EntryCard));
