import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Card } from 'antd';
import classNames from 'classnames';
import { EntryCardHeader, EntryPageActions, EntryVersionsPanel, TagPopover, WebsiteInfoCard } from '../';
import { ProfileRecord } from '../../local-flux/reducers/records';
import imageCreator, { findClosestMatch } from '../../utils/imageUtils';

class EntryCard extends Component {
    constructor (props) {
        super(props);

        this.state = {
            expanded: false,
            showVotes: false,
            showVersions: false
        };
    }

    shouldComponentUpdate (nextProps, nextState) { // eslint-disable-line complexity
        const { author, blockNr, canClaimPending, claimPending, entry,
            fetchingEntryBalance, isPending, style, votePending } = nextProps;
        if (blockNr !== this.props.blockNr ||
            canClaimPending !== this.props.canClaimPending ||
            claimPending !== this.props.claimPending ||
            !entry.equals(this.props.entry) ||
            isPending !== this.props.isPending ||
            fetchingEntryBalance !== this.props.fetchingEntryBalance ||
            !author.equals(this.props.author) ||
            (style && style.width !== this.props.style.width) ||
            votePending !== this.props.votePending ||
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
        const { entry, loggedEthAddress } = this.props;
        return entry.getIn(['author', 'ethAddress']) === loggedEthAddress;
    };

    isPossiblyUnsafe = () => {
        const { entry } = this.props;
        return !this.isOwnEntry() && parseInt(entry.get('score'), 10) <= -30;
    };

    handleComments = () => {
        const { entry, history, loggedEthAddress } = this.props;
        history.push(`/${loggedEthAddress}/${entry.get('entryId')}#comments-section`);
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
    getImageSrc = (imageObj) => {
        const { baseUrl } = this.props;
        const bestMatch = findClosestMatch(700, imageObj.toJS(), Object.keys(imageObj)[0]);
        return imageCreator(imageObj.getIn([bestMatch, 'src']), baseUrl);
    };
    renderResolvingPlaceholder = () => (
      <Card className="entry-card entry-card_transparent entry-card_fixed-height">
        <div>
          Resolving ipfs hash
        </div>
      </Card>
    );

    render () {
        const { author, baseUrl, baseWidth, containerRef, entry, existingDraft, isPending, style,
            toggleOutsideNavigation } = this.props;
        const content = entry.get('content');
        const entryType = entry.get('entryType');
        // TODO use getLatestEntryVersion channel
        const latestVersion = content && content.get('version');

        if (isPending) {
            return this.renderResolvingPlaceholder();
        }
        const hasContent = (entryType === 1 && content.getIn(['cardInfo', 'title']).length > 0) ||
            !!content.get('title');
        const cardClass = classNames('entry-card', {
            'entry-card_transparent': (this.isPossiblyUnsafe() && !this.state.expanded) || !hasContent
        });
        return (
          <Card
            className={cardClass}
            style={style}
            title={
              <EntryCardHeader
                author={author}
                containerRef={containerRef}
                entry={entry}
                isNotSafe={this.isPossiblyUnsafe()}
                isOwnEntry={this.isOwnEntry()}
                openVersionsPanel={this.openVersionsPanel}
              />
            }
          >
            {!hasContent && !isPending &&
              <div style={{ height: '240px' }}>Cannot resolve content</div>
            }
            {hasContent && entryType === 0 &&
              <Link
                className="unstyled-link"
                to={{
                    pathname: `/${entry.getIn(['author', 'ethAddress'])}/${entry.get('entryId')}`,
                    state: { overlay: true }
                }}
              >
                <div className="content-link entry-card__title">
                  {content.get('title')}
                </div>
              </Link>
            }
            {hasContent && entryType === 1 &&
              <div>
                <WebsiteInfoCard
                  baseUrl={baseUrl}
                  baseWidth={baseWidth}
                  cardInfo={content.get('cardInfo')}
                  hasCard={!!hasContent}
                  onClick={toggleOutsideNavigation}
                  maxImageHeight={150}
                  infoExtracted
                />
              </div>
            }
            {hasContent &&
              <Link
                className="unstyled-link"
                to={{
                    pathname: `/${entry.getIn(['author', 'ethAddress'])}/${entry.get('entryId')}`,
                    state: { overlay: true }
                }}
              >
                <div className="content-link entry-card__excerpt">
                  {content.get('excerpt')}
                </div>
              </Link>
            }
            {hasContent &&
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
            {hasContent &&
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

EntryCard.defaultProps = {
    author: new ProfileRecord()
};

EntryCard.propTypes = {
    author: PropTypes.shape().isRequired,
    blockNr: PropTypes.number,
    baseUrl: PropTypes.string,
    baseWidth: PropTypes.number,
    canClaimPending: PropTypes.bool,
    claimPending: PropTypes.bool,
    entry: PropTypes.shape(),
    existingDraft: PropTypes.shape(),
    fetchingEntryBalance: PropTypes.bool,
    handleEdit: PropTypes.func,
    style: PropTypes.shape(),
    toggleOutsideNavigation: PropTypes.func,
    containerRef: PropTypes.shape(),
    entryPageShow: PropTypes.func.isRequired,
    history: PropTypes.shape().isRequired,
    isPending: PropTypes.bool,
    loggedEthAddress: PropTypes.string,
    votePending: PropTypes.bool,
};

export default withRouter(injectIntl(EntryCard));
