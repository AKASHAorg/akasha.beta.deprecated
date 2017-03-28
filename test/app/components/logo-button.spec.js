import React from 'react';
import { IntlProvider } from 'react-intl';
import { spy } from 'sinon';
import chai from 'chai';
import { shallow } from 'enzyme';
import { FlatButton } from 'material-ui';
import { LogoButton } from '../../../app/components/logo-button';

const { expect } = chai;

describe('LogoButton tests', () => {
    let props;
    let mountedComp;
    const mountComp = () => {
        if (!mountedComp) {
            mountedComp = shallow(<LogoButton {...props} />);
        }
        return mountedComp;
    };
    beforeEach(() => {
        props = {
            saveGenSettings: spy(),
            theme: 'light'
        };
        mountedComp = undefined;
    });
    it('should render FlatButton', () => {
        expect(mountComp().find(FlatButton).length).to.equal(1, 'FlatButton wasn\'t rendered');
    });
    it('should call saveGenSettings', () => {
        const component = mountComp();
        component.find(FlatButton).simulate('click');
        expect(props.saveGenSettings.calledOnce).to.be.true;
        expect(props.saveGenSettings.calledWith({ theme: 'dark' })).to.be.true;
    });
});
