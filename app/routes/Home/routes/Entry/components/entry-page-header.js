import React, { Component, PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import { CardHeader, IconButton, SvgIcon } from 'material-ui';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import { Avatar } from 'shared-components';
import { calculateReadingTime } from 'utils/dataModule';
import imageCreator from 'utils/imageUtils';// eslint-disable-line import/no-unresolved, import/extensions
import { entryMessages } from 'locale-data/messages';
import styles from './entry-page-header.scss';

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
        const profileName = `${publisher.firstName} ${publisher.lastName}`;
        const userInitials = profileName.match(/\b\w/g).reduce((prev, current) => prev + current, '');
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
        const { blockNumberDiff, intl, wordCount } = this.props;
        const readingTime = calculateReadingTime(wordCount);
        return (
          <div style={{ fontSize: '12px' }}>
            {intl.formatMessage(entryMessages.publishedBlockDiff, { blockDiff: blockNumberDiff })}
            <span style={{ padding: '0 5px' }}>-</span>
            {readingTime.hours &&
              intl.formatMessage(entryMessages.hoursCount, { hours: readingTime.hours })
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
        const { publisherTitleShadow, publisher, selectProfile } = this.props;
        const publisherBaseUrl = publisher.baseUrl;
        const publisherAvatar = imageCreator(publisher.avatar, publisherBaseUrl);
        return (
          <div
            className={`${styles.entry_publisher_info}`}
            style={{ backgroundColor: '#FFF' }}
          >
            <div
              className={`${styles.entry_publisher_info_inner}`}
              style={{
                  boxShadow: publisherTitleShadow ?
                      '0px 15px 28px -15px #DDD, 0 12px 15px -15px #000000' : 'none'
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
                    {`${publisher.firstName} ${publisher.lastName}`}
                  </button>
                }
                subtitle={this.renderSubtitle()}
                style={{ width: '93%', display: 'inline-block' }}
              />
              <div style={{ width: '7%', display: 'inline-block' }} >
                <IconButton onClick={this.handleBackNavigation} >
                  <SvgIcon>
                    <CloseIcon />
                  </SvgIcon>
                </IconButton>
              </div>
            </div>
          </div>
        );
    }
}

EntryPageHeader.propTypes = {
    blockNumberDiff: PropTypes.number,
    intl: PropTypes.shape(),
    publisher: PropTypes.shape(),
    publisherTitleShadow: PropTypes.bool,
    selectProfile: PropTypes.func,
    wordCount: PropTypes.number
};

EntryPageHeader.contextTypes = {
    router: PropTypes.shape()
};

export default injectIntl(EntryPageHeader);
