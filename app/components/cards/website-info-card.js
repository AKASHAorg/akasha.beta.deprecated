import React from 'react';
import PropTypes from 'prop-types';
import { Card, Icon } from 'antd';
import imageCreator, { findClosestMatch } from '../../utils/imageUtils';
import { getTextColor } from '../../utils/colorUtils';
import ParserUtils from '../../utils/parsers/parser-utils';

const getImageSrc = (imageObj, baseUrl, targetWidth) => {
    const bestMatch = findClosestMatch((targetWidth || 700), imageObj.toJS(), imageObj.keys()[0]);
    return imageCreator(imageObj.getIn([bestMatch, 'src']), baseUrl);
};

const navigateTo = (url, onClick, isEdit) =>
    (ev) => {
        if (!isEdit) {
            ev.preventDefault();
            if (onClick) {
                return onClick(url);
            }
        }
        return true;
    };

const WebsiteInfoCard = (props) => {
    const { cardInfo, baseUrl, hasCard, baseWidth, onClick,
        onClose, isEdit, loading } = props;
    const { url, image, description, title, bgColor } = cardInfo;
    const bodyStyle = {
        padding: 0
    };
    let textColor = '#444';

    if (bgColor) {
        bodyStyle.backgroundColor = bgColor;
        textColor = getTextColor(bgColor);
    }
    return (
      <Card
        bodyStyle={bodyStyle}
        className={`website-info-card website-info-card${isEdit ? '_edit' : ''}`}
        loading={loading}
        noHovering
      >
        {isEdit &&
          <Icon
            type="close-square"
            className="website-info-card__close-button"
            onClick={onClose}
          />
        }
        {(image.size > 0) &&
          <a
            onClick={navigateTo(url, onClick, isEdit)}
            href={url}
            title={url}
            className="website-info-card__image-link"
          >
            <img
              alt="card-cover"
              style={{
                width: '100%'
              }}
              src={getImageSrc(image, baseUrl, baseWidth)}
            />
          </a>
        }
        <div
          className="website-info-card__title-wrapper"
          style={{ padding: '0 12px' }}
        >
          {title &&
            <h3
              className="website-info-card__title"
            >
              <a
                onClick={navigateTo(url, onClick, isEdit)}
                href={url}
                title={url}
                style={{ color: textColor }}
              >
                {title}
              </a>
            </h3>
          }
          {description &&
            <a
              href={url}
              onClick={navigateTo(url, onClick, isEdit)}
              className="website-info-card__description"
              style={{ color: textColor, opacity: 0.85 }}
            >
              {description}
            </a>
          }
          {url && hasCard &&
            <small
              title={url}
              className="website-info-card__source-url"
            >
              <a
                onClick={navigateTo(url, onClick, isEdit)}
                href={url}
                style={{ color: textColor, opacity: 0.75 }}
              >
                {ParserUtils.parseUrl(url).hostname}
              </a>
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
    onClose: PropTypes.func,
    isEdit: PropTypes.bool,
    loading: PropTypes.bool,
};

export default WebsiteInfoCard;
