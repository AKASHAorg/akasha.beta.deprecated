import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withRouter from 'react-router/withRouter';
import Link from 'react-router-dom/Link';
import { Card } from 'antd';
import classNames from 'classnames';
import { EntryCardHeader, EntryPageActions, TagPopover, WebsiteInfoCard } from '../index';
import { toggleOutsideNavigation } from '../../local-flux/actions/app-actions';
import { entryGetShort, entryPageShow } from '../../local-flux/actions/entry-actions';
import { ProfileRecord } from '../../local-flux/reducers/state-models/profile-state-model';
import { externalProcessSelectors, entrySelectors, profileSelectors,
  settingsSelectors } from '../../local-flux/selectors';
import { entryMessages, generalMessages } from '../../locale-data/messages';
import LazyImageLoader from '../lazy-image-loader';
import { isLinkToAkashaWeb, extractEntryUrl } from '../../utils/url-utils';
import withRequest from '../high-order-components/with-request';

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
            markAsNew: props.markAsNew
        };
    }

    shouldComponentUpdate (nextProps, nextState) { // eslint-disable-line complexity
        const { author, blockNr, entry, isPending, large, style } = nextProps;

        if (blockNr !== this.props.blockNr ||
            !entry.equals(this.props.entry) ||
            isPending !== this.props.isPending ||
            large !== this.props.large ||
            !author.equals(this.props.author) ||
            (style && style.width !== this.props.style.width) ||
            nextState.expanded !== this.state.expanded ||
            nextState.markAsNew !== this.state.markAsNew ||
            nextProps.markAsNew !== this.props.markAsNew
        ) {
            return true;
        }
        return false;
    }
    componentWillReceiveProps (nextProps) {
        const { markAsNew } = nextProps;
        if (!markAsNew && this.props.markAsNew) {
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

    _handleNavigation = (href) => {
        const { history } = this.props;
        history.push(href);
    };

    _handleOutsideNavigation = (url) => {
        const { history } = this.props;
        const isInternalUrl = isLinkToAkashaWeb(url);
        if (isInternalUrl) {
            const entryUrl = extractEntryUrl(url);
            if (entryUrl) {
                return history.push(entryUrl);
            }
        } else {
            this.props.toggleOutsideNavigation(url);
        }
    }

    onRetry = () => {
        const { contextId, entry, dispatchAction } = this.props;
        const ethAddress = entry.getIn(['author', 'ethAddress']);
        dispatchAction(entryGetShort({ context: contextId, entryId: entry.entryId, ethAddress }));
    };

    renderContentPlaceholder = () => (
      <div>
        <div className="content-placeholder entry-card__title_placeholder" style={{ width: '80%' }} />
        <div className="content-placeholder entry-card__title_placeholder" style={{ width: '40%' }} />
        <div className="content-placeholder entry-card__content-placeholder" style={{ marginTop: '16px' }} />
        <div className="content-placeholder entry-card__content-placeholder" style={{ marginTop: '8px' }} />
      </div>
    );

    renderHiddenContent = (entryId) => (
      <div key={`${entryId}-hidden`} style={{ position: 'relative' }}>
        <ContentPlaceholder />
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
        <ContentPlaceholder />
        <div className="entry-card__unresolved">
          <div className="heading flex-center">
            {this.props.intl.formatMessage(generalMessages.noPeersAvailable)}
          </div>
          <div className="flex-center">
            <span className="content-link entry-card__retry-button" onClick={this.onRetry}>
              {this.props.intl.formatMessage(generalMessages.retry)}
            </span>
          </div>
        </div>
      </div>
    );

    /* eslint-disable complexity */
    render () {
        const { author, baseUrl, containerRef, entry, hideEntrySettings, isPending, large,
            style, intl } = this.props;
        const { expanded, markAsNew } = this.state;
        const content = entry && entry.get('content');
        const entryType = entry && entry.getIn(['content', 'entryType']);
        const entryId = entry && entry.get('entryId');
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
                onEntryVersionNavigation={this._handleNavigation}
                onDraftNavigation={this._handleNavigation}
                loading={isPending}
              />
            }
          >
            {isPending && <ContentPlaceholder />}
            {hasContent &&
              !isPending &&
              [!hideContent && hasFeaturedImage && entryType === 0 && <Link
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
              !hideContent && entryType === 1 &&
                <WebsiteInfoCard
                  key={`${entryId}-entryCard`}
                  baseUrl={baseUrl}
                  baseWidth={large ? largeCard : smallCard}
                  cardInfo={content.get('cardInfo')}
                  hasCard={!!hasContent}
                  onClick={this._handleOutsideNavigation}
                  maxImageHeight={150}
                  infoExtracted
                  intl={intl}
                />,
              !hideContent && entryType === 0 &&
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
                <Link
                  key={`${entryId}-excerpt`}
                  className="unstyled-link"
                  to={{
                      pathname: `/${entry.getIn(['author', 'ethAddress']) || '0x0'}/${entryId}`,
                      state: { overlay: true }
                  }}
                >
                  <div className="entry-card__excerpt">
                    <span className="content-link">{content.get('excerpt')}</span>
                  </div>
                </Link>,
              !hideContent && <div className="entry-card__tags" key={`${entryId}-tags`}>
                  {content.get('tags').map(tag => (
                    <TagPopover
                      containerRef={containerRef}
                      key={tag}
                      tag={tag}
                    />
                  ))}
                </div>,
              hideContent && this.renderHiddenContent(entryId),
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
    containerRef: PropTypes.shape(),
    contextId: PropTypes.string,
    entry: PropTypes.shape(),
    entryGetShort: PropTypes.func.isRequired,
    entryPageShow: PropTypes.func.isRequired,
    hideEntrySettings: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    isPending: PropTypes.bool,
    large: PropTypes.bool,
    loggedEthAddress: PropTypes.string,
    style: PropTypes.shape(),
    toggleOutsideNavigation: PropTypes.func,
    markAsNew: PropTypes.bool,
};

function mapStateToProps (state, ownProps) {
    const entry = ownProps.entry || entrySelectors.selectEntryById(state, ownProps.itemId);
    const ethAddress = entry.author.ethAddress;
    return {
        author: profileSelectors.selectProfileByEthAddress(state, ethAddress),
        baseUrl: externalProcessSelectors.getBaseUrl(state),
        blockNr: externalProcessSelectors.getCurrentBlockNumber(state),
        entry,
        hideEntrySettings: settingsSelectors.getHideEntrySettings(state),
        loggedEthAddress: profileSelectors.selectLoggedEthAddress(state),
    };
}

export default connect(
    mapStateToProps,
    {
        entryPageShow,
        toggleOutsideNavigation
    }
)(withRouter(injectIntl(withRequest(EntryCard))));
