import React from 'react';
import { IntlProvider } from 'react-intl';
import { spy } from 'sinon';
import chai from 'chai';
import { shallow } from 'enzyme';
import { IconButton, SvgIcon } from 'material-ui';
import muiTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import { ServiceStatusBar } from '../../../app/components/service-status-bar';
import { StatusBarEthereum, StatusBarIpfs } from '../../../app/shared-components/svg';
import { GethStatus, IpfsStatus } from '../../../app/local-flux/reducers/records';
import ServiceState from '../../../app/constants/ServiceState';

const { expect } = chai;

describe('ServiceStatusBar tests', () => {
    let props;
    let mountedComp;
    const intlProvider = new IntlProvider({ locale: 'en' }, {});
    const { intl } = intlProvider.getChildContext();
    const mountComp = () => {
        if (!mountedComp) {
            mountedComp = shallow(
                <ServiceStatusBar intl={intl} {...props} />,
                { context: { muiTheme } }
            );
        }
        return mountedComp;
    };
    beforeEach(() => {
        props = {
            gethStarting: false,
            gethStatus: new GethStatus(),
            ipfsStarting: false,
            ipfsStatus: new IpfsStatus(),
            toggleGethDetails: spy(),
            toggleIpfsDetails: spy(),
        };
        mountedComp = undefined;
    });

    describe('with default props', () => {
        it('should render 2 IconButtons', () => {
            expect(mountComp().find(IconButton).length).to.equal(2,
                'it didn\'t render 2 IconButton components');
        });
        it('should render 2 SvgIcons', () => {
            expect(mountComp().find(SvgIcon).length).to.equal(2,
                'it didn\'t render 2 SvgIcon components');
        });
        it('should render StatusBarEthereum', () => {
            expect(mountComp().find(StatusBarEthereum).length).to.equal(1,
                'StatusBarEthereum was not rendered');
        });
        it('should render StatusBarIpfs', () => {
            expect(mountComp().find(StatusBarIpfs).length).to.equal(1,
                'StatusBarIpfs was not rendered');
        });
        it('geth status should be "stopped"', () => {
            expect(mountComp().instance().getGethState()).to.equal(ServiceState.stopped,
                'geth state is not "stopped"');
        });
        it('ipfs status should be "stopped"', () => {
            expect(mountComp().instance().getIpfsState()).to.equal(ServiceState.stopped,
                'ipfs state is not "stopped"');
        });
        it('should call toggleGethDetails', () => {
            mountComp().find(IconButton).first().simulate('click');
            expect(props.toggleGethDetails.calledOnce).to.be.true;
        });
        it('should call toggleIpfsDetails', () => {
            mountComp().find(IconButton).last().simulate('click');
            expect(props.toggleIpfsDetails.calledOnce).to.be.true;
        });
    });
    describe('with different geth status', () => {
        it('geth status should be "starting"', () => {
            props.gethStatus = props.gethStatus.merge({ starting: true });
            expect(mountComp().instance().getGethState()).to.equal(ServiceState.starting,
                'geth state is not "starting"');
            props.gethStatus = new GethStatus();
            props.gethStarting = true;
            expect(mountComp().instance().getGethState()).to.equal(ServiceState.starting,
                'geth state is not "starting"');
            props.gethStatus = props.gethStatus.merge({ process: true });
            props.gethStarting = false;
            expect(mountComp().instance().getGethState()).to.equal(ServiceState.starting,
                'geth state is not "starting"');
        });
        it('geth status should not be "starting"', () => {
            props.gethStatus = props.gethStatus.merge({ api: true, starting: true });
            expect(mountComp().instance().getGethState()).to.not.equal(ServiceState.starting,
                'geth state is "starting"');
            props.gethStatus = props.gethStatus.merge({ api: false, downloading: true, starting: true });
            expect(mountComp().instance().getGethState()).to.not.equal(ServiceState.starting,
                'geth state is "starting"');
        });
        it('geth status should be "downloading"', () => {
            props.gethStatus = props.gethStatus.merge({ downloading: true });
            expect(mountComp().instance().getGethState()).to.equal(ServiceState.downloading,
                'geth state is not "downloading"');
        });
        it('geth status should not be "downloading"', () => {
            props.gethStatus = props.gethStatus.merge({ api: true, downloading: true });
            expect(mountComp().instance().getGethState()).to.not.equal(ServiceState.downloading,
                'geth state is "downloading"');
        });
        it('geth status should be "started"', () => {
            props.gethStatus = props.gethStatus.merge({ api: true });
            expect(mountComp().instance().getGethState()).to.equal(ServiceState.started,
                'geth state is not "started"');
        });
        it('geth status should not be "started"', () => {
            props.gethStatus = props.gethStatus.merge({ api: true, stopped: true });
            expect(mountComp().instance().getGethState()).to.not.equal(ServiceState.started,
                'geth state is "started"');
        });
    });
    describe('with different ipfs status', () => {
        it('ipfs status should be "starting"', () => {
            props.ipfsStarting = true;
            expect(mountComp().instance().getIpfsState()).to.equal(ServiceState.starting,
                'ipfs state is not "starting"');
        });
        it('ipfs status should not be "starting"', () => {
            props.ipfsStatus = props.gethStatus.merge({ process: true });
            props.ipfsStarting = true;
            expect(mountComp().instance().getIpfsState()).to.not.equal(ServiceState.starting,
                'ipfs state is "starting"');
            props.gethStatus = props.gethStatus.merge({ downloading: true, process: false });
            expect(mountComp().instance().getIpfsState()).to.not.equal(ServiceState.starting,
                'ipfs state is "starting"');
        });
        it('ipfs status should be "downloading"', () => {
            props.ipfsStatus = props.ipfsStatus.merge({ downloading: true });
            expect(mountComp().instance().getIpfsState()).to.equal(ServiceState.downloading,
                'ipfs state is not "downloading"');
        });
        it('ipfs status should not be "downloading"', () => {
            props.ipfsStatus = props.ipfsStatus.merge({ downloading: true, started: true });
            expect(mountComp().instance().getIpfsState()).to.not.equal(ServiceState.downloading,
                'ipfs state is "downloading"');
        });
        it('ipfs status should be "started"', () => {
            props.ipfsStatus = props.ipfsStatus.merge({ process: true });
            expect(mountComp().instance().getIpfsState()).to.equal(ServiceState.started,
                'ipfs state is not "started"');
            props.ipfsStatus = props.ipfsStatus.merge({ process: false, started: true });
            expect(mountComp().instance().getIpfsState()).to.equal(ServiceState.started,
                'ipfs state is not "started"');
        });
    });
});
