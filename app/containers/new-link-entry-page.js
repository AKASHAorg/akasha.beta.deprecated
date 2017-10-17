import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Col, Row, Icon } from 'antd';
import { PublishOptionsPanel, TagEditor, WebsiteInfoCard } from '../components';
import { selectDraftById, selectLoggedProfile } from '../local-flux/selectors';
import { entryMessages, generalMessages } from '../locale-data/messages';
import { extractWebsiteInfo } from '../utils/extract-website-info';
import { draftCreate, draftsGet, draftUpdate, draftsGetCount,
    draftRevertToVersion } from '../local-flux/actions/draft-actions';
import { actionAdd } from '../local-flux/actions/action-actions';
import { searchResetResults } from '../local-flux/actions/search-actions';
import { getResizedImages, findClosestMatch } from '../utils/imageUtils';
import { uploadImage } from '../local-flux/services/utils-service';

self.extract_website_info = extractWebsiteInfo;
class NewLinkEntryPage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            showPublishPanel: false,
            errors: {}
        };
    }
    componentWillReceiveProps (nextProps) {
        const { match, draftObj, draftsFetched, entriesFetched, resolvingEntries,
            userDefaultLicense } = nextProps;
        const { loggedProfile } = this.props;
        const draftIsPublished = resolvingEntries.includes(match.params.draftId);
        if (!draftObj && draftsFetched && entriesFetched && !draftIsPublished) {
            this.props.draftCreate({
                id: match.params.draftId,
                ethAddress: loggedProfile.get('ethAddress'),
                content: {
                    licence: userDefaultLicense,
                    featuredImage: {},
                },
                tags: [],
                entryType: 'link',
            });
        }
    }
    // format an url based on the prefix of the source url
    _formatUrl = (targetUrl, sourceUrl) => {
        const prefix = sourceUrl.split('://')[0];
        if (targetUrl.startsWith(prefix)) {
            return targetUrl;
        }
        if (targetUrl.startsWith('//')) {
            return `${prefix}://${targetUrl.substr(2)}`;
        }
        return `${prefix}://${targetUrl}`;
    }
    _processUrl = () => {
        const { draftObj, loggedProfile, match } = this.props;
        const url = draftObj.getIn(['content', 'url']);
        extractWebsiteInfo(url).then((data) => {
            let filePromises = [];
            if (data.info['og:image']) {
                filePromises = getResizedImages([this._formatUrl(data.info['og:image'], data.url)], {
                    ipfsFile: true
                });
            }
            Promise.all(filePromises).then((results) => {
                let promise = Promise.resolve();
                if (results[0]) {
                    promise = uploadImage(results[0]);
                }
                promise.then(uploadedImage =>
                    this.props.draftUpdate(draftObj.merge({
                        ethAddress: loggedProfile.get('ethAddress'),
                        content: draftObj.get('content').merge({
                            cardInfo: {
                                title: data.info['og:title'],
                                description: data.info['og:description'],
                                image: uploadedImage || {},
                            },
                            url: data.url
                        }),
                        id: match.params.draftId,
                        hasCard: true,
                    })));
            });
        });
    }

    _handleUrlBlur = this._processUrl

    _handleKeyPress = (ev) => {
        // handle enter key press
        if (ev.which === 13) {
            this._processUrl();
            if (!ev.defaultPrevented) {
                ev.preventDefault();
            }
        }
    }

    _handleUrlChange = (ev) => {
        const { match, loggedProfile, draftObj } = this.props;
        this.props.draftUpdate(draftObj.merge({
            ethAddress: loggedProfile.get('ethAddress'),
            content: draftObj.get('content').merge({
                url: ev.target.value,
            }),
            id: match.params.draftId,
        }));
    }

    _togglePublishPanel = state =>
        (ev) => {
            this.setState({
                showPublishPanel: state
            });
        }

    _createRef = nodeName =>
        (node) => { this[nodeName] = node; }

    render () {
        const { intl, baseUrl, draftObj, licences, match, tagSuggestions, tagSuggestionsCount,
            showSecondarySidebar, loggedProfile } = this.props;
        const { showPublishPanel, errors } = this.state;

        if (!draftObj) {
            return (<div>Finding draft</div>);
        }
        console.log(draftObj, 'draft obj');
        const { content, tags, hasCard, localChanges, onChain } = draftObj;
        const { title, url, excerpt, latestVersion, licence,
            featuredImage, cardInfo, } = content;
        return (
          <div className="edit-entry-page link-page">
            <div
              className="edit-entry-page__publish-options"
              onClick={this._togglePublishPanel(true)}
            >
              <Icon
                type="ellipsis"
                style={{ transform: 'rotate(90deg)' }}
              />
              {intl.formatMessage(entryMessages.publishOptions)}
            </div>
            <Row
              type="flex"
              className="edit-entry-page__content"
            >
              <Col
                span={showPublishPanel ? 17 : 24}
                className="edit-entry-page__editor-wrapper"
              >
                <div className="edit-entry-page__editor">
                  <input
                    ref={this._createRef('titleInput')}
                    className="edit-entry-page__url-input-field"
                    placeholder="Enter an address. eg. www.akasha.world"
                    onChange={this._handleUrlChange}
                    onBlur={this._handleUrlBlur}
                    onKeyPress={this._handleKeyPress}
                    value={url}
                  />
                  {hasCard &&
                    <WebsiteInfoCard
                      baseUrl={baseUrl}
                      cardInfo={cardInfo}
                      hasCard
                      url={url}
                    />
                  }
                </div>
                <div className="edit-entry-page__tag-editor">
                  <TagEditor
                    ref={this._createRef('tagEditor')}
                    match={match}
                    nodeRef={(node) => { this.tagsField = node; }}
                    intl={intl}
                    ethAddress={loggedProfile.get('ethAddress')}
                    onTagUpdate={this._handleTagUpdate}
                    tags={tags}
                    actionAdd={this.props.actionAdd}
                    tagSearch={this.props.tagSearch}
                    tagSuggestions={tagSuggestions}
                    tagSuggestionsCount={tagSuggestionsCount}
                    searchResetResults={this.props.searchResetResults}
                  />
                </div>
              </Col>
              <Col
                span={6}
                className={
                  `edit-entry-page__publish-options-panel-wrapper
                  edit-entry-page__publish-options-panel-wrapper${showPublishPanel ? '_open' : ''}`
                }
              >
                <PublishOptionsPanel
                  baseUrl={baseUrl}
                  intl={intl}
                  onClose={this._togglePublishPanel(false)}
                  onLicenceChange={this._handleDraftLicenceChange}
                  onExcerptChange={this._handleExcerptChange}
                  onFeaturedImageChange={this._handleFeaturedImageChange}
                  title={title}
                  excerpt={excerpt}
                  errors={errors}
                  featuredImage={featuredImage}
                  selectedLicence={licence}
                  licences={licences}
                />
              </Col>
            </Row>
          </div>
        );
    }
}

