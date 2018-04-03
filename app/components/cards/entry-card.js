import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Card } from 'antd';
import classNames from 'classnames';
import { EntryCardHeader, EntryPageActions, TagPopover, WebsiteInfoCard } from '../index';
import { ProfileRecord } from '../../local-flux/reducers/records';
import { entryMessages, generalMessages } from '../../locale-data/messages';
import LazyImageLoader from '../lazy-image-loader';

const smallCard = 320;
const largeCard = 480;

const ContentPlaceholder = () => (
  <div>
    <div className="content-placeholder entry-card__title_placeholder" style={{ width: '80%' }} />
    <div className="content-placeholder entry-card__title_placeholder" style={{ width: '40%' }} />
    <div className="content-placeholder entry-card__content-placeholder" style={{ marginTop: '16px' }} />
    <div className="content-placeholder entry-card__content-placeholder" style={{ marginTop: '8px' }} />
  </div>
);
class EntryCard extends Component {
    constructor (props) {
        super(props);

        this.state = {
            expanded: false,
            showVotes: false,
            markAsNew: props.markAsNew
        };
    }

    shouldComponentUpdate (nextProps, nextState) { // eslint-disable-line complexity
        const { author, blockNr, canClaimPending, claimPending, entry,
            fetchingEntryBalance, isPending, large, style, votePending, isBusy } = nextProps;
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
            nextState.showVotes !== this.state.showVotes ||
            nextState.markAsNew !== this.state.markAsNew ||
            nextProps.markAsNew !== this.props.markAsNew
        ) {
            return true;
        }
        return false;
    }
    componentWillReceiveProps (nextProps) {
        const { markAsNew } = nextProps;
        if(!markAsNew && this.props.markAsNew) {
            setTimeout(() => {
                this.setState({
                    markAsNew
                });
            }, 2000)
        }
    }
    showHiddenContent = () => {
        this.setState({
            expanded: true
        });
    };

    isOwnEntry = () => {
        const { entry, loggedEthAddress } = this.props;
        return entry.getIn(['author', 'ethAddress']) === loggedEthAddress;
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

    // getVersion = (version) => {
    //     const { entry, loggedAkashaId, entryPageShow } = this.props;
    //     // const query = version !== undefined ? `?version=${version}` : '';
    //     // this.context.router.push(`/${loggedAkashaId}/entry/${entry.get('entryId')}${query}`);
    //     // entryPageShow(entry.get('entryId'));
    // };

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

    // getImageSrc = (imageObj) => {
    //     const { baseUrl, large } = this.props;
    //     const baseWidth = large ? largeCard : smallCard;
    //     const bestMatch = findClosestMatch(baseWidth || 700, imageObj, Object.keys(imageObj)[0]);
    //     if (bestMatch) {
    //         return imageCreator(imageObj[bestMatch].src, baseUrl);
    //     }
    //     return '';
    // };

    renderContentPlaceholder = () => (
      <div>
        <div className="content-placeholder entry-card__title_placeholder" style={{ width: '80%' }} />
        <div className="content-placeholder entry-card__title_placeholder" style={{ width: '40%' }} />
        <div className="content-placeholder entry-card__content-placeholder" style={{ marginTop: '16px' }} />
        <div className="content-placeholder entry-card__content-placeholder" style={{ marginTop: '8px' }} />
      </div>
    );

    renderHiddenContent = () => (
      <div style={{ position: 'relative' }}>
        {this.renderContentPlaceholder()}
        <div className="entry-card__hidden">
          <div className="heading flex-center">
            {this.props.intl.formatMessage(entryMessages.hiddenContent, {
                score: this.props.hideEntrySettings.value
            })}
          </div>
          <div className="heading entry-card__hidden-message">
            {this.props.intl.formatMessage(entryMessages.hiddenContent2)}
            <Link className="entry-card__settings-link" to="/profileoverview/settings">
              {this.props.intl.formatMessage(entryMessages.hiddenContent3)}
            </Link>
          </div>
          <div className="flex-center">
            <span className="content-link entry-card__retry-button" onClick={this.showHiddenContent}>
              {this.props.intl.formatMessage(entryMessages.showAnyway)}
            </span>
          </div>
        </div>
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
            <span
              className="content-link entry-card__retry-button"
              onClick={() => this.props.onRetry({
                  context: this.props.contextId,
                  entryId: this.props.entry.get('entryId'),
                  ethAddress: this.props.loggedEthAddress
              })}
            >
              {this.props.intl.formatMessage(generalMessages.retry)}
            </span>
          </div>
        </div>
      </div>
    );

    // renderResolvingPlaceholder = () => {
    //     const { large, style } = this.props;
    //     const cardClass = classNames('entry-card entry-card_transparent', {
    //         'entry-card_large': large
    //     });
    //     return (
    //       <Card className={cardClass} style={style} title={<EntryCardHeader loading />}>
    //         {this.renderContentPlaceholder()}
    //       </Card>
    //     );
    // };
    /* eslint-disable complexity */
    render () {

        const { author, baseUrl, containerRef, entry, hideEntrySettings, isPending, large,
            style, toggleOutsideNavigation, intl } = this.props;
        const { expanded, markAsNew } = this.state;
        const content = entry && entry.get('content');
        const entryType = entry && entry.getIn(['content', 'entryType']);
        const entryId = entry && entry.get('entryId');
        // if (isPending) {
        //     return this.renderResolvingPlaceholder();
        // }
        const hasContent = (entryType === 1 && content.getIn(['cardInfo', 'title']).length > 0) ||
            (content && !!content.get('title'));
        const hideContent = !this.isOwnEntry() && hideEntrySettings.checked &&
            entry.score < hideEntrySettings.value && !expanded;
        const featuredImage = content.get('featuredImage');
        const hasFeaturedImage = featuredImage && !!Object.keys(featuredImage).length;
        const featuredImageClass = classNames('flex-center entry-card__featured-image-wrapper', {
            'entry-card__featured-image-wrapper_large': large
        });
        const cardClass = classNames('entry-card', {
            'entry-card_transparent': hideContent || !hasContent,
            'entry-card_large': large,
            'entry-card_new-entry': markAsNew
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
                isOwnEntry={this.isOwnEntry()}
                large={large}
                openVersionsPanel={this.openVersionsPanel}
                onEntryVersionNavigation={this._handleNavigation}
                onDraftNavigation={this._handleNavigation}
                loading={isPending}
              />
            }
          >
            {isPending && <ContentPlaceholder />}
            {hasContent &&
              !hideContent &&
              !isPending &&
              [hasFeaturedImage && entryType === 0 && <Link
                className="unstyled-link"
                key={`${entryId}-fImage`}
                to={{
                    pathname: `/${entry.getIn(['author', 'ethAddress']) || '0x0'}/${entryId}`,
                    state: { overlay: true }
                }}
              >
                <div className={featuredImageClass}>
                  <LazyImageLoader
                    image={featuredImage}
                    baseWidth={large ? largeCard : smallCard}
                    baseUrl={baseUrl}
                    className="entry-card__featured-image"
                  />
                </div>
              </Link>,
                <div className="entry-card__title" key={`${entryId}-title`}>
                  <Link
                    className="unstyled-link"
                    to={{
                      pathname: `/${entry.getIn(['author', 'ethAddress']) || '0x0'}/${entryId}`,
                      state: { overlay: true }
                    }}
                  >
                    <span className="content-link">{content.get('title')}</span>
                  </Link>
                </div>,
              hasContent && !hideContent && content.get('excerpt') &&
                <div className="entry-card__excerpt" key={`${entryId}-excerpt`}>
                  <Link
                    className="unstyled-link"
                    to={{
                        pathname: `/${entry.getIn(['author', 'ethAddress']) || '0x0'}/${entryId}`,
                        state: { overlay: true }
                    }}
                  >
                    <span className="content-link">{content.get('excerpt')}</span>
                  </Link>
                </div>,
              entryType === 1 &&
                <WebsiteInfoCard
                  key={`${entryId}-entryCard`}
                  baseUrl={baseUrl}
                  baseWidth={large ? largeCard : smallCard}
                  cardInfo={content.get('cardInfo')}
                  hasCard={!!hasContent}
                  onClick={toggleOutsideNavigation}
                  maxImageHeight={150}
                  infoExtracted
                  intl={intl}
                />,
                <div className="entry-card__tags" key={`${entryId}-tags`}>
                  {content.get('tags').map(tag => (
                    <TagPopover
                      containerRef={containerRef}
                      key={tag}
                      tag={tag}
                    />
                  ))}
                </div>,
                <EntryPageActions
                  key={`${entryId}-entryActions`}
                  containerRef={containerRef}
                  entry={entry}
                  noVotesBar
                />
              ]
            }
            {!hasContent && !isPending &&
                this.renderUnresolvedPlaceholder()
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
    contextId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    entry: PropTypes.shape(),
    fetchingEntryBalance: PropTypes.bool,
    handleEdit: PropTypes.func,
    hideEntrySettings: PropTypes.shape().isRequired,
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
