import React, { Component, PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import { CardHeader, IconButton, SvgIcon } from 'material-ui';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import EditIcon from 'material-ui/svg-icons/image/edit';
import { Avatar } from 'shared-components';
import { calculateReadingTime, getInitials } from 'utils/dataModule';
import imageCreator from 'utils/imageUtils';// eslint-disable-line import/no-unresolved, import/extensions
import { entryMessages } from 'locale-data/messages';
import styles from './entry-page-header.scss';

const buttonStyle= {
    width: '40px',
    height: '40px',
    padding: '8px',
    margin: '4px'
};

class EntryPageHeader extends Component {

    handleBackNavigation = () => {
        this.context.router.goBack();
    }

    renderAvatar = () => {
        const { publisher, selectProfile } = this.props;
        const publisherBaseUrl = publisher.baseUrl;
        const publisherAvatar = publisher.avatar ?
            imageCreator(publisher.avatar, publisherBaseUrl) :
            null;
        const userInitials = getInitials(publisher.firstName, publisher.lastName);
        return (
          <button
            style={{
                border: '0px', outline: 'none', background: 'transparent', borderRadius: '50%'
            }}
            onClick={selectProfile}
          >
            <Avatar
              image={publisherAvatar}
              style={{ display: 'inline-block' }}
              radius={40}
              userInitials={userInitials}
              userInitialsStyle={{
                  textTransform: 'uppercase',
                  fontSize: '12px',
                  fontWeight: '600',
                  margin: '0px'
              }}
            />
          </button>
        );
    };

    renderSubtitle = () => {
        const { entryBlockNr, intl, timestamp, wordCount } = this.props;
        const publishDate = new Date(timestamp * 1000);
        const readingTime = calculateReadingTime(wordCount);
        return (
          <div style={{ fontSize: '12px' }}>
            <span style={{ paddingRight: '5px' }}>
              {intl.formatMessage(entryMessages.published)}
            </span>
            <span
              data-tip={`Block ${entryBlockNr}`}
              style={{ fontWeight: 600, textDecoration: 'underline', display: 'inline-block' }}
            >
              {intl.formatRelative(publishDate)}
            </span>
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
        const { handleEdit, isActive, isOwnEntry, publisherTitleShadow, publisher,
            selectProfile } = this.props;
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
                subtitle={this.renderSubtitle()}
              />
              <div style={{ position: 'absolute', top: 0, right: 0, height: 80, display: 'flex', alignItems: 'center' }} >
                {isOwnEntry &&
                  <div
                    data-tip={isActive ?
                        'Edit entry' :
                        'This entry can no longer be edited'
                    }
                  >
                    <IconButton onClick={handleEdit} style={buttonStyle}>
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
          </div>
        );
    }
}

EntryPageHeader.propTypes = {
    entryBlockNr: PropTypes.number,
    handleEdit: PropTypes.func,
    intl: PropTypes.shape(),
    isActive: PropTypes.bool,
    isOwnEntry: PropTypes.bool,
    publisher: PropTypes.shape(),
    publisherTitleShadow: PropTypes.bool,
    selectProfile: PropTypes.func,
    timestamp: PropTypes.number,
    wordCount: PropTypes.number
};

EntryPageHeader.contextTypes = {
    router: PropTypes.shape()
};

export default injectIntl(EntryPageHeader);
