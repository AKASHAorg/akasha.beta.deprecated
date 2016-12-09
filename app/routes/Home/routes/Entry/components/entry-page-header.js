import React, { Component } from 'react';
import { CardHeader, IconButton, SvgIcon } from 'material-ui';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import imageCreator from 'utils/imageUtils';// eslint-disable-line import/no-unresolved, import/extensions
import styles from './entry-page-header.scss';

class EntryPageHeader extends Component {
    render () {
        const { publisherTitleShadow, publisher } = this.props;
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
                avatar={publisherAvatar}
                title={`${publisher.lastName} ${publisher.firstName}`}
                subtitle={'1 day ago - 5 min read'}
                style={{
                    width: '93%',
                    display: 'inline-block'
                }}
              />
              <div
                style={{
                    width: '7%',
                    display: 'inline-block'
                }}
              >
                <IconButton
                  onClick={this._handleBackNavigation}
                >
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
    publisher: React.PropTypes.shape(),
    publisherTitleShadow: React.PropTypes.bool
};
export default EntryPageHeader;
