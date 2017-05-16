import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import ReactTooltip from 'react-tooltip';
import { parse } from 'querystring';
import { CardHeader, IconButton, SvgIcon, FlatButton } from 'material-ui';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import EditIcon from 'material-ui/svg-icons/image/edit';
import { ProfileHoverCard } from 'shared-components';
import { calculateReadingTime, getInitials } from 'utils/dataModule'; // eslint-disable-line import/no-unresolved, import/extensions
import { entryMessages, generalMessages } from 'locale-data/messages'; // eslint-disable-line import/no-unresolved, import/extensions
import styles from './entry-page-header.scss';
import { entryPageHide } from '../../../../../local-flux/actions/entry-actions';
import { selectFullEntry, selectLoggedAkashaId } from '../../../../../local-flux/selectors';
import { Avatar, EntryVersionsPanel } from '../../../../../components';

const buttonStyle = {
    width: '40px',
    height: '40px',
    padding: '8px',
    margin: '4px'
};

const FLOATING_COMMENTS_BUTTON_ACTIVE = false;

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
            return (
              <Avatar
                style={{ cursor: 'pointer' }}
                radius={40}
              />
            );
        }
        const userInitials = getInitials(publisher.firstName, publisher.lastName);

        return (
          <Link to={`/${publisher.get('akashaId')}`}>
            <Avatar
              image={publisher.avatar}
              style={{ cursor: 'pointer' }}
              radius={40}
              userInitials={userInitials}
              userInitialsStyle={{ fontSize: '12px', margin: '0px' }}
              onMouseEnter={this.showProfileHoverCard}
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
                data-tip={`Block ${blockNr}`}
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
        const { entry, existingDraft, isScrollingDown,
            latestVersion, loggedAkashaId, publisherTitleShadow, publisher, intl,
            commentsSectionTop, newCommentsCount, history } = this.props;
        const { palette } = this.context.muiTheme;
        const isOwnEntry = entry && loggedAkashaId === entry.getIn(['entryEth', 'publisher']);
        let newCommentsButtonTop = 0;
        if (isScrollingDown) {
            newCommentsButtonTop = 32;
        } else if (commentsSectionTop > 0) {
            newCommentsButtonTop = 32;
        } else {
            newCommentsButtonTop = 110;
        }

        return (
          <div
            className={styles.entry_publisher_info}
            style={{ backgroundColor: palette.canvasColor }}
          >
            <div
              className={styles.entry_publisher_info_inner}
              style={{
                  position: 'relative',
                  boxShadow: publisherTitleShadow ?
                      '0px 15px 28px -15px #DDD, 0 12px 15px -15px #000000' : 'none',
                  transform: 'translate3d(0,0,0)',
                  willChange: 'box-shadow',
                  padding: 16
              }}
            >
              <CardHeader
                avatar={this.renderAvatar()}
                title={publisher ?
                  <Link to={`/${publisher.get('akashaId')}`}>
                    <div
                      className="content-link"
                      onMouseEnter={this.showProfileHoverCard}
                      style={{
                          color: palette.textColor,
                          fontSize: '16px',
                          fontWeight: '600',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '570px',
                          textAlign: 'left'
                      }}
                    >
                      {`${publisher.firstName} ${publisher.lastName}`}
                    </div>
                  </Link> :
                  <div style={{ height: '22px' }} />
                }
                onMouseLeave={this.hideProfileHoverCard}
                subtitle={this.renderSubtitle()}
                style={{ zIndex: 5, padding: 0 }}
              >
                {publisher &&
                  <ProfileHoverCard
                    anchorHovered={this.state.anchorHovered}
                    anchorNode={this.state.hoverNode}
                    profile={publisher}
                  />
                }
              </CardHeader>
              {newCommentsCount > 0 && FLOATING_COMMENTS_BUTTON_ACTIVE &&
                <div
                  style={{
                      position: 'absolute',
                      top: newCommentsButtonTop,
                      transform: 'translate3d(0,0,0)',
                      textAlign: 'center',
                      margin: '0 auto',
                      zIndex: 1,
                      padding: 0,
                      width: 700,
                      transition: isScrollingDown ? 'top 0.214s ease-in-out' : 'none',
                      height: 1,
                      willChange: 'top'
                  }}
                  className="row middle-xs"
                >
                  <div className="col-xs-12 center-xs" style={{ position: 'relative' }}>
                    <FlatButton
                      primary
                      label={intl.formatMessage(entryMessages.newComments, {
                          count: newCommentsCount
                      })}
                      hoverColor="#ececec"
                      backgroundColor={palette.canvasColor}
                      style={{ position: 'absolute', top: -18, zIndex: 2, left: '50%', marginLeft: '-70px' }}
                      labelStyle={{ fontSize: 12 }}
                      onClick={this.props.onRequestNewestComments}
                    />
                  </div>
                </div>
              }
              <div style={{ position: 'absolute', top: 0, right: 0, height: 80, display: 'flex', alignItems: 'center', zIndex: 5 }} >
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
    commentsSectionTop: PropTypes.number,
    entry: PropTypes.shape(),
    existingDraft: PropTypes.shape(),
    history: PropTypes.shape(),
    intl: PropTypes.shape(),
    isScrollingDown: PropTypes.bool,
    latestVersion: PropTypes.number,
    location: PropTypes.shape(),
    loggedAkashaId: PropTypes.string.isRequired,
    match: PropTypes.shape(),
    newCommentsCount: PropTypes.number,
    onRequestNewestComments: PropTypes.func,
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
        latestVersion: state.entryState.get('fullEntryLatestVersion'),
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
