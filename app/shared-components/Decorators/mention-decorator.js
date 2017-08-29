import PropTypes from 'prop-types';
import React, { Component } from 'react';

const Channel = global.Channel;
const existsClient = Channel.client.registry.profileExists;
const existsServer = Channel.server.registry.profileExists;
const addressOfClient = Channel.client.registry.addressOf;
const addressOfServer = Channel.server.registry.addressOf;
const getProfileDataClient = Channel.client.profile.getProfileData;
const getProfileDataServer = Channel.server.profile.getProfileData;

class MentionComponent extends Component {

    constructor (props) {
        super(props);
        existsServer.enable();
        addressOfServer.enable();
        this.state = {
            exists: false,
            fetchingData: true,
            profileAddress: null,
            profileData: null
        };
        this.timeout = null;
    }

    componentDidMount () {
        const { children, nonEditable } = this.props;
        const akashaId = children[0].props.text.slice(1);
        existsClient.on(this.handleExists);
        existsServer.send({ akashaId });
        if (nonEditable) {
            addressOfClient.on(this.handleAddressOf);
            getProfileDataClient.on(this.handleProfileData);
        }
    }

    componentWillReceiveProps (nextProps) {
        const newText = nextProps.children[0].props.text;
        const oldText = this.props.children[0].props.text;
        if (newText !== oldText) {
            const akashaId = newText.slice(1);
            existsServer.send({ akashaId });
            this.setState({
                fetchingData: true,
                profileAddress: null,
                profileData: null
            });
        }
    }

    componentWillUnmount () {
        existsClient.removeListener(this.handleExists);
        if (this.props.nonEditable) {
            addressOfClient.removeListener(this.handleAddressOf);
            getProfileDataClient.removeListener(this.handleProfileData);
        }
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    setContainerRef = (el) => {
        this.container = el;
    };

    navigateToProfile = () => {
        const { profileAddress } = this.state;
        const { router } = this.context;
        if (profileAddress) {
            router.push(`${router.params.akashaId}/profile/${profileAddress}`);
        }
    };

    handleExists = (ev, resp) => {
        const { children, nonEditable } = this.props;
        const akashaId = children[0].props.text.slice(1);
        if (akashaId === resp.data.akashaId) {
            if (nonEditable && resp.data.exists && !this.state.profileAddress) {
                addressOfServer.send([{ akashaId }]);
            }
            this.setState({
                exists: resp.data.exists
            });
        }
    };

    handleAddressOf = (ev, resp) => {
        const akashaId = this.props.children[0].props.text.slice(1);
        const address = resp.data.collection && resp.data.collection[0];
        if (address && resp.data.request[0].akashaId === akashaId) {
            if (!this.state.profileData) {
                getProfileDataServer.send({ profile: address });
            }
            this.setState({
                profileAddress: address
            });
        }
    };

    handleProfileData = (ev, resp) => {
        const akashaId = this.props.children[0].props.text.slice(1);
        if (resp.data && resp.data.akashaId === akashaId) {
            this.setState({
                fetchingData: false,
                profileData: resp.data
            });
        }
    };

    render () {
        const { children, nonEditable } = this.props;
        const { palette } = this.context.muiTheme;
        return (
          <div style={{ display: 'inline-block' }} ref={this.setContainerRef}>
            <span
              style={{
                  color: this.state.exists ? palette.primary1Color : '',
                  cursor: nonEditable && this.state.exists ? 'pointer' : 'auto'
              }}
              onClick={nonEditable && this.navigateToProfile}
            >
              {children}
            </span>
          </div>
        );
    }
}

MentionComponent.contextTypes = {
    muiTheme: PropTypes.shape(),
    router: PropTypes.shape()
};

MentionComponent.propTypes = {
    children: PropTypes.node,
    nonEditable: PropTypes.bool,
};

const findMentionEntities = (contentBlock, callback) => {
    const text = contentBlock.getText();
    let matchArr;
    let start;
    const regex = /@[\w._]*/g;
    while ((matchArr = regex.exec(text)) !== null) {
        start = matchArr.index;
        callback(start, start + matchArr[0].length);
    }
};

const withHoverCard = Comp => props => <Comp nonEditable {...props} />;

const decorators = {
    editableDecorator: {
        strategy: findMentionEntities,
        component: MentionComponent
    },
    nonEditableDecorator: {
        strategy: findMentionEntities,
        component: withHoverCard(MentionComponent)
    }
};

export default decorators;
