import React from 'react';
import chai from 'chai';
import { shallow } from 'enzyme';
import muiTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import { Setup } from '../../../app/components';
import { Tutorials } from '../../../app/shared-components';

const { expect } = chai;

describe('Setup component tests', () => {
    let mountedComp;
    let props;

    beforeEach(() => {
        props = {
            children: <div>test children</div>
        }
        mountedComp = shallow(<Setup {...props} />, { context: { muiTheme } });
    });

    it('should render Tutorials', () => {
        expect(mountedComp.find(Tutorials).length).to.equal(1,
            'Tutorials component was not rendered');
    });
    it('should render its children', () => {
        expect(mountedComp.contains(<div>test children</div>)).to.be.true;
    });
});
