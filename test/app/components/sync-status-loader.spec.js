import React from 'react';
import { IntlProvider } from 'react-intl';
import { spy } from 'sinon';
import chai from 'chai';
import { shallow } from 'enzyme';
import { SyncStatusLoader } from '../../../app/components';
import { SyncProgressLoader } from '../../../app/shared-components';
import { GethStatus, GethSyncStatus, IpfsStatus } from '../../../app/local-flux/reducers/records';
import { setupMessages } from '../../../app/locale-data/messages';

const { expect } = chai;

describe('SyncStatusLoader tests', () => {
    let props;
    let mountedComp;
    const intlProvider = new IntlProvider({ locale: 'en' }, {});
    const { intl } = intlProvider.getChildContext();
    const mountComp = () => {
        if (!mountedComp) {
            mountedComp = shallow(<SyncStatusLoader {...props} />);
        }
        return mountedComp;
    };
    beforeEach(() => {
        props = {
            gethStarting: false,
            gethStatus: new GethStatus(),
            gethSyncStatus: new GethSyncStatus(),
            intl,
            ipfsStatus: new IpfsStatus(),
            syncActionId: 0
        };
        mountedComp = undefined;
    });

    describe('with default props', () => {
        it('should render SyncProgressLoader', () => {
            expect(mountComp().find(SyncProgressLoader).length).to.equal(1,
                'SyncProgressLoader was not rendered');
        });
        it('should pass correct props to SyncProgressLoader', () => {
            const defaultValue = SyncProgressLoader.defaultProps.value;
            expect(mountComp().find(SyncProgressLoader).prop('value'))
                .to.equal(defaultValue, 'the "value" prop is not the default one');
        });
        it('should render the correct message (launching services)', () => {
            expect(mountComp().contains(intl.formatMessage(setupMessages.launchingServices)))
                .to.be.true;
        });
    });
    describe('with geth downloading', () => {
        const gethDownloadingMessage = intl.formatMessage(setupMessages.downloadingGeth);
        beforeEach(() => {
            props.gethStatus = props.gethStatus.merge({ downloading: true });
        });
        it('should render the "downloading geth" message - case 1', () => {
            expect(mountComp().contains(gethDownloadingMessage)).to.be.true;
        });
        it('should render the "downloading geth" message - case 2', () => {
            props.ipfsStatus = props.ipfsStatus.merge({ downloading: true });
            expect(mountComp().contains(gethDownloadingMessage)).to.be.true;
        });
        it('should render the "downloading geth" message - case 3', () => {
            props.gethStatus = props.gethStatus.merge({ api: true });
            expect(mountComp().contains(gethDownloadingMessage)).to.be.true;
        });
        it('should render the "downloading geth" message - case 4', () => {
            props.syncActionId = 2;
            expect(mountComp().contains(gethDownloadingMessage)).to.be.true;
        });
        it('should render the "downloading geth" message - case 5', () => {
            props.syncActionId = 3;
            expect(mountComp().contains(gethDownloadingMessage)).to.be.true;
        });
        it('should render the "downloading geth" message - case 6', () => {
            props.gethSyncStatus = props.gethSyncStatus.merge({ peerCount: 0, highestBlock: 123 });
            expect(mountComp().contains(gethDownloadingMessage)).to.be.true;
        });
        it('should render the "downloading geth" message - case 7', () => {
            props.gethSyncStatus = props.gethSyncStatus.merge({ peerCount: 3, highestBlock: 0 });
            expect(mountComp().contains(gethDownloadingMessage)).to.be.true;
        });
    });
    describe('with ipfs downloading', () => {
        const ipfsDownloadingMessage = intl.formatMessage(setupMessages.downloadingIpfs);
        beforeEach(() => {
            props.ipfsStatus = props.ipfsStatus.merge({ downloading: true });
        });
        it('should render the "downloading ipfs" message - case 1', () => {
            expect(mountComp().contains(ipfsDownloadingMessage)).to.be.true;
        });
        it('should render the "downloading ipfs" message - case 2', () => {
            props.gethStatus = props.gethStatus.merge({ api: true });
            expect(mountComp().contains(ipfsDownloadingMessage)).to.be.true;
        });
        it('should render the "downloading ipfs" message - case 3', () => {
            props.syncActionId = 2;
            expect(mountComp().contains(ipfsDownloadingMessage)).to.be.true;
        });
        it('should render the "downloading ipfs" message - case 4', () => {
            props.syncActionId = 3;
            expect(mountComp().contains(ipfsDownloadingMessage)).to.be.true;
        });
        it('should render the "downloading ipfs" message - case 5', () => {
            props.gethSyncStatus = props.gethSyncStatus.merge({ peerCount: 0, highestBlock: 123 });
            expect(mountComp().contains(ipfsDownloadingMessage)).to.be.true;
        });
        it('should render the "downloading ipfs" message - case 6', () => {
            props.gethSyncStatus = props.gethSyncStatus.merge({ peerCount: 3, highestBlock: 0 });
            expect(mountComp().contains(ipfsDownloadingMessage)).to.be.true;
        });
    });
    describe('with synchronization stopped / paused', () => {
        const disconnectedMessage = intl.formatMessage(setupMessages.disconnected);
        beforeEach(() => {
            props.syncActionId = 2;
        });
        it('should render the "disconnected" message - case 1', () => {
            expect(mountComp().contains(disconnectedMessage)).to.be.true;
        });
        it('should render the "disconnected" message - case 2', () => {
            props.gethStatus = props.gethStatus.merge({ api: true });
            expect(mountComp().contains(disconnectedMessage)).to.be.true;
        });
        it('should render the "disconnected" message - case 3', () => {
            props.syncActionId = 3;
            expect(mountComp().contains(disconnectedMessage)).to.be.true;
        });
        it('should render the "disconnected" message - case 4', () => {
            props.gethSyncStatus = props.gethSyncStatus.merge({ peerCount: 0, highestBlock: 123 });
            expect(mountComp().contains(disconnectedMessage)).to.be.true;
        });
        it('should render the "disconnected" message - case 5', () => {
            props.gethSyncStatus = props.gethSyncStatus.merge({ peerCount: 3, highestBlock: 0 });
            expect(mountComp().contains(disconnectedMessage)).to.be.true;
        });
        it('should render synchronizing counter', () => {
            const currentBlock = 345;
            const highestBlock = 654;
            props.gethSyncStatus = props.gethSyncStatus.merge({
                currentBlock,
                highestBlock
            });
            const current = <strong>{currentBlock}</strong>;
            const slash = '/';
            expect(mountComp().contains(intl.formatMessage(setupMessages.synchronizing)))
                .to.be.true;
            expect(mountComp().contains(current)).to.be.true;
            expect(mountComp().contains(slash)).to.be.true;
            expect(mountComp().contains(highestBlock)).to.be.true;
        });
        it('should render synchronizing counter', () => {
            const pulledStates = 345;
            const knownStates = 654;
            props.gethSyncStatus = props.gethSyncStatus.merge({
                pulledStates,
                knownStates
            });
            const pulled = <strong>{pulledStates}</strong>;
            const slash = '/';
            expect(mountComp().contains(intl.formatMessage(setupMessages.processing)))
                .to.be.true;
            expect(mountComp().contains(pulled)).to.be.true;
            expect(mountComp().contains(slash)).to.be.true;
            expect(mountComp().contains(knownStates)).to.be.true;
        });
    });
    describe('with no peers', () => {
        const findingPeersMessage = intl.formatMessage(setupMessages.findingPeers);
        beforeEach(() => {
            props.gethStatus = props.gethStatus.merge({ api: true });
        });
        it('should render "finding peers" message - case 1', () => {
            expect(mountComp().contains(findingPeersMessage)).to.be.true;
        });
        it('should render "finding peers" message - case 2', () => {
            props.gethSyncStatus = props.gethSyncStatus.merge({ peerCount: 3 });
            expect(mountComp().contains(findingPeersMessage)).to.be.true;
        });
        it('should render "finding peers" message - case 3', () => {
            props.gethSyncStatus = props.gethSyncStatus.merge({ highestBlock: 123 });
            expect(mountComp().contains(findingPeersMessage)).to.be.true;
        });
    });
    describe('with ipfs started and geth stopped', () => {
        it('should render default message (waiting for services)', () => {
            props.ipfsStatus = props.ipfsStatus.merge({ process: true });
            expect(mountComp().contains(intl.formatMessage(setupMessages.waitingForServices)))
                .to.be.true;
        });
    });
    describe('with geth starting', () => {
        const gethStartingMessage = intl.formatMessage(setupMessages.startingGeth);
        beforeEach(() => {
            props.gethStatus = props.gethStatus.merge({ starting: true });
        });
        it('should render "starting geth" message - case 1', () => {
            expect(mountComp().contains(gethStartingMessage)).to.be.true;
        });
        it('should render "starting geth" message - case 2', () => {
            props.gethStatus = props.gethStatus.merge({ downloading: true });
            expect(mountComp().contains(gethStartingMessage)).to.be.true;
        });
        it('should render "starting geth" message - case 3', () => {
            props.ipfsStatus = props.ipfsStatus.merge({ downloading: true });
            expect(mountComp().contains(gethStartingMessage)).to.be.true;
        });
        it('should render "starting geth" message - case 4', () => {
            props.syncActionId = 2;
            expect(mountComp().contains(gethStartingMessage)).to.be.true;
        });
        it('should render "starting geth" message - case 5', () => {
            props.syncActionId = 3;
            expect(mountComp().contains(gethStartingMessage)).to.be.true;
        });
        it('should render "starting geth" message - case 6', () => {
            props.gethStatus = props.gethStatus.merge({ api: true });
            expect(mountComp().contains(gethStartingMessage)).to.be.true;
        });
        it('should render "starting geth" message - case 7', () => {
            props.gethSyncStatus = props.gethSyncStatus.merge({ peerCount: 0, highestBlock: 123 });
            expect(mountComp().contains(gethStartingMessage)).to.be.true;
        });
        it('should render "starting geth" message - case 8', () => {
            props.gethSyncStatus = props.gethSyncStatus.merge({ peerCount: 3, highestBlock: 0 });
            expect(mountComp().contains(gethStartingMessage)).to.be.true;
        });
    });
    describe('with geth upgrading', () => {
        const gethUpgradingMessage = intl.formatMessage(setupMessages.upgradingGeth);
        beforeEach(() => {
            props.gethStatus = props.gethStatus.merge({ upgrading: true });
        });
        it('should render "upgrading geth" message - case 1', () => {
            expect(mountComp().contains(gethUpgradingMessage)).to.be.true;
        });
        it('should render "upgrading geth" message - case 2', () => {
            props.gethStatus = props.gethStatus.merge({ starting: true });
            expect(mountComp().contains(gethUpgradingMessage)).to.be.true;
        });
        it('should render "upgrading geth" message - case 3', () => {
            props.gethStatus = props.gethStatus.merge({ downloading: true });
            expect(mountComp().contains(gethUpgradingMessage)).to.be.true;
        });
        it('should render "upgrading geth" message - case 4', () => {
            props.ipfsStatus = props.ipfsStatus.merge({ downloading: true });
            expect(mountComp().contains(gethUpgradingMessage)).to.be.true;
        });
        it('should render "upgrading geth" message - case 5', () => {
            props.syncActionId = 2;
            expect(mountComp().contains(gethUpgradingMessage)).to.be.true;
        });
        it('should render "upgrading geth" message - case 6', () => {
            props.syncActionId = 3;
            expect(mountComp().contains(gethUpgradingMessage)).to.be.true;
        });
        it('should render "upgrading geth" message - case 7', () => {
            props.gethStatus = props.gethStatus.merge({ api: true });
            expect(mountComp().contains(gethUpgradingMessage)).to.be.true;
        });
        it('should render "upgrading geth" message - case 8', () => {
            props.gethSyncStatus = props.gethSyncStatus.merge({ peerCount: 0, highestBlock: 123 });
            expect(mountComp().contains(gethUpgradingMessage)).to.be.true;
        });
        it('should render "upgrading geth" message - case 8', () => {
            props.gethSyncStatus = props.gethSyncStatus.merge({ peerCount: 3, highestBlock: 0 });
            expect(mountComp().contains(gethUpgradingMessage)).to.be.true;
        });
    });
    describe('with sync complete', () => {
        const syncCompletedMessage = intl.formatMessage(setupMessages.syncCompleted);
        beforeEach(() => {
            props.syncActionId = 4;
        });
        it('should pass correct props to SyncProgressLoader', () => {
            expect(mountComp().find(SyncProgressLoader).prop('value'))
                .to.equal(100, 'the "value" prop is not 100%');
        });
        it('should render "sync completed" message - case 1', () => {
            expect(mountComp().contains(syncCompletedMessage)).to.be.true;
        });
        it('should render "sync completed" message - case 2', () => {
            props.gethStatus = props.gethStatus.merge({ starting: true });
            expect(mountComp().contains(syncCompletedMessage)).to.be.true;
        });
        it('should render "sync completed" message - case 3', () => {
            props.gethStatus = props.gethStatus.merge({ downloading: true });
            expect(mountComp().contains(syncCompletedMessage)).to.be.true;
        });
        it('should render "sync completed" message - case 4', () => {
            props.ipfsStatus = props.ipfsStatus.merge({ downloading: true });
            expect(mountComp().contains(syncCompletedMessage)).to.be.true;
        });
        it('should render "sync completed" message - case 5', () => {
            props.gethStatus = props.gethStatus.merge({ api: true });
            expect(mountComp().contains(syncCompletedMessage)).to.be.true;
        });
        it('should render "sync completed" message - case 6', () => {
            props.gethSyncStatus = props.gethSyncStatus.merge({ peerCount: 0, highestBlock: 123 });
            expect(mountComp().contains(syncCompletedMessage)).to.be.true;
        });
        it('should render "sync completed" message - case 7', () => {
            props.gethSyncStatus = props.gethSyncStatus.merge({ peerCount: 3, highestBlock: 0 });
            expect(mountComp().contains(syncCompletedMessage)).to.be.true;
        });
    });
    describe('with geth synchronizing', () => {
        const peerCountMessage = intl.formatMessage(setupMessages.peerCount, { peerCount: 3 });
        beforeEach(() => {
            props.gethSyncStatus = props.gethSyncStatus.merge({
                currentBlock: 321,
                highestBlock: 4321,
                knownStates: 789,
                peerCount: 3,
                pulledStates: 56,
                startingBlock: 10
            });
        });
        it('should pass correct props to SyncProgressLoader', () => {
            const value = ((321 - 10) / (4321 - 10)) * 100;
            expect(mountComp().find(SyncProgressLoader).prop('value'))
                .to.equal(value, 'the "value" prop is not correct');
        });
        it('should render "peer count" message - case 1', () => {
            expect(mountComp().contains(peerCountMessage)).to.be.true;
        });
        it('should render "peer count" message - case 2', () => {
            props.gethStatus = props.gethStatus.merge({ starting: true });
            expect(mountComp().contains(peerCountMessage)).to.be.true;
        });
        it('should render "peer count" message - case 3', () => {
            props.gethStatus = props.gethStatus.merge({ downloading: true });
            expect(mountComp().contains(peerCountMessage)).to.be.true;
        });
        it('should render "peer count" message - case 4', () => {
            props.ipfsStatus = props.ipfsStatus.merge({ downloading: true });
            expect(mountComp().contains(peerCountMessage)).to.be.true;
        });
        it('should render "peer count" message - case 5', () => {
            props.syncActionId = 2;
            expect(mountComp().contains(peerCountMessage)).to.be.true;
        });
        it('should render "peer count" message - case 6', () => {
            props.syncActionId = 3;
            expect(mountComp().contains(peerCountMessage)).to.be.true;
        });
        it('should render "peer count" message - case 6', () => {
            props.syncActionId = 4;
            expect(mountComp().contains(peerCountMessage)).to.be.true;
        });
        it('should render "peer count" message - case 7', () => {
            props.gethStatus = props.gethStatus.merge({ api: true });
            expect(mountComp().contains(peerCountMessage)).to.be.true;
        });
        it('should render synchronizing counter', () => {
            const current = <strong>{321}</strong>;
            const slash = '/';
            const highestBlock = 4321;
            expect(mountComp().contains(intl.formatMessage(setupMessages.synchronizing)))
                .to.be.true;
            expect(mountComp().contains(current)).to.be.true;
            expect(mountComp().contains(slash)).to.be.true;
            expect(mountComp().contains(highestBlock)).to.be.true;
        });
        it('should render synchronizing counter', () => {
            const pulled = <strong>{56}</strong>;
            const slash = '/';
            const knownStates = 789;
            expect(mountComp().contains(intl.formatMessage(setupMessages.processing)))
                .to.be.true;
            expect(mountComp().contains(pulled)).to.be.true;
            expect(mountComp().contains(slash)).to.be.true;
            expect(mountComp().contains(knownStates)).to.be.true;
        });
    });
});
