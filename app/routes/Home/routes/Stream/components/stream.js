import React, { PropTypes } from 'react';
import throttle from 'lodash.throttle';
import styles from './stream.scss';

const LIMIT = 5;

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

    handleScroll = () => {
        if (!this.trigger) {
            return null;
        }
        const rect = this.trigger.getBoundingClientRect();

        if (rect.top >= 0 && rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        ) {
            if (this.props.params.filter === 'tag') {
                this.showMoreTagEntries();
            } else {
                this.showMoreSavedEntries();
            }
        }
    };

    getTriggerRef = (element) => {
        this.trigger = element;
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
          <div className={`row ${styles.root}`} ref={c => { this.container = c; }}>
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
    selectedTag: PropTypes.string,
    tagEntries: PropTypes.shape(),
    params: PropTypes.shape(),
    children: PropTypes.node
};
export default Stream;
