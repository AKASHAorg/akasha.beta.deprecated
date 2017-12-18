import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Card } from 'antd';
import classNames from 'classnames';
import { EntryCardHeader, EntryPageActions, TagPopover, WebsiteInfoCard } from '../index';
import { ProfileRecord } from '../../local-flux/reducers/records';
import { generalMessages } from '../../locale-data/messages';
import imageCreator, { findClosestMatch } from '../../utils/imageUtils';

const smallCard = 320;
const largeCard = 480;

class EntryCard extends Component {
    constructor (props) {
        super(props);

        this.state = {
            expanded: false,
            showVotes: false,
        };
    }

    shouldComponentUpdate (nextProps, nextState) { // eslint-disable-line complexity
        const { author, blockNr, canClaimPending, claimPending, entry,
            fetchingEntryBalance, isPending, large, style, votePending } = nextProps;
        if (blockNr !== this.props.blockNr ||
            canClaimPending !== this.props.canClaimPending ||
            claimPending !== this.props.claimPending ||
            !entry.equals(this.props.entry) ||
            isPending !== this.props.isPending ||
            large !== this.props.large ||
            fetchingEntryBalance !== this.props.fetchingEntryBalance ||
            !author.equals(this.props.author) ||
            (style && style.width !== this.props.style.width) ||
            votePending !== this.props.votePending ||
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
        const { entry, handleEdit } = this.props;
        handleEdit(entry.get('entryId'));
    };

    _handleNavigation = (href) => {
        const { history } = this.props;
        history.push(href);
    };

    getVersion = (version) => {
        const { entry, loggedAkashaId, entryPageShow } = this.props;
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

    getImageSrc = (imageObj) => {
        const { baseUrl, large } = this.props;
        const baseWidth = large ? largeCard : smallCard;
        const bestMatch = findClosestMatch(baseWidth || 700, imageObj, Object.keys(imageObj)[0]);
        if (bestMatch) {
            return imageCreator(imageObj[bestMatch].src, baseUrl);
        }
        return '';
    };

    renderContentPlaceholder = () => (
      <div>
        <div className="content-placeholder entry-card__title_placeholder" style={{ width: '80%' }} />
        <div className="content-placeholder entry-card__title_placeholder" style={{ width: '40%' }} />
        <div className="content-placeholder entry-card__content-placeholder" style={{ marginTop: '16px' }} />
        <div className="content-placeholder entry-card__content-placeholder" style={{ marginTop: '8px' }} />
      </div>
    );

    renderUnresolvedPlaceholder = () => (
      <div style={{ position: 'relative' }}>
        {this.renderContentPlaceholder()}
        <div className="entry-card__unresolved">
          <div className="heading flex-center">
            {this.props.intl.formatMessage(generalMessages.noPeersAvailable)}
          </div>
          <div className="flex-center">
            <span className="content-link entry-card__retry-button" onClick={this.props.onRetry}>
              {this.props.intl.formatMessage(generalMessages.retry)}
            </span>
          </div>
        </div>
      </div>
    );

    renderResolvingPlaceholder = () => {
        const { large } = this.props;
        const cardClass = classNames('entry-card entry-card_transparent', {
            'entry-card_large': large
        });
        return (
          <Card className={cardClass} title={<EntryCardHeader loading />}>
            {this.renderContentPlaceholder()}
          </Card>
        );
    };

    render () {
        const { author, baseUrl, containerRef, entry, existingDraft, isPending, large,
            style, toggleOutsideNavigation, intl } = this.props;
        const content = entry.get('content');
        const entryType = entry.getIn(['content', 'entryType']);
        // TODO use getLatestEntryVersion channel
        const latestVersion = content && content.get('version');
        if (isPending) {
            return this.renderResolvingPlaceholder();
        }
        const hasContent = (entryType === 1 && content.getIn(['cardInfo', 'title']).length > 0) ||
            !!content.get('title');
        const featuredImage = content.get('featuredImage');
        const hasFeaturedImage = featuredImage && !!Object.keys(featuredImage).length;
        const featuredImageClass = classNames('flex-center entry-card__featured-image-wrapper', {
            'entry-card__featured-image-wrapper_large': large
        });
        const cardClass = classNames('entry-card', {
            'entry-card_transparent': (this.isPossiblyUnsafe() && !this.state.expanded) || !hasContent,
            'entry-card_large': large
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
                large={large}
                openVersionsPanel={this.openVersionsPanel}
                onEntryVersionNavigation={this._handleNavigation}
                onDraftNavigation={this._handleNavigation}
              />
            }
          >
            {!hasContent && this.renderUnresolvedPlaceholder()}
            {hasContent && entryType === 0 && hasFeaturedImage &&
              <Link
                className="unstyled-link"
                to={{
                    pathname: `/${entry.getIn(['author', 'ethAddress']) || '0x0'}/${entry.get('entryId')}`,
                    state: { overlay: true }
                }}
              >
                <div className={featuredImageClass}>
                  <img alt="" className="entry-card__featured-image" src={this.getImageSrc(featuredImage)} />
                </div>
              </Link>
            }
            {hasContent && entryType === 0 &&
              <div className="entry-card__title">
                <Link
                  className="unstyled-link"
                  to={{
                      pathname: `/${entry.getIn(['author', 'ethAddress']) || '0x0'}/${entry.get('entryId')}`,
                      state: { overlay: true }
                  }}
                >
                  <span className="content-link">{content.get('title')}</span>
                </Link>
              </div>
            }
            {hasContent && entryType === 1 &&
              <div>
                <WebsiteInfoCard
                  baseUrl={baseUrl}
                  baseWidth={large ? largeCard : smallCard}
                  cardInfo={content.get('cardInfo')}
                  hasCard={!!hasContent}
                  onClick={toggleOutsideNavigation}
                  maxImageHeight={150}
                  infoExtracted
                  intl={intl}
                />
              </div>
            }
            {hasContent && content.get('excerpt') &&
              <div className="entry-card__excerpt">
                <Link
                  className="unstyled-link"
                  to={{
                      pathname: `/${entry.getIn(['author', 'ethAddress']) || '0x0'}/${entry.get('entryId')}`,
                      state: { overlay: true }
                  }}
                >
                  <span className="content-link">{content.get('excerpt')}</span>
                </Link>
              </div>
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
          </Card>
        );
    }
}

EntryCard.defaultProps = {
    author: new ProfileRecord(),
    style: {}
};

EntryCard.propTypes = {
    author: PropTypes.shape().isRequired,
    blockNr: PropTypes.number,
    baseUrl: PropTypes.string,
    canClaimPending: PropTypes.bool,
    claimPending: PropTypes.bool,
    containerRef: PropTypes.shape(),
    entry: PropTypes.shape(),
    entryPageShow: PropTypes.func.isRequired,
    existingDraft: PropTypes.shape(),
    fetchingEntryBalance: PropTypes.bool,
    handleEdit: PropTypes.func,
    history: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    isPending: PropTypes.bool,
    large: PropTypes.bool,
    loggedEthAddress: PropTypes.string,
    onRetry: PropTypes.func.isRequired,
    style: PropTypes.shape(),
    toggleOutsideNavigation: PropTypes.func,
    votePending: PropTypes.bool,
};

export default withRouter(injectIntl(EntryCard));
