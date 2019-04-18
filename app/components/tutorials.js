import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { tutorialMessages } from '../locale-data/messages';
import styles from './tutorials.scss';

class Tutorials extends Component {
    constructor (props) {
        super(props);
        this.state = {
            currentSlide: 0
        };
        const { intl } = props;
        this.slides = [{
            title: intl.formatMessage(tutorialMessages.akashaTitle),
            content: intl.formatMessage(tutorialMessages.akashaContent),
            iconClassName: 'intro_akasha'
        }, {
            title: intl.formatMessage(tutorialMessages.ethereumTitle),
            content: intl.formatMessage(tutorialMessages.ethereumContent),
            iconClassName: 'intro_ethereum'
        }, {
            title: intl.formatMessage(tutorialMessages.ipfsTitle),
            content: intl.formatMessage(tutorialMessages.ipfsContent),
            iconClassName: 'intro_ipfs'
        }, {
            title: intl.formatMessage(tutorialMessages.webTitle),
            content: intl.formatMessage(tutorialMessages.webContent),
            iconClassName: 'web'
        }];
    }

    componentDidMount = () => {
        this.interval = setInterval(this.tick, 15000);
    }
    componentWillUnmount = () => {
        clearInterval(this.interval);
    }
    tick = () => {
        const { currentSlide } = this.state;
        this.setState({ currentSlide: currentSlide === 3 ? 0 : currentSlide + 1 });
    }

    render () {
        const { theme } = this.props;
        const containerClassName = 'intro_bg';
        const slider = this.slides.map((slide, key) =>
            (<div
                className={ `${ styles.slide_item } ${ styles[theme] } row between-xs` }
                key={ slide.iconClassName }
                style={ { opacity: (key === this.state.currentSlide) ? 1 : 0 } }
            >
                <div className="col-xs-12">
                    <h1>
                        { slide.title }
                    </h1>
                </div>
                <div className="col-xs-12">
                    <div
                        className={ `${ styles[`${ slide.iconClassName }_${ theme }`] } ${ styles.slide_icon }` }/>
                </div>
                <div className="col-xs-12">
                    <p className={ `${ styles.slide_text }` }>
                        { slide.content }
                    </p>
                </div>
            </div>)
        );
        return (
            <div className={ `${ styles.root } ${ styles[`${ containerClassName }_${ theme }`] }` }>
                { slider }
            </div>
        );
    }
}

Tutorials.propTypes = {
    intl: PropTypes.shape(),
    theme: PropTypes.string,
};

function mapStateToProps (state) {
    return {
        theme: state.settingsState.getIn(['general', 'theme'])
    };
}

export default connect(mapStateToProps)(injectIntl(Tutorials));
