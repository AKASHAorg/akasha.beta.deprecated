import PropTypes from 'prop-types';
import React from 'react';
import { isInViewport } from 'utils/domUtils';
import throttle from 'lodash.throttle';
import styles from './stream.scss';

const LIMIT = 5;
const ALL_STREAM_LIMIT = 10;

class Stream extends React.Component {
    constructor (props) {
        super(props);
        this.container = null;
        this.trigger = null;
        this.lastTagEntryIndex = 0;
    }

    componentDidMount () {
        if (this.container) {
            this.container.addEventListener('scroll', throttle(this.handleScroll, 500));
        }
    }

    componentWillReceiveProps (nextProps) {
        const { tagEntries, selectedTag } = nextProps;
        if (selectedTag !== this.props.selectedTag) {
            this.lastTagEntryIndex = 0;
            return;
        }
        if (tagEntries.size !== this.props.tagEntries.size) {
            this.lastTagEntryIndex = tagEntries.size > 0 ?
                tagEntries.last().get('entryId') :
                0;
        }
    }

    getTriggerRef = (element) => {
        this.trigger = element;
    };

    handleScroll = () => {
        if (!this.trigger) {
            return null;
        }

        if (isInViewport(this.trigger)) {
            switch (this.props.params.filter) {
                case 'tag':
                    return this.showMoreTagEntries();
                case 'bookmarks':
                    return this.showMoreSavedEntries();
                case 'allEntries':
                    return this.showMoreAllStream();
                default:
                    return null;
            }
        }
    };

    showMoreAllStream = () => {
        const { entryActions, lastAllStreamBlock } = this.props;
        entryActions.moreAllStreamIterator(lastAllStreamBlock - 1, ALL_STREAM_LIMIT + 1);
    };

    showMoreTagEntries = () => {
        const { entryActions, selectedTag } = this.props;
        entryActions.moreEntryTagIterator(selectedTag, this.lastTagEntryIndex, LIMIT + 1);
    };

    showMoreSavedEntries = () => {
        const { entryActions } = this.props;
        entryActions.moreSavedEntriesList(LIMIT);
    };

    render () {
        return (
          <div className={`row ${styles.root}`} ref={(c) => { this.container = c; }}>
            <div className="col-xs-12">
              <div className="row center-xs">
                <div className="col-xs-10" style={{ padding: '24px 0' }}>
                  {React.cloneElement(this.props.children, { getTriggerRef: this.getTriggerRef })}
                </div>
              </div>
            </div>
          </div>
        );
    }
}
Stream.propTypes = {
    entryActions: PropTypes.shape(),
    lastAllStreamBlock: PropTypes.number,
    selectedTag: PropTypes.string,
    tagEntries: PropTypes.shape(),
    params: PropTypes.shape(),
    children: PropTypes.node
};
export default Stream;
