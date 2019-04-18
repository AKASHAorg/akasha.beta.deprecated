import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Popover } from 'antd';
import classNames from 'classnames';
import { entryMessages } from '../../locale-data/messages';
import { isInternalLink, isValidLink, prependHttp } from '../../utils/url-utils';

class LinkPopover extends Component {
    state = {
        invalidLink: false,
        value: ''
    };

    onAddLink = (value) => {
        const isValid = isValidLink(value);
        if (isValid) {
            const url = isInternalLink(value) ? `${ value }` : prependHttp(value);
            this.props.onSubmit(url);
        } else {
            this.setState({ invalidLink: true });
        }
    };

    onChange = (ev) => {
        if (this.state.invalidLink) {
            this.setState({
                invalidLink: !isValidLink(ev.target.value)
            });
        }
        this.setState({
            value: ev.target.value
        });
    };

    onKeyDown = (ev) => {
        if (ev.key === 'Enter') {
            this.onAddLink(ev.target.value);
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
                className={ inputClassName }
                onBlur={ onClose }
                onChange={ this.onChange }
                onKeyDown={ this.onKeyDown }
                placeholder={ intl.formatMessage(entryMessages.linkPlaceholder) }
                value={ value }
            />
        );

        return (
            <div className="selectable-editor__popover-wrapper" style={ { top, left } }>
                <Popover
                    content={ content }
                    overlayClassName="link-popover"
                    onVisibleChange={ this.onVisibleChange }
                    placement="top"
                    visible
                >
                    <div className="selectable-editor__popover-inner"/>
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
