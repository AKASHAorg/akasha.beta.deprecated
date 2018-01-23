import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Popover } from 'antd';
import classNames from 'classnames';
import { entryMessages } from '../../locale-data/messages';
import { prependHttp } from '../../utils/url-utils';

class LinkPopover extends Component {
    state = {
        invalidLink: false,
        value: ''
    };

    isLinkValid = (value, submitIfValid) => {
        const expression = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
        const regex = new RegExp(expression);
        const isValid = value.match(regex);
        if (isValid && submitIfValid) {
            this.props.onSubmit(prependHttp(value));
            return;
        }
        if (!isValid) {
            this.setState({ invalidLink: true });
        } else if (this.state.invalidLink) {
            this.setState({ invalidLink: false });
        }
    };

    onChange = (ev) => {
        if (this.state.invalidLink) {
            this.isLinkValid(ev.target.value);
        }
        this.setState({
            value: ev.target.value
        });
    };

    onKeyDown = (ev) => {
        if (ev.key === 'Enter') {
            this.isLinkValid(ev.target.value, true);
        }
    };

    render () {
        const { intl, left, onClose, top } = this.props;
        const { invalidLink, value } = this.state;
        const inputClassName = classNames('link-popover__input', {
            'link-popover__input_invalid': invalidLink
        });
        const content = (
          <input
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
            className={inputClassName}
            onBlur={onClose}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            placeholder={intl.formatMessage(entryMessages.linkPlaceholder)}
            value={value}
          />
        );

        return (
          <div className="selectable-editor__popover-wrapper" style={{ top, left }}>
            <Popover
              content={content}
              overlayClassName="link-popover"
              onVisibleChange={this.onVisibleChange}
              placement="top"
              visible
            >
              <div className="selectable-editor__popover-inner" />
            </Popover>
          </div>
        );
    }
}

LinkPopover.propTypes = {
    intl: PropTypes.shape().isRequired,
    left: PropTypes.number,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    top: PropTypes.number,
};

export default injectIntl(LinkPopover);
