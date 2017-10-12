import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import { parse } from 'querystring';
import { Icon, Tooltip } from 'antd';
import classNames from 'classnames';
import { Avatar, EntryVersionsPanel, ProfilePopover } from '../';
import { entryMessages, generalMessages } from '../../locale-data/messages';
import { entryPageHide } from '../../local-flux/actions/entry-actions';
import { selectFullEntry, selectLoggedEthAddress, selectProfile } from '../../local-flux/selectors';
import { calculateReadingTime, getDisplayName } from '../../utils/dataModule';

class EntryPageHeader extends Component {
    state = {
        showVersions: false,
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
        const query = version !== undefined ? `?version=${version}` : '';
        history.replace(`${match.url}${query}`);
    };

    handleEdit = () => {
        const { entry, existingDraft, history } = this.props;
        if (existingDraft) {
            history.push(`/draft/${existingDraft.get('id')}`);
        } else {
            const version = entry.getIn(['content', 'version']);
            const query = `editEntry=${entry.get('entryId')}&version=${version}`;
            history.push(`/draft/new?${query}`);
        }
    };

    renderAvatar = () => {
        const { author, containerRef } = this.props;
        if (!author.get('ethAddress')) {
            return <Avatar className="entry-page-header__avatar" size="small" />;
        }

        return (
          <ProfilePopover
            containerRef={containerRef}
            ethAddress={author.get('ethAddress')}
          >
            <Avatar
              className="entry-page-header__avatar"
              firstName={author.get('firstName')}
              image={author.get('avatar')}
              lastName={author.get('lastName')}
              size="small"
            />
          </ProfilePopover>
        );
    };

    renderSubtitle = () => {
        const { entry, intl, latestVersion } = this.props;
        const wordCount = entry.getIn(['content', 'wordCount']) || 0;
        const publishDate = new Date(entry.get('publishDate') * 1000);
        const readingTime = calculateReadingTime(wordCount);
        const isOlderVersion = latestVersion && latestVersion !== this.getCurrentVersion();
        let publishedMessage;
        if (!latestVersion) {
            publishedMessage = intl.formatMessage(entryMessages.published);
        } else if (isOlderVersion) {
            publishedMessage = (
              <span>
                <span>{intl.formatMessage(entryMessages.olderVersion)} </span>
                <span onClick={this.openVersionsPanel} className="link">
                  {intl.formatMessage(entryMessages.version)}
                </span>
                <span> *</span>
              </span>
            );
        } else {
            publishedMessage = (
              <span>
                <span onClick={this.openVersionsPanel} className="link">
                  {intl.formatMessage(entryMessages.published)}
                </span>
                <span> *</span>
              </span>
            );
        }

        return (
          <div>
            <span style={{ paddingRight: '5px' }}>
              {publishedMessage}
            </span>
            {!isOlderVersion &&
              <span style={{ display: 'inline-block' }}>
                {intl.formatRelative(publishDate)}
              </span>
            }
            <span style={{ padding: '0 7px' }}>|</span>
            {readingTime.hours &&
              <span style={{ marginRight: 5 }}>
                {intl.formatMessage(generalMessages.hoursCount, { hours: readingTime.hours })}
              </span>
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
        const { author, containerRef, entry, existingDraft, intl, latestVersion,
            loggedEthAddress } = this.props;
        const ethAddress = entry.getIn(['author', 'ethAddress']);
        const akashaId = author.get('akashaId');
        const isOwnEntry = loggedEthAddress === ethAddress;
        const buttonClass = classNames('entry-page-header__button', {
            'content-link': entry.get('active'),
            'entry-page-header__button_disabled': !entry.get('active')
        });

        return (
          <div className="entry-page-header">
            <div className="entry-page-header__inner">
              {this.renderAvatar()}
              <div className="entry-page-header__info">
                <div className="entry-page-header__author">
                  {author.get('ethAddress') &&
                    <ProfilePopover
                      ethAddress={ethAddress}
                      containerRef={containerRef}
                    >
                      <span className="content-link">
                        {getDisplayName({ akashaId, ethAddress })}
                      </span>
                    </ProfilePopover>
                  }
                </div>
                <div className="entry-page-header__subtitle">
                  {this.renderSubtitle()}
                </div>
              </div>
              <div className="flex-center entry-page-header__actions">
                {isOwnEntry &&
                  <Tooltip
                    getPopupContainer={this.getPopupContainer}
                    title={entry.get('active') ?
                        intl.formatMessage(entryMessages.editEntry) :
                        intl.formatMessage(entryMessages.cannotEdit)
                    }
                  >
                    <Icon
                      className={buttonClass}
                      onClick={entry.get('active') && this.handleEdit}
                      type="edit"
                    />
                  </Tooltip>
                }
              </div>
            </div>
            {!!latestVersion && this.state.showVersions &&
              <EntryVersionsPanel
                closeVersionsPanel={this.closeVersionsPanel}
                currentVersion={this.getCurrentVersion()}
                existingDraft={existingDraft}
                getVersion={this.getVersion}
                handleEdit={this.handleEdit}
                isOwnEntry={isOwnEntry}
                latestVersion={latestVersion}
              />
            }
          </div>
        );
    }
}

EntryPageHeader.propTypes = {
    author: PropTypes.shape(),
    containerRef: PropTypes.shape().isRequired,
    entry: PropTypes.shape(),
    existingDraft: PropTypes.shape(),
    history: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    latestVersion: PropTypes.number,
    location: PropTypes.shape(),
    loggedEthAddress: PropTypes.string.isRequired,
    match: PropTypes.shape().isRequired,
};

function mapStateToProps (state) {
    const entry = selectFullEntry(state);
    const ethAddress = entry && entry.getIn(['author', 'ethAddress']);
    const drafts = state.draftState.get('drafts');
    const existingDraft = entry &&
        drafts.find(draft => draft.get('entryId') === entry.get('entryId'));
    return {
        author: selectProfile(state, ethAddress),
        entry,
        existingDraft,
        loggedEthAddress: selectLoggedEthAddress(state),
    };
}

export default connect(
    mapStateToProps,
    {
        entryPageHide
    }
)(withRouter(injectIntl(EntryPageHeader)));
