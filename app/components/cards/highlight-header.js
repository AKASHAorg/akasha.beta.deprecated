import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FormattedDate, injectIntl } from 'react-intl';
import { Popover, Icon } from 'antd';
import { highlightMessages } from '../../locale-data/messages';
import { Avatar, ProfilePopover } from '../';

class HighlightHeader extends Component {
    state = {
        visible: false,
    }

    hide = () => {
        this.setState({
            visible: false,
        });
    }

    handleVisibleChange = (visible) => {
        this.setState({ visible });
    }

    render () {
        const { containerRef, deleteHighlight, highlight, toggleNoteEditable, intl, publisher } = this.props;

        const date = (
          <FormattedDate
            day="2-digit"
            month="long"
            value={new Date(highlight.get('timestamp'))}
            year="numeric"
          />
        );
        const publisherUrl = `/@${highlight.get('publisher')}`;
        const entryUrl = `${publisherUrl}/${highlight.get('entryId')}`;

        const menu = (
          <div
            onClick={this.hide}
            className="highlight-header__menu"
          >
            <div className="highlight-header__button-text">
              {intl.formatMessage(highlightMessages.startEntry)}
            </div>
            <div
              onClick={() => toggleNoteEditable(highlight.get('id'))}
              className="highlight-header__button-text"
            >
              {highlight.get('notes') ?
                  intl.formatMessage(highlightMessages.editNote) :
                  intl.formatMessage(highlightMessages.addNote)
                }
            </div>
            <div
              onClick={() => deleteHighlight(highlight.get('id'))}
              className="highlight-header__button-text"
            >
              {intl.formatMessage(highlightMessages.deleteHighlight)}
            </div>
          </div>
        );

        return (
          <div className="highlight-header">
            <ProfilePopover akashaId={highlight.get('publisher')} containerRef={containerRef}>
              <Avatar
                className="highlight-header__avatar"
                firstName={publisher.get('firstName')}
                image={publisher.get('avatar')}
                lastName={publisher.get('lastName')}
                size="small"
              />
            </ProfilePopover>
            <div className="highlight-header__text">
              <ProfilePopover akashaId={highlight.get('publisher')} containerRef={containerRef}>
                <span className="content-link">
                  {publisher.get('akashaId') || highlight.get('publisher')}
                </span>
              </ProfilePopover>
              <div className="highlight-header__subtitle">
                <div className="highlight-header__entry-title overflow-ellipsis">
                  <Link className="unstyled-link content-link highlight-header__link" to={entryUrl}>
                    {highlight.get('entryTitle')}
                  </Link>
                </div>
                <span style={{ margin: '0px 5px' }}>|</span>
                {date}
              </div>
            </div>
            <Popover
              arrowPointAtCenter
              placement="bottomLeft"
              content={menu}
              trigger="click"
              overlayClassName="highlight-header__popover"
              visible={this.state.visible}
              onVisibleChange={this.handleVisibleChange}
            >
              <Icon type="ellipsis" className="highlight-header__menu-icon" />
            </Popover>
          </div>
        );
    }
}

HighlightHeader.propTypes = {
    containerRef: PropTypes.shape(),
    deleteHighlight: PropTypes.func.isRequired,
    highlight: PropTypes.shape().isRequired,
    toggleNoteEditable: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
    publisher: PropTypes.shape()
};

export default injectIntl(HighlightHeader);
