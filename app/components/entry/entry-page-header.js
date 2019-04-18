import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import { parse } from 'querystring';
import { Popover, Tooltip } from 'antd';
import { Avatar, Icon, ProfilePopover, ShareLinkModal } from '../';
import { entryTypes } from '../../constants/entry-types';
import { entryMessages, generalMessages } from '../../locale-data/messages';
import { entryGetFull, entryPageHide } from '../../local-flux/actions/entry-actions';
import { draftSelectors, entrySelectors, profileSelectors } from '../../local-flux/selectors';
import { calculateReadingTime, getDisplayName } from '../../utils/dataModule';
import { addPrefix } from '../../utils/url-utils';
import withRequest from '../high-order-components/with-request';

class EntryPageHeader extends Component {
    state = {
        showVersions: false,
    };
    wasVisible = false;

    _handleVersionsPopoverVisibility = (visible, latestVersion) => {
        this.wasVisible = true;
        if (!latestVersion) return;
        this.setState({
            showVersions: visible
        });
    }
    getCurrentVersion = () => {
        const { entry, latestVersion, location } = this.props;
        const { version } = parse(location.search);
        if (entry.content) {
            return entry.content.version;
        } else if (version) {
            return Number(version);
        }
        return latestVersion;
    };

    getPopupContainer = () => this.props.containerRef || document.body;

    getVersion = (version) => {
        const { history, match } = this.props;
        const query = version !== undefined ? `?version=${ version }` : '';
        history.replace(`${ match.url }${ query }`);
    };

    handleEdit = () => {
        const { entry, history } = this.props;
        const entryType = entryTypes[entry.getIn(['content', 'entryType'])];
        history.push(`/draft/${ entryType }/${ entry.get('entryId') }`);
        // if (existingDraft) {
        //     history.push(`/draft/${existingDraft.get('id')}`);
        // } else {
        //     const version = entry.getIn(['content', 'version']);
        //     const query = `editEntry=${entry.get('entryId')}&version=${version}`;
        //     history.push(`/draft/new?${query}`);
        // }
    };
    _switchToVersion = version =>
        (ev) => {
            const { author, entry, latestVersion } = this.props;
            this.props.dispatchAction(entryGetFull({
                ethAddress: author.get('ethAddress'),
                entryId: entry.get('entryId'),
                version,
                latestVersion
            }));
            ev.preventDefault();
        }
    renderAvatar = () => {
        const { author, containerRef } = this.props;
        if (!author.get('ethAddress')) {
            return <Avatar className="entry-page-header__avatar" size="small"/>;
        }

        return (
            <ProfilePopover
                containerRef={ containerRef }
                ethAddress={ author.get('ethAddress') }
            >
                <Avatar
                    className="entry-page-header__avatar"
                    firstName={ author.get('firstName') }
                    image={ author.get('avatar') }
                    lastName={ author.get('lastName') }
                    size="small"
                />
            </ProfilePopover>
        );
    };

    _getVersionsPopoverContent = () => {
        const { latestVersion, entry, intl } = this.props;
        const { versionsInfo } = entry;
        const versionsEnum = Array(latestVersion + 1).fill('');
        return versionsEnum.map((version, index) => (
            <div
                key={ `${ index }` }
                className="popover-menu__item"
                onClick={ this._switchToVersion(index) }
            >
                { intl.formatMessage(entryMessages.versionNumber, {
                    index: index + 1
                }) }
            </div>
        ));
    }

