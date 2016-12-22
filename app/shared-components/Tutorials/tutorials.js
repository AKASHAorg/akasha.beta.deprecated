import React, { Component, PropTypes } from 'react';
import styles from './tutorials.scss';

class Tutorials extends Component {
    constructor (props) {
        super(props);
        this.state = {
            currentSlide: 3
        };
        this.slides = [{
            title: 'The Language of Freedom',
            content: `With AKASHA your thoughts and ideas will echo throughout humanity's existence,
                thanks to a planetary-scale network immune to censorship by design. The information
                lives and spreads across the network without relying on a particular entity,
                not even us.`,
            iconClassName: 'intro_akasha'
        }, {
            title: 'Powered By Ethereum',
            content: `Ethereum allowed us to build a new kind of application that removes the need
                to blindly trust server administrators. Thanks to its transparent properties we
                have strong authentication, identity, verifiability, voting and
                micro-transactions.`,
            iconClassName: 'intro_ethereum'
        }, {
            title: 'Enhanced By The Inter-Planetary File System',
            content: `Thanks to the Inter-Planetary File System (IPFS) we removed also the need
                for servers to distribute and store your content. This allows users to circumvent
                traditional censorship blockades and empowers people with real freedom of
                expression.`,
            iconClassName: 'intro_ipfs'
        }, {
            title: 'Towards A Better Web In Service Of Humanity',
            content: `The future isn't some place where we are going to go but a place we get to
                create. We deserve a better web and we now have the tools to make it happen.
                Together we can create a world where freedom of expression on the web is a right,
                not a feature.`,
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
          <div
            className={`${styles.slide_item} ${styles[theme]} row between-xs`}
            key={key}
            style={{ opacity: (key === this.state.currentSlide) ? 1 : 0 }}
          >
            <div className="col-xs-12">
              <h1>
                {slide.title}
              </h1>
            </div>
            <div className="col-xs-12">
              <div className={`${styles[`${slide.iconClassName}_${theme}`]} ${styles.slide_icon}`} />
            </div>
            <div className="col-xs-12">
              <p className={`${styles.slide_text}`} >
                {slide.content}
              </p>
            </div>
          </div>
        );
        return (
          <div className={`${styles.root} ${styles[`${containerClassName}_${theme}`]}`} >
            {slider}
          </div>
        );
    }
}

Tutorials.propTypes = {
    theme: PropTypes.string
};

export default Tutorials;
