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
        onClose, isEdit, loading, error, infoExtracted, maxImageHeight } = props;
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
        className={
            `website-info-card
            website-info-card${!infoExtracted && !error ? '_empty' : ''}
            website-info-card${isEdit ? '_edit' : ''}`
        }
        loading={loading}
        hoverable={false}
      >
        {!title && !description && infoExtracted && !error &&
          <div>Cannot extract information from website!</div>
        }
        {error &&
          <div className="website-info-card__error">
            <Icon type="exclamation-circle-o" />
            {error}
          </div>
        }
        {isEdit && infoExtracted &&
          <Icon
            type="close-square"
            className="website-info-card__close-button"
            onClick={onClose}
          />
        }
        {!error && (image.size > 0) &&
          <a
            onClick={navigateTo(url, onClick, isEdit)}
            href={url}
            title={url}
            className="website-info-card__image-link"
          >
            <div
              className="website-info-card__card-cover-wrapper"
              style={{ height: maxImageHeight }}
            >
              <img
                alt="card-cover"
                src={getImageSrc(image, baseUrl, baseWidth)}
              />
            </div>
          </a>
        }
        {!error && url && hasCard &&
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
        <div
          className="website-info-card__title-wrapper"
        >
          {!error && title &&
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
          {!error && description &&
            <a
              href={url}
              onClick={navigateTo(url, onClick, isEdit)}
              className="website-info-card__description"
              style={{ color: textColor, opacity: 0.85 }}
            >
              {description}
            </a>
          }
        </div>
      </Card>
    );
};
WebsiteInfoCard.defaultProps = {
    maxImageHeight: 350,
};

WebsiteInfoCard.propTypes = {
    baseUrl: PropTypes.string,
    baseWidth: PropTypes.number,
    cardInfo: PropTypes.shape(),
    error: PropTypes.string,
    hasCard: PropTypes.bool,
    infoExtracted: PropTypes.bool.isRequired,
    maxImageHeight: PropTypes.number,
    onClick: PropTypes.func,
    onClose: PropTypes.func,
    isEdit: PropTypes.bool,
    loading: PropTypes.bool,
};

export default WebsiteInfoCard;
