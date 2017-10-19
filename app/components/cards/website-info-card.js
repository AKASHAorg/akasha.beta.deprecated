import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import imageCreator, { findClosestMatch } from '../../utils/imageUtils';

const getImageSrc = (imageObj, baseUrl) => {
    const bestMatch = findClosestMatch(700, imageObj.toJS(), imageObj.keys()[0]);
    return imageCreator(imageObj.getIn([bestMatch, 'src']), baseUrl);
};

const getHostName = (url) => {
    const link = document.createElement('a');
    link.href = url;
    return link.hostname;
};

const WebsiteInfoCard = (props) => {
    const { cardInfo, url, baseUrl, hasCard } = props;
    return (
      <Card bodyStyle={{ padding: 0 }} className="website-info-card" noHovering>
        {(cardInfo.get('image').size > 0) &&
          <a href={url} title={url}>
            <img
              alt="card-cover"
              style={{
                width: '100%'
              }}
              src={getImageSrc(cardInfo.get('image'), baseUrl)}
            />
          </a>
        }
        <div className="" style={{ padding: '0 12px' }}>
          {cardInfo.get('title') &&
            <h3 title={cardInfo.get('title')}>
              <a
                href={url}
                title={url}
              >
                {cardInfo.get('title')}
              </a>
            </h3>
          }
          {cardInfo.get('description') &&
            <div>
              {cardInfo.get('description')}
            </div>
          }
          {url && hasCard &&
            <small
              title={url}
              className="website-info-card__source-url"
            >
              <a href={url}>{getHostName(url)}</a>
            </small>
          }
        </div>
      </Card>
    );
};

WebsiteInfoCard.propTypes = {
    baseUrl: PropTypes.string,
    cardInfo: PropTypes.shape(),
    hasCard: PropTypes.bool,
    url: PropTypes.string,
};

export default WebsiteInfoCard;