NewLinkEntryPage.propTypes = {
    actionAdd: PropTypes.func,
    akashaId: PropTypes.string,
    baseUrl: PropTypes.string,
    draftObj: PropTypes.shape(),
    draftCreate: PropTypes.func,
    draftUpdate: PropTypes.func,
    draftsFetched: PropTypes.bool,
    entriesFetched: PropTypes.bool,
    intl: PropTypes.shape(),
    licences: PropTypes.shape(),
    loggedProfile: PropTypes.shape(),
    match: PropTypes.shape(),
    resolvingEntries: PropTypes.shape(),
    showSecondarySidebar: PropTypes.bool,
    secondarySidebarToggle: PropTypes.func,
    searchResetResults: PropTypes.func,
    tagSearch: PropTypes.func,
    tagSuggestions: PropTypes.shape(),
    tagSuggestionsCount: PropTypes.number,
    userDefaultLicense: PropTypes.shape(),

};
const mapStateToProps = (state, ownProps) => ({
    loggedProfile: selectLoggedProfile(state),
    baseUrl: state.externalProcState.getIn(['ipfs', 'status', 'baseUrl']),
    draftObj: selectDraftById(state, ownProps.match.params.draftId),
    draftsFetched: state.draftState.get('draftsFetched'),
    entriesFetched: state.draftState.get('entriesFetched'),
    licences: state.licenseState.get('byId'),
    resolvingEntries: state.draftState.get('resolvingEntries'),
    showSecondarySidebar: state.appState.get('showSecondarySidebar'),
    tagSuggestions: state.searchState.get('tags'),
    tagSuggestionsCount: state.searchState.get('resultsCount'),
    userDefaultLicense: state.settingsState.getIn(['userSettings', 'defaultLicense'])
});

export default connect(
    mapStateToProps,
    {
        actionAdd,
        draftCreate,
        draftUpdate,
        searchResetResults,
    }
)(injectIntl(NewLinkEntryPage));
