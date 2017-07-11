import React from 'react';
import { IntlProvider } from 'react-intl';
import * as immutable from 'immutable';
import { spy } from 'sinon';
import chai from 'chai';
import { shallow } from 'enzyme';
import { List, ListItem } from 'material-ui';
import muiTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import { ProfileList } from '../../../app/components';
import { Avatar, DataLoader } from '../../../app/shared-components';
import { GethStatus, IpfsStatus, ProfileRecord } from '../../../app/local-flux/reducers/records';
import { setupMessages } from '../../../app/locale-data/messages';

const { expect } = chai;

describe('ProfileList component tests', () => {
    let props;
    let mountedComp;
    const intlProvider = new IntlProvider({ locale: 'en' }, {});
    const { intl } = intlProvider.getChildContext();
    const mountComp = () => {
        if (!mountedComp) {
            mountedComp = shallow(<ProfileList {...props} />, { context: { muiTheme } });
        }
        return mountedComp;
    };
    beforeEach(() => {
        props = {
            fetchingProfiles: false,
            gethStatus: new GethStatus(),
            handleSelect: spy(),
            intl,
            ipfsStatus: new IpfsStatus(),
            profiles: new immutable.List(),
        };
        mountedComp = undefined;
    });

    describe('with default props', () => {
        it('should render the gethStopped placeholder message', () => {
            expect(mountComp().contains(intl.formatMessage(setupMessages.gethStopped))).to.be.true;
        });
    });
    describe('with geth running', () => {
        it('should render the ipfsStopped placeholder message', () => {
            props.gethStatus = new GethStatus({ api: true });
            expect(mountComp().contains(intl.formatMessage(setupMessages.ipfsStopped))).to.be.true;
        });
    });
    describe('with geth and ipfs running', () => {
        it('should render the noProfilesFound placeholder message', () => {
            props.gethStatus = new GethStatus({ api: true });
            props.ipfsStatus = new IpfsStatus({ started: true });
            expect(mountComp().contains(intl.formatMessage(setupMessages.noProfilesFound)))
                .to.be.true;
        });
    });
    describe('with profiles', () => {
        beforeEach(() => {
            props.gethStatus = new GethStatus({ api: true });
            props.ipfsStatus = new IpfsStatus({ started: true });
            props.profiles = props.profiles.push(new ProfileRecord({ akashaId: 'test' }));
        });
        it('should render DataLoader', () => {
            expect(mountComp().find(DataLoader).length).to.equal(1,
                'DataLoader was not rendered');
        });
        it('should render the List component', () => {
            expect(mountComp().find(List).length).to.equal(1,
                'List was not rendered');
        });
        it('should render 1 ListItem component', () => {
            expect(mountComp().find(ListItem).length).to.equal(1,
                'ListItem was not rendered');
        });
        it('should render 2 ListItem component', () => {
            props.profiles = props.profiles.push(new ProfileRecord({ akashaId: 'test2' }));
            expect(mountComp().find(ListItem).length).to.equal(2,
                'there are not 2 ListItem components rendered');
        });
    });
});
