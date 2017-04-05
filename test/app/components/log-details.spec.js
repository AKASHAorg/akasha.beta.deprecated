import React from 'react';
import { IntlProvider } from 'react-intl';
import { OrderedSet } from 'immutable';
import { spy } from 'sinon';
import chai from 'chai';
import { shallow } from 'enzyme';
import { LogDetails, PanelContainerFooter } from '../../../app/components';
import { LogsList } from '../../../app/shared-components';

const { expect } = chai;

describe('LogDetails tests', () => {
    let props;
    let mountedComp;
    const intlProvider = new IntlProvider({ locale: 'en' });
    const { intl } = intlProvider.getChildContext();
    const mountComp = () => {
        if (!mountedComp) {
            mountedComp = shallow(<LogDetails {...props} />);
        }
        return mountedComp;
    };
    beforeEach(() => {
        props = {
            gethLogs: new OrderedSet(),
            gethStartLogger: spy(),
            gethStopLogger: spy(),
            history: { goBack: spy() },
            intl,
            timestamp: 0
        };
        mountedComp = undefined;
    });

    describe('with default props', () => {
        it('should render the PanelContainerFooter', () => {
            expect(mountComp().find(PanelContainerFooter).length).to.equal(1,
                'PanelContainerFooter was not rendered');
        });
        it('should render the footer action', () => {
            expect(mountComp().find(PanelContainerFooter).prop('leftActions')).to.be.ok;
            expect(mountComp().find(PanelContainerFooter).children().length).to.not.be.ok;
        });
        it('should render the LogsList', () => {
            expect(mountComp().find(LogsList).length).to.equal(1,
                'LogsList was not rendered');
        });
    });
});
