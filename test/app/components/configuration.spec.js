import React from 'react';
import { IntlProvider } from 'react-intl';
import { spy } from 'sinon';
import chai from 'chai';
import { shallow } from 'enzyme';
import { FlatButton, RadioButton, RadioButtonGroup, RaisedButton } from 'material-ui';
import { Configuration } from '../../../app/components';
import { GethCacheSelectField, PanelContainer, PanelHeader,
    PathInputField } from '../../../app/shared-components';
import { GethSettings, IpfsSettings } from '../../../app/local-flux/reducers/records';

const { expect } = chai;

describe('Configuration component tests', () => {
    let props;
    let mountedComp;
    const intlProvider = new IntlProvider({ locale: 'en' }, {});
    const { intl } = intlProvider.getChildContext();
    const mountComp = () => {
        if (!mountedComp) {
            mountedComp = shallow(<Configuration.WrappedComponent intl={intl} {...props} />);
        }
        return mountedComp;
    };
    beforeEach(() => {
        props = {
            configurationSaved: false,
            defaultGethSettings: new GethSettings(),
            defaultIpfsSettings: new IpfsSettings(),
            gethSettings: new GethSettings(),
            ipfsSettings: new IpfsSettings(),
            saveConfiguration: spy(),
        };
        mountedComp = undefined;
    });

    describe('with default props and state', () => {
        it('should render the PanelContainer', () => {
            expect(mountComp().find(PanelContainer).length).to.equal(1,
                'PanelContainer was not rendered');
        });
        it('should render the submit button (Next)', () => {
            expect(mountComp().find(PanelContainer).prop('actions')).to.have.length(1,
                'PanelContainer doesn\'t have exactly one action');
        });
        it('should render a RadioButtonGroup', () => {
            expect(mountComp().find(RadioButtonGroup).length).to.equal(1,
                'RadioButtonGroup was not rendered');
        });
        it('should render 2 RadioButtons', () => {
            expect(mountComp().find(RadioButton).length).to.equal(2,
                'it didn\'t render 2 RadioButton components');
        });
        it('should not render the form (for "advanced" option)', () => {
            expect(mountComp().find(GethCacheSelectField).length).to.equal(0,
                'GethCacheSelectField was rendered');
            expect(mountComp().find(PathInputField).length).to.equal(0,
                'PathInputField was rendered');
            expect(mountComp().find(FlatButton).length).to.equal(0,
                'FlatButton was rendered');
        });
    });
    describe('with "advanced" option selected', () => {
        let component;
        before(() => {
            component = mountComp();
            // Simulating a "click" event on RadioButton wouldn't work in Shallow Rendering
            // Instead, a "change" event will be simulated on the RadioButtonGroup
            component.find(RadioButtonGroup).simulate('change', null, 'advanced');
        });
        it('should change its state', () => {
            expect(component.state().isAdvanced).to.be.true;
        });
        it('should render the form components', () => {
            expect(component.find(GethCacheSelectField).length).to.equal(1,
                'GethCacheSelectField was not rendered');
            expect(component.find(PathInputField).length).to.equal(2,
                'PathInputField was not rendered');
            expect(component.find(FlatButton).length).to.equal(1,
                'FlatButton was not rendered');
        });
        it('should render empty geth cache select', () => {
            expect(component.find(GethCacheSelectField).prop('cache')).to.not.be.ok;
        });
        it('should render empty geth data dir input', () => {
            expect(component.find(PathInputField).first().prop('path')).to.not.be.ok;
        });
        it('should render empty ipfs storage path', () => {
            expect(component.find(PathInputField).last().prop('path')).to.not.be.ok;
        });
    });
    describe('with populated form fields', () => {
        let component;
        beforeEach(() => {
            component = mountComp();
            // Simulating a "click" event on RadioButton wouldn't work in Shallow Rendering
            // Instead, a "change" event will be simulated on the RadioButtonGroup
            component.find(RadioButtonGroup).simulate('change', null, 'advanced');
            component.setState({
                cache: 512,
                gethDataDir: 'geth/path',
                ipfsPath: 'ipfs/path',
            });
        });
        it('should render geth cache with correct prop', () => {
            expect(component.find(GethCacheSelectField).prop('cache')).to.equal(512,
                'GethCacheSelectField doesn\'t have the correct prop');
        });
        it('should render geth data dir input with correct prop', () => {
            expect(component.find(PathInputField).first().prop('path'))
                .to.equal('geth/path', 'geth PathInputField doesn\'t have the correct prop');
        });
        it('should render ipfs storage input with correct prop', () => {
            expect(component.find(PathInputField).last().prop('path'))
                .to.equal('ipfs/path', 'ipfs PathInputField doesn\'t have the correct prop');
        });
        it('should submit "advanced" form data', () => {
            // TODO: if possible, find a way to simulate click on the PanelContainer "Next" action button
            component.instance().handleSubmit();
            const expected = {
                geth: {
                    cache: 512,
                    datadir: 'geth/path'
                },
                ipfs: {
                    storagePath: 'ipfs/path'
                }
            };
            expect(props.saveConfiguration.calledOnce).to.be.true;
            expect(props.saveConfiguration.calledWith(expected)).to.be.true;
        });
        it('should submit "express" form data', () => {
            // Simulating a "click" event on RadioButton wouldn't work in Shallow Rendering
            // Instead, a "change" event will be simulated on the RadioButtonGroup
            component.find(RadioButtonGroup).simulate('change', null, 'express');
            // TODO: if possible, find a way to simulate click on the PanelContainer "Next" action button
            component.instance().handleSubmit();
            const expected = {
                geth: new GethSettings().toJS(),
                ipfs: new IpfsSettings().toJS()
            };
            expect(props.saveConfiguration.calledOnce).to.be.true;
            expect(props.saveConfiguration.calledWith(expected)).to.be.true;
        });
        it('should reset form data', () => {
            component.find(FlatButton).simulate('click');
            expect(component.find(GethCacheSelectField).prop('cache')).to.not.be.ok;
            expect(component.find(PathInputField).first().prop('path')).to.not.be.ok;
            expect(component.find(PathInputField).last().prop('path')).to.not.be.ok;
        });
    });
});