    renderSubtitle = () => {
        const { entry, intl, latestVersion } = this.props;
        const { showVersions } = this.state;
        const wordCount = entry.getIn(['content', 'wordCount']) || 0;
        const publishDate = new Date(entry.get('publishDate') * 1000);
        const readingTime = calculateReadingTime(wordCount);
        const isOlderVersion = latestVersion && latestVersion !== this.getCurrentVersion();
        // const { versionsInfo } = entry;
        const publishedMessage = (
            <span>
            { !isOlderVersion &&
            <span>
                V{ latestVersion ? latestVersion + 1 : 1 } &#183; { intl.formatMessage(entryMessages.edited) }
              </span>
            }
                { (isOlderVersion) &&
                <span>
                  V{ this.getCurrentVersion() + 1 } &#183; { intl.formatMessage(entryMessages.published) }
              </span>
                }
          </span>
        );
        return (
            <div>
                { readingTime.hours &&
                <span style={ { marginRight: 5 } }>
                { intl.formatMessage(generalMessages.hoursCount, { hours: readingTime.hours }) }
              </span>
                }
                { intl.formatMessage(generalMessages.minCount, { minutes: readingTime.minutes }) }
                <span
                    style={ { paddingLeft: '5px' } }>{ intl.formatMessage(entryMessages.readTime) }</span>
                <span style={ { padding: '0 0 0 5px' } }>
              ({ intl.formatMessage(entryMessages.wordsCount, { words: wordCount }) })
            </span>
                <span style={ { padding: '0 7px' } }>|</span>
                <Popover
                    content={ this.wasVisible ? this._getVersionsPopoverContent() : null }
                    visible={ showVersions }
                    trigger="click"
                    onVisibleChange={ visibility => this._handleVersionsPopoverVisibility(visibility, latestVersion) }
                    placement="bottomRight"
                    overlayClassName="popover-menu"
                >
              <span className="entry-page-header__versions-button">
                <span style={ { paddingRight: '5px' } }>
                  { publishedMessage }
                </span>
                  { !isOlderVersion &&
                  <span style={ { display: 'inline-block' } }>
                    { intl.formatRelative(publishDate) }
                  </span>
                  }
                  { latestVersion &&
                  <Icon type="arrowDropdownOpen" style={ { paddingLeft: 5 } }/>
                  }
              </span>
                </Popover>
            </div>
        );
    };

    render () {
        const { author, containerRef, entry, intl, loggedEthAddress } = this.props;
        const ethAddress = entry.getIn(['author', 'ethAddress']);
        const akashaId = author.get('akashaId');
        const isOwnEntry = loggedEthAddress === ethAddress;
        const url = addPrefix(`/${ ethAddress }/${ entry.entryId }`);

        return (
            <div className="entry-page-header">
                <div className="entry-page-header__inner">
                    { this.renderAvatar() }
                    <div className="entry-page-header__info">
                        <div className="entry-page-header__author">
                            { author.get('ethAddress') &&
                            <ProfilePopover
                                ethAddress={ ethAddress }
                                containerRef={ containerRef }
                            >
                      <span className="content-link">
                        { getDisplayName({ akashaId, ethAddress }) }
                      </span>
                            </ProfilePopover>
                            }
                        </div>
                        <div className="entry-page-header__subtitle">
                            { this.renderSubtitle() }
                        </div>
                    </div>
                    <div className="flex-center entry-page-header__actions">
                        { isOwnEntry &&
                        <Tooltip
                            getPopupContainer={ this.getPopupContainer }
                            title={ intl.formatMessage(entryMessages.editEntry) }
                        >
                            <Icon
                                className="content-link entry-page-header__button"
                                onClick={ this.handleEdit }
                                type="edit"
                            />
                        </Tooltip>
                        }
                        <ShareLinkModal url={ url } withLabel/>
                    </div>
                </div>
            </div>
        );
    }
}

EntryPageHeader.propTypes = {
    author: PropTypes.shape(),
    containerRef: PropTypes.shape(),
    entry: PropTypes.shape(),
    entryGetFull: PropTypes.func,
    existingDraft: PropTypes.shape(),
    history: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    latestVersion: PropTypes.number,
    location: PropTypes.shape(),
    loggedEthAddress: PropTypes.string,
    match: PropTypes.shape().isRequired,
};

function mapStateToProps (state) {
    const entry = entrySelectors.selectFullEntry(state);
    const ethAddress = entry && entrySelectors.getEntryAuthorEthAddress(state);
    const drafts = draftSelectors.selectDrafts(state);
    const existingDraft = entry &&
        drafts.find(draft => draft.get('entryId') === entry.get('entryId'));
    return {
        author: profileSelectors.selectProfileByEthAddress(state, ethAddress),
        entry,
        existingDraft,
        loggedEthAddress: profileSelectors.selectLoggedEthAddress(state),
        latestVersion: entrySelectors.selectFullEntryLatestVersion(state),
    };
}

export default connect(
    mapStateToProps,
    {
        entryPageHide,
        // entryGetFull,

    }
)(withRouter(injectIntl(withRequest(EntryPageHeader))));
