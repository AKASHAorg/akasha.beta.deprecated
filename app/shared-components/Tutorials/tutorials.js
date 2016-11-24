import React, { Component, PropTypes } from 'react';

class Tutorials extends Component {
    constructor (props) {
        super(props);
        this.state = {
            currentSlide: 0
        };
        this.slides = [{
            title: 'The Language of Freedom',
            content: `With AKASHA your thoughts and ideas will echo throughout humanity's existence,
                thanks to a planetary-scale network immune to censorship by design. The information
                lives and spreads across the network without relying on a particular entity,
                not even us.`,
            icon: 'intro_akasha.png'
        }, {
            title: 'Powered By Ethereum',
            content: `Ethereum allowed us to build a new kind of application that removes the need
                to blindly trust server administrators. Thanks to its transparent properties we
                have strong authentication, identity, verifiability, voting and
                micro-transactions.`,
            icon: 'intro_ethereum.png'
        }, {
            title: 'Enhanced By The Inter-Planetary File System',
            content: `Thanks to the Inter-Planetary File System (IPFS) we removed also the need
                for servers to distribute and store your content. This allows users to circumvent
                traditional censorship blockades and empowers people with real freedom of
                expression.`,
            icon: 'intro_ipfs.png'
        }, {
            title: 'Towards A Better Web In Service Of Humanity',
            content: `The future isn't some place where we are going to go but a place we get to
                create. We deserve a better web and we now have the tools to make it happen.
                Together we can create a world where freedom of expression on the web is a right,
                not a feature.`,
            icon: 'intro_ipfs.png'
        }];
    }
    componentDidMount = () => {
        this.interval = setInterval(this.tick, 10000);
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
        const baseRoute = `./images/tutorials-${theme}/`;
        const containerBg = 'intro_bg.png';

        const slider = this.slides.map((slide, key) =>
          <div
            key={key}
            style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                color: (theme === 'light') ? '#444' : '#c5c5c5',
                textAlign: 'center',
                paddingTop: '5%',
                opacity: (key === this.state.currentSlide) ? 1 : 0,
                transition: 'opacity 0.214s ease-in-out'
            }}
          >
            <h1>
              {slide.title}
            </h1>
            <div
              style={{
                  backgroundImage: `url("${baseRoute}${slide.icon}")`,
                  width: 360,
                  height: 360,
                  backgroundSize: 'cover',
                  display: 'block',
                  margin: '36px auto',
              }}
            />
            <p
              style={{
                  maxWidth: 580,
                  margin: '64px auto',
                  textAlign: 'justify'
              }}
            >
              {slide.content}
            </p>
          </div>
        );
        return (
          <div
            style={{
                position: 'relative',
                backgroundImage: `url("${baseRoute}${containerBg}")`,
                height: '100%'
            }}
          >
            {slider}
          </div>
        );
    }
}

Tutorials.propTypes = {
    theme: PropTypes.string
};

export default Tutorials;
