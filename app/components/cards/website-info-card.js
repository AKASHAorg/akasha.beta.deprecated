import React from 'react';
import PropTypes from 'prop-types';
import { Card, Icon } from 'antd';
import imageCreator, { findClosestMatch } from '../../utils/imageUtils';

const getHexFromRgb = (rgb) => {
    const r = `0${(parseInt(rgb[1], 10).toString(16)).slice(-2)}`;
    const g = `0${(parseInt(rgb[2], 10).toString(16)).slice(-2)}`;
    const b = `0${(parseInt(rgb[3], 10).toString(16)).slice(-2)}`;

    return {
        r, g, b
    };
};

const getLuma = (color) => {
    const rgb = color.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    if (rgb && rgb.length >= 3) {
        const { r, g, b } = getHexFromRgb(color);
        return [
            0.299 * r,
            0.587 * g,
            0.114 * b
        ].reduce((p, c) => p + c) / 255;
    }
    const hex = color.replace(/#/, '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return [
        0.299 * r,
        0.587 * g,
        0.114 * b
    ].reduce((p, c) => p + c) / 255;
};

const getTextColor = (color) => {
    const luma = getLuma(color);
    if (luma < 0.51) {
        return '#FFF';
    }
    return '#444';
};

const getImageSrc = (imageObj, baseUrl, targetWidth) => {
    const bestMatch = findClosestMatch((targetWidth || 700), imageObj.toJS(), imageObj.keys()[0]);
    return imageCreator(imageObj.getIn([bestMatch, 'src']), baseUrl);
};

const getHostName = (url) => {
    const link = document.createElement('a');
    link.href = url;
    return link.hostname;
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
                {getHostName(url)}
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
