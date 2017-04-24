import React from 'react';
import { IntlProvider } from 'react-intl';
import { spy } from 'sinon';
import chai from 'chai';
import { shallow } from 'enzyme';
import { Snackbar } from 'material-ui';
import { ErrorBar } from '../../../app/components';
import { ErrorRecord } from '../../../app/local-flux/reducers/records';
import muiTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

const { expect } = chai;

describe('ErrorBar tests', () => {
    let props;
    let mountedComp;
    const intlProvider = new IntlProvider({ locale: 'en' }, {});
    const { intl } = intlProvider.getChildContext();
    const mountComp = () => {
        if (!mountedComp) {
            mountedComp = shallow(<ErrorBar {...props} />, { context: { muiTheme } });
        }
        return mountedComp;
    };
    beforeEach(() => {
        props = {
            deleteError: spy(),
            error: new ErrorRecord(),
            intl
        };
        mountedComp = undefined;
    });
    describe('with empty error', () => {
        it('should render Snackbar', () => {
            expect(mountComp().find(Snackbar).length).to.equal(1, 'Snackbar wasn\'t rendered');
        });
        it('should pass correct props to Snackbar', () => {
            expect(mountComp().find(Snackbar).prop('message')).to.equal('',
                'the error message was not empty');
        });
    });
    describe('with "real" error', () => {
        beforeEach(() => {
            props.error = new ErrorRecord({
                code: 'EX01',
                id: '1234',
                message: 'Test',
                fatal: false
            });
        });
        it('should render Snackbar', () => {
            expect(mountComp().find(Snackbar).length).to.equal(1, 'Snackbar wasn\'t rendered');
        });
        it('should pass correct props to Snackbar', () => {
            expect(mountComp().find(Snackbar).prop('message')).to.equal('Test',
                'the error message was not passed correctly');
        });
        it('should call deleteError on request close', () => {
            const component = mountComp();
            component.find(Snackbar).prop('onRequestClose')();
            expect(props.deleteError.calledOnce).to.be.true;
            expect(props.deleteError.calledWith(props.error.get('id'))).to.be.true;
        });
        it('should call deleteError on action click', () => {
            expect(props.deleteError.calledOnce).to.be.false;
            const component = mountComp();
            component.find(Snackbar).prop('onActionTouchTap')();
            expect(props.deleteError.calledOnce).to.be.true;
            expect(props.deleteError.calledWith(props.error.get('id'))).to.be.true;
        });
    });
});
