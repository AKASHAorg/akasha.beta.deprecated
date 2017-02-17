import React, { Component, PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import { CardHeader, IconButton, SvgIcon, FlatButton } from 'material-ui';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import EditIcon from 'material-ui/svg-icons/image/edit';
import { Avatar, EntryVersionsPanel, ProfileHoverCard } from 'shared-components';
import { calculateReadingTime, getInitials } from 'utils/dataModule'; // eslint-disable-line import/no-unresolved, import/extensions
import imageCreator from 'utils/imageUtils'; // eslint-disable-line import/no-unresolved, import/extensions
import { entryMessages } from 'locale-data/messages'; // eslint-disable-line import/no-unresolved, import/extensions
import styles from './entry-page-header.scss';

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

    handleBackNavigation = () => {
        this.context.router.goBack();
    };

    showProfileHoverCard = (ev) => {
        this.setState({
            anchorHovered: true,
            hoverNode: ev.target
        });
    };

    hideProfileHoverCard = () => {
        this.setState({
            anchorHovered: false,
            hoverNode: null
        });
    };

    renderAvatar = () => {
        const { publisher, selectProfile } = this.props;
        const publisherBaseUrl = publisher.baseUrl;
        const publisherAvatar = publisher.avatar ?
            imageCreator(publisher.avatar, publisherBaseUrl) :
            null;
        const userInitials = getInitials(publisher.firstName, publisher.lastName);
        return (
          <Avatar
            image={publisherAvatar}
            style={{ display: 'inline-block', cursor: 'pointer' }}
            radius={40}
            userInitials={userInitials}
            userInitialsStyle={{
                textTransform: 'uppercase',
                fontSize: '12px',
                fontWeight: '600',
                margin: '0px'
            }}
            onMouseEnter={this.showProfileHoverCard}
            onClick={selectProfile}
          />
        );
    };

    renderSubtitle = () => {
        const { currentVersion, entryBlockNr, intl, latestVersion, timestamp,
            wordCount } = this.props;
        const publishDate = new Date(timestamp * 1000);
        const readingTime = calculateReadingTime(wordCount);
        const isOlderVersion = latestVersion && latestVersion !== currentVersion;
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
                data-tip={`Block ${entryBlockNr}`}
                style={{ fontWeight: 600, display: 'inline-block' }}
              >
                {intl.formatRelative(publishDate)}
              </span>
            }
            <span style={{ padding: '0 5px' }}>-</span>
            {readingTime.hours &&
              <span style={{ marginRight: 5 }}>
                {intl.formatMessage(entryMessages.hoursCount, { hours: readingTime.hours })}
              </span>
            }
            {intl.formatMessage(entryMessages.minutesCount, { minutes: readingTime.minutes })}
            <span style={{ paddingLeft: '5px' }}>{intl.formatMessage(entryMessages.readTime)}</span>
            <span style={{ padding: '0 5px' }}>
              ({intl.formatMessage(entryMessages.wordsCount, { words: wordCount })})
            </span>
          </div>
        );
    }

    render () {
        const { currentVersion, existingDraft, getVersion, handleEdit, isActive, isOwnEntry,
            latestVersion, publisherTitleShadow, publisher, selectProfile, intl,
            commentsSectionTop } = this.props;
        const isScrollingDown = (this.props.scrollDirection === -1);
        let newCommentsButtonTop = 0;
        if (isScrollingDown) {
            newCommentsButtonTop = 32;
        }
        if (!isScrollingDown) {
            if (commentsSectionTop > 0) {
                newCommentsButtonTop = 32;
            } else {
                newCommentsButtonTop = 110;
            }
        }
        return (
          <div
            className={`${styles.entry_publisher_info}`}
            style={{ backgroundColor: '#FFF' }}
          >
            <div
              className={`${styles.entry_publisher_info_inner}`}
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
                title={
                  <button
                    style={{
                        border: '0px',
                        outline: 'none',
                        background: 'transparent',
                        padding: 0,
                        fontSize: '16px',
                        fontWeight: '600'
                    }}
                    onClick={selectProfile}
                    onMouseEnter={this.showProfileHoverCard}
                  >
                    <div
                      style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '570px',
                          textAlign: 'left'
                      }}
                    >
                      {`${publisher.firstName} ${publisher.lastName}`}
                    </div>
                  </button>
                }
                onMouseLeave={this.hideProfileHoverCard}
                subtitle={this.renderSubtitle()}
                style={{
                    backgroundColor: '#FFF',
                    zIndex: 5,
                    padding: 0
                }}
              >
                <ProfileHoverCard
                  anchorHovered={this.state.anchorHovered}
                  anchorNode={this.state.hoverNode}
                  profile={publisher}
                />
              </CardHeader>
              {(this.props.newCommentsCount > 0) && FLOATING_COMMENTS_BUTTON_ACTIVE &&
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
                          count: this.props.newCommentsCount
                      })}
                      hoverColor="#ececec"
                      backgroundColor="#FFF"
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
                    data-tip={isActive ?
                        'Edit entry' :
                        'This entry can no longer be edited'
                    }
                  >
                    <IconButton onClick={handleEdit} style={buttonStyle} disabled={!isActive}>
                      <SvgIcon>
                        <EditIcon />
                      </SvgIcon>
                    </IconButton>
                  </div>
                }
                <div data-tip="Close">
                  <IconButton onClick={this.handleBackNavigation} style={buttonStyle}>
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
                currentVersion={currentVersion}
                existingDraft={existingDraft}
                getVersion={getVersion}
                handleEdit={handleEdit}
                isOwnEntry={isOwnEntry}
                latestVersion={latestVersion}
              />
            }
          </div>
        );
    }
}

EntryPageHeader.propTypes = {
    commentsSectionTop: PropTypes.number,
    currentVersion: PropTypes.number,
    entryBlockNr: PropTypes.number,
    existingDraft: PropTypes.shape(),
    getVersion: PropTypes.func,
    handleEdit: PropTypes.func,
    intl: PropTypes.shape(),
    isActive: PropTypes.bool,
    isOwnEntry: PropTypes.bool,
    latestVersion: PropTypes.number,
    newCommentsCount: PropTypes.number,
    onRequestNewestComments: PropTypes.func,
    publisher: PropTypes.shape(),
    publisherTitleShadow: PropTypes.bool,
    scrollDirection: PropTypes.number,
    selectProfile: PropTypes.func,
    timestamp: PropTypes.number,
    wordCount: PropTypes.number,
};

EntryPageHeader.contextTypes = {
    router: PropTypes.shape()
};

export default injectIntl(EntryPageHeader);
