import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import { entryMessages } from '../../locale-data/messages';
import { isInternalLink, isValidLink, prependHttp } from '../../utils/url-utils';

class EditorLinkInput extends Component {
    state = {
        value: ''
    };

    componentDidMount () {
        const { url } = this.props;
        // in order to keep consistency with draft-js-anchor-plugin used in comment editor,
        // we should remove the link entity instead of editing it when clicking the link button
        // in Toolbar component
        if (url) {
            this.reset();
            this.props.removeEntity();
        } else {
            this.textInput.focus();
        }
    }

    reset = () => {
        this.setState({
            value: '',
        });

        this.props.cancelEntity();
    };

    onAddLink = (value) => {
        const isValid = isValidLink(value);
        if (isValid) {
            const url = isInternalLink(value) ? `#/${ value }` : prependHttp(value);
            this.props.setEntity({ url });
            this.reset();
        } else {
            this.setState({ invalidLink: true });
        }
    };

    onLinkChange = (ev) => {
        if (this.state.invalidLink) {
            this.setState({
                invalidLink: !isValidLink(ev.target.value)
            });
        }
        this.setState({
            value: ev.target.value
        });
    }

    onLinkKeyDown = (ev) => {
        if (ev.key === 'Enter') {
            ev.preventDefault();
            this.onAddLink(ev.target.value);
        }
    }

    render () {
        const { intl } = this.props;
        const className = classNames('toolbar__input editor-link-input', {
            'editor-link-input_invalid': this.state.invalidLink
        });

        return (
            <div style={ { whiteSpace: 'nowrap' } }>
                <input
                    ref={ (el) => {
                        this.textInput = el;
                    } }
                    type="text"
                    className={ className }
                    onChange={ this.onLinkChange }
                    value={ this.state.value }
                    onKeyDown={ this.onLinkKeyDown }
                    placeholder={ intl.formatMessage(entryMessages.linkPlaceholder) }
                />
            </div>
        );
    }
}

EditorLinkInput.propTypes = {
    cancelEntity: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
    removeEntity: PropTypes.func.isRequired,
    setEntity: PropTypes.func.isRequired,
    url: PropTypes.string
};

export default injectIntl(EditorLinkInput);
