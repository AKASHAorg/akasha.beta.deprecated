import React from 'react';
import { IntlProvider } from 'react-intl';
import { spy } from 'sinon';
import { expect } from 'chai';
import { mount, render } from 'enzyme';
import TagEditor from '../../../app/components/tag-editor';
import { Draft as DraftRecord } from '../../../app/local-flux/reducers/records/draft-record';
import { SearchRecord } from '../../../app/local-flux/reducers/records/search-record';

describe('[Component] TagEditor', () => {
    // change these accordingly
    const ROOT_NODE_ID = 'tag-editor';
    const ROOT_NODE_CLASSNAME_PROP = `${ROOT_NODE_ID}-test`;
    const SUGGESTIONS_CONTAINER_CLASSNAME = `${ROOT_NODE_ID}__suggestions-container`;
    const TAG_ITEM_CLASSNAME = `${ROOT_NODE_ID}__tag-item`;
    const TAG_ITEM_CLASSNAME_CA = `${TAG_ITEM_CLASSNAME}_cannot-add`;
    const TAG_ITEM_CLASSNAME_SC = `${TAG_ITEM_CLASSNAME}_should-register`;

    let mountedComp;

    const intlProvider = new IntlProvider({ locale: 'en' }, {});
    const sampleDraft = new DraftRecord();
    const sampleSearch = new SearchRecord();

    let defaultProps = {
        canCreateTags: false,
        className: ROOT_NODE_CLASSNAME_PROP,
        isUpdate: false,
        onChange: () => {},
        onTagAdd: () => {},
        onTagRemove: () => {},
        searchResetResults: () => {},
        searchTags: () => {},
        tagErrors: '',
        tags: sampleDraft.tags,
        tagSuggestions: sampleSearch.get('tags'),
        tagSuggestionsCount: 0,
        intl: intlProvider.getChildContext().intl
    };
    const mountComp = (passedProps = {}) => {
        if (!mountedComp) {
            mountedComp = mount(<TagEditor {...defaultProps} {...passedProps} />);
        }
        return mountedComp;
    };

    afterEach(() => {
        if(mountedComp) {
            mountedComp.unmount();
            mountedComp = null;
        }
    });

    it('should render component with default props', () => {
        const wrapper = mountComp();
        expect(wrapper.find(`.${ROOT_NODE_ID}`)).to.have.lengthOf(1);
    });

    it('should render suggestions when tagSuggestionsCount > 0', () => {
        const wrapper = mountComp({
            tagSuggestionsCount: 2,
            tagSuggestions: defaultProps.tagSuggestions.push(['test', 'test-tag']),
        });
        wrapper.find('input').simulate('click');
        expect(wrapper.find(`.${SUGGESTIONS_CONTAINER_CLASSNAME}`).length).to.be.greaterThan(0);
    });

    describe('-> when a new tag is added', () => {

        const localProps = {
            ...defaultProps,
            canCreateTags: false,
            tags: defaultProps.tags.set('test-tag', { checking: false, exists: false }),
        }
        describe('-> and it is NOT registered yet', () => {
            it('should NOT ALLOW tag creation if user cannot create tags', () => {
                const wrapper = mountComp(localProps);
                expect(wrapper.find(`.${TAG_ITEM_CLASSNAME}`).length).to.be.equal(wrapper.props().tags.size);
                expect(wrapper.find(`.${TAG_ITEM_CLASSNAME}`).some(`.${TAG_ITEM_CLASSNAME_CA}`)).to.be.true;
            });
            it ('should ALLOW tag creation if user can create tags', () => {
                const wrapper = mountComp({
                    ...localProps,
                    canCreateTags: true
                });
                expect(wrapper.find(`.${TAG_ITEM_CLASSNAME}`).some(`.${TAG_ITEM_CLASSNAME_SC}`)).to.be.true;
            });
            it('should not show any popovers when the tag is in checking state', () => {
                const wrapper = mountComp({
                    ...localProps,
                    canCreateTags: false,
                    tags: defaultProps.tags.set('test-tag', { checking: true, exists: false })
                });
                expect(wrapper.find(`.${TAG_ITEM_CLASSNAME}`).some(`.${TAG_ITEM_CLASSNAME_CA}`)).to.be.false;
                expect(wrapper.find(`.${TAG_ITEM_CLASSNAME}`).some(`.${TAG_ITEM_CLASSNAME_SC}`)).to.be.false;
            });
        });
        describe('-> and it is already registered', () => {
            const alreadyRegProps = {
                ...localProps,
                tags: defaultProps.tags.set('test-tag', { exists: true, checking: false })
            }

            it('should not show any popovers', () => {
                const wrapper = mountComp(alreadyRegProps);
                expect(wrapper.find(`.${TAG_ITEM_CLASSNAME}`).some(`.${TAG_ITEM_CLASSNAME_CA}`)).to.be.false;
                expect(wrapper.find(`.${TAG_ITEM_CLASSNAME}`).some(`.${TAG_ITEM_CLASSNAME_SC}`)).to.be.false;
            });

            it('should not show any popovers when the tag is in checking state', () => {
                const wrapper = mountComp({
                    ...alreadyRegProps,
                    tags: alreadyRegProps.tags.setIn(['test-tag', 'checking'], true)
                });
                expect(wrapper.find(`.${TAG_ITEM_CLASSNAME}`).some(`.${TAG_ITEM_CLASSNAME_CA}`)).to.be.false;
                expect(wrapper.find(`.${TAG_ITEM_CLASSNAME}`).some(`.${TAG_ITEM_CLASSNAME_SC}`)).to.be.false;
            });

            it('should open "should register" popover when exists key is not present && canCreateTags=true && checking=false', () => {
                const wrapper = mountComp({
                    ...alreadyRegProps,
                    tags: defaultProps.tags.set('test-tag', { checking: false }),
                    canCreateTags: true
                });
                expect(wrapper.find(`.${TAG_ITEM_CLASSNAME}`).some(`.${TAG_ITEM_CLASSNAME_SC}`)).to.be.true;
            });
        });
    });
});
