import React from 'react';
import { IntlProvider } from 'react-intl';
import { spy } from 'sinon';
import chai from 'chai';
import { shallow } from 'enzyme';
import { OrderedSet } from 'immutable';
import { Sync, SyncStatusLoader } from '../../../app/components';
import { LogsList, PanelContainer } from '../../../app/shared-components';
import { GethStatus, GethSyncStatus, IpfsStatus } from '../../../app/local-flux/reducers/records';
import { setupMessages, generalMessages } from '../../../app/locale-data/messages';

const { expect } = chai;

describe('Sync component tests', () => {
    let props;
    let mountedComp;
    const intlProvider = new IntlProvider({ locale: 'en' }, {});
    const { intl } = intlProvider.getChildContext();
    const mountComp = () => {
        if (!mountedComp) {
            mountedComp = shallow(<Sync.WrappedComponent intl={intl} {...props} />);
        }
        return mountedComp;
    };
    beforeEach(() => {
        props = {
            configurationSaved: false,
            gethBusyState: false,
            gethGetSyncStatus: spy(),
            gethLogs: new OrderedSet(),
            gethPauseSync: spy(),
            gethResumeSync: spy(),
            gethStart: spy(),
            gethStarting: false,
            gethStartLogger: spy(),
            gethStatus: new GethStatus(),
            gethStop: spy(),
            gethStopLogger: spy(),
            gethStopSync: spy(),
            gethSyncStatus: new GethSyncStatus(),
            ipfsBusyState: false,
            ipfsPortsRequested: false,
            ipfsStart: spy(),
            ipfsStatus: IpfsStatus(),
            ipfsStop: spy(),
            saveGeneralSettings: spy(),
            syncActionId: 0,
            timestamp: 1234,
        };
        mountedComp = undefined;
    });

    describe('with default props and state', () => {
        it('should render the PanelContainer', () => {
            expect(mountComp().find(PanelContainer).length).to.equal(1,
                'PanelContainer was not rendered');
        });
        it('should render the panel actions', () => {
            expect(mountComp().find(PanelContainer).prop('actions').length).to.equal(2,
                'PanelContainer doesn\'t have 2 actions');
            expect(mountComp().find(PanelContainer).prop('leftActions').length).to.equal(1,
                'PanelContainer doesn\'t have 1 left side action');
        });
        it('should not render LogsList', () => {
            expect(mountComp().find(LogsList).length).to.equal(0,
                'LogsList was rendered');
        });
        it('should render the correct title', () => {
            const titleMessage = intl.formatMessage(setupMessages.waitingForGeth);
            expect(mountComp().find('h1').length).to.equal(1,
                'title was not rendered');
            expect(mountComp().find('h1').contains(titleMessage)).to.be.true;
        });
        it('should render the correct sync message', () => {
            const syncMessage = intl.formatMessage(setupMessages.onSyncStart);
            expect(mountComp().find('p').length).to.equal(1,
                'paragraph was not rendered');
            expect(mountComp().find('p').contains(syncMessage)).to.be.true;
        });
        it('should render SyncStatusLoader', () => {
            expect(mountComp().find(SyncStatusLoader).length).to.equal(1,
                'SyncStatusLoader was not rendered');
        });
        it('should handle the "cancel" action when services are stopped', () => {
            // TODO: if possible, find a way to simulate click on the PanelContainer action button
            mountComp().instance().handleCancel();
            expect(props.gethStopSync.callCount).to.equal(1, 'gethStopSync was not called');
            expect(props.gethStop.callCount).to.equal(0, 'gethStop was called');
            expect(props.ipfsStop.callCount).to.equal(0, 'ipfsStop was called');
            expect(props.saveGeneralSettings.callCount).to.equal(1, 'saveGeneralSettings was not called');
        });
        it('should handle the "cancel" action when services are started', () => {
            props.gethStatus = props.gethStatus.merge({ spawned: true });
            props.ipfsStatus = props.ipfsStatus.merge({ spawned: true });
            // TODO: if possible, find a way to simulate click on the PanelContainer action button
            mountComp().instance().handleCancel();
            expect(props.gethStopSync.callCount).to.equal(1, 'gethStopSync was not called');
            expect(props.gethStop.callCount).to.equal(1, 'gethStop was not called');
            expect(props.ipfsStop.callCount).to.equal(1, 'ipfsStop was not called');
            expect(props.saveGeneralSettings.callCount).to.equal(1, 'saveGeneralSettings was not called');
        });
    });
    describe('with log list open', () => {
        it('should render LogsList', () => {
            const component = mountComp();
            component.instance().toggleGethLogs();
            expect(mountComp().find(LogsList).length).to.equal(1,
                'LogsList was not rendered');
        });
        it('should not render title, sync message or SyncStatusLoader', () => {
            const component = mountComp();
            component.instance().toggleGethLogs();
            expect(mountComp().find('h1').length).to.equal(0,
                'title was rendered');
            expect(mountComp().find('p').length).to.equal(0,
                'sync message was rendered');
            expect(mountComp().find(SyncStatusLoader).length).to.equal(0,
                'SyncStatusLoader was rendered');
        });
    });
    describe('with syncActionId = 1 (syncing)', () => {
        beforeEach(() => {
            props.syncActionId = 1;
        });
        it('should handle the correct title message', () => {
            const titleMessage = intl.formatMessage(setupMessages.synchronizing);
            expect(mountComp().find('h1').length).to.equal(1,
                'title was not rendered');
            expect(mountComp().find('h1').contains(titleMessage)).to.be.true;
        });
        it('should handle the "pause" action', () => {
            // TODO: if possible, find a way to simulate click on the PanelContainer action button
            mountComp().instance().handlePause();
            expect(props.gethStop.callCount).to.equal(1, 'gethStop was not called');
            expect(props.gethPauseSync.callCount).to.equal(1, 'gethPauseSync was not called');
        });
    });
    describe('with syncActionId = 2 (paused)', () => {
        beforeEach(() => {
            props.syncActionId = 2;
        });
        it('should handle the correct title message', () => {
            const titleMessage = intl.formatMessage(setupMessages.syncPaused);
            expect(mountComp().find('h1').length).to.equal(1,
                'title was not rendered');
            expect(mountComp().find('h1').contains(titleMessage)).to.be.true;
        });
        it('should handle the "resume" action', () => {
            // TODO: if possible, find a way to simulate click on the PanelContainer action button
            mountComp().instance().handlePause();
            expect(props.gethStart.callCount).to.equal(1, 'gethStart was not called');
            expect(props.gethResumeSync.callCount).to.equal(1, 'gethResumeSync was not called');
        });
    });
    describe('with syncActionId = 3 (stopped)', () => {
        beforeEach(() => {
            props.syncActionId = 3;
        });
        it('should handle the correct title message', () => {
            const titleMessage = intl.formatMessage(setupMessages.syncStopped);
            expect(mountComp().find('h1').length).to.equal(1,
                'title was not rendered');
            expect(mountComp().find('h1').contains(titleMessage)).to.be.true;
        });
        it('should handle the "resume" action', () => {
            // TODO: if possible, find a way to simulate click on the PanelContainer action button
            mountComp().instance().handlePause();
            expect(props.gethStart.callCount).to.equal(1, 'gethStart was not called');
            expect(props.gethResumeSync.callCount).to.equal(1, 'gethResumeSync was not called');
        });
    });
    describe('with syncActionId = 4 (synced)', () => {
        beforeEach(() => {
            props.syncActionId = 4;
        });
        it('should handle the correct title message', () => {
            const titleMessage = intl.formatMessage(setupMessages.syncCompleted);
            expect(mountComp().find('h1').length).to.equal(1,
                'title was not rendered');
            expect(mountComp().find('h1').contains(titleMessage)).to.be.true;
        });
        it('should render the correct sync message', () => {
            const syncMessage = intl.formatMessage(setupMessages.afterSyncFinish);
            expect(mountComp().find('p').length).to.equal(1,
                'paragraph was not rendered');
            expect(mountComp().find('p').contains(syncMessage)).to.be.true;
        });
        it('should handle the "next" action', () => {
            // TODO: if possible, find a way to simulate click on the PanelContainer action button
            mountComp().instance().handlePause();
            expect(props.ipfsStart.callCount).to.equal(1, 'ipfsStart was not called');
        });
    });
});
