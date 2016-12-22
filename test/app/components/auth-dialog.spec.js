import React from 'react';
import ReactDOM from 'react-dom';
import sinon from 'sinon';
import { mount, render } from 'enzyme';
import { expect } from 'chai';
import { mountWithIntl } from '../helpers/mount-wrapper';

import { Dialog, TextField } from 'material-ui';
import AuthDialog from '../../../app/shared-components/Dialogs/auth-dialog';

import { getMuiTheme } from 'material-ui/styles';
const muiTheme = getMuiTheme();

describe('<AuthDialog />', function() {
    beforeEach(function() {
        this.spiedSubmit = sinon.spy();
        const requiredProps = {
            errors: [],
            isVisible: false,
            onSubmit: this.spiedSubmit
        };
        this.wrapper = mountWithIntl(<AuthDialog { ...requiredProps } />, {
            context: { muiTheme },
            childContextTypes: {
                muiTheme: React.PropTypes.object
            }
        });
        this.dialogNode = this.wrapper.find(Dialog).get(0);
    });
    it('does not show when props.isVisible is false', function () {

    });
    it('does show when props.isVisible is true', function () {

    });
    it('should call onSubmit prop on enter key press', function() {

    });
    it('should call onSubmit prop on submit button click', function() {

    });
    it('should call onSubmit when mixing enter key with click, 100 times each', function () {

    });
})
