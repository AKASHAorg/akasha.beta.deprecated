import React from 'react';
import { IntlProvider } from 'react-intl';
import { spy } from 'sinon';
import chai from 'chai';
import { shallow } from 'enzyme';
import { Dialog } from 'material-ui';
import { FatalErrorModal } from '../../../app/components';
import { ErrorRecord } from '../../../app/local-flux/reducers/records';

const { expect } = chai;

describe('FatalErrorModal tests', () => {
    let props;
    let mountedComp;
    const intlProvider = new IntlProvider({ locale: 'en' }, {});
    const { intl } = intlProvider.getChildContext();
    const mountComp = () => {
        if (!mountedComp) {
            mountedComp = shallow(<FatalErrorModal {...props} />);
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
        it('should render Dialog', () => {
            expect(mountComp().find(Dialog).length).to.equal(1, 'Dialog wasn\'t rendered');
        });
    });
    describe('with "real" error', () => {
        beforeEach(() => {
            props.error = new ErrorRecord({
                code: 'EX02',
                id: '2222',
                message: 'Test',
                fatal: true
            });
        });
        it('should render Dialog', () => {
            expect(mountComp().find(Dialog).length).to.equal(1, 'Dialog wasn\'t rendered');
        });
        it('Dialog should have one action button', () => {
            expect(mountComp().find(Dialog).prop('actions').length).to.equal(1,
                'Dialog does not have exactly one action button');
        });
        it('should render the error message', () => {
            expect(mountComp().contains(props.error.get('message'))).to.be.true;
        });
    });
});
