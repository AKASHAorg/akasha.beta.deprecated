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
import { selectFullEntry, selectLoggedAkashaId } from '../../local-flux/selectors';
import { calculateReadingTime } from '../../utils/dataModule';

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
        const { containerRef, publisher } = this.props;
        if (!publisher) {
            return <Avatar className="entry-page-header__avatar" />;
        }

        return (
          <ProfilePopover
            akashaId={publisher.get('akashaId')}
            containerRef={containerRef}
          >
            <Avatar
              className="entry-page-header__avatar"
              firstName={publisher.get('firstName')}
              image={publisher.avatar}
              lastName={publisher.get('lastName')}
              size="small"
            />
          </ProfilePopover>
        );
    };

    renderSubtitle = () => {
        const { entry, intl, latestVersion } = this.props;
        const wordCount = entry.getIn(['content', 'wordCount']) || 0;
        const publishDate = new Date(entry.getIn(['entryEth', 'unixStamp']) * 1000);
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
        const { containerRef, entry, existingDraft, intl, latestVersion, loggedAkashaId,
            publisher } = this.props;
        const isOwnEntry = entry && loggedAkashaId === entry.getIn(['entryEth', 'publisher']);
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
                  {publisher &&
                    <ProfilePopover
                      akashaId={publisher.get('akashaId')}
                      containerRef={containerRef}
                    >
                      <span className="content-link">{publisher.akashaId}</span>
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
    containerRef: PropTypes.shape(),
    entry: PropTypes.shape(),
    existingDraft: PropTypes.shape(),
    history: PropTypes.shape(),
    intl: PropTypes.shape(),
    latestVersion: PropTypes.number,
    location: PropTypes.shape(),
    loggedAkashaId: PropTypes.string.isRequired,
    match: PropTypes.shape(),
    publisher: PropTypes.shape(),
};

function mapStateToProps (state) {
    const entry = selectFullEntry(state);
    const akashaId = entry && entry.getIn(['entryEth', 'publisher']);
    const drafts = state.draftState.get('drafts');
    const existingDraft = entry &&
        drafts.find(draft => draft.get('entryId') === entry.get('entryId'));
    return {
        entry,
        existingDraft,
        loggedAkashaId: selectLoggedAkashaId(state),
        publisher: state.profileState.getIn(['byEthAddress', akashaId]),
    };
}

export default connect(
    mapStateToProps,
    {
        entryPageHide
    }
)(withRouter(injectIntl(EntryPageHeader)));
