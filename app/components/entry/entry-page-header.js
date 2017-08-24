import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import ReactTooltip from 'react-tooltip';
import { parse } from 'querystring';
import { CardHeader, IconButton, SvgIcon } from 'material-ui';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import EditIcon from 'material-ui/svg-icons/image/edit';
import { Avatar, EntryVersionsPanel, ProfileHoverCard } from '../';
import { entryMessages, generalMessages } from '../../locale-data/messages';
import { entryPageHide } from '../../local-flux/actions/entry-actions';
import { selectFullEntry, selectLoggedAkashaId } from '../../local-flux/selectors';
import { calculateReadingTime, getInitials } from '../../utils/dataModule';
import styles from './entry-page-header.scss';

const buttonStyle = {
    width: '40px',
    height: '40px',
    padding: '8px',
    margin: '4px'
};

class EntryPageHeader extends Component {
    state = {
        showVersions: false,
        anchorHovered: false,
    };

    componentDidMount () {
        ReactTooltip.rebuild();
    }

    componentWillUnmount () {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

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

    showProfileHoverCard = (ev) => {
        this.setState({
            hoverNode: ev.currentTarget
        });
        this.timeout = setTimeout(() => {
            this.setState({
                anchorHovered: true,
            });
        }, 500);
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

    getVersion = (version) => {
        const { history, match } = this.props;
        const query = version !== undefined ? `?version=${version}` : '';
        history.replace(`${match.url}${query}`);
    };

    hideProfileHoverCard = () => {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.setState({
            anchorHovered: false,
            hoverNode: null
        });
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
        const { publisher } = this.props;
        if (!publisher) {
            return <Avatar style={{ cursor: 'pointer' }} />;
        }
        const userInitials = getInitials(publisher.firstName, publisher.lastName);

        return (
          <Link to={`/@${publisher.get('akashaId')}`}>
            <Avatar
              image={publisher.avatar}
              onMouseEnter={this.showProfileHoverCard}
              style={{ cursor: 'pointer' }}
              userInitials={userInitials}
              userInitialsStyle={{ fontSize: '12px', margin: '0px' }}
            />
          </Link>
        );
    };

    renderSubtitle = () => {
        const { entry, intl, latestVersion } = this.props;
        const blockNr = entry.getIn(['entryEth', 'blockNr']);
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
          <div style={{ fontSize: '12px' }}>
            <span style={{ paddingRight: '5px' }}>
              {publishedMessage}
            </span>
            {!isOlderVersion &&
              <span
                data-tip={intl.formatMessage(entryMessages.blockNr, { blockNr })}
                style={{ fontWeight: 600, display: 'inline-block' }}
              >
                {intl.formatRelative(publishDate)}
              </span>
            }
            <span style={{ padding: '0 5px' }}>-</span>
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
    }

    render () {
        const { entry, existingDraft, latestVersion, loggedAkashaId,
            publisherTitleShadow, publisher, intl, history } = this.props;
        const { palette } = this.context.muiTheme;
        const isOwnEntry = entry && loggedAkashaId === entry.getIn(['entryEth', 'publisher']);

        return (
          <div
            className={styles.entry_publisher_info}
            style={{ backgroundColor: palette.entryPageBackground }}
          >
            <div
              className={styles.entry_publisher_info_inner}
              style={{
                  position: 'relative',
                  boxShadow: publisherTitleShadow ?
                      '0px 15px 28px -15px #555, 0 12px 15px -15px #000000' : 'none',
                  transform: 'translate3d(0,0,0)',
                  willChange: 'box-shadow',
                  padding: 16
              }}
            >
              <CardHeader
                avatar={this.renderAvatar()}
                onMouseLeave={this.hideProfileHoverCard}
                subtitle={this.renderSubtitle()}
                style={{ zIndex: 5, padding: 0 }}
                title={publisher ?
                  <Link to={`/@${publisher.get('akashaId')}`}>
                    <div
                      className={`content-link ${styles.entry_publisher_name}`}
                      onMouseEnter={this.showProfileHoverCard}
                      style={{ color: palette.textColor }}
                    >
                      {publisher.akashaId}
                    </div>
                  </Link> :
                  <div style={{ height: '22px' }} />
                }
              >
                {publisher &&
                  <ProfileHoverCard
                    anchorHovered={this.state.anchorHovered}
                    anchorNode={this.state.hoverNode}
                    profile={publisher}
                  />
                }
              </CardHeader>
              <div className={styles.entry_header_actions}>
                {isOwnEntry &&
                  <div
                    data-tip={entry.get('active') ?
                        intl.formatMessage(entryMessages.editEntry) :
                        intl.formatMessage(entryMessages.cannotEdit)
                    }
                  >
                    <IconButton
                      onClick={this.handleEdit}
                      style={buttonStyle}
                      disabled={!entry.get('active')}
                    >
                      <SvgIcon>
                        <EditIcon />
                      </SvgIcon>
                    </IconButton>
                  </div>
                }
                <div data-tip={intl.formatMessage(generalMessages.close)}>
                  <IconButton onClick={history.goBack} style={buttonStyle}>
                    <SvgIcon>
                      <CloseIcon />
                    </SvgIcon>
                  </IconButton>
                </div>
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

EntryPageHeader.contextTypes = {
    muiTheme: PropTypes.shape()
};

EntryPageHeader.propTypes = {
    entry: PropTypes.shape(),
    existingDraft: PropTypes.shape(),
    history: PropTypes.shape(),
    intl: PropTypes.shape(),
    latestVersion: PropTypes.number,
    location: PropTypes.shape(),
    loggedAkashaId: PropTypes.string.isRequired,
    match: PropTypes.shape(),
    publisher: PropTypes.shape(),
    publisherTitleShadow: PropTypes.bool,
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
        publisher: state.profileState.getIn(['byId', akashaId]),
    };
}

export default connect(
    mapStateToProps,
    {
        entryPageHide
    }
)(withRouter(injectIntl(EntryPageHeader)));
