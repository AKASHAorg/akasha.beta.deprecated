import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import imageCreator, { findClosestMatch } from '../../utils/imageUtils';

const getImageSrc = (imageObj, baseUrl, targetWidth) => {
    const bestMatch = findClosestMatch((targetWidth || 700), imageObj.toJS(), imageObj.keys()[0]);
    return imageCreator(imageObj.getIn([bestMatch, 'src']), baseUrl);
};

const getHostName = (url) => {
    const link = document.createElement('a');
    link.href = url;
    return link.hostname;
};

const navigateTo = (url, onClick) =>
    (ev) => {
        ev.preventDefault();
        if (onClick) onClick(url);
    };

const WebsiteInfoCard = (props) => {
    const { cardInfo, baseUrl, hasCard, baseWidth, onClick } = props;
    const { url } = cardInfo;
    return (
      <Card bodyStyle={{ padding: 0 }} className="website-info-card" noHovering>
        {(cardInfo.get('image').size > 0) &&
          <a onClick={navigateTo(url, onClick)} href="#" title={url}>
            <img
              alt="card-cover"
              style={{
                width: '100%'
              }}
              src={getImageSrc(cardInfo.get('image'), baseUrl, baseWidth)}
            />
          </a>
        }
        <div className="" style={{ padding: '0 12px' }}>
          {cardInfo.get('title') &&
            <h3 title={cardInfo.get('title')}>
              <a
                onClick={navigateTo(url, onClick)}
                href="#"
                title={url}
              >
                {cardInfo.get('title')}
              </a>
            </h3>
          }
          {cardInfo.get('description') &&
            <a
              onClick={navigateTo(url, onClick)}
              href="#"
            >
              {cardInfo.get('description')}
            </a>
          }
          {url && hasCard &&
            <small
              title={url}
              className="website-info-card__source-url"
            >
              <a onClick={navigateTo(url, onClick)} href="#" >{getHostName(url)}</a>
            </small>
          }
        </div>
      </Card>
    );
};

WebsiteInfoCard.propTypes = {
    baseUrl: PropTypes.string,
    baseWidth: PropTypes.number,
    cardInfo: PropTypes.shape(),
    hasCard: PropTypes.bool,
    onClick: PropTypes.func,
};

export default WebsiteInfoCard;
