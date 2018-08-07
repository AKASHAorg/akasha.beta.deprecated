import React from 'react';
import { IntlProvider } from 'react-intl';
import { spy } from 'sinon';
import chai from 'chai';
import { shallow } from 'enzyme';
import TagEditor from '../../../app/components/tag-editor';
const { expect } = chai;

describe('[Component] TagEditor', () => {
    const mountComp = () => {
        let mountedComp;
        let props = {
            canCreateTags: false,
            className: 'tag-editor-test',
            isUpdate: false,
            onChange: () => {},
            onTagAdd: () => {},
            onTagRemove: () => {},
            searchResetResults: () => {},
            searchTags: () => {},
            tagErrors: '',
            tags: {},
            tagSuggestions: {},
            tagSuggestionsCount: 0,
        };
        if (!mountedComp) {
            mountedComp = shallow(<TagEditor {...props} />);
        }
        return mountedComp;
    };
    it('should render component', () => {
        const comp = mountComp();
        expect(comp).to.not.be.null;
    });
});
