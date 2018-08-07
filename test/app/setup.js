// import 'babel-polyfill';
import { JSDOM } from 'jsdom';
// import hook from 'css-modules-require-hook';
import sinon from 'sinon';
import Channel from './helpers/channels';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createActionChannels } from '../../app/local-flux/sagas/helpers';

const document = new JSDOM('<!doctype html><html><body></body></html>');
global.window = document.defaultView;

before('init tests', function () {
    this.sandbox = sinon.createSandbox();
    createActionChannels(Channel);
    Enzyme.configure({
        adapter: new Adapter()
    });
});

beforeEach(() => {
    global.document = {
        ...document,
        // just overwrite event listener methods before every test
        addEventListener: () => {},
        removeEventListener: () => {}
    }
});

// hook({
//     generateScopedName: '[name]__[local]___[hash:base64:5]'
// });


// global.navigator = global.window.navigator;
