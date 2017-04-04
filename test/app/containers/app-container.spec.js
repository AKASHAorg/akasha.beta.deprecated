import React from 'react';
import { spy } from 'sinon';
import chai from 'chai';
import { shallow } from 'enzyme';
import ReactTooltip from 'react-tooltip';
import { AppContainer } from '../../../app/containers/app-container';
import { ErrorBar, FatalErrorModal, NotificationBar, TermsPanel } from '../../../app/components';
import { AuthDialog, DataLoader, GethDetailsModal, IpfsDetailsModal, PublishConfirmDialog,
    TransferConfirmDialog, WeightConfirmDialog } from '../../../app/shared-components';
import { AppRecord, ErrorRecord, ErrorState,
    NotificationRecord } from '../../../app/local-flux/reducers/records';

const { expect } = chai;

describe('App Container tests', () => {
    let props;
    let mountedComp;
    const mountComp = () => {
        if (!mountedComp) {
            mountedComp = shallow(<AppContainer match={{}} {...props} />);
        }
        return mountedComp;
    };
    beforeEach(() => {
        props = {
            appState: new AppRecord(),
            errorDeleteFatal: spy(),
            errorDeleteNonFatal: spy(),
            errorState: new ErrorState(),
            hideNotification: spy(),
            hideTerms: spy()
        };
        mountedComp = undefined;
    });

    describe('with default props', () => {
        it('should render the DataLoader', () => {
            expect(mountComp().find(DataLoader).length).to.equal(1, 'DataLoader was not rendered');
        });
        it('should pass correct props to DataLoader', () => {
            const comp = mountComp().find(DataLoader).first();
            expect(comp.props().flag).to.equal(!props.appState.get('appReady'),
                'DataLoader was not rendered with the correct flag prop');
        });
        it('should not render NotificationBar', () => {
            expect(mountComp().find(NotificationBar).length).to.equal(0,
                'NotificationBar was rendered');
        });
        it('should not render ErrorBar', () => {
            expect(mountComp().find(ErrorBar).length).to.equal(0,
                'ErrorBar was rendered');
        });
        it('should not render FatalErrorModal', () => {
            expect(mountComp().find(FatalErrorModal).length).to.equal(0,
                'FatalErrorModal was rendered');
        });
        it('should not render GethDetailsModal', () => {
            expect(mountComp().find(GethDetailsModal).length).to.equal(0,
                'GethDetailsModal was rendered');
        });
        it('should not render IpfsDetailsModal', () => {
            expect(mountComp().find(IpfsDetailsModal).length).to.equal(0,
                'IpfsDetailsModal was rendered');
        });
        it('should not render AuthDialog', () => {
            expect(mountComp().find(AuthDialog).length).to.equal(0,
                'AuthDialog was rendered');
        });
        it('should not render WeightConfirmDialog', () => {
            expect(mountComp().find(WeightConfirmDialog).length).to.equal(0,
                'WeightConfirmDialog was rendered');
        });
        it('should not render PublishConfirmDialog', () => {
            expect(mountComp().find(PublishConfirmDialog).length).to.equal(0,
                'PublishConfirmDialog was rendered');
        });
        it('should not render TransferConfirmDialog', () => {
            expect(mountComp().find(TransferConfirmDialog).length).to.equal(0,
                'TransferConfirmDialog was rendered');
        });
        it('should not render TermsPanel', () => {
            expect(mountComp().find(TermsPanel).length).to.equal(0,
                'TermsPanel was rendered');
        });
        it('should render ReactTooltip', () => {
            expect(mountComp().find(ReactTooltip).length).to.equal(1,
                'ReactTooltip was not rendered');
        });
    });
    describe('with notifications', () => {
        it('should render the NotificationBar', () => {
            const notif = new NotificationRecord({ id: 'test' });
            props.appState = props.appState.set('notifications',
                props.appState.get('notifications').push(notif));
            expect(mountComp().find(NotificationBar).length).to.equal(1,
                'NotificationBar was not rendered');
        });
    });
    describe('with non fatal errors', () => {
        it('should render the ErrorBar', () => {
            const id = '1234';
            props.errorState = props.errorState.merge({
                nonFatalErrors: props.errorState.get('nonFatalErrors').push(id)
            });
            expect(mountComp().find(ErrorBar).length).to.equal(1,
                'ErrorBar was not rendered');
        });
    });
    describe('with fatal errors', () => {
        it('should render the FatalErrorModal', () => {
            const id = '1234';
            props.errorState = props.errorState.merge({
                fatalErrors: props.errorState.get('fatalErrors').push(id)
            });
            expect(mountComp().find(FatalErrorModal).length).to.equal(1,
                'FatalErrorModal was not rendered');
        });
    });
    describe('with geth details model opened', () => {
        it('should render the GethDetailsModal', () => {
            props.appState = props.appState.set('showGethDetailsModal', true);
            expect(mountComp().find(GethDetailsModal).length).to.equal(1,
                'GethDetailsModal was not rendered');
        });
    });
    describe('with ipfs details model opened', () => {
        it('should render the IpfsDetailsModal', () => {
            props.appState = props.appState.set('showIpfsDetailsModal', true);
            expect(mountComp().find(IpfsDetailsModal).length).to.equal(1,
                'IpfsDetailsModal was not rendered');
        });
    });
    describe('with auth dialog open', () => {
        it('should render the AuthDialog', () => {
            props.appState = props.appState.set('showAuthDialog', 123);
            expect(mountComp().find(AuthDialog).length).to.equal(1,
                'AuthDialog was not rendered');
        });
    });
    describe('with weight confirm dialog open', () => {
        it('should render the WeightConfirmDialog', () => {
            const mockObj = { mock: true };
            props.appState = props.appState.set('weightConfirmDialog', mockObj);
            expect(mountComp().find(WeightConfirmDialog).length).to.equal(1,
                'WeightConfirmDialog was not rendered');
        });
    });
    describe('with publish confirm dialog open', () => {
        it('should render the PublishConfirmDialog', () => {
            const mockObj = { mock: true };
            props.appState = props.appState.set('publishConfirmDialog', mockObj);
            expect(mountComp().find(PublishConfirmDialog).length).to.equal(1,
                'PublishConfirmDialog was not rendered');
        });
    });
    describe('with transfer confirm dialog open', () => {
        it('should render the TransferConfirmDialog', () => {
            const mockObj = { mock: true };
            props.appState = props.appState.set('transferConfirmDialog', mockObj);
            expect(mountComp().find(TransferConfirmDialog).length).to.equal(1,
                'TransferConfirmDialog was not rendered');
        });
    });
    describe('with terms panel open', () => {
        it('should render the TermsPanel', () => {
            props.appState = props.appState.set('showTerms', true);
            expect(mountComp().find(TermsPanel).length).to.equal(1,
                'TermsPanel was not rendered');
        });
    });
});
